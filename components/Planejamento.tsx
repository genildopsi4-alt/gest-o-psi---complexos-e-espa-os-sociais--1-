import React, { useState } from 'react';
import { AtividadePlanejada } from '../types';

const Planejamento: React.FC = () => {
    const [selectedActivity, setSelectedActivity] = useState<AtividadePlanejada | null>(null);

    // Initial Data with SGE-MI Structure
    const atividades: AtividadePlanejada[] = [
        {
            id: 1,
            tipo: 'rede',
            tipoLabel: 'Gestão/Rede',
            data: '16/02',
            dia: 16,
            titulo: 'Reunião de Rede Socioassistencial',
            descricao: 'Planejamento integrado com CRAS e CREAS.',
            responsavel: 'Coordenação',
            color: 'amber', // Yellow for Management/Network
            publicoEstimado: 15,
            status: 'planejado',
            unidade: 'CSMI João XXIII'
        },
        {
            id: 2,
            tipo: 'interna',
            tipoLabel: 'Grupo GAP',
            data: '06/02',
            dia: 6,
            titulo: 'Roda de Conversa: Identidade',
            descricao: 'Dinâmica de grupo com adolescentes sobre autoimagem.',
            responsavel: 'Genildo Barbosa',
            color: 'emerald', // Green for Groups
            publicoEstimado: 25,
            status: 'realizado',
            unidade: 'CSMI João XXIII'
        },
        {
            id: 3,
            tipo: 'comunitaria',
            tipoLabel: 'Ação Comunitária',
            data: '20/02',
            dia: 20,
            titulo: 'Ação Mais Infância na Praça',
            descricao: 'Atividades lúdicas e atendimento psicossocial móvel.',
            responsavel: 'Equipe Técnica',
            color: 'blue', // Blue for Events
            publicoEstimado: 100,
            status: 'planejado',
            unidade: 'CSMI João XXIII'
        },
        {
            id: 4,
            tipo: 'atendimento_crise',
            tipoLabel: 'Atendimento Individual',
            data: '10/02',
            dia: 10,
            titulo: 'Plantão Psicológico',
            descricao: 'Atendimento de demandas espontâneas e encaminhamentos.',
            responsavel: 'Plantão',
            color: 'red', // Red for Individual/Crisis
            publicoEstimado: 5,
            status: 'realizado',
            unidade: 'CSMI João XXIII'
        },
        {
            id: 5,
            tipo: 'interna',
            tipoLabel: 'Grupo ACT',
            data: '27/02',
            dia: 27,
            titulo: 'Sessão 3: Estilos Parentais',
            descricao: 'Aplicação do currículo ACT com cuidadores.',
            responsavel: 'Sarah Araújo',
            color: 'emerald',
            publicoEstimado: 12,
            status: 'planejado',
            unidade: 'CSMI João XXIII'
        }
    ];

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
            case 'emerald': return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
            case 'purple': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
            case 'amber': return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
            case 'red': return 'bg-red-50 border-red-200 hover:bg-red-100';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const getBadgeStyle = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-100 text-blue-800';
            case 'emerald': return 'bg-emerald-100 text-emerald-800';
            case 'purple': return 'bg-purple-100 text-purple-800';
            case 'amber': return 'bg-amber-100 text-amber-800';
            case 'red': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCalendarEventStyle = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-500 text-white';
            case 'emerald': return 'bg-emerald-600 text-white';
            case 'purple': return 'bg-purple-500 text-white';
            case 'amber': return 'bg-amber-400 text-amber-900';
            case 'red': return 'bg-red-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    // Calendar Logic (February 2026 starts on Sunday)
    const daysInMonth = 28;
    const startDay = 0; // Sunday
    const calendarDays = [];

    for (let i = 0; i < startDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const renderCalendarEvent = (day: number) => {
        const events = atividades.filter(a => a.dia === day);
        if (events.length === 0) return null;

        return (
            <div className="flex flex-col gap-1 mt-1">
                {events.map((ev) => (
                    <div
                        key={ev.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedActivity(ev); }}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm truncate cursor-pointer transition hover:scale-105 ${getCalendarEventStyle(ev.color)}`}
                    >
                        {ev.tipoLabel}
                    </div>
                ))}
            </div>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <section className="p-6 md:p-8 animate-fade-in space-y-8 pb-32">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 leading-none tracking-tight">Relatório Estratégico Mensal</h2>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Fevereiro 2026 • SGE-MI Integrado</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 mr-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                <i className="fa-solid fa-user"></i>
                            </div>
                        ))}
                    </div>
                    <button onClick={handlePrint} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 uppercase tracking-wide">
                        <i className="fa-solid fa-file-export"></i> Gerar PDF
                    </button>
                </div>
            </div>

            {/* CALENDAR & LEGEND */}
            <div className="flex flex-col xl:flex-row gap-8">

                {/* MAIN CALENDAR */}
                <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
                    <div className="p-6 flex justify-between items-center border-b border-slate-100">
                        <h3 className="font-black text-slate-700 text-lg flex items-center gap-2">
                            <i className="fa-regular fa-calendar text-slate-400"></i> FEVEREIRO
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500" title="Ação Comunitária"></span>
                            <span className="w-3 h-3 rounded-full bg-emerald-500" title="Grupos"></span>
                            <span className="w-3 h-3 rounded-full bg-amber-400" title="Gestão/Rede"></span>
                            <span className="w-3 h-3 rounded-full bg-red-500" title="Individual/Crise"></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 border-b border-gray-100 bg-slate-50">
                        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                            <div key={day} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 auto-rows-[120px]">
                        {calendarDays.map((day, index) => (
                            <div key={index} className={`border-r border-b border-slate-50 p-2 relative hover:bg-slate-50/50 transition group ${!day ? 'bg-slate-50/30' : ''}`}>
                                {day && (
                                    <>
                                        <span className={`text-sm font-bold block mb-1 ${day === 29 ? 'text-transparent' : 'text-slate-300 group-hover:text-slate-500'}`}>{day}</span>
                                        {renderCalendarEvent(day)}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PRINTABLE LIST (Visible only on Print) */}
            <div className="hidden print:block mt-8">
                <h2 className="text-xl font-bold border-b-2 border-black mb-4 pb-2 uppercase">Detalhamento das Atividades - Fevereiro 2026</h2>
                <table className="w-full text-xs text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b border-black">
                            <th className="p-2 font-bold uppercase">Data</th>
                            <th className="p-2 font-bold uppercase">Atividade</th>
                            <th className="p-2 font-bold uppercase">Tipo</th>
                            <th className="p-2 font-bold uppercase">Público Est.</th>
                            <th className="p-2 font-bold uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atividades.map(atv => (
                            <tr key={atv.id} className="border-b border-gray-300">
                                <td className="p-2 font-mono">{atv.data}</td>
                                <td className="p-2">
                                    <div className="font-bold">{atv.titulo}</div>
                                    <div className="text-[10px] italic">{atv.descricao}</div>
                                </td>
                                <td className="p-2 uppercase font-bold text-[10px]">{atv.tipoLabel}</td>
                                <td className="p-2 text-center">{atv.publicoEstimado}</td>
                                <td className="p-2 text-center uppercase font-bold text-[10px]">{atv.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-12 pt-8 border-t border-black grid grid-cols-2 gap-20">
                    <div className="text-center">
                        <p className="font-bold uppercase text-xs">Genildo Barbosa</p>
                        <p className="text-[10px]">Técnico Responsável - CRP 11/12345</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold uppercase text-xs">Coordenação CSMI</p>
                        <p className="text-[10px]">Visto da Gestão</p>
                    </div>
                </div>
            </div>

            {/* ACTIVITY MODAL */}
            {selectedActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedActivity(null)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className={`h-32 ${getCalendarEventStyle(selectedActivity.color)} p-6 relative flex flex-col justify-end`}>
                            <button onClick={() => setSelectedActivity(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mb-2">
                                {selectedActivity.unidade}
                            </span>
                            <h2 className="text-2xl font-black text-white leading-none">{selectedActivity.titulo}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <i className="fa-regular fa-calendar"></i>
                                    <span className="font-bold">{selectedActivity.data}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-users"></i>
                                    <span className="font-bold">{selectedActivity.publicoEstimado} Pessoas</span>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed font-medium">
                                {selectedActivity.descricao}
                            </p>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <i className="fa-solid fa-user-tie"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Responsável Técnico</p>
                                    <p className="font-bold text-slate-800">{selectedActivity.responsavel}</p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button className="flex-1 py-3 rounded-xl font-bold uppercase text-xs bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition">
                                    <i className="fa-solid fa-pen-to-square mr-2"></i> Editar
                                </button>
                                <button className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs border transition ${selectedActivity.status === 'realizado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                    {selectedActivity.status === 'realizado' ? 'Realizado' : 'Marcar Realizado'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default Planejamento;
