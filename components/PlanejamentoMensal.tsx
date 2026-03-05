import React, { useRef } from 'react';
import { UserProfile } from '../types';
import { DocumentContainer, SPSHeader, SPSFooter, TableRow } from './InstrumentaisShared';

interface PlanejamentoMensalProps {
    user: UserProfile | null;
    currentUnit: { name: string; address: string; email: string };
    currentDate: Date;
}

// ── Célula editável que se expande totalmente na impressão ────────────────────
const EditCell: React.FC<{
    placeholder: string;
    defaultValue?: string;
    className?: string;
    center?: boolean;
}> = ({ placeholder, defaultValue, className = '', center }) => (
    <div
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={`w-full h-full p-2 outline-none bg-transparent break-words whitespace-pre-wrap min-h-[90px] ${center ? 'text-center' : ''} ${className}
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300`}
        style={{ wordBreak: 'break-word', minHeight: 90 }}
        dangerouslySetInnerHTML={defaultValue ? { __html: defaultValue.replace(/\n/g, '<br/>') } : undefined}
    />
);

// ── Linha da tabela de planejamento ──────────────────────────────────────────
const PlanRow: React.FC<{
    data: string;
    atividade: string;
    metodologia: string;
    recursos: string;
    publico: string;
    responsavel: string;
    onRemove: () => void;
}> = ({ data, atividade, metodologia, recursos, publico, responsavel, onRemove }) => (
    <div
        className="grid grid-cols-12 divide-x-2 divide-black border-b border-black last:border-b-0 relative group"
        style={{ breakInside: 'avoid', pageBreakInside: 'avoid' } as React.CSSProperties}
    >
        <div className="col-span-1"><EditCell placeholder="DD/MM&#10;HH:mm" defaultValue={data} center className="text-xs" /></div>
        <div className="col-span-2"><EditCell placeholder="Nome da atividade" defaultValue={atividade} className="text-xs font-bold" /></div>
        <div className="col-span-3"><EditCell placeholder="Objetivos e metodologia..." defaultValue={metodologia} className="text-[11px] leading-snug text-justify" /></div>
        <div className="col-span-2"><EditCell placeholder="Materiais..." defaultValue={recursos} className="text-[10px]" /></div>
        <div className="col-span-2"><EditCell placeholder="Público" defaultValue={publico} center className="text-[10px] font-bold" /></div>
        <div className="col-span-2"><EditCell placeholder="Profissional" defaultValue={responsavel} center className="text-[10px]" /></div>

        {/* Botão remover — invisível na impressão */}
        <button
            onClick={onRemove}
            className="absolute -right-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 print:hidden opacity-0 group-hover:opacity-100 transition p-2 bg-white rounded-full shadow-sm border border-slate-200"
            title="Remover linha"
        >
            <i className="fa-solid fa-trash"></i>
        </button>
    </div>
);

// ── Componente principal ──────────────────────────────────────────────────────
const PlanejamentoMensal: React.FC<PlanejamentoMensalProps> = ({ user, currentUnit, currentDate }) => {
    const [rows, setRows] = React.useState([
        {
            id: 1,
            data: '03/02\n09:00h',
            atividade: '"Painel coletivo de carnaval."',
            metodologia: 'Objetivo: Estimular a socialização.\n\nRoda de conversa e construção de painel.',
            recursos: 'Cartolina, tesoura, cola, lápis de cor.',
            publico: 'GPI',
            responsavel: `${user?.name || 'GENILDO'}\n${user?.role || 'TÉCNICO'}\nCRP: ${user?.crp || '00/00000'}`,
        },
        { id: 2, data: '', atividade: '', metodologia: '', recursos: '', publico: '', responsavel: '' },
        { id: 3, data: '', atividade: '', metodologia: '', recursos: '', publico: '', responsavel: '' },
    ]);

    const addRow = () =>
        setRows(prev => [...prev, { id: Date.now(), data: '', atividade: '', metodologia: '', recursos: '', publico: '', responsavel: '' }]);

    const removeRow = (id: number) => {
        if (window.confirm('Remover esta linha?')) setRows(prev => prev.filter(r => r.id !== id));
    };

    return (
        <DocumentContainer>
            <SPSHeader />

            {/* Cabeçalho do documento */}
            <div className="border-2 border-black mb-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' } as React.CSSProperties}>
                <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                    Planejamento Mensal de Atividades
                </div>
                <TableRow label="Tema:" content="Carnaval da alegria" contentInput />
                <TableRow label="Subtema:" content="Ritmos, fantasias e tradições." contentInput />
                <TableRow label="Área de Atuação:" content={user?.role || 'Psicologia Social'} contentInput />
                <TableRow label="Unidade/Equipamento:" content={currentUnit.name} contentInput />
                <TableRow label="Endereço:" content={currentUnit.address} contentInput />
                <TableRow label="OSC Executora:" content="Centro de Formação e Inclusão Social Nossa Senhora de Fátima" contentInput />
                <TableRow
                    label="Mês/Ano:"
                    content={`${currentDate.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()}/${currentDate.getFullYear()}`}
                    contentInput
                />
            </div>

            {/* Tabela de planejamento */}
            <div className="border-2 border-black mb-4">
                {/* Cabeçalho da tabela */}
                <div
                    className="grid grid-cols-12 divide-x-2 divide-black bg-blue-200 border-b-2 border-black text-center text-[10px] font-bold uppercase leading-tight"
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' } as React.CSSProperties}
                >
                    <div className="col-span-1 p-2 flex items-center justify-center">Data/<br />Horário</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Atividade</div>
                    <div className="col-span-3 p-2 flex items-center justify-center">Metodologia</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Recursos</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Público Alvo</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Profissional</div>
                </div>

                <div className="text-xs">
                    {rows.map(row => (
                        <PlanRow
                            key={row.id}
                            data={row.data}
                            atividade={row.atividade}
                            metodologia={row.metodologia}
                            recursos={row.recursos}
                            publico={row.publico}
                            responsavel={row.responsavel}
                            onRemove={() => removeRow(row.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Botão adicionar linha — invisível na impressão */}
            <div className="flex justify-center mb-8 print:hidden">
                <button
                    onClick={addRow}
                    className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-100 transition flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i> Adicionar Linha ao Planejamento
                </button>
            </div>

            <SPSFooter unit={currentUnit} />
        </DocumentContainer>
    );
};

export default PlanejamentoMensal;
