import React from 'react';

interface Grupo {
  id: number;
  tipo: 'GAP' | 'ACT' | 'GFA' | 'GPI' | 'CÍRCULO';
  nome: string;
  dia: string;
  horario: string;
  facilitador: string;
  participantes: number;
}

const Grupos: React.FC = () => {
  const grupos: Grupo[] = [
    { id: 1, tipo: 'GAP', nome: 'Adolescentes Participativos', dia: 'Terça', horario: '18h', facilitador: 'Genildo Barbosa', participantes: 25 },
    { id: 2, tipo: 'ACT', nome: 'Parentalidade Positiva', dia: 'Quinta', horario: '15h', facilitador: 'Sarah Araújo', participantes: 12 },
    { id: 3, tipo: 'GFA', nome: 'Família Atípica', dia: 'Sexta', horario: '14h', facilitador: 'Equipe Técnica', participantes: 10 },
    { id: 4, tipo: 'CÍRCULO', nome: 'Justiça Restaurativa', dia: 'Quarta', horario: '16h', facilitador: 'Mediação', participantes: 8 },
    { id: 5, tipo: 'GAP', nome: 'GAP Curió', dia: 'Segunda', horario: '18h', facilitador: 'Pedro Silva', participantes: 22 },
    { id: 6, tipo: 'ACT', nome: 'ACT Curió', dia: 'Sexta', horario: '09h', facilitador: 'Ana Paula', participantes: 15 },
  ];

  const getBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'GAP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ACT': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'GFA': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'GPI': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CÍRCULO': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section className="p-6 md:p-8 animate-fade-in pb-20">
      {/* Header da Seção */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Grupos e Chamadas</h2>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monitoramento Semanal das Atividades Coletivas</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 flex items-center text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-1">
          <i className="fa-solid fa-plus mr-2"></i> Novo Grupo
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((grupo) => (
          <div key={grupo.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group hover:border-emerald-100 relative overflow-hidden">
            
            {/* Topo do Card */}
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider ${getBadgeStyle(grupo.tipo)}`}>
                {grupo.tipo}
              </span>
              <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-400">
                    <i className="fa-regular fa-clock"></i>
                    <span>{grupo.dia} - {grupo.horario}</span>
                  </div>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                {grupo.nome}
              </h3>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                 <i className="fa-solid fa-user-check text-emerald-500"></i> {grupo.facilitador}
              </p>
            </div>

            {/* Grid de Ações (Botões) */}
            <div className="space-y-3">
                {/* Linha 1: Gestão (Lista e Frequência) */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl border-2 border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition text-xs font-bold uppercase">
                        <i className="fa-solid fa-list-ul"></i> Ver Lista
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl border-2 border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold uppercase">
                        <i className="fa-solid fa-calendar-check"></i> Frequência
                    </button>
                </div>

                {/* Linha 2: Ação Direta (Inscrição e Avaliação) */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition text-xs font-black uppercase tracking-wide">
                        <i className="fa-solid fa-user-plus"></i> Inscrição
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg transition text-xs font-black uppercase tracking-wide">
                        <i className="fa-solid fa-star"></i> Avaliar
                    </button>
                </div>
            </div>

            {/* Decorative Icon Background */}
            <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-50 text-8xl z-0 pointer-events-none group-hover:text-emerald-50 transition-colors duration-500">
                <i className="fa-solid fa-users"></i>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default Grupos;