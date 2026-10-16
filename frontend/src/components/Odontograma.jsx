import React, { useState, useCallback } from 'react';

const DENTES_SUPERIOR = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const DENTES_INFERIOR = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export const PROCEDURE_COLORS = {
    CARIE:       '#EF4444',
    RESTAURACAO: '#22C55E',
    EXODONTIA:   '#3B82F6',
    ENDODONTIA:  '#F59E0B',
    COROA:       '#8B5CF6',
    PROTESE:     '#EC4899',
    IMPLANTE:    '#06B6D4',
    OUTRO:       '#6B7280',
};

export const PROCEDURE_LABELS = {
    CARIE:       'Cárie',
    RESTAURACAO: 'Restauração',
    EXODONTIA:   'Exodontia',
    ENDODONTIA:  'Endodontia',
    COROA:       'Coroa',
    PROTESE:     'Prótese',
    IMPLANTE:    'Implante',
    OUTRO:       'Outro',
};

const FACE_LABELS = { V: 'Vestibular', M: 'Mesial', O: 'Oclusal', D: 'Distal', L: 'Lingual' };

// Retorna a primeira cor presente nas faces do dente, ou null
function getDenteColor(marcacoes) {
    if (!marcacoes) return null;
    const tipos = Object.values(marcacoes).map(f => f.tipo).filter(Boolean);
    return tipos.length > 0 ? (PROCEDURE_COLORS[tipos[0]] || '#6B7280') : null;
}

// Caixa compacta representando um dente no arco
function DenteBox({ numero, marcacoes, selecionado, onClick }) {
    const cor = getDenteColor(marcacoes);
    return (
        <button
            type="button"
            className={`dente-box${selecionado ? ' dente-box--sel' : ''}${cor ? ' dente-box--marcado' : ''}`}
            onClick={() => onClick(numero)}
            title={`Dente ${numero}`}
        >
            <span className="dente-box__num">{numero}</span>
            <span className="dente-box__dot" style={{ background: cor || 'transparent', borderColor: cor || '#D1D5DB' }} />
        </button>
    );
}

