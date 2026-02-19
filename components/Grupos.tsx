import React, { useState } from 'react';
import { Section, UserProfile } from '../types';

interface Grupo {
  id: number;
  tipo: 'GAP' | 'ACT' | 'GFA' | 'GPI' | 'CÍRCULO' | 'JANELAS';
  nome: string;
  dia: string;
  horario: string;
  facilitador: string;
  cofacilitador?: string;
  participantes: number;
  unidadeId: string; // Added to link to unit
}

interface Unit {
  id: string;
  name: string;
  type: 'Complexo Social' | 'Espaço Social';
  icon: string;
  color: string;
  location: string;
}

interface GruposProps {
  onNavigate?: (section: Section, group: string) => void;
  user?: UserProfile | null;
}

const Grupos: React.FC<GruposProps> = ({ onNavigate, user }) => {
  const isAdmin = user?.role === 'admin';
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  // 1. DATA: Units
  const units: Unit[] = [
    { id: 'joao23', name: 'CSMI João XXIII', type: 'Complexo Social', icon: 'fa-hands-holding-child', color: 'bg-orange-500', location: 'João XXIII' },
    { id: 'cristo', name: 'CSMI Cristo Redentor', type: 'Complexo Social', icon: 'fa-hands-holding-child', color: 'bg-teal-600', location: 'Cristo Redentor' },
    { id: 'curio', name: 'CSMI Curió', type: 'Complexo Social', icon: 'fa-hands-holding-child', color: 'bg-emerald-600', location: 'Curió' },
    { id: 'barbalha', name: 'CSMI Barbalha', type: 'Complexo Social', icon: 'fa-hands-holding-child', color: 'bg-purple-600', location: 'Barbalha' },
    { id: 'quintino', name: 'Espaço Social Quintino Cunha', type: 'Espaço Social', icon: 'fa-hands-holding-child', color: 'bg-blue-500', location: 'Quintino Cunha' },
    { id: 'barra', name: 'Espaço Social Barra do Ceará', type: 'Espaço Social', icon: 'fa-hands-holding-child', color: 'bg-cyan-600', location: 'Barra do Ceará' },
    { id: 'dias_macedo', name: 'Espaço Social Dias Macedo', type: 'Espaço Social', icon: 'fa-hands-holding-child', color: 'bg-indigo-500', location: 'Dias Macedo' },
  ];

  // Auto-select unit for technicians (skip unit selection screen)
  React.useEffect(() => {
    if (!isAdmin && user?.unit) {
      const matchedUnit = units.find(u => u.name === user.unit);
      if (matchedUnit) {
        setSelectedUnit(matchedUnit.id);
      }
    }
  }, [user]);

  // 2. DATA: Groups (Mapping to Units)
  // 2. DATA: Groups (Mapping to Units)
  const [grupos, setGrupos] = useState<Grupo[]>(() => {
    const saved = localStorage.getItem('grupos-data');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      // João XXIII
      { id: 1, tipo: 'GAP', nome: 'GAP João XXIII', dia: 'Terça', horario: '18h', facilitador: 'Genildo Barbosa', cofacilitador: 'Maria Silva', participantes: 25, unidadeId: 'joao23' },
      { id: 2, tipo: 'ACT', nome: 'ACT João XXIII', dia: 'Quinta', horario: '15h', facilitador: 'Sarah Araújo', participantes: 12, unidadeId: 'joao23' },
      { id: 3, tipo: 'GFA', nome: 'GFA João XXIII', dia: 'Sexta', horario: '14h', facilitador: 'Equipe Técnica', participantes: 10, unidadeId: 'joao23' },
      { id: 4, tipo: 'GPI', nome: 'GPI João XXIII', dia: 'Quarta', horario: '08h', facilitador: 'Equipe Multi', participantes: 35, unidadeId: 'joao23' },

      // Curió
      { id: 5, tipo: 'GAP', nome: 'GAP Curió', dia: 'Segunda', horario: '18h', facilitador: 'Pedro Silva', participantes: 22, unidadeId: 'curio' },
      { id: 6, tipo: 'ACT', nome: 'ACT Curió', dia: 'Sexta', horario: '09h', facilitador: 'Ana Paula', participantes: 15, unidadeId: 'curio' },

      // Dias Macedo - Janelas da Infância (TESTE)
      { id: 9, tipo: 'JANELAS', nome: 'Janelas da Infância (TESTE)', dia: 'Sábado', horario: '08h', facilitador: 'Equipe Dias Macedo', participantes: 15, unidadeId: 'dias_macedo' },

      // Templates for others (Generic)
      { id: 7, tipo: 'GAP', nome: 'GAP Cristo Redentor', dia: 'Terça', horario: '17h', facilitador: 'Equipe', participantes: 20, unidadeId: 'cristo' },
      { id: 8, tipo: 'GPI', nome: 'GPI Barbalha', dia: 'Quinta', horario: '08h', facilitador: 'Equipe', participantes: 40, unidadeId: 'barbalha' },
    ];
  });

  // Save to LocalStorage whenever groups change
  React.useEffect(() => {
    localStorage.setItem('grupos-data', JSON.stringify(grupos));
  }, [grupos]);

  const [editingGroup, setEditingGroup] = useState<Grupo | null>(null);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);

  // New Group Form State
  const [newGroupData, setNewGroupData] = useState<Partial<Grupo>>({
    tipo: 'GAP',
    nome: '',
    dia: '',
    horario: '',
    facilitador: '',
    participantes: 0
  });

  const getBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'GAP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ACT': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'GFA': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'GPI': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CÍRCULO': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'JANELAS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAction = (section: Section, group: string) => {
    if (onNavigate) {
      onNavigate(section, group);
    }
  };

  const currentUnit = units.find(u => u.id === selectedUnit);
  const filteredGrupos = grupos.filter(g => g.unidadeId === selectedUnit);

  const handleSaveFacilitators = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    setGrupos(prev => prev.map(g => g.id === editingGroup.id ? editingGroup : g));
    setEditingGroup(null);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;

    const maxId = grupos.length > 0 ? Math.max(...grupos.map(g => g.id)) : 0;
    const newGroup: Grupo = {
      id: maxId + 1,
      tipo: newGroupData.tipo as any,
      nome: newGroupData.nome || `Novo Grupo ${newGroupData.tipo}`,
      dia: newGroupData.dia || 'A definir',
      horario: newGroupData.horario || '00h',
      facilitador: newGroupData.facilitador || 'A definir',
      participantes: 0,
      unidadeId: selectedUnit,
      ...(newGroupData.cofacilitador ? { cofacilitador: newGroupData.cofacilitador } : {})
    };

    setGrupos([...grupos, newGroup]);
    setIsNewGroupModalOpen(false);
    setNewGroupData({ tipo: 'GAP', nome: '', dia: '', horario: '', facilitador: '', participantes: 0 });
  };

  const handleDeleteGroup = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      setGrupos(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <section className="p-6 md:p-8 animate-fade-in pb-20 max-w-7xl mx-auto relative">

      {/* --- LEVEL 1: UNITS SELECTION --- */}
      {!selectedUnit ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                {isAdmin ? 'Unidades Móveis & Fixas' : `Minha Unidade`}
              </h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {isAdmin ? 'Selecione o Complexo ou Espaço Social para gerenciar' : user?.unit || 'Sua unidade de atuação'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.filter(u => isAdmin ? true : u.name === user?.unit).map((unit) => (
              <div
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${unit.color} opacity-10 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-500`}></div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${unit.color} text-white flex items-center justify-center text-2xl shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                    <i className={`fa-solid ${unit.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{unit.type}</span>
                    <h3 className="text-xl font-black text-slate-800 leading-none group-hover:text-orange-600 transition-colors">{unit.location}</h3>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 relative z-10">
                  <span className="text-xs font-bold text-slate-500 group-hover:text-orange-500 transition-colors flex items-center gap-2">
                    Acessar Grupos <i className="fa-solid fa-arrow-right"></i>
                  </span>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+4</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* --- LEVEL 2: GROUPS LIST --- */
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedUnit(null)}
                title="Voltar para unidades"
                className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-orange-500 transition shadow-sm"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Grupos: {currentUnit?.location}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gerenciamento de Vínculos</p>
              </div>
            </div>
            <button
              onClick={() => setIsNewGroupModalOpen(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 flex items-center text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-1"
            >
              <i className="fa-solid fa-plus mr-2"></i> Adicionar Grupo
            </button>
          </div>

          {filteredGrupos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
              {filteredGrupos.map((grupo) => (
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
                  <div className="mb-6 relative group/info">
                    <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover/info:opacity-100 transition">
                      <button
                        onClick={() => setEditingGroup(grupo)}
                        className="text-slate-300 hover:text-orange-500 p-1"
                        title="Editar Facilitadores"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(grupo.id)}
                        className="text-slate-300 hover:text-red-500 p-1"
                        title="Excluir Grupo"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>

                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                      {grupo.nome}
                    </h3>
                    <div className="flex flex-col gap-1 mt-2">
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <i className="fa-solid fa-user-check text-emerald-500"></i>
                        <span className="font-bold text-slate-700">Facilitador:</span> {grupo.facilitador}
                      </p>
                      {grupo.cofacilitador && (
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                          <i className="fa-solid fa-user-group text-blue-500"></i>
                          <span className="font-bold text-slate-700">Co-Facilitador:</span> {grupo.cofacilitador}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grid de Ações (Botões) */}
                  <div className="space-y-3">
                    {/* Linha 1: Gestão (Lista e Frequência) */}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleAction('beneficiarios', grupo.tipo)} className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl border-2 border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition text-xs font-bold uppercase">
                        <i className="fa-solid fa-list-ul"></i> Ver Lista
                      </button>
                      <button onClick={() => handleAction('diario', grupo.tipo)} className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl border-2 border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold uppercase">
                        <i className="fa-solid fa-calendar-check"></i> Frequência
                      </button>
                    </div>

                    {/* Linha 2: Ação Direta (Inscrição e Avaliação) */}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleAction('beneficiarios', grupo.tipo)} className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition text-xs font-black uppercase tracking-wide">
                        <i className="fa-solid fa-user-plus"></i> Inscrição
                      </button>
                      <button onClick={() => alert('Funcionalidade em desenvolvimento.')} className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg transition text-xs font-black uppercase tracking-wide">
                        <i className="fa-solid fa-star"></i> Avaliar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 animate-fade-in-up">
              <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-4"></i>
              <h3 className="text-lg font-black text-slate-500">Nenhum grupo cadastrado nesta unidade.</h3>
              <button
                onClick={() => setIsNewGroupModalOpen(true)}
                className="mt-4 text-emerald-600 font-bold text-sm uppercase hover:underline"
              >
                Criar primeiro grupo
              </button>
            </div>
          )}
        </>
      )}

      {/* NEW GROUP MODAL */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-slate-100">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">Novo Grupo</h3>
                <p className="text-xs font-bold text-emerald-100">Adicionar à unidade atual</p>
              </div>
              <button onClick={() => setIsNewGroupModalOpen(false)} className="text-white hover:rotate-90 transition duration-300 w-8 h-8 flex items-center justify-center">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tipo de Grupo</label>
                <select
                  value={newGroupData.tipo}
                  onChange={(e) => setNewGroupData({ ...newGroupData, tipo: e.target.value as any })}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700"
                >
                  <option value="GAP">GAP - Grupo de Adolescente Participativo</option>
                  <option value="GPI">GPI - Grupo de Pessoas Idosas</option>
                  <option value="GFA">GFA - Grupo de Famílias</option>
                  <option value="ACT">ACT - Parentalidade Positiva</option>
                  <option value="CÍRCULO">CÍRCULO - Círculo de Construção de Paz</option>
                  <option value="JANELAS">JANELAS - Janelas da Infância</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome do Grupo</label>
                <input
                  type="text"
                  value={newGroupData.nome}
                  onChange={(e) => setNewGroupData({ ...newGroupData, nome: e.target.value })}
                  required
                  className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700"
                  placeholder="Ex: GAP Jovens Titãs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Dia da Semana</label>
                  <select
                    value={newGroupData.dia}
                    onChange={(e) => setNewGroupData({ ...newGroupData, dia: e.target.value })}
                    required
                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700"
                  >
                    <option value="">Selecione...</option>
                    <option value="Segunda">Segunda</option>
                    <option value="Terça">Terça</option>
                    <option value="Quarta">Quarta</option>
                    <option value="Quinta">Quinta</option>
                    <option value="Sexta">Sexta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Horário</label>
                  <input
                    type="text"
                    value={newGroupData.horario}
                    onChange={(e) => setNewGroupData({ ...newGroupData, horario: e.target.value })}
                    required
                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700"
                    placeholder="Ex: 14h"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Facilitador(a)</label>
                <input
                  type="text"
                  value={newGroupData.facilitador}
                  onChange={(e) => setNewGroupData({ ...newGroupData, facilitador: e.target.value })}
                  required
                  className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700"
                  placeholder="Nome do Facilitador"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Co-Facilitador(a)</label>
                <input
                  type="text"
                  value={newGroupData.cofacilitador || ''}
                  onChange={(e) => setNewGroupData({ ...newGroupData, cofacilitador: e.target.value })}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700"
                  placeholder="Nome do Co-Facilitador (Opcional)"
                />
              </div>

              <button type="submit" className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition hover:-translate-y-0.5 mt-2">
                Criar Grupo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingGroup && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-slate-100">
            <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">Equipe do Grupo</h3>
                <p className="text-xs font-bold text-orange-100">Quem conduz as atividades?</p>
              </div>
              <button onClick={() => setEditingGroup(null)} className="text-white hover:rotate-90 transition duration-300 w-8 h-8 flex items-center justify-center">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSaveFacilitators} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Facilitador(a) Principal</label>
                <div className="relative">
                  <i className="fa-solid fa-user-check absolute left-4 top-3.5 text-emerald-500"></i>
                  <input
                    type="text"
                    value={editingGroup.facilitador}
                    onChange={(e) => setEditingGroup({ ...editingGroup, facilitador: e.target.value })}
                    className="w-full border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition font-bold text-slate-700"
                    placeholder="Nome do Facilitador"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Co-Facilitador(a) (Opcional)</label>
                <div className="relative">
                  <i className="fa-solid fa-user-group absolute left-4 top-3.5 text-blue-500"></i>
                  <input
                    type="text"
                    value={editingGroup.cofacilitador || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, cofacilitador: e.target.value })}
                    className="w-full border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition font-bold text-slate-700"
                    placeholder="Nome do Co-Facilitador"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 transition hover:-translate-y-0.5 mt-2">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default Grupos;
