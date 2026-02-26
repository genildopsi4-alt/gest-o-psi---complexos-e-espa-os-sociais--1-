import React, { useState, useEffect } from 'react';
import { Section, UserProfile } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onLogout: () => void;
  user?: UserProfile | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, onLogout, user }) => {
  const [time, setTime] = useState(new Date());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
      }
    }
  };

  const isAdmin = user?.role === 'admin' || user?.name?.includes('Genildo');

  // Cores dos pilares Mais Infância Ceará
  const sectionColors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    vinculos: { bg: 'bg-[#3AADD9]/10', text: 'text-[#3AADD9]', border: 'border-[#3AADD9]/30', iconBg: 'text-[#3AADD9]' },
    act: { bg: 'bg-[#EDA59E]/15', text: 'text-[#D4776E]', border: 'border-[#EDA59E]/30', iconBg: 'text-[#D4776E]' },
    compaz: { bg: 'bg-[#4D9B8A]/10', text: 'text-[#4D9B8A]', border: 'border-[#4D9B8A]/30', iconBg: 'text-[#4D9B8A]' },
    atendimento: { bg: 'bg-[#7B5EA7]/10', text: 'text-[#7B5EA7]', border: 'border-[#7B5EA7]/30', iconBg: 'text-[#7B5EA7]' },
    grupos: { bg: 'bg-[#3AADD9]/10', text: 'text-[#3AADD9]', border: 'border-[#3AADD9]/30', iconBg: 'text-[#3AADD9]' },
    dashboard: { bg: 'bg-[#00BFA6]/10', text: 'text-[#00897B]', border: 'border-[#00BFA6]/30', iconBg: 'text-[#00BFA6]' },
  };
  const defaultColor = { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', iconBg: 'text-slate-500' };

  const menuItems: { id: Section; label: string; icon: string; badge?: number; separator?: string }[] = [
    { id: 'dashboard', label: 'Painel de Controle', icon: 'fa-grip-vertical' },
    { id: 'vinculos', label: 'Grupos de Vínculos', icon: 'fa-users', separator: 'Registro de Atividades' },
    { id: 'act', label: 'ACT Parentalidade', icon: 'fa-hands-holding-child' },
    { id: 'compaz', label: 'COMPAZ', icon: 'fa-peace' },
    { id: 'atendimento', label: 'Atendimento', icon: 'fa-user-pen' },
    { id: 'grupos', label: 'Chamada Digital', icon: 'fa-users-viewfinder', separator: 'Gestão' },
    { id: 'instrumentais', label: 'Instrumentais', icon: 'fa-file-signature' },
    { id: 'planejamento', label: 'Relatórios', icon: 'fa-file-lines' },
    { id: 'beneficiarios', label: 'Busca Ativa', icon: 'fa-user-clock', badge: 3 },
    { id: 'rede', label: 'Rede de Apoio', icon: 'fa-map-location-dot' },
    { id: 'eventos', label: 'Eventos', icon: 'fa-calendar-day' },
  ];

  return (
    <aside className="w-64 bg-white border-r-2 border-[#00BFA6]/20 h-full flex flex-col flex-shrink-0 transition-all duration-300 font-sans z-30 shadow-xl rounded-r-[2rem]">

      {/* --- BRAND --- */}
      <div className="h-24 flex items-center px-6 border-b-2 border-[#00BFA6]/10 flex-shrink-0 bg-gradient-to-r from-[#00BFA6] to-[#3AADD9] rounded-tr-[2rem]">
        {/* Ícone Branco com Texto Verde (Conforme Imagem) */}
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#00BFA6] text-2xl font-black shadow-lg mr-3 transform -rotate-6 border-2 border-white/50">
          Ψ
        </div>
        <div className="flex flex-col text-white">
          <h1 className="font-black text-2xl tracking-tight leading-none drop-shadow-sm">Gestão PSI</h1>
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-0.5">Complexos e Espaços Sociais</span>
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

      {/* --- PWA INSTALL BUTTON --- */}
      {deferredPrompt && (
        <div className="px-4 pt-4 pb-0">
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <i className="fa-solid fa-download animate-bounce"></i>
            <span className="text-xs font-black uppercase tracking-wider">Instalar App</span>
          </button>
        </div>
      )}

      <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <React.Fragment key={item.id}>
              {item.separator && (
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-3 pb-1 pl-4 mt-1 border-t border-slate-100 first:border-t-0 first:mt-0">
                  {item.separator}
                </h3>
              )}
              <button
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 relative group
                  ${isActive
                    ? `${(sectionColors[item.id] || defaultColor).bg} ${(sectionColors[item.id] || defaultColor).text} shadow-sm border-2 ${(sectionColors[item.id] || defaultColor).border}`
                    : 'text-slate-500 hover:bg-[#00BFA6]/5 hover:text-[#00897B] border-2 border-transparent hover:border-[#00BFA6]/15'}
                `}
              >
                <div className={`w-8 flex justify-center mr-2 ${isActive ? (sectionColors[item.id] || defaultColor).iconBg : 'text-slate-400 group-hover:text-[#00BFA6]'}`}>
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
            </React.Fragment>
          );
        })}
      </nav>

      {/* --- ÁREA ADMINISTRATIVA (somente Admin) --- */}
      {isAdmin && (
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
      )}

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
