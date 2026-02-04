import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LoginProps {
    onLogin: (user: UserProfile) => void;
    onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [regName, setRegName] = useState('');
    const [regCrp, setRegCrp] = useState('');
    const [regUnit, setRegUnit] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

    const unitsList = [
        "CSMI João XXIII",
        "CSMI Cristo Redentor",
        "CSMI Curió",
        "CSMI Barbalha",
        "Espaço Social Quintino Cunha",
        "Espaço Social Barra do Ceará",
        "Espaço Social Dias Macedo"
    ];

    const avatarList = [
        "/avatars/avatar_01.png",
        "/avatars/avatar_02.png",
        "/avatars/avatar_03.png",
        "/avatars/avatar_04.png",
        "/avatars/avatar_05.png"
    ];

    const availableCourses = [
        "ACT - Parentalidade Positiva",
        "Círculo de Construção de Paz",
        "CNV - Comunicação Não Violenta",
        "Justiça Restaurativa",
        "Competências Socioemocionais",
        "Mediação de Conflitos"
    ];

    const toggleCourse = (course: string) => {
        setSelectedCourses(prev =>
            prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
        );
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulação de login com usuário padrão (Genildo) se não estiver registrando
        setTimeout(() => {
            setLoading(false);
            onLogin({
                name: 'Genildo Barbosa',
                role: 'Psicólogo Social',
                crp: '11/04982',
                qualificacoes: [
                    "ACT - Parentalidade Positiva",
                    "Círculo de Construção de Paz",
                    "Competências Socioemocionais"
                ]
            });
        }, 1000);
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLogin({
                name: regName || 'Novo Usuário',
                role: 'Psicólogo Social',
                crp: regCrp || '00/00000',
                unit: regUnit || 'Não informada',
                avatar: selectedAvatar || '/avatars/avatar_01.png',
                qualificacoes: selectedCourses
            });
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-[#FEF3C7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decorativo */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full text-emerald-900 font-bold text-xs hover:bg-white transition shadow-sm"
                >
                    <i className="fa-solid fa-arrow-left"></i> Voltar
                </button>
            )}

            <div className={`bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/50 relative z-10 animate-fade-in-up transition-all duration-500 ${isRegistering ? 'max-w-2xl' : 'max-w-md'}`}>
                <div className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        {/* Logo Reverted: Teal Icon for White Background */}
                        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mx-auto mb-4 transform rotate-3">
                            Ψ
                        </div>
                        <h1 className="text-2xl font-black text-emerald-900 tracking-tight">Gestão PSI</h1>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-6">Complexos e Espaços Sociais</p>

                        {/* Tag de Login Técnico */}
                        <div className="inline-block bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-id-card"></i> Login Usuário Técnico
                            </p>
                        </div>
                    </div>

                    {!isRegistering ? (
                        // --- TELA DE LOGIN ---
                        <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Usuário / CPF</label>
                                <input
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"
                                    placeholder="Digite seu usuário"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Senha de Acesso</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Acessar Sistema'}
                            </button>

                            <div className="pt-4 text-center border-t border-slate-100 mt-4">
                                <p className="text-xs text-slate-500 font-medium mb-2">Primeiro acesso?</p>
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(true)}
                                    className="text-orange-500 font-black text-xs uppercase tracking-wider hover:underline"
                                >
                                    Criar Cadastro Profissional
                                </button>
                            </div>
                        </form>
                    ) : (
                        // --- TELA DE CADASTRO (PRIMEIRO ACESSO) ---
                        <form onSubmit={handleRegisterSubmit} className="space-y-6 animate-fade-in max-h-[80vh] overflow-y-auto p-1 custom-scrollbar">
                            <div className="flex items-center gap-2 mb-2 bg-orange-50 p-3 rounded-xl border border-orange-100 sticky top-0 bg-orange-50 z-10">
                                <i className="fa-solid fa-circle-info text-orange-500"></i>
                                <p className="text-xs font-bold text-orange-800 leading-tight">Complete seu perfil profissional para personalizar o sistema.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Nome Completo</label>
                                    <input
                                        type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Nº CRP</label>
                                    <input
                                        type="text" required value={regCrp} onChange={e => setRegCrp(e.target.value)}
                                        placeholder="00/00000"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* UNIDADE DE ATUAÇÃO */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Unidade de Atuação</label>
                                <select
                                    required
                                    value={regUnit}
                                    onChange={(e) => setRegUnit(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 appearance-none"
                                >
                                    <option value="">Selecione sua unidade...</option>
                                    {unitsList.map((unit, idx) => (
                                        <option key={idx} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>

                            {/* AVATAR SELECTION */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-3 ml-1">Escolha seu Avatar</label>
                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {avatarList.map((avatar, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedAvatar(avatar)}
                                            className={`relative w-16 h-16 rounded-full border-4 cursor-pointer transition-transform hover:scale-110 flex-shrink-0 ${selectedAvatar === avatar ? 'border-emerald-500 scale-110 shadow-lg' : 'border-transparent filter grayscale hover:grayscale-0'}`}
                                        >
                                            <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover rounded-full bg-white" />
                                            {selectedAvatar === avatar && (
                                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-white">
                                                    <i className="fa-solid fa-check"></i>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-3 ml-1 border-b border-slate-100 pb-1">
                                    Facilitador de Grupos / Cursos (COMPAZ & ACT)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {availableCourses.map((course, idx) => {
                                        const isSelected = selectedCourses.includes(course);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => toggleCourse(course)}
                                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>
                                                    {isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                                                </div>
                                                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>{course}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition text-xs uppercase"
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-xs"
                                >
                                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Concluir Cadastro'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
