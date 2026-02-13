import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AuthService } from '../src/services/AuthService';

import avatar01 from '../src/assets/avatars/avatar_01.png';
import avatar02 from '../src/assets/avatars/avatar_02.png';
import avatar03 from '../src/assets/avatars/avatar_03.png';
import avatar04 from '../src/assets/avatars/avatar_04.png';
import avatar05 from '../src/assets/avatars/avatar_05.png';
import avatar06 from '../src/assets/avatars/avatar_06.png';

interface LoginProps {
    onLogin: (user: UserProfile) => void;
    onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login State
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [regName, setRegName] = useState('');
    const [regCpf, setRegCpf] = useState('');
    const [regCrp, setRegCrp] = useState('');
    const [regUnit, setRegUnit] = useState('');
    const [regRole, setRegRole] = useState<'admin' | 'tecnico'>('tecnico');
    const [regPassword, setRegPassword] = useState('');
    const [accessKey, setAccessKey] = useState('');
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
        avatar01, avatar02, avatar03, avatar04, avatar05, avatar06
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

    // CPF Mask Helper
    const formatCpf = (value: string) => {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
            .replace(/(-\d{2})\d+?$/, '$1'); // Impede que sejam digitados mais de 11 dígitos
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { user, error } = await AuthService.login(cpf, password);

        if (error) {
            setError(error);
            setLoading(false);
        } else if (user) {
            onLogin(user);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation for Manager Role - Optional: Keep the secret key if desired, but SQL handles logic too
        if (regRole === 'admin' && accessKey !== 'gestor') {
            alert('Chave de acesso incorreta para perfil de Gestor.');
            setLoading(false);
            return;
        }

        const result = await AuthService.register({
            nome: regName,
            cpf: regCpf,
            crp: regCrp,
            unidade: regRole === 'tecnico' ? (regUnit || 'Não informada') : 'Gestão Central',
            senha: regPassword,
            avatar: selectedAvatar || '/avatars/avatar_01.png',
            role: regRole,
            qualificacoes: selectedCourses
        });

        if (result.success) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            setIsRegistering(false);
            setLoading(false);
            // Pre-fill login
            setCpf(regCpf);
            setPassword(regPassword);
        } else {
            setError(result.error);
            alert(result.error);
            setLoading(false);
        }
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
                                <i className="fa-solid fa-id-card"></i> Portal do Colaborador
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    {!isRegistering ? (
                        // --- TELA DE LOGIN ---
                        <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">CPF</label>
                                <input
                                    type="text"
                                    required
                                    value={cpf}
                                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition"
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    minLength={14}
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
                                <div className="text-right mt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            alert(`Para recuperar sua senha, envie um e-mail para:\ngenildo.barbosa@sps.ce.gov.br\n\nInforme seu CPF e Nome Completo.`);
                                        }}
                                        className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition uppercase"
                                    >
                                        Esqueci a Senha
                                    </button>
                                </div>
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

                                {/* Botão de Download do APK */}
                                <div className="mt-6">
                                    <a
                                        href="/app-release.apk"
                                        download="GestaoPSI.apk"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                                    >
                                        <i className="fa-brands fa-android text-base text-emerald-600 group-hover:scale-110 transition-transform"></i>
                                        <span>Baixar App Android</span>
                                    </a>
                                </div>
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
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">CPF</label>
                                    <input
                                        type="text" required value={regCpf} onChange={e => setRegCpf(formatCpf(e.target.value))}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        minLength={14}
                                        aria-label="CPF"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Nº CRP</label>
                                    <input
                                        type="text" required value={regCrp} onChange={e => setRegCrp(e.target.value)}
                                        placeholder="00/00000"
                                        aria-label="Número CRP"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Nome Completo</label>
                                    <input
                                        type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                                        aria-label="Nome Completo"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Crie sua Senha</label>
                                    <input
                                        type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)}
                                        placeholder="••••••••"
                                        aria-label="Crie sua Senha"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Perfil de Acesso</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-center gap-2 ${regRole === 'admin' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500 hover:border-orange-200'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            title="Perfil Gestor"
                                            checked={regRole === 'admin'}
                                            onChange={() => setRegRole('admin')}
                                            className="hidden"
                                        />
                                        <i className="fa-solid fa-user-tie"></i>
                                        <span className="text-[10px] font-black uppercase text-center">Gestor / Psicólogo Referência</span>
                                    </label>
                                    <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-center gap-2 ${regRole === 'tecnico' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-500 hover:border-teal-200'}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="tecnico"
                                            title="Perfil Técnico"
                                            checked={regRole === 'tecnico'}
                                            onChange={() => setRegRole('tecnico')}
                                            className="hidden"
                                        />
                                        <i className="fa-solid fa-user-nurse"></i>
                                        <span className="text-[10px] font-black uppercase text-center">Técnico de Unidade</span>
                                    </label>
                                </div>
                            </div>

                            {/* UNIDADE DE ATUAÇÃO (Apenas p/ Técnico) */}
                            {regRole === 'tecnico' && (
                                <div className="mb-4 animate-fade-in-down">
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Unidade de Atuação</label>
                                    <select
                                        required
                                        title="Selecione sua unidade"
                                        value={regUnit}
                                        onChange={(e) => setRegUnit(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition font-bold text-slate-600 text-sm appearance-none"
                                    >
                                        <option value="">Selecione sua unidade...</option>
                                        {unitsList.map((unit, idx) => (
                                            <option key={idx} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ACCESS KEY FOR ADMIN */}
                            {regRole === 'admin' && (
                                <div className="mb-4 animate-fade-in-down">
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1 text-orange-500">
                                        <i className="fa-solid fa-lock mr-1"></i>
                                        Senha do Gestor
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={accessKey}
                                        onChange={(e) => setAccessKey(e.target.value)}
                                        placeholder="Digite a senha de administrador..."
                                        className="w-full px-4 py-3 rounded-xl bg-orange-50 border-2 border-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition font-bold text-orange-800 text-sm"
                                    />
                                    <p className="text-[10px] text-orange-400 mt-1 font-bold ml-1">
                                        * Senha necessária para perfil de Gestão.
                                    </p>
                                </div>
                            )}

                            {/* AVATAR SELECTION */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-3 ml-1">Escolha seu Avatar</label>
                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {avatarList.map((avatar, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedAvatar(avatar)}
                                            className={`relative w-16 h-16 rounded-full border-4 cursor-pointer shrink-0 transition-all duration-300 ${selectedAvatar === avatar ? 'border-emerald-500 scale-110 shadow-lg' : 'border-transparent filter grayscale hover:grayscale-0'}`}
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
