import React, { useState, useCallback } from 'react';

// Dentes permanentes (1-32) com representação gráfica simplificada por faces
const DENTES_PERMANENTES = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
];

// Faces de cada dente
const FACES = ['O', 'M', 'D', 'V', 'L']; // Oclusal/Vestibular, Mesial, Distal, Vestibular/Lingual

// Cores por tipo de procedimento
const PROCEDURE_COLORS = {
    'CARIE': '#FF4C4C',
    'RESTAURACAO': '#16A34A',
    'EXODONTIA': '#3B82F6',
    'ENDODONTIA': '#F59E0B',
    'COROA': '#8B5CF6',
    'PROTESE': '#EC4899',
    'IMPLANTE': '#06B6D4',
    'OUTRO': '#6B7280'
};

/**
 * Odontograma interativo - representação de um dente com suas 5 faces clicáveis
 */
function DenteGrafico({ denteNumero, faces = {}, onClick }) {
    const facesColor = FACES.reduce((acc, face) => {
        const proc = faces[face];
        acc[face] = proc?.cor || '#E5E7EB';
        acc[face + '_label'] = proc?.cor ? '#FFFFFF' : '#374151';
        return acc;
    }, {});

    return (
        <div className="odonto-dente" title={`Dente ${denteNumero}`}>
            <div className="odonto-dente__num">{denteNumero}</div>
            <svg width="80" height="80" viewBox="0 0 100 100" className="odonto-dente__svg">
                {/* Fundo branco */}
                <rect x="0" y="0" width="100" height="100" fill={facesColor['O']} rx="3"
                    onClick={() => onClick(denteNumero, 'O')} className="odonto-face" />
                {/* Divisões em forma de X - 5 faces */}
                <polygon points="5,5 45,45 45,5" fill={facesColor['M']}
                    onClick={() => onClick(denteNumero, 'M')} className="odonto-face" />
                <polygon points="95,5 55,45 95,55" fill={facesColor['D']}
                    onClick={() => onClick(denteNumero, 'D')} className="odonto-face" />
                <polygon points="5,95 45,55 45,95" fill={facesColor['L']}
                    onClick={() => onClick(denteNumero, 'L')} className="odonto-face" />
                <polygon points="95,95 55,55 95,45" fill="#E5E7EB"
                    onClick={() => onClick(denteNumero, 'O')} className="odonto-face" />
                {/* Centro */}
                <polygon points="45,45 55,55 45,55" fill="#F9FAFB"
                    onClick={() => onClick(denteNumero, 'O')} className="odonto-face" />
                {/* Linhas divisórias */}
                <line x1="5" y1="5" x2="95" y2="95" stroke="#D1D5DB" strokeWidth="1" pointerEvents="none" />
                <line x1="95" y1="5" x2="5" y2="95" stroke="#D1D5DB" strokeWidth="1" pointerEvents="none" />
                {/* Labels de faces */}
                <text x="27" y="29" fontSize="7" fill={facesColor['M_label']} textAnchor="middle" pointerEvents="none">M</text>
                <text x="73" y="29" fontSize="7" fill={facesColor['D_label']} textAnchor="middle" pointerEvents="none">D</text>
                <text x="27" y="80" fontSize="7" fill={facesColor['L_label']} textAnchor="middle" pointerEvents="none">L</text>
                <text x="50" y="52" fontSize="7" fill="#374151" textAnchor="middle" pointerEvents="none">O</text>
            </svg>
        </div>
    );
}

/**
 * Painel de seleção de procedimento
 */
function ProcedimentoSelector({ selecionado, onSelect }) {
    const opcoes = Object.keys(PROCEDURE_COLORS);

    return (
        <div className="odonto-selector">
            <label className="odonto-selector__label">Procedimento:</label>
            <div className="odento-selector__items">
                {opcoes.map(tipo => (
                    <button
                        key={tipo}
                        className={`odento-selector__btn ${selecionado === tipo ? 'active' : ''}`}
                        style={{ '--cor': PROCEDURE_COLORS[tipo] }}
                        onClick={() => onSelect(tipo)}
                        type="button"
                    >
                        <span className="odento-selector__dot" style={{ backgroundColor: PROCEDURE_COLORS[tipo] }}></span>
                        {formatarProcedimento(tipo)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function formatarProcedimento(texto) {
    return texto.charAt(0) + texto.slice(1).toLowerCase()
        .replace(/_/g, ' ')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Odontograma completo
 * @param {Object} props
 * @param {Object} props.denticao - Mapa { numeroDente: { face: { tipo, cor, observacao } } }
 * @param {Function} props.onMarcar - (dente, face, tipo) => void
 * @param {boolean} props.editavel
 * @param {string} props.procedimentoSelecionado
 * @param {Function} props.onTrocarProcedimento
 */
export function Odontograma({
    denticao = {},
    onMarcar,
    editavel = true,
    procedimentoSelecionado = 'CARIE',
    onTrocarProcedimento
}) {
    const handleFaceClick = useCallback((dente, face) => {
        const tipo = procedimentoSelecionado;
        if (onMarcar) {
            onMarcar(dente, face, tipo);
        }
    }, [procedimentoSelecionado, onMarcar]);

    // Linha superior: arcos superiores (direita->esquerda: 18-17...11 | 21...27-28)
    // Linha inferior: arcos inferiores (direita->esquerda: 48-47...41 | 31...47-48)
    return (
        <div className="odontograma">
            {editavel && onTrocarProcedimento && (
                <ProcedimentoSelector
                    selecionado={procedimentoSelecionado}
                    onSelect={onTrocarProcedimento}
                />
            )}

            <div className="odonto-label">Dentição Permanente</div>

            {/* Arco Superior */}
            <div className="odonto-arcada">
                <div className="odonto-arcada__title">Superior</div>
                <div className="odonto-arcada__row">
                    {DENTES_PERMANENTES.slice(0, 8).map(num => (
                        <DenteGrafico
                            key={num}
                            denteNumero={num}
                            faces={denticao[num] || {}}
                            onClick={handleFaceClick}
                        />
                    ))}
                    <div className="odonto-mid-line"></div>
                    {DENTES_PERMANENTES.slice(8, 16).map(num => (
                        <DenteGrafico
                            key={num}
                            denteNumero={num}
                            faces={denticao[num] || {}}
                            onClick={handleFaceClick}
                        />
                    ))}
                </div>
            </div>

            {/* Arco Inferior */}
            <div className="odonto-arcada">
                <div className="odonto-arcada__title">Inferior</div>
                <div className="odonto-arcada__row">
                    {DENTES_PERMANENTES.slice(16, 24).map(num => (
                        <DenteGrafico
                            key={num}
                            denteNumero={num}
                            faces={denticao[num] || {}}
                            onClick={handleFaceClick}
                        />
                    ))}
                    <div className="odonto-mid-line"></div>
                    {DENTES_PERMANENTES.slice(24).map(num => (
                        <DenteGrafico
                            key={num}
                            denteNumero={num}
                            faces={denticao[num] || {}}
                            onClick={handleFaceClick}
                        />
                    ))}
                </div>
            </div>

            <div className="dente-legend">
                {Object.entries(PROCEDURE_COLORS).map(([tipo, cor]) => (
                    <span key={tipo} className="dente-legend__item">
                        <span className="dente-legend__dot" style={{ backgroundColor: cor }}></span>
                        {formatarProcedimento(tipo)}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Odontograma;

function getDentePosition(denteNumero) {
    const idx = DENTES_PERMANENTES.indexOf(denteNumero);
    return idx >= 0 ? idx : -1;
}