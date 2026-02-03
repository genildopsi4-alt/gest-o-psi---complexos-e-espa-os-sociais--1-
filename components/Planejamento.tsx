import React from 'react';
import { AtividadePlanejada } from '../types';

const Planejamento: React.FC = () => {
    // Dados originais mantidos
    const atividades: AtividadePlanejada[] = [
        {
            id: 1,
            tipo: 'rede',
            tipoLabel: 'Ação em Rede',
            data: '16/01',
            titulo: 'Visita TEAcolhe',
            descricao: 'Orientações sobre autismo para famílias atípicas.',
            responsavel: 'Sarah / Equipe Externa',
            color: 'blue'
        },
        {
            id: 2,
            tipo: 'interna',
            tipoLabel: 'Interna (GAP)',
            data: '06/01',
            titulo: 'Roda do Equilíbrio',
            descricao: 'Autoavaliação emocional com adolescentes.',
            responsavel: 'Sarah / Nelma',
            color: 'emerald'
        },
        {
            id: 3,
            tipo: 'comunitaria',
            tipoLabel: 'Comunitária',
            data: '30/01',
            titulo: 'Dia D - Intergeracional',
            descricao: 'Brincadeiras misturando GAP, GPI e Crianças.',
            responsavel: 'Equipe Técnica',
            color: 'purple'
        }
    ];

    const getColorClasses = (color: string) => {
        switch(color) {
            case 'blue': return 'bg-blue-50 border-blue-200';
            case 'emerald': return 'bg-emerald-50 border-emerald-200';
            case 'purple': return 'bg-purple-50 border-purple-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const getBadgeClasses = (color: string) => {
        switch(color) {
            case 'blue': return 'text-blue-600 border-blue-200';
            case 'emerald': return 'text-emerald-600 border-emerald-200';
            case 'purple': return 'text-purple-600 border-purple-200';
            default: return 'text-gray-600 border-gray-200';
        }
    }

    // Lógica para o Calendário (Janeiro 2026 começa na Quinta-feira)
    const daysInMonth = 31;
    const startDay = 4; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui
    const calendarDays = [];
    
    // Dias vazios antes do início do mês
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }
    
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const renderCalendarEvent = (day: number) => {
        if (day === 15) return <div className="mt-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm truncate">Dia D - Ação Comunitária</div>;
        if (day === 22) return <div className="mt-2 bg-purple-500 text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm truncate">Fórum de Rede Local</div>;
        if (day === 28) return <div className="mt-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm truncate">Oficina Temática: Vínculos</div>;
        if (day === 29) return <div className="absolute top-2 right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">29</div>;
        return null;
    };

    return (
    <section className="p-6 md:p-8 animate-fade-in space-y-8">
      
      {/* --- HEADER SUPERIOR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 leading-none">Planejamento Estratégico Mensal</h2>
                <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wide">Janeiro 2026</p>
            </div>
            <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
        <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm border border-emerald-200 hover:bg-emerald-100 transition shadow-sm flex items-center gap-2">
            <i className="fa-solid fa-download"></i> Exportar
        </button>
      </div>

      {/* --- GRID DO CALENDÁRIO E SIDEBAR --- */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* CALENDÁRIO */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Dias da Semana */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>
                ))}
            </div>
            {/* Dias */}
            <div className="grid grid-cols-7 auto-rows-[100px] text-sm">
                {calendarDays.map((day, index) => (
                    <div key={index} className={`border-r border-b border-gray-100 p-2 relative hover:bg-gray-50 transition group ${!day ? 'bg-gray-50/30' : ''}`}>
                        {day && (
                            <>
                                <span className={`font-bold ${day === 29 ? 'text-transparent' : 'text-gray-400 group-hover:text-gray-600'}`}>{day}</span>
                                {renderCalendarEvent(day)}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* SIDEBAR DE DESTAQUES */}
        <div className="w-full xl:w-96 flex flex-col gap-6">
            
            {/* Lista de Atividades em Destaque */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-star text-amber-400"></i> ATIVIDADES EM DESTAQUE
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border-l-4 border-red-500 hover:shadow-md transition cursor-pointer">
                        <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Dia 15</span>
                            <h4 className="font-bold text-gray-800 text-sm">Dia D - Ação Comunitária</h4>
                        </div>
                        <i className="fa-solid fa-chevron-right ml-auto text-gray-300 text-xs"></i>
                    </div>

                    <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition cursor-pointer">
                        <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-handshake"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Dia 22</span>
                            <h4 className="font-bold text-gray-800 text-sm">Fórum de Rede Local</h4>
                        </div>
                        <i className="fa-solid fa-chevron-right ml-auto text-gray-300 text-xs"></i>
                    </div>

                    <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-500 hover:shadow-md transition cursor-pointer">
                        <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-heart"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Dia 28</span>
                            <h4 className="font-bold text-gray-800 text-sm">Oficina Temática: Vínculos</h4>
                        </div>
                        <i className="fa-solid fa-chevron-right ml-auto text-gray-300 text-xs"></i>
                    </div>
                </div>
            </div>

            {/* Card Tema do Mês */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">TEMA DO MÊS</p>
                    <h3 className="text-xl font-black mb-2 leading-tight">Fortalecimento de Vínculos e Parentalidade</h3>
                    <p className="text-xs text-emerald-100 opacity-80 leading-relaxed">Foco em consolidar as redes de apoio familiar através das metodologias ACT e GFA.</p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-emerald-400 opacity-10 rounded-full blur-2xl"></div>
            </div>
        </div>
      </div>

      {/* --- LISTA DETALHADA EXISTENTE --- */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-6">Detalhamento das Atividades</h3>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-bold text-lg text-emerald-800">Destaques (Modelo Curió)</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">Referência Técnica</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {atividades.map((atv) => (
                    <div key={atv.id} className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer hover:-translate-y-1 ${getColorClasses(atv.color)}`}>
                    <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold bg-white px-2 py-0.5 rounded border ${getBadgeClasses(atv.color)}`}>
                            {atv.tipoLabel}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{atv.data}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mt-2">{atv.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-snug">{atv.descricao}</p>
                    <p className="text-xs text-gray-500 mt-3 flex items-center pt-2 border-t border-black/5">
                        <i className="fa-solid fa-user-check mr-1.5 opacity-70"></i> 
                        {atv.responsavel}
                    </p>
                </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Planejamento;