// Cruz de 5 faces para o dente selecionado
//   disposição:
//       [V]
//   [M] [O] [D]
//       [L]
function FaceCross({ marcacoes, procedimento, onToggle }) {
    const faces = [
        { id: 'V', area: 'v' },
        { id: 'M', area: 'm' },
        { id: 'O', area: 'o' },
        { id: 'D', area: 'd' },
        { id: 'L', area: 'l' },
    ];

    return (
        <div className="face-cross">
            {faces.map(({ id, area }) => {
                const marcado = marcacoes[id];
                const cor = marcado ? (PROCEDURE_COLORS[marcado.tipo] || '#6B7280') : null;
                const label = FACE_LABELS[id];
                return (
                    <button
                        key={id}
                        type="button"
                        className={`face-cell face-cell--${area}${marcado ? ' face-cell--marcado' : ''}`}
                        style={cor ? { background: cor, borderColor: cor, color: '#fff' } : {}}
                        onClick={() => onToggle(id)}
                        title={`${label}${marcado ? ` — ${PROCEDURE_LABELS[marcado.tipo] || marcado.tipo}` : ' — vazio'}`}
                    >
                        <span className="face-cell__letra">{id}</span>
                        <span className="face-cell__label">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

/**
 * Odontograma interativo
 * @prop {Object}   denticao                  - { [numDente]: { [face]: { tipo, observacao } } }
 * @prop {Function} onMarcar                  - (dente, face, tipo|null) => void
 * @prop {boolean}  editavel
 * @prop {string}   procedimentoSelecionado
 * @prop {Function} onTrocarProcedimento
 */
export function Odontograma({ denticao = {}, onMarcar, editavel = true, procedimentoSelecionado = 'CARIE', onTrocarProcedimento }) {
    const [denteSel, setDenteSel] = useState(null);

    const handleDenteClick = useCallback((numero) => {
        setDenteSel(prev => prev === numero ? null : numero);
    }, []);

    const handleFaceToggle = useCallback((face) => {
        if (!denteSel || !onMarcar) return;
        const jatem = denticao[denteSel]?.[face]?.tipo === procedimentoSelecionado;
        onMarcar(denteSel, face, jatem ? null : procedimentoSelecionado);
    }, [denteSel, denticao, procedimentoSelecionado, onMarcar]);

    const handleLimparDente = useCallback(() => {
        if (!denteSel || !onMarcar) return;
        const faces = Object.keys(denticao[denteSel] || {});
        faces.forEach(face => onMarcar(denteSel, face, null));
    }, [denteSel, denticao, onMarcar]);

    const marcacoesSel = denteSel ? (denticao[denteSel] || {}) : {};
    const temMarcacoes = Object.keys(marcacoesSel).length > 0;

    return (
        <div className="odontograma-v2">

            {/* Seletor de procedimento */}
            {editavel && (
                <div className="odonto-procs">
                    <span className="odonto-procs__label">Marcando:</span>
                    <div className="odonto-procs__btns">
                        {Object.entries(PROCEDURE_COLORS).map(([tipo, cor]) => (
                            <button
                                key={tipo}
                                type="button"
                                className={`odonto-proc-btn${procedimentoSelecionado === tipo ? ' odonto-proc-btn--ativo' : ''}`}
                                style={{ '--cor': cor }}
                                onClick={() => onTrocarProcedimento?.(tipo)}
                            >
                                <span className="odonto-proc-btn__dot" style={{ background: cor }} />
                                {PROCEDURE_LABELS[tipo]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Arco Superior */}
            <div className="odonto-arco">
                <span className="odonto-arco__label">Superior — direito → esquerdo</span>
                <div className="odonto-arco__dentes">
                    {DENTES_SUPERIOR.map((num, i) => (
                        <React.Fragment key={num}>
                            {i === 8 && <div className="odonto-sep" />}
                            <DenteBox numero={num} marcacoes={denticao[num]} selecionado={denteSel === num} onClick={handleDenteClick} />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Arco Inferior */}
            <div className="odonto-arco">
                <span className="odonto-arco__label">Inferior — direito → esquerdo</span>
                <div className="odonto-arco__dentes">
                    {DENTES_INFERIOR.map((num, i) => (
                        <React.Fragment key={num}>
                            {i === 8 && <div className="odonto-sep" />}
                            <DenteBox numero={num} marcacoes={denticao[num]} selecionado={denteSel === num} onClick={handleDenteClick} />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Painel do dente selecionado */}
            {denteSel ? (
                <div className="odonto-detalhe">
                    <div className="odonto-detalhe__header">
                        <span className="odonto-detalhe__titulo">Dente {denteSel}</span>
                        <div className="odonto-detalhe__actions">
                            {temMarcacoes && (
                                <button type="button" className="odonto-detalhe__limpar" onClick={handleLimparDente}>
                                    Limpar dente
                                </button>
                            )}
                            <button type="button" className="odonto-detalhe__fechar" onClick={() => setDenteSel(null)}>
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="odonto-detalhe__corpo">
                        <FaceCross marcacoes={marcacoesSel} procedimento={procedimentoSelecionado} onToggle={handleFaceToggle} />

                        <div className="odonto-detalhe__info">
                            <p className="odonto-detalhe__dica">
                                Clique em uma face para marcar como <strong>{PROCEDURE_LABELS[procedimentoSelecionado]}</strong>.
                                Clique novamente para desmarcar.
                            </p>
                            {temMarcacoes && (
                                <div className="odonto-detalhe__tags">
                                    {Object.entries(marcacoesSel).map(([face, info]) => (
                                        <span
                                            key={face}
                                            className="odonto-tag"
                                            style={{
                                                background: (PROCEDURE_COLORS[info.tipo] || '#6B7280') + '18',
                                                color: PROCEDURE_COLORS[info.tipo] || '#6B7280',
                                                borderColor: (PROCEDURE_COLORS[info.tipo] || '#6B7280') + '40',
                                            }}
                                        >
                                            {FACE_LABELS[face] || face}: {PROCEDURE_LABELS[info.tipo] || info.tipo}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="odonto-hint">Clique em um dente para selecionar e marcar as faces.</p>
            )}

        </div>
    );
}

export default Odontograma;
