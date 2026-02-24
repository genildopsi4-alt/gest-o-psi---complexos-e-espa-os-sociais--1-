import React, { useState, useRef } from 'react';
import { RelatorioService } from '../src/services/RelatorioService';

const Compaz: React.FC = () => {
    const [selectedUnidade, setSelectedUnidade] = useState<string>('');
    const [dataAtividade, setDataAtividade] = useState<string>(new Date().toISOString().split('T')[0]);
    const [metodologia, setMetodologia] = useState<string>('');
    const [qtdParticipantes, setQtdParticipantes] = useState<number>(0);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [observacoes, setObservacoes] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const metodologias = [
        { value: 'circulo_paz', label: 'Círculo de Construção de Paz', icon: 'fa-circle-nodes', color: 'text-indigo-600' },
        { value: 'justica_restaurativa', label: 'Justiça Restaurativa', icon: 'fa-scale-balanced', color: 'text-blue-600' },
        { value: 'mediacao', label: 'Mediação de Conflitos', icon: 'fa-handshake', color: 'text-emerald-600' },
        { value: 'cnv', label: 'CNV (Comunicação Não-Violenta)', icon: 'fa-comments', color: 'text-purple-600' },
        { value: 'socioemocional', label: 'Competências Socioemocionais', icon: 'fa-brain', color: 'text-pink-600' },
    ];

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            unidade: selectedUnidade || "Unidade Não Selecionada",
            tipo_acao: 'rede',
            atividade_especifica: 'compaz',
            data_registro: dataAtividade,
            qtd_participantes: qtdParticipantes,
            compaz_metodologia: metodologia,
            fotos_urls: selectedImages,
            observacoes
        };
        const result = await RelatorioService.saveAtendimento(dataToSave, []);
        if (result.success) {
            alert("Ação COMPAZ salva com sucesso! ✅");
            setMetodologia('');
            setQtdParticipantes(0);
            setSelectedImages([]);
            setObservacoes('');
        } else {
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-indigo-50/30 min-h-full">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-indigo-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">COMPAZ</h2>
                            <p className="text-indigo-100 text-sm font-medium">Cultura de Paz e Resolução de Conflitos</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <i className="fa-solid fa-peace text-3xl"></i>
                        </div>
                    </div>

                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        {/* Unidade e Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade</label>
                                <select
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 transition font-bold text-slate-700"
                                    value={selectedUnidade}
                                    onChange={(e) => setSelectedUnidade(e.target.value)}
                                >
                                    {unidades.map((u, i) => (
                                        <option key={i} value={u.value} disabled={u.disabled}>{u.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Data da Ação</label>
                                <input
                                    type="date"
                                    value={dataAtividade}
                                    onChange={(e) => setDataAtividade(e.target.value)}
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 transition font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Metodologia */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Metodologia Aplicada</label>
                            <div className="grid grid-cols-1 gap-3">
                                {metodologias.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => setMetodologia(m.value)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${metodologia === m.value
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${m.color}`}>
                                            <i className={`fa-solid ${m.icon}`}></i>
                                        </div>
                                        <span className={`text-sm font-bold ${metodologia === m.value ? 'text-indigo-900' : 'text-slate-600'}`}>
                                            {m.label}
                                        </span>
                                        {metodologia === m.value && (
                                            <i className="fa-solid fa-check-circle text-indigo-500 ml-auto"></i>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantidade */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Quantidade de Participantes</label>
                            <input
                                type="number"
                                min="0"
                                value={qtdParticipantes || ''}
                                onChange={(e) => setQtdParticipantes(parseInt(e.target.value) || 0)}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-black text-slate-700 text-lg"
                                placeholder="0"
                            />
                        </div>

                        {/* Fotos */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-camera text-indigo-500"></i> Evidência Fotográfica
                            </h3>
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-indigo-50/50 hover:border-indigo-300 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageChange} />
                                <i className="fa-solid fa-cloud-arrow-up text-2xl text-indigo-400 mb-2"></i>
                                <p className="text-xs font-black text-slate-500">Tirar foto ou anexar</p>
                            </div>
                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedImages.map((img, idx) => (
                                        <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-100 aspect-square">
                                            <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]">
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
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 transition font-medium text-slate-700 h-20 resize-none"
                                placeholder="Detalhes sobre a ação realizada..."
                            />
                        </div>

                        {/* Salvar */}
                        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                            <i className="fa-solid fa-check-double text-lg"></i> Salvar Ação COMPAZ
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Compaz;
