
import React from 'react';

interface BottomNavProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, setActiveSection }) => {
    const navItems = [
        { id: 'dashboard', icon: 'fa-chart-pie', label: 'Painel' },
        { id: 'vinculos', icon: 'fa-users', label: 'Vínculos' },
        { id: 'act', icon: 'fa-hands-holding-child', label: 'ACT' },
        { id: 'compaz', icon: 'fa-peace', label: 'COMPAZ' },
        { id: 'atendimento', icon: 'fa-user-pen', label: 'Atend.' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4 flex justify-between items-center z-50 md:hidden pb-safe mb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex flex-col items-center gap-1 w-full p-2 rounded-xl transition-all duration-300 ${activeSection === item.id ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <i className={`fa-solid ${item.icon} text-xl mb-0.5 ${activeSection === item.id ? 'animate-bounce-short' : ''}`}></i>
                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                    {activeSection === item.id && (
                        <span className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5"></span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
