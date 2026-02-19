import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DocumentContainer, SPSHeader, SPSFooter, TableRow } from './InstrumentaisShared';

interface PlanejamentoMensalProps {
    user: UserProfile | null;
    currentUnit: { name: string; address: string; email: string };
    currentDate: Date;
}

interface PlanningRow {
    id: number;
    data: string;
    atividade: string;
    metodologia: string;
    recursos: string;
    publico: string;
    responsavel: string;
}

const PlanejamentoMensal: React.FC<PlanejamentoMensalProps> = ({ user, currentUnit, currentDate }) => {
    const [planningRows, setPlanningRows] = useState<PlanningRow[]>([
        { id: 1, data: '03/02\n09:00h', atividade: '“Painel coletivo de carnaval.”', metodologia: 'Objetivo: Estimular a socialização.\n\nRoda de conversa e construção de painel.', recursos: 'Cartolina, tesoura, cola, lápis de cor.', publico: 'GPI', responsavel: `${user?.name || 'GENILDO'}\n${user?.role || 'TÉCNICO'}\nCRP: ${user?.crp || '00/00000'}` },
        { id: 2, data: '', atividade: '', metodologia: '', recursos: '', publico: '', responsavel: '' },
        { id: 3, data: '', atividade: '', metodologia: '', recursos: '', publico: '', responsavel: '' }
    ]);

    const addPlanningRow = () => {
        const newRow: PlanningRow = {
            id: Date.now(),
            data: '',
            atividade: '',
            metodologia: '',
            recursos: '',
            publico: '',
            responsavel: ''
        };
        setPlanningRows([...planningRows, newRow]);
    };

    const updatePlanningRow = (id: number, field: keyof PlanningRow, value: string) => {
        setPlanningRows(planningRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const removePlanningRow = (id: number) => {
        if (confirm('Tem certeza que deseja remover esta linha?')) {
            setPlanningRows(planningRows.filter(row => row.id !== id));
        }
    };

    return (
        <DocumentContainer>
            <SPSHeader />
            <div className="border-2 border-black mb-6">
                <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                    Planejamento Mensal de Atividades
                </div>
                <TableRow label="Tema:" content="Carnaval da alegria" contentInput />
                <TableRow label="Subtema:" content="Ritmos, fantasias e tradições." contentInput />
                <TableRow label="Área de Atuação:" content={user?.role || "Psicologia Social"} contentInput />
                <TableRow label="Unidade/Equipamento:" content={currentUnit.name} contentInput />
                <TableRow label="Endereço:" content={currentUnit.address} contentInput />
                <TableRow label="OSC Executora:" content="Centro de Formação e Inclusão Social Nossa Senhora de Fátima" contentInput />
                <TableRow label="Mês/Ano:" content={`${currentDate.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()}/${currentDate.getFullYear()}`} contentInput />
            </div>

            <div className="border-2 border-black mb-4">
                <div className="grid grid-cols-12 divide-x-2 divide-black bg-blue-200 border-b-2 border-black text-center text-[10px] font-bold uppercase leading-tight">
                    <div className="col-span-1 p-2 flex items-center justify-center">Data/<br />Horário</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Atividade</div>
                    <div className="col-span-3 p-2 flex items-center justify-center">Metodologia</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Recursos</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Público Alvo</div>
                    <div className="col-span-2 p-2 flex items-center justify-center">Profissional</div>
                </div>

                <div className="text-xs">
                    {planningRows.map((row) => (
                        <div key={row.id} className="grid grid-cols-12 divide-x-2 divide-black border-b border-black last:border-b-0 relative group min-h-[100px]">
                            <div className="col-span-1 p-0">
                                <textarea
                                    className="w-full h-full p-2 resize-none outline-none text-center bg-transparent"
                                    value={row.data}
                                    onChange={(e) => updatePlanningRow(row.id, 'data', e.target.value)}
                                    placeholder="DD/MM HH:mm"
                                    title="Data/Horário"
                                />
                            </div>
                            <div className="col-span-2 p-0">
                                <textarea
                                    className="w-full h-full p-2 resize-none outline-none font-bold bg-transparent"
                                    value={row.atividade}
                                    onChange={(e) => updatePlanningRow(row.id, 'atividade', e.target.value)}
                                    placeholder="Nome da atividade"
                                    title="Atividade"
                                />
                            </div>
                            <div className="col-span-3 p-0">
                                <textarea
                                    className="w-full h-full p-2 resize-none outline-none text-[11px] leading-snug bg-transparent text-justify"
                                    value={row.metodologia}
                                    onChange={(e) => updatePlanningRow(row.id, 'metodologia', e.target.value)}
                                    placeholder="Objetivos..."
                                    title="Metodologia"
                                />
                            </div>
                            <div className="col-span-2 p-0">
                                <textarea
                                    className="w-full h-full p-2 resize-none outline-none text-[10px] bg-transparent"
                                    value={row.recursos}
                                    onChange={(e) => updatePlanningRow(row.id, 'recursos', e.target.value)}
                                    placeholder="Materiais..."
                                    title="Recursos"
                                />
                            </div>
                            <div className="col-span-2 p-0">
                                <textarea
                                    className="w-full h-full p-2 resize-none outline-none text-center font-bold text-[10px] bg-transparent"
                                    value={row.publico}
                                    onChange={(e) => updatePlanningRow(row.id, 'publico', e.target.value)}
                                    placeholder="Público"
                                    title="Público Alvo"
                                />
                            </div>
                            <div className="col-span-2 p-0">
                                <textarea
                                    className="w-full h-full p-2 resize-none outline-none text-[10px] text-center bg-transparent"
                                    value={row.responsavel}
                                    onChange={(e) => updatePlanningRow(row.id, 'responsavel', e.target.value)}
                                    placeholder="Profissional"
                                    title="Profissional Responsável"
                                />
                            </div>

                            {/* Remove Button (No Print) */}
                            <button
                                onClick={() => removePlanningRow(row.id)}
                                className="absolute -right-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 print:hidden opacity-0 group-hover:opacity-100 transition p-2 bg-white rounded-full shadow-sm border border-slate-200"
                                title="Remover linha"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Button (No Print) */}
            <div className="flex justify-center mb-8 print:hidden">
                <button
                    onClick={addPlanningRow}
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
