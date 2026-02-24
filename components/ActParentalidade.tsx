import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';

interface ActParentalidadeProps {
    user?: UserProfile | null;
}

const ActParentalidade: React.FC<ActParentalidadeProps> = ({ user }) => {
    const isAdmin = user?.role === 'admin' || user?.name?.includes('Genildo');
    const [selectedUnidade, setSelectedUnidade] = useState<string>(isAdmin ? '' : (user?.unit || ''));
    const [dataAtividade, setDataAtividade] = useState<string>(new Date().toISOString().split('T')[0]);
    const [actSessao, setActSessao] = useState<number | null>(null);
    const [qtdParticipantes, setQtdParticipantes] = useState<number>(0);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [observacoes, setObservacoes] = useState<string>('');
    const [temaAbordado, setTemaAbordado] = useState<string>('');
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

    const sessaoTemas: Record<number, string> = {
        1: 'Conhecendo o Programa ACT',
        2: 'Compreendendo o Comportamento Infantil',
        3: 'Compreendendo o Comportamento dos Pais',
        4: 'O Impacto da Violência',
        5: 'Disciplina Positiva e Limites',
        6: 'Controlando a Raiva',
        7: 'Resolvendo Conflitos',
        8: 'Encerramento e Compromissos',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            unidade: selectedUnidade || "Unidade Não Selecionada",
            tipo_acao: 'rede',
            atividade_especifica: 'act',
            data_registro: dataAtividade,
            qtd_participantes: qtdParticipantes,
            act_sessao: actSessao,
            fotos_urls: selectedImages,
            observacoes: `Sessão ${actSessao}: ${temaAbordado}. ${observacoes}`
        };
        const result = await RelatorioService.saveAtendimento(dataToSave, []);
        if (result.success) {
            alert("Encontro ACT salvo com sucesso! ✅");
            setActSessao(null);
            setQtdParticipantes(0);
            setSelectedImages([]);
            setObservacoes('');
            setTemaAbordado('');
        } else {
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-[#FFF0EE]/30 min-h-full">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* ── HERO VISUAL ACT ── */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-[#EDA59E]/30">
                    {/* Banner Principal */}
                    <div className="relative">
                        <img src="act-banner.png" alt="Programa ACT - Para Educar Crianças em Ambientes Seguros" className="w-full h-auto object-cover" />
                    </div>

                    {/* Crescer com Afeto */}
                    <div className="bg-gradient-to-r from-[#FFF0EE] to-[#FDE8C8]/50 border-y border-[#EDA59E]/20">
                        <img src="act-crescer-afeto.jpg" alt="Crescer com Afeto, Sem Violência" className="w-full h-auto object-cover" />
                    </div>

                    {/* Infográfico + Stats */}
                    <div className="p-6 space-y-4 bg-white">
                        <div className="flex justify-center">
                            <img src="act-infografico.png" alt="ACT Ceará - Infográfico" className="max-h-[400px] object-contain rounded-xl" />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-[#FFF0EE] rounded-xl p-3 text-center border border-[#EDA59E]/20">
                                <p className="text-xl font-black text-[#D4776E]">8</p>
                                <p className="text-[9px] font-black text-[#EDA59E] uppercase tracking-wider">Sessões</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                                <p className="text-xl font-black text-amber-600">24</p>
                                <p className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Municípios</p>
                            </div>
                            <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-100">
                                <p className="text-xl font-black text-rose-600">1.164</p>
                                <p className="text-[9px] font-black text-rose-400 uppercase tracking-wider">Famílias</p>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
                                <p className="text-xl font-black text-indigo-600">190</p>
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-wider">Facilitadores</p>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <i className="fa-solid fa-shield-halved mr-1 text-[#EDA59E]"></i>
                            Programa validado pela APA — American Psychological Association
                        </p>
                    </div>
                </div>

                {/* ── FORMULÁRIO DE REGISTRO ── */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-[#EDA59E]/30">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#EDA59E] to-[#D4776E] p-6 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">ACT - Parentalidade</h2>
                            <p className="text-white/80 text-sm font-medium">Adultos e Crianças Juntos com Carinho</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <i className="fa-solid fa-hands-holding-child text-3xl"></i>
                        </div>
                    </div>

                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        {/* Unidade e Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade</label>
                                <select
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-[#EDA59E] transition font-bold text-slate-700"
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
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Data do Encontro</label>
                                <input
                                    type="date"
                                    value={dataAtividade}
                                    onChange={(e) => setDataAtividade(e.target.value)}
                                    title="Data do Encontro"
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-[#EDA59E] transition font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Sessão ACT */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Qual Sessão?</label>
                            <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sessao) => (
                                    <button
                                        key={sessao}
                                        type="button"
                                        onClick={() => { setActSessao(sessao); setTemaAbordado(sessaoTemas[sessao]); }}
                                        className={`p-3 rounded-xl border-2 font-black text-center transition-all ${actSessao === sessao
                                            ? 'border-[#EDA59E] bg-[#FFF0EE] text-[#D4776E] shadow-md scale-105'
                                            : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {sessao}ª
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tema (automático) */}
                        {actSessao && (
                            <div className="bg-[#FFF0EE] border-2 border-[#EDA59E]/30 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
                                <div className="w-10 h-10 bg-[#EDA59E] text-white rounded-xl flex items-center justify-center font-black">
                                    {actSessao}ª
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#D4776E] uppercase">Tema da Sessão</p>
                                    <p className="text-sm font-bold text-slate-700">{sessaoTemas[actSessao]}</p>
                                </div>
                            </div>
                        )}

                        {/* Quantidade de Participantes */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Quantidade de Participantes</label>
                            <input
                                type="number"
                                min="0"
                                value={qtdParticipantes || ''}
                                onChange={(e) => setQtdParticipantes(parseInt(e.target.value) || 0)}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-[#EDA59E] font-black text-slate-700 text-lg"
                                placeholder="0"
                            />
                        </div>

                        {/* Fotos */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-camera text-[#EDA59E]"></i> Evidência Fotográfica
                            </h3>
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-[#FFF0EE]/50 hover:border-[#EDA59E] transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} title="Anexar foto" />
                                <i className="fa-solid fa-cloud-arrow-up text-2xl text-[#EDA59E] mb-2"></i>
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
                                className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-[#EDA59E] transition font-medium text-slate-700 h-20 resize-none"
                                placeholder="Como foi o encontro de hoje..."
                            />
                        </div>

                        {/* Salvar */}
                        <button type="submit" className="w-full bg-gradient-to-r from-[#EDA59E] to-[#D4776E] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                            <i className="fa-solid fa-check-double text-lg"></i> Salvar Encontro ACT
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ActParentalidade;
