import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import {
    Users, CalendarDays, Wallet, HandCoins, CalendarPlus, ChevronRight, UserPlus, Stethoscope,
    ClipboardPlus, CreditCard, ClipboardList, BarChart3, Activity, CalendarX2, CircleCheck,
    CircleX, CalendarCheck, Banknote, FileText, RefreshCw, Clock
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { API_BASE_URL } from '../config/api';
import { formatarMoeda } from '../ultilitarios/ultilitarios';
import './Dashboard.css';
import axios from 'axios';

// Status reais de StatusConsulta (backend)
const STATUS_CONSULTA = {
    AGENDADA: { label: 'Aguardando confirmação', tone: 'warning' },
    CONFIRMADA: { label: 'Confirmada', tone: 'success' },
    AGUARDANDO_ATENDIMENTO: { label: 'Aguardando atendimento', tone: 'info' },
    FINALIZADA: { label: 'Concluída', tone: 'neutral' },
    CANCELADA: { label: 'Cancelada', tone: 'danger' },
};

const PERIODOS = [
    { dias: 7, label: '7 dias' },
    { dias: 30, label: '30 dias' },
    { dias: 90, label: '3 meses' },
];

// Datas locais no formato YYYY-MM-DD (evita o deslocamento de fuso de new Date('YYYY-MM-DD'))
const pad = n => String(n).padStart(2, '0');
const chaveData = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dataLocal = chave => {
    const [a, m, d] = chave.split('-').map(Number);
    return new Date(a, m - 1, d);
};

function saudacao(hora) {
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
}

const primeiroNome = nome => (nome || '').trim().split(/\s+/)[0] || 'Paciente';

function Dashboard() {
    const { user, hasRole } = useAuth();
    const displayName = user?.nome || user?.username;

    const isGerente = hasRole('ROLE_GERENTE');
    const isDentista = hasRole('ROLE_DENTISTA');
    const isAdministrativo = hasRole('ROLE_ADMINISTRATIVO');
    const veFinanceiro = isGerente || isAdministrativo;
    const podeAgendar = isGerente || isAdministrativo;
    const veConsultasHoje = isGerente || isDentista;
    const veProntuario = isGerente || isDentista;

    const [consultas, setConsultas] = useState(null);
    const [lancamentos, setLancamentos] = useState(null);
    const [resumo, setResumo] = useState(null);
    const [erros, setErros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState(7);

    const carregar = useCallback(() => {
        setLoading(true);
        setErros([]);
        const falhas = [];
        const req = (url, setter, nome) =>
            axios.get(`${API_BASE_URL}${url}`)
                .then(r => setter(r.data))
                .catch(() => { setter(null); falhas.push(nome); });

        const promises = [
            req('/dashboard/summary', setResumo, 'indicadores'),
            req('/consultas', setConsultas, 'consultas'),
        ];
        if (veFinanceiro) promises.push(req('/financeiro/lancamentos', setLancamentos, 'financeiro'));

        Promise.allSettled(promises).finally(() => {
            setErros(falhas);
            setLoading(false);
        });
    }, [veFinanceiro]);

    useEffect(() => { carregar(); }, [carregar]);

    const agora = new Date();
    const hojeChave = chaveData(agora);
    // Precisão de minuto: mantém os useMemo estáveis entre renderizações
    const agoraIso = `${hojeChave}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;

    const consultasHoje = useMemo(() => (consultas || [])
        .filter(c => c.dataHora && c.dataHora.slice(0, 10) === hojeChave)
        .sort((a, b) => a.dataHora.localeCompare(b.dataHora)), [consultas, hojeChave]);

    const consultasHojeAtivas = consultasHoje.filter(c => c.status !== 'CANCELADA');

    // Exibidas quando não há consultas hoje, para a agenda não ficar vazia sem motivo
    const proximasConsultas = useMemo(() => (consultas || [])
        .filter(c => c.dataHora && c.dataHora.slice(0, 10) > hojeChave && !['CANCELADA', 'FINALIZADA'].includes(c.status))
        .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
        .slice(0, 5), [consultas, hojeChave]);

    // Próximo atendimento: primeira consulta ainda não iniciada/encerrada a partir de agora
    const proximaId = useMemo(() => {
        const prox = consultasHoje.find(c =>
            ['AGENDADA', 'CONFIRMADA', 'AGUARDANDO_ATENDIMENTO'].includes(c.status) && c.dataHora.slice(0, 16) >= agoraIso);
        return prox?.idConsulta;
    }, [consultasHoje, agoraIso]);

    const financeiro = useMemo(() => {
        if (!lancamentos) return null;
        const mes = hojeChave.slice(0, 7);
        return lancamentos.reduce((acc, l) => {
            const valor = parseFloat(l.valor) || 0;
            if (l.tipo !== 'RECEITA') return acc;
            if (l.status === 'PAGO' && l.data?.slice(0, 7) === mes) acc.receitaMes += valor;
            if (l.status === 'PENDENTE') acc.aReceber += valor;
            return acc;
        }, { receitaMes: 0, aReceber: 0 });
    }, [lancamentos, hojeChave]);

    const serieGrafico = useMemo(() => {
        if (!consultas) return null;
        const contagem = {};
        consultas.forEach(c => {
            if (!c.dataHora || c.status === 'CANCELADA') return;
            const k = c.dataHora.slice(0, 10);
            contagem[k] = (contagem[k] || 0) + 1;
        });
        const hoje = dataLocal(hojeChave);
        const serie = [];
        for (let i = periodo - 1; i >= 0; i--) {
            const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
            const k = chaveData(d);
            serie.push({ chave: k, data: d, total: contagem[k] || 0 });
        }
        return serie;
    }, [consultas, periodo, hojeChave]);

    // Atividade derivada de registros reais (não há log de auditoria no backend)
    const atividades = useMemo(() => {
        const itens = [];
        (consultas || []).forEach(c => {
            if (!c.dataHora || c.dataHora.slice(0, 16) > agoraIso) return;
            const mapa = {
                FINALIZADA: { icone: CircleCheck, tone: 'success', texto: 'Consulta concluída' },
                CONFIRMADA: { icone: CalendarCheck, tone: 'info', texto: 'Consulta confirmada' },
                CANCELADA: { icone: CircleX, tone: 'danger', texto: 'Consulta cancelada' },
            }[c.status];
            if (!mapa) return;
            itens.push({
                id: `c-${c.idConsulta}`, ...mapa,
                detalhe: `${primeiroNome(c.paciente?.nome)}${c.dentista?.nome ? ` · Dr(a). ${primeiroNome(c.dentista.nome)}` : ''}`,
                quando: new Date(c.dataHora), comHora: true,
            });
        });
        (lancamentos || []).forEach(l => {
            if (l.tipo !== 'RECEITA' || l.status !== 'PAGO' || !l.data || l.data > hojeChave) return;
            itens.push({
                id: `l-${l.idLancamento}`, icone: Banknote, tone: 'success',
                texto: 'Pagamento recebido', detalhe: formatarMoeda(parseFloat(l.valor) || 0),
                quando: dataLocal(l.data.slice(0, 10)), comHora: false,
            });
        });
        return itens.sort((a, b) => b.quando - a.quando).slice(0, 6);
    }, [consultas, lancamentos, hojeChave, agoraIso]);

    const acoesRapidas = [
        { to: '/pacientes/novo', icone: UserPlus, titulo: 'Cadastrar paciente', descricao: 'Novo cadastro com dados e anamnese', tone: 'primary', ok: isGerente || isAdministrativo },
        { to: '/funcionarios/novo', icone: Stethoscope, titulo: 'Cadastrar dentista', descricao: 'Novo profissional com cargo Dentista', tone: 'info', ok: isGerente },
        { to: '/procedimentos', icone: ClipboardPlus, titulo: 'Adicionar procedimento', descricao: 'Catálogo de tratamentos e valores', tone: 'warning', ok: isGerente },
        { to: '/financeiro', icone: CreditCard, titulo: 'Registrar pagamento', descricao: 'Lançar receitas e despesas', tone: 'success', ok: veFinanceiro },
        // Perfis sem acesso aos cadastros (dentista) recebem atalhos do próprio fluxo
        { to: '/consultas/hoje', icone: CalendarDays, titulo: 'Consultas de hoje', descricao: 'Check-in e atendimentos do dia', tone: 'info', ok: isDentista && !isGerente },
        { to: '/consultas', icone: ClipboardList, titulo: 'Minhas consultas', descricao: 'Calendário e histórico de atendimentos', tone: 'primary', ok: isDentista && !isGerente },
    ].filter(a => a.ok);

    const linkAgenda = veConsultasHoje ? '/consultas/hoje' : (podeAgendar ? '/agendamento' : null);
    const dataExtenso = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <Container className="dashboard-container">
            {/* Cabeçalho */}
            <header className="dash-header">
                <div className="dash-header__text">
                    <h1 className="dash-title">{saudacao(agora.getHours())}, {displayName || 'Visitante'}</h1>
                    <p className="dash-subtitle">Aqui está o resumo da sua clínica hoje.</p>
                </div>
                <div className="dash-header__actions">
                    {podeAgendar && (
                        <Link to="/agendamento" className="btn dash-btn-primary">
                            <CalendarPlus size={18} aria-hidden="true" /> Agendar consulta
                        </Link>
                    )}
                    {linkAgenda && (
                        <Link to={linkAgenda} className="btn dash-btn-secondary">
                            <CalendarDays size={18} aria-hidden="true" /> Ver agenda
                        </Link>
                    )}
                </div>
            </header>

            {erros.length > 0 && !loading && (
                <Alert variant="warning" className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <span>Não foi possível carregar: {erros.join(', ')}.</span>
                    <Button size="sm" variant="outline-dark" className="rounded-pill" onClick={carregar}>
                        <RefreshCw size={14} className="me-1" aria-hidden="true" /> Tentar novamente
                    </Button>
                </Alert>
            )}

            {/* Indicadores */}
            <Row className="g-3 mb-4">
                <Col xs={12} sm={6} xl={3}>
                    <KpiCard titulo="Pacientes cadastrados" icone={Users} tone="primary" loading={loading}
                        valor={resumo ? resumo.totalPacientes.toLocaleString('pt-BR') : '—'} />
                </Col>
                <Col xs={12} sm={6} xl={3}>
                    <KpiCard titulo="Consultas hoje" icone={CalendarDays} tone="info" loading={loading}
                        valor={consultas ? consultasHojeAtivas.length : '—'}
                        detalhe={consultas && consultasHoje.length !== consultasHojeAtivas.length
                            ? `${consultasHoje.length - consultasHojeAtivas.length} cancelada(s)` : null} />
                </Col>
                {veFinanceiro && (
                    <>
                        <Col xs={12} sm={6} xl={3}>
                            <KpiCard titulo="Receita do mês" icone={Wallet} tone="success" loading={loading}
                                valor={financeiro ? formatarMoeda(financeiro.receitaMes) : '—'} detalhe="Lançamentos pagos" />
                        </Col>
                        <Col xs={12} sm={6} xl={3}>
                            <KpiCard titulo="A receber" icone={HandCoins} tone="warning" loading={loading}
                                valor={financeiro ? formatarMoeda(financeiro.aReceber) : '—'} detalhe="Receitas pendentes" />
                        </Col>
                    </>
                )}
            </Row>

            {/* Agenda + Ações rápidas */}
            <Row className="g-3 mb-4">
                <Col xs={12} lg={8}>
                    <Card className="dash-card h-100">
                        <div className="dash-card__header">
                            <div className="dash-card__title">
                                <span className="dash-icon dash-icon--info"><CalendarDays size={18} /></span>
                                <div>
                                    <h2>Agenda de hoje</h2>
                                    <span className="dash-card__meta text-capitalize">{dataExtenso}</span>
                                </div>
                            </div>
                            {linkAgenda && <Link to={linkAgenda} className="dash-link">Ver todos <ChevronRight size={16} /></Link>}
                        </div>
                        <div className="dash-card__body">
                            {loading ? <Carregando /> : !consultas ? (
                                <EstadoVazio icone={CalendarX2} texto="Não foi possível carregar a agenda." />
                            ) : consultasHoje.length === 0 && proximasConsultas.length > 0 ? (
                                <>
                                    <p className="agenda-aviso">
                                        <CalendarX2 size={16} aria-hidden="true" /> Nenhum atendimento agendado para hoje.
                                    </p>
                                    <h3 className="agenda-subtitulo">Próximos atendimentos</h3>
                                    <ul className="agenda-list">
                                        {proximasConsultas.map(c => {
                                            const st = STATUS_CONSULTA[c.status] || { label: c.status, tone: 'neutral' };
                                            const d = new Date(c.dataHora);
                                            return (
                                                <li key={c.idConsulta} className="agenda-item">
                                                    <div className="agenda-item__hora">
                                                        {d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        <span className="agenda-item__data">{d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                                                    </div>
                                                    <div className="agenda-item__info">
                                                        <strong>{c.paciente?.nome || 'Paciente'}</strong>
                                                        {c.dentista?.nome && <span>Dr(a). {c.dentista.nome}</span>}
                                                    </div>
                                                    <span className={`dash-badge dash-badge--${st.tone}`}>{st.label}</span>
                                                    <div className="agenda-item__acoes">
                                                        {veProntuario && c.paciente?.idPaciente && (
                                                            <Link to={`/pacientes/${c.paciente.idPaciente}/prontuario`} className="dash-icon-btn"
                                                                title="Abrir prontuário" aria-label={`Abrir prontuário de ${c.paciente?.nome || 'paciente'}`}>
                                                                <FileText size={16} />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {veConsultasHoje && <Link to="/consultas" className="agenda-more">Ver calendário de consultas</Link>}
                                </>
                            ) : consultasHoje.length === 0 ? (
                                <EstadoVazio icone={CalendarX2} texto="Nenhum atendimento agendado para hoje">
                                    {podeAgendar && (
                                        <Link to="/agendamento" className="btn btn-sm dash-btn-primary mt-3">
                                            <CalendarPlus size={16} aria-hidden="true" /> Agendar consulta
                                        </Link>
                                    )}
                                </EstadoVazio>
                            ) : (
                                <ul className="agenda-list">
                                    {consultasHoje.slice(0, 8).map(c => {
                                        const st = STATUS_CONSULTA[c.status] || { label: c.status, tone: 'neutral' };
                                        return (
                                            <li key={c.idConsulta} className={`agenda-item ${c.idConsulta === proximaId ? 'agenda-item--next' : ''} ${c.status === 'CANCELADA' ? 'agenda-item--cancelada' : ''}`}>
                                                <div className="agenda-item__hora">
                                                    {new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    {c.idConsulta === proximaId && <span className="agenda-item__next">Próximo</span>}
                                                </div>
                                                <div className="agenda-item__info">
                                                    <strong>{c.paciente?.nome || 'Paciente'}</strong>
                                                    {c.dentista?.nome && <span>Dr(a). {c.dentista.nome}</span>}
                                                </div>
                                                <span className={`dash-badge dash-badge--${st.tone}`}>{st.label}</span>
                                                <div className="agenda-item__acoes">
                                                    {veProntuario && c.paciente?.idPaciente && (
                                                        <Link to={`/pacientes/${c.paciente.idPaciente}/prontuario`} className="dash-icon-btn"
                                                            title="Abrir prontuário" aria-label={`Abrir prontuário de ${c.paciente?.nome || 'paciente'}`}>
                                                            <FileText size={16} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {!loading && consultasHoje.length > 8 && linkAgenda && (
                                <Link to={linkAgenda} className="agenda-more">+ {consultasHoje.length - 8} consulta(s) hoje</Link>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className="dash-card h-100">
                        <div className="dash-card__header">
                            <div className="dash-card__title">
                                <span className="dash-icon dash-icon--primary"><Activity size={18} /></span>
                                <h2>Ações rápidas</h2>
                            </div>
                        </div>
                        <div className="dash-card__body">
                            {acoesRapidas.length === 0 ? (
                                <EstadoVazio icone={ClipboardList} texto="Nenhuma ação disponível para o seu perfil." />
                            ) : (
                                <nav className="quick-list" aria-label="Ações rápidas">
                                    {acoesRapidas.map(({ to, icone: Icone, titulo, descricao, tone }) => (
                                        <Link key={to} to={to} className="quick-item">
                                            <span className={`dash-icon dash-icon--${tone}`}><Icone size={18} /></span>
                                            <span className="quick-item__text">
                                                <strong>{titulo}</strong>
                                                <span>{descricao}</span>
                                            </span>
                                            <ChevronRight size={18} className="quick-item__chevron" aria-hidden="true" />
                                        </Link>
                                    ))}
                                </nav>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Visão geral + Atividade */}
            <Row className="g-3">
                <Col xs={12} lg={8}>
                    <Card className="dash-card h-100">
                        <div className="dash-card__header">
                            <div className="dash-card__title">
                                <span className="dash-icon dash-icon--primary"><BarChart3 size={18} /></span>
                                <div>
                                    <h2>Visão geral da clínica</h2>
                                    <span className="dash-card__meta">Consultas agendadas por dia (exceto canceladas)</span>
                                </div>
                            </div>
                            <div className="dash-segmented" role="group" aria-label="Período do gráfico">
                                {PERIODOS.map(p => (
                                    <button key={p.dias} type="button" aria-pressed={periodo === p.dias}
                                        className={periodo === p.dias ? 'active' : ''} onClick={() => setPeriodo(p.dias)}>
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="dash-card__body">
                            {loading ? <Carregando /> : !serieGrafico ? (
                                <EstadoVazio icone={BarChart3} texto="Não foi possível carregar os dados do gráfico." />
                            ) : serieGrafico.every(p => p.total === 0) ? (
                                <EstadoVazio icone={BarChart3} texto="Nenhuma consulta registrada no período selecionado." />
                            ) : (
                                <GraficoBarras serie={serieGrafico} />
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className="dash-card h-100">
                        <div className="dash-card__header">
                            <div className="dash-card__title">
                                <span className="dash-icon dash-icon--info"><Clock size={18} /></span>
                                <div>
                                    <h2>Atividade recente</h2>
                                    <span className="dash-card__meta">Pela data das consultas e lançamentos</span>
                                </div>
                            </div>
                        </div>
                        <div className="dash-card__body">
                            {loading ? <Carregando /> : atividades.length === 0 ? (
                                <EstadoVazio icone={Activity} texto="Ainda não há atividades registradas." />
                            ) : (
                                <ul className="activity-list">
                                    {atividades.map(({ id, icone: Icone, tone, texto, detalhe, quando, comHora }) => (
                                        <li key={id} className="activity-item">
                                            <span className={`dash-icon dash-icon--sm dash-icon--${tone}`}><Icone size={16} /></span>
                                            <div className="activity-item__text">
                                                <strong>{texto}</strong>
                                                <span>{detalhe}</span>
                                            </div>
                                            <time dateTime={quando.toISOString()}>
                                                {quando.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                {comHora && <> · {quando.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</>}
                                            </time>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

function KpiCard({ titulo, valor, icone: Icone, tone, detalhe, loading }) {
    return (
        <Card className="dash-card kpi-card h-100">
            <div className="kpi-card__body">
                <div className="kpi-card__text">
                    <span className="kpi-card__label">{titulo}</span>
                    {loading
                        ? <span className="kpi-card__skeleton" aria-label="Carregando" />
                        : <strong className="kpi-card__value">{valor}</strong>}
                    {detalhe && !loading && <span className="kpi-card__detail">{detalhe}</span>}
                </div>
                <span className={`dash-icon dash-icon--lg dash-icon--${tone}`}><Icone size={22} /></span>
            </div>
        </Card>
    );
}

function GraficoBarras({ serie }) {
    const max = Math.max(...serie.map(p => p.total));
    const topo = Math.max(4, Math.ceil(max / 4) * 4);
    const marcas = [topo, topo * 0.75, topo * 0.5, topo * 0.25, 0];
    const passoRotulo = serie.length <= 7 ? 1 : serie.length <= 31 ? 5 : 15;
    const mostrarValores = serie.length <= 14;
    const total = serie.reduce((s, p) => s + p.total, 0);
    const fmt = d => d.toLocaleDateString('pt-BR', serie.length <= 7 ? { weekday: 'short', day: '2-digit' } : { day: '2-digit', month: '2-digit' });

    return (
        <div className="chart" role="img" aria-label={`Gráfico de barras: ${total} consultas em ${serie.length} dias, máximo de ${max} em um dia.`}>
            <div className="chart__summary"><strong>{total}</strong> consultas no período</div>
            <div className="chart__plot">
                <div className="chart__axis" aria-hidden="true">
                    {marcas.map(m => <span key={m}>{Math.round(m)}</span>)}
                </div>
                <div className="chart__area">
                    <div className="chart__grid" aria-hidden="true">{marcas.map(m => <span key={m} />)}</div>
                    <div className="chart__bars">
                        {serie.map(p => (
                            <div key={p.chave} className="chart__col" title={`${p.data.toLocaleDateString('pt-BR')}: ${p.total} consulta(s)`}>
                                <div className="chart__bar" style={{ height: `${(p.total / topo) * 100}%` }}>
                                    {mostrarValores && p.total > 0 && <span className="chart__value">{p.total}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="chart__labels" aria-hidden="true">
                {serie.map((p, i) => {
                    const ultimo = i === serie.length - 1;
                    // Rótulos espaçados; o último dia sempre aparece sem colidir com o anterior
                    const exibir = ultimo || (i % passoRotulo === 0 && serie.length - 1 - i >= passoRotulo / 2);
                    return <span key={p.chave}>{exibir ? fmt(p.data) : ''}</span>;
                })}
            </div>
        </div>
    );
}

function Carregando() {
    return (
        <div className="dash-loading">
            <Spinner animation="border" size="sm" className="dash-spinner" />
            <span>Carregando…</span>
        </div>
    );
}

function EstadoVazio({ icone: Icone, texto, children }) {
    return (
        <div className="dash-empty">
            <span className="dash-empty__icon"><Icone size={28} /></span>
            <p>{texto}</p>
            {children}
        </div>
    );
}

export default Dashboard;
