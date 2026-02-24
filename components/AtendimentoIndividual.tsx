import React, { useState } from 'react';
import { UserProfile } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';

interface AtendimentoIndividualProps {
    user?: UserProfile | null;
}

const AtendimentoIndividual: React.FC<AtendimentoIndividualProps> = ({ user }) => {
    const isAdmin = user?.role === 'admin' || user?.name?.includes('Genildo');
    const [selectedUnidade, setSelectedUnidade] = useState<string>(isAdmin ? '' : (user?.unit || ''));
    const [dataAtendimento, setDataAtendimento] = useState<string>(new Date().toISOString().split('T')[0]);
    const [tipoAtendimento, setTipoAtendimento] = useState<string>('');
    const [nomeAtendido, setNomeAtendido] = useState<string>('');
    const [observacoes, setObservacoes] = useState<string>('');
    const [registros, setRegistros] = useState<Array<{ tipo: string; nome: string; obs: string; hora: string }>>([]);

    const unidades = [
        { label: '-- Selecione a Unidade --', value: '', disabled: true },
        { value: 'CSMI João XXIII', label: 'João XXIII' },
        { value: 'CSMI Cristo Redentor', label: 'Cristo Redentor' },
        { value: 'CSMI Curió', label: 'Curió' },
        { value: 'CSMI Barbalha', label: 'Barbalha' },
        { value: 'Espaço Social Quintino Cunha', label: 'Quintino Cunha' },
        { value: 'Espaço Social Barra do Ceará', label: 'Barra do Ceará' },
        { value: 'Espaço Social Dias Macedo', label: 'Dias Macedo' },
    ];

    const tiposAtendimento = [
        { value: 'escuta', label: 'Escuta Qualificada', icon: 'fa-ear-listen', color: 'bg-violet-500', lightBg: 'bg-violet-50 border-violet-200' },
        { value: 'acolhimento', label: 'Acolhimento', icon: 'fa-hand-holding-heart', color: 'bg-rose-500', lightBg: 'bg-rose-50 border-rose-200' },
        { value: 'triagem', label: 'Triagem', icon: 'fa-clipboard-list', color: 'bg-amber-500', lightBg: 'bg-amber-50 border-amber-200' },
        { value: 'visita_domiciliar', label: 'Visita Domiciliar', icon: 'fa-house-user', color: 'bg-sky-500', lightBg: 'bg-sky-50 border-sky-200' },
        { value: 'visita_institucional', label: 'Visita Institucional', icon: 'fa-building', color: 'bg-slate-500', lightBg: 'bg-slate-50 border-slate-200' },
        { value: 'busca_ativa', label: 'Busca Ativa', icon: 'fa-magnifying-glass-location', color: 'bg-orange-500', lightBg: 'bg-orange-50 border-orange-200' },
    ];

    const tipoSelecionado = tiposAtendimento.find(t => t.value === tipoAtendimento);

    const handleAddRegistro = async () => {
        if (!tipoAtendimento || !nomeAtendido.trim()) {
            alert("Preencha o tipo e o nome do atendido.");
            return;
        }

        const novoRegistro = {
            tipo: tipoAtendimento,
            nome: nomeAtendido,
            obs: observacoes,
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        // Save to service
        const dataToSave = {
            unidade: selectedUnidade || "Unidade Não Selecionada",
            tipo_acao: 'comunitaria',
            atividade_especifica: tipoAtendimento,
            data_registro: dataAtendimento,
            qtd_participantes: 1,
            fotos_urls: [],
            observacoes: `${nomeAtendido} - ${observacoes}`
        };

        const result = await RelatorioService.saveAtendimento(dataToSave, []);
        if (result.success) {
            setRegistros(prev => [novoRegistro, ...prev]);
            setNomeAtendido('');
            setObservacoes('');
            setTipoAtendimento('');
        } else {
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-violet-50/30 min-h-full">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-violet-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Atendimento</h2>
                            <p className="text-violet-100 text-sm font-medium">Registro rápido e simplificado</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <i className="fa-solid fa-user-pen text-3xl"></i>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Unidade e Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade</label>
                                <select
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-violet-500 transition font-bold text-slate-700"
                                    value={selectedUnidade}
                                    onChange={(e) => setSelectedUnidade(e.target.value)}
                                    title="Selecionar Unidade"
                                    disabled={!isAdmin && !!user?.unit}
                                >
                                    {unidades.map((u, i) => (
                                        <option key={i} value={u.value} disabled={u.disabled}>{u.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Data</label>
                                <input
                                    type="date"
                                    value={dataAtendimento}
                                    onChange={(e) => setDataAtendimento(e.target.value)}
                                    title="Data do Atendimento"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-violet-500 transition font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Tipo de Atendimento */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Tipo de Atendimento</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {tiposAtendimento.map((tipo) => (
                                    <button
                                        key={tipo.value}
                                        type="button"
                                        onClick={() => setTipoAtendimento(tipo.value)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${tipoAtendimento === tipo.value
                                            ? `${tipo.lightBg} shadow-md scale-[1.02]`
                                            : 'border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-10 h-10 ${tipo.color} text-white rounded-xl flex items-center justify-center shadow-sm`}>
                                            <i className={`fa-solid ${tipo.icon}`}></i>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase text-center leading-tight ${tipoAtendimento === tipo.value ? 'text-slate-800' : 'text-slate-500'}`}>
                                            {tipo.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Nome do Atendido */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome do Atendido</label>
                            <input
                                type="text"
                                value={nomeAtendido}
                                onChange={(e) => setNomeAtendido(e.target.value)}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-violet-500 transition font-bold text-slate-700"
                                placeholder="Nome completo..."
                            />
                        </div>

                        {/* Observação */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Breve Observação</label>
                            <textarea
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-violet-500 transition font-medium text-slate-700 h-16 resize-none"
                                placeholder="Demanda, encaminhamento, etc..."
                            />
                        </div>

                        {/* Botão Salvar */}
                        <button
                            type="button"
                            onClick={handleAddRegistro}
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-plus text-lg"></i> Registrar Atendimento
                        </button>

                        {/* Registros do dia */}
                        {registros.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <i className="fa-solid fa-list-check text-violet-500"></i>
                                    Registros de Hoje ({registros.length})
                                </h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {registros.map((reg, idx) => {
                                        const tipoInfo = tiposAtendimento.find(t => t.value === reg.tipo);
                                        return (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className={`w-8 h-8 ${tipoInfo?.color || 'bg-slate-400'} text-white rounded-lg flex items-center justify-center text-xs`}>
                                                    <i className={`fa-solid ${tipoInfo?.icon || 'fa-user'}`}></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-slate-700 truncate">{reg.nome}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{tipoInfo?.label} • {reg.hora}</p>
                                                </div>
                                                <i className="fa-solid fa-check-circle text-emerald-400"></i>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AtendimentoIndividual;
