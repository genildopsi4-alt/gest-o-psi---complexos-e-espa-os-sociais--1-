import React, { useState, useEffect } from 'react';
import { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems: { id: Section; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Painel de Controle', icon: 'fa-grip-vertical' },
    { id: 'diario', label: 'Novo Registro', icon: 'fa-plus' },
    { id: 'grupos', label: 'Chamada Digital', icon: 'fa-users-viewfinder' },
    { id: 'instrumentais', label: 'Instrumentais', icon: 'fa-file-signature' },
    { id: 'planejamento', label: 'Relatórios', icon: 'fa-file-lines' },
    { id: 'beneficiarios', label: 'Busca Ativa', icon: 'fa-user-clock', badge: 3 },
    { id: 'rede', label: 'Rede de Apoio', icon: 'fa-map-location-dot' },
    { id: 'eventos', label: 'Eventos', icon: 'fa-calendar-day' },
  ];

  return (
    <aside className="w-64 bg-white border-r-2 border-orange-100 h-full flex flex-col flex-shrink-0 transition-all duration-300 font-sans z-30 shadow-xl rounded-r-[2rem]">

      {/* --- BRAND --- */}
      <div className="h-24 flex items-center px-6 border-b-2 border-orange-50 flex-shrink-0 bg-teal-500 rounded-tr-[2rem]">
        {/* Ícone Branco com Texto Verde (Conforme Imagem) */}
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 text-2xl font-black shadow-lg mr-3 transform -rotate-6 border-2 border-teal-200">
          Ψ
        </div>
        <div className="flex flex-col text-white">
          <h1 className="font-black text-2xl tracking-tight leading-none drop-shadow-sm">Gestão PSI</h1>
          <span className="text-[10px] font-bold text-teal-50 uppercase tracking-widest mt-0.5">Complexos e Espaços Sociais</span>
        </div>
      </div>

      {/* --- ACTIVE CLOCK --- */}
      <div className="p-6 bg-amber-50 border-b border-orange-100 flex-shrink-0 flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-black text-teal-700 tracking-tight font-mono leading-none flex items-center gap-1">
          {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          <i className="fa-solid fa-sun text-yellow-400 text-sm animate-spin-slow"></i>
        </div>
        <p className="text-[11px] font-bold text-orange-400 uppercase mt-2 tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
          {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 relative group
                ${isActive
                  ? 'bg-orange-100 text-orange-600 shadow-sm border-2 border-orange-200'
                  : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600 border-2 border-transparent hover:border-teal-100'}
              `}
            >
              <div className={`w-8 flex justify-center mr-2 ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-teal-500'}`}>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
              </div>

              <span>{item.label}</span>

              {item.badge && (
                <span className={`
                    ml-auto text-[10px] font-black px-2 py-1 rounded-full shadow-sm
                    ${isActive
                    ? 'bg-red-400 text-white'
                    : 'bg-red-100 text-red-500'}
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* --- ÁREA ADMINISTRATIVA --- */}
      <div className="px-4 py-2 bg-white border-t border-slate-50">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Área Administrativa</h3>
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`w-full flex items-center justify-center px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm group ${activeSection === 'dashboard' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200' : 'bg-indigo-50 text-indigo-600 border-2 border-indigo-50 hover:bg-indigo-100'}`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 mr-2 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-chart-pie"></i>
          </div>
          Gestão Central
        </button>
      </div>

      {/* --- FOOTER / LOGOUT --- */}
      <div className="p-4 border-t-2 border-orange-50 flex-shrink-0 bg-slate-50 rounded-br-[2rem]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-black text-red-500 bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-200 rounded-2xl transition-all shadow-sm group"
        >
          <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-lg group-hover:-translate-x-1 transition-transform"></i>
          SAIR
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
