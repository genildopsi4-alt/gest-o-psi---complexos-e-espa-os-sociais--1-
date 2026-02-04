import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
    title: string;
    subtitle?: string;
    user: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, user }) => {
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const phrases = [
        "“Se mudarmos o começo da história, mudamos a história toda.”",
        "“O brincar permeia a lembrança mais vívida e feliz da infância.”",
        "“Aprender com o GAP: Socialização e Protagonismo Juvenil.”",
        "“Janelas da Infância: Monitorando o desenvolvimento integral.”",
        "“Precisamos priorizar a primeira infância e focar nos mais vulneráveis.”",
        "“ACT - Parentalidade Positiva: Fortalecendo vínculos.”"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % phrases.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleProfile = () => {
        setIsProfileExpanded(!isProfileExpanded);
    };

    const getInitials = (name: string) => {
        return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'GB';
    }

    const getCourseStyle = (courseName: string) => {
        if (courseName.includes("ACT")) return "bg-blue-50 text-blue-700 border-blue-200";
        if (courseName.includes("CNV")) return "bg-pink-50 text-pink-700 border-pink-200";
        if (courseName.includes("Paz")) return "bg-teal-50 text-teal-700 border-teal-200";
        if (courseName.includes("Justiça")) return "bg-purple-50 text-purple-700 border-purple-200";
        return "bg-slate-50 text-slate-700 border-slate-200";
    }

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b-2 border-orange-100 px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0 z-20 shadow-sm relative rounded-bl-[2rem]">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-8 w-8 bg-orange-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <i className="fa-solid fa-shapes"></i>
                    </div>
                    <h2 className="text-2xl font-black text-teal-800 tracking-tight uppercase">{title}</h2>
                </div>
                <div className="flex flex-col pl-11">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{subtitle || 'Mais Infância Ceará'}</p>
                    <p className="text-xs font-bold text-slate-400 italic font-serif transition-opacity duration-1000">
                        {phrases[quoteIndex]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden lg:block group">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 text-sm group-focus-within:text-orange-500 transition"></i>
                    <input type="text" placeholder="Buscar no sistema..." className="bg-amber-50 border-2 border-orange-100 rounded-full py-2.5 pl-10 pr-4 text-xs font-bold text-slate-600 outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition w-64 placeholder-orange-300/70" />
                </div>

                {/* Profile Section */}
                <div className="relative border-l-2 border-orange-100 pl-6" ref={dropdownRef}>
                    <button
                        onClick={toggleProfile}
                        className="flex items-center gap-3 cursor-pointer hover:bg-orange-50 p-2 rounded-2xl transition-all outline-none focus:ring-4 focus:ring-orange-100 border border-transparent hover:border-orange-100"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-slate-700 leading-none">{user?.name || 'Usuário'}</p>
                            <p className="text-[9px] text-teal-600 font-black uppercase mt-1 bg-teal-50 px-2 py-0.5 rounded-full inline-block">{user?.role || 'Profissional'}</p>
                        </div>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Profile"
                                className={`w-11 h-11 rounded-2xl bg-white object-cover shadow-md border-2 border-teal-200 transition-transform duration-300 ${isProfileExpanded ? 'rotate-180 bg-teal-500' : ''}`}
                            />
                        ) : (
                            <div className={`w-11 h-11 rounded-2xl bg-teal-400 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-teal-200 transition-transform duration-300 ${isProfileExpanded ? 'rotate-180 bg-teal-500' : ''}`}>
                                {isProfileExpanded ? <i className="fa-solid fa-chevron-up text-xs"></i> : getInitials(user?.name || '')}
                            </div>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileExpanded && (
                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border-2 border-orange-100 overflow-hidden animate-fade-in-up z-50">
                            <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white object-cover" alt="Avatar" />
                                    ) : (
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-500 font-black shadow">
                                            {getInitials(user?.name || '')}
                                        </div>
                                    )}
                                    <div className="text-white">
                                        <p className="font-black text-sm leading-none">{user?.name}</p>
                                        <p className="text-[10px] uppercase opacity-90">{user?.role}</p>
                                        {user?.unit && <p className="text-[9px] font-bold text-teal-100 mt-0.5"><i className="fa-solid fa-location-dot mr-1"></i>{user.unit}</p>}
                                    </div>
                                </div>
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 text-center">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">CRP: {user?.crp || '---'}</p>
                                </div>
                            </div>

                            <div className="p-5 bg-white">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-graduation-cap text-orange-400"></i> Qualificações
                                </p>
                                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {user?.qualificacoes && user.qualificacoes.length > 0 ? (
                                        user.qualificacoes.map((qual, idx) => (
                                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${getCourseStyle(qual)}`}>
                                                <i className="fa-solid fa-check-circle"></i>
                                                <span className="text-[11px] font-bold leading-tight">{qual}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-lg text-center">Nenhuma qualificação registrada.</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 border-t-2 border-slate-100">
                                <button className="w-full py-3 text-xs font-black text-slate-500 hover:text-white hover:bg-orange-400 rounded-xl transition text-center uppercase tracking-wider">
                                    <i className="fa-solid fa-gear mr-1"></i> Configurações
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
