import React, { useState, useRef, useEffect } from 'react';
import { Beneficiario, UserProfile } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';

interface GruposVinculosProps {
    beneficiarios?: Beneficiario[];
    initialGroupFilter?: string;
    user?: UserProfile | null;
}

const GruposVinculos: React.FC<GruposVinculosProps> = ({ beneficiarios = [], initialGroupFilter, user }) => {
    const isAdmin = user?.role === 'admin' || user?.name?.includes('Genildo');
    const [groupFilter, setGroupFilter] = useState<string>(initialGroupFilter || 'GAP');
    const [attendance, setAttendance] = useState<Record<number, string>>({});
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [observacoes, setObservacoes] = useState<string>('');
    const [selectedUnidade, setSelectedUnidade] = useState<string>(isAdmin ? '' : (user?.unit || ''));
    const [dataAtividade, setDataAtividade] = useState<string>(new Date().toISOString().split('T')[0]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialGroupFilter && ['GAP', 'GPI', 'GFA'].includes(initialGroupFilter)) {
            setGroupFilter(initialGroupFilter);
        }
    }, [initialGroupFilter]);

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

    const toggleAttendance = (id: number) => {
        setAttendance(prev => {
            const current = prev[id] || 'none';
            let next = 'none';
            if (current === 'none') next = 'presente';
            else if (current === 'presente') next = 'falta';
            else if (current === 'falta') next = 'justificada';
            else if (current === 'justificada') next = 'none';

            if (next === 'none') {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            }
            return { ...prev, [id]: next };
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setSelectedImages(prev => [...prev, e.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const filteredBeneficiarios = beneficiarios.filter(b => b.grupo === groupFilter);
    const presentCount = Object.values(attendance).filter(v => v === 'presente').length;

    const getStatusConfig = (s: string) => {
        switch (s) {
            case 'presente': return { color: 'bg-emerald-500 border-emerald-500', text: 'text-emerald-900', bg: 'bg-emerald-50', icon: 'fa-check' };
            case 'justificada': return { color: 'bg-yellow-400 border-yellow-400', text: 'text-yellow-900', bg: 'bg-yellow-50', icon: 'fa-exclamation' };
            case 'falta': return { color: 'bg-red-500 border-red-500', text: 'text-red-900', bg: 'bg-red-50', icon: 'fa-xmark' };
            default: return { color: 'border-slate-200 text-transparent', text: 'text-slate-700', bg: '', icon: 'fa-check' };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const participantes = beneficiarios.filter(b => attendance[b.id] === 'presente');
        const dataToSave = {
            unidade: selectedUnidade || "Unidade Não Selecionada",
            tipo_acao: 'interna',
            atividade_especifica: `grupo_${groupFilter.toLowerCase()}`,
            data_registro: dataAtividade,
            qtd_participantes: participantes.length,
            fotos_urls: selectedImages,
            observacoes
        };
        const result = await RelatorioService.saveAtendimento(dataToSave, participantes);
        if (result.success) {
            alert("Frequência salva com sucesso! ✅");
            setAttendance({});
            setSelectedImages([]);
            setObservacoes('');
        } else {
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    const groupInfo: Record<string, { name: string; color: string; bgLight: string; icon: string; desc: string }> = {
        'GAP': { name: 'GAP - Adolescentes', color: 'bg-purple-500', bgLight: 'bg-purple-50 border-purple-200', icon: 'fa-users', desc: 'Grupo de Adolescente Participativo' },
        'GPI': { name: 'GPI - Pessoa Idosa', color: 'bg-orange-500', bgLight: 'bg-orange-50 border-orange-200', icon: 'fa-heart', desc: 'Grupo de Pessoas Idosas' },
        'GFA': { name: 'GFA - Famílias', color: 'bg-pink-500', bgLight: 'bg-pink-50 border-pink-200', icon: 'fa-house-chimney-user', desc: 'Grupo de Famílias Atípicas' },
    };

    const currentGroup = groupInfo[groupFilter] || groupInfo['GAP'];

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-orange-50/30 min-h-full">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-orange-100">
                    <div className={`${currentGroup.color} p-6 text-white flex justify-between items-center`}>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Grupos de Vínculos</h2>
                            <p className="text-white/80 text-sm font-medium">Frequência e registro de atividades em grupo</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <i className={`fa-solid ${currentGroup.icon} text-3xl`}></i>
                        </div>
                    </div>

                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        {/* Seletores */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade</label>
                                <select
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-orange-500 transition font-bold text-slate-700"
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
                                    value={dataAtividade}
                                    onChange={(e) => setDataAtividade(e.target.value)}
                                    title="Data da Atividade"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-orange-500 transition font-bold text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Grupo</label>
                                <div className="flex gap-2">
                                    {['GAP', 'GPI', 'GFA'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => { setGroupFilter(g); setAttendance({}); }}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${groupFilter === g
                                                ? `${groupInfo[g].color} text-white shadow-lg`
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Nome do grupo */}
                        <div className={`p-4 rounded-2xl border-2 ${currentGroup.bgLight} flex items-center gap-3`}>
                            <i className={`fa-solid ${currentGroup.icon} text-lg`}></i>
                            <div>
                                <p className="font-black text-sm">{currentGroup.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{currentGroup.desc}</p>
                            </div>
                            <span className="ml-auto bg-white px-3 py-1 rounded-full text-xs font-black text-orange-600 shadow-sm">
                                {presentCount} presentes
                            </span>
                        </div>

                        {/* Lista de chamada */}
                        <div className="bg-white rounded-2xl border-2 border-slate-100 max-h-[400px] overflow-y-auto shadow-inner">
                            {filteredBeneficiarios.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {filteredBeneficiarios.map(b => {
                                        const status = attendance[b.id] || 'none';
                                        const config = getStatusConfig(status);
                                        return (
                                            <div key={b.id} onClick={() => toggleAttendance(b.id)} className={`flex items-center justify-between p-4 cursor-pointer transition select-none hover:bg-slate-50 ${config.bg}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${b.avatar_bg} ${b.avatar_text}`}>
                                                        {b.avatar_letter}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-black ${config.text}`}>{b.nome}</p>
                                                        {b.age && <span className="text-[10px] text-slate-400 font-bold">{b.age}</span>}
                                                    </div>
                                                </div>
                                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${config.color} ${status !== 'none' ? 'text-white scale-110 shadow-md' : ''}`}>
                                                    <i className={`fa-solid ${config.icon} text-xs`}></i>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-slate-300 flex flex-col items-center">
                                    <i className="fa-solid fa-users-slash text-4xl mb-3 opacity-20"></i>
                                    <p className="text-sm font-bold">Nenhum participante cadastrado neste grupo.</p>
                                    <p className="text-xs text-slate-400 mt-1">Inscreva participantes na aba "Chamada Digital".</p>
                                </div>
                            )}
                        </div>

                        {/* Fotos */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-camera text-orange-500"></i> Evidência Fotográfica
                            </h3>
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-orange-50/50 hover:border-orange-300 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} title="Anexar foto" />
                                <i className="fa-solid fa-cloud-arrow-up text-2xl text-orange-400 mb-2"></i>
                                <p className="text-xs font-black text-slate-500">Tirar foto ou anexar</p>
                            </div>
                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedImages.map((img, idx) => (
                                        <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-100 aspect-square">
                                            <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(idx)} title="Remover foto" className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]">
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Observações */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Observações</label>
                            <textarea
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-orange-500 transition font-medium text-slate-700 h-20 resize-none"
                                placeholder="Anotações sobre a atividade do dia..."
                            />
                        </div>

                        {/* Salvar */}
                        <button type="submit" className={`w-full ${currentGroup.color} text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-[0.98]`}>
                            <i className="fa-solid fa-check-double text-lg"></i> Salvar Frequência
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default GruposVinculos;
