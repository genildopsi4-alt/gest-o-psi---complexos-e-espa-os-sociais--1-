import React, { useState, useRef } from 'react';
import { Beneficiario } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';

interface DiarioProps {
    beneficiarios?: Beneficiario[];
}

const Diario: React.FC<DiarioProps> = ({ beneficiarios = [] }) => {
    const [tipoAcao, setTipoAcao] = useState<'interna' | 'rede' | 'comunitaria'>('interna');
    const [atividade, setAtividade] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [attendance, setAttendance] = useState<number[]>([]);
    const [groupFilter, setGroupFilter] = useState<string>('todos');
    const [observacoes, setObservacoes] = useState<string>(''); // Added observations state
    const [compazType, setCompazType] = useState<string>(''); // Added Compaz state
    const [actSessao, setActSessao] = useState<number | null>(null); // Added ACT state
    const [qtdParticipantesNum, setQtdParticipantesNum] = useState<number>(0); // Added manual count state

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Find participants objects
        const participantes = beneficiarios.filter(b => attendance.includes(b.id));

        const dataToSave = {
            unidade: "CSMI Cristo Redentor", // TODO: Get from user context
            tipo_acao: tipoAcao,
            atividade_especifica: atividade,
            data_registro: new Date().toISOString().split('T')[0],
            qtd_participantes: participantes.length || qtdParticipantesNum,
            act_sessao: actSessao,
            compaz_metodologia: compazType,
            fotos_urls: selectedImages,
            observacoes: observacoes
        };

        const result = await RelatorioService.saveAtendimento(dataToSave, participantes);

        if (result.success) {
            alert("Atividade salva com sucesso! ✅");
            // Reset form could go here
            setAtividade('');
            setAttendance([]);
            setSelectedImages([]);
            setObservacoes('');
        } else {
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    const unidades = [
        { label: '-- Complexos Sociais --', disabled: true },
        { value: 'joao23', label: 'João XXIII' },
        { value: 'cristo', label: 'Cristo Redentor' },
        { value: 'curio', label: 'Curió' },
        { value: 'barbalha', label: 'Barbalha' },
        { label: '-- Espaços Sociais --', disabled: true },
        { value: 'quintino', label: 'Quintino Cunha' },
        { value: 'barra', label: 'Barra do Ceará' },
        { value: 'dias_macedo', label: 'Dias Macedo' },
    ];

    const handleAtividadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valor = e.target.value;
        setAtividade(valor);
        if (valor === 'gap') setGroupFilter('GAP');
        else if (valor === 'gfa') setGroupFilter('GFA');
        else if (valor === 'gpi') setGroupFilter('GPI');
        else if (valor === 'act') setGroupFilter('ACT');
        else setGroupFilter('todos');
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

    const toggleAttendance = (id: number) => {
        setAttendance(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const filteredBeneficiarios = beneficiarios.filter(b =>
        groupFilter === 'todos' || b.grupo === groupFilter
    );



    // Helper to render custom radio button
    const CustomRadio = ({ checked, colorClass }: { checked: boolean, colorClass: string }) => (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${checked ? `border-${colorClass}` : 'border-slate-300'}`}>
            {checked && <div className={`w-2.5 h-2.5 rounded-full bg-${colorClass}`}></div>}
        </div>
    );

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-orange-50/30 min-h-full">
            <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-orange-100">
                <div className="bg-orange-500 p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Registro de Atividade</h2>
                        <p className="text-orange-100 text-sm font-medium">Foco no Tempo de Brincar e Convivência</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                        <i className="fa-solid fa-puzzle-piece text-3xl"></i>
                    </div>
                </div>
                <form className="p-8 space-y-8" onSubmit={handleSubmit}>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">1. Identificação</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Unidade / Equipamento</label>
                                <select className="w-full border-slate-200 border-2 rounded-xl p-3 focus:ring-orange-500 focus:border-orange-500 outline-none transition font-medium">
                                    {unidades.map((u, i) => (
                                        <option key={i} value={u.value} disabled={u.disabled}>{u.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Data da Atividade</label>
                                <input type="datetime-local" className="w-full border-slate-200 border-2 rounded-xl p-3 outline-none focus:ring-orange-500 focus:border-orange-500 transition font-medium" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-3">Modalidade da Ação</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                {/* Option 1: Interna */}
                                <label className={`border-2 rounded-2xl p-4 flex items-center cursor-pointer transition select-none ${tipoAcao === 'interna' ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                    <input type="radio" name="tipo_acao" value="interna" checked={tipoAcao === 'interna'} onChange={() => { setTipoAcao('interna'); setAtividade(''); setGroupFilter('todos'); }} className="hidden" />
                                    <CustomRadio checked={tipoAcao === 'interna'} colorClass="orange-500" />
                                    <div>
                                        <span className={`block font-black text-sm ${tipoAcao === 'interna' ? 'text-orange-900' : 'text-slate-700'}`}>Atividade do Brincar</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Grupos de Vínculo</span>
                                    </div>
                                </label>

                                {/* Option 2: Rede (Updated Style & Text) */}
                                <label className={`border-2 rounded-2xl p-4 flex items-center cursor-pointer transition select-none ${tipoAcao === 'rede' ? 'bg-teal-50 border-teal-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                    <input type="radio" name="tipo_acao" value="rede" checked={tipoAcao === 'rede'} onChange={() => { setTipoAcao('rede'); setAtividade(''); setGroupFilter('todos'); }} className="hidden" />
                                    <CustomRadio checked={tipoAcao === 'rede'} colorClass="teal-600" />
                                    <div>
                                        <span className={`block font-black text-sm ${tipoAcao === 'rede' ? 'text-teal-900' : 'text-slate-700'}`}>Programas Parceiros</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">COMPAZ / ACT</span>
                                    </div>
                                </label>

                                {/* Option 3: Comunitária */}
                                <label className={`border-2 rounded-2xl p-4 flex items-center cursor-pointer transition select-none ${tipoAcao === 'comunitaria' ? 'bg-purple-50 border-purple-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                    <input type="radio" name="tipo_acao" value="comunitaria" checked={tipoAcao === 'comunitaria'} onChange={() => { setTipoAcao('comunitaria'); setAtividade(''); setGroupFilter('todos'); }} className="hidden" />
                                    <CustomRadio checked={tipoAcao === 'comunitaria'} colorClass="purple-500" />
                                    <div>
                                        <span className={`block font-black text-sm ${tipoAcao === 'comunitaria' ? 'text-purple-900' : 'text-slate-700'}`}>Ações Técnicas</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Atendimentos e Visitas</span>
                                    </div>
                                </label>

                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Atividade Específica</label>
                            <select className="w-full border-slate-200 border-2 rounded-xl p-3 outline-none focus:ring-orange-500 font-bold text-slate-700" value={atividade} onChange={handleAtividadeChange}>
                                <option value="">Selecione...</option>
                                {tipoAcao === 'interna' ? (
                                    <>
                                        <option value="janelas_infancia">Janelas da Infância (TESTE)</option>
                                        <option value="grupo_gap">Grupo GAP (Adolescentes)</option>
                                        <option value="grupo_gfa">Grupo GFA (Famílias Atípicas)</option>
                                        <option value="grupo_gpi">Grupo GPI (Pessoa Idosa)</option>
                                    </>
                                ) : tipoAcao === 'rede' ? (
                                    <>
                                        <option value="act">Encontro ACT - Parentalidade</option>
                                        <option value="compaz">Ação COMPAZ</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="escuta_qualificada">Escuta Qualificada</option>
                                        <option value="visita_domiciliar">Visita Domiciliar</option>
                                        <option value="visita_institucional">Visita Institucional</option>
                                        <option value="palestra">Palestra</option>
                                        <option value="capacitacao">Capacitação</option>
                                        <option value="busca_ativa">Busca Ativa</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* 2. Chamada de Participantes (Lógica Condicional) */}
                    {atividade === 'act' ? (
                        <div className="bg-white rounded-2xl border-2 border-orange-100 p-6 space-y-6 animate-fade-in">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">2. Chamada de Participantes</h3>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-3">Qual Sessão do ACT?</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sessao) => (
                                        <div key={sessao} className="text-center">
                                            <input type="radio" name="act_sessao" id={`sessao_${sessao}`} className="peer hidden" />
                                            <label htmlFor={`sessao_${sessao}`} className="block p-3 rounded-xl border-2 border-slate-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-900 font-bold text-slate-500 cursor-pointer transition hover:bg-slate-50">
                                                {sessao}ª
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Quantidade de Presentes</label>
                                <input type="number" className="w-full border-slate-200 border-2 rounded-xl p-3 outline-none focus:border-orange-500 font-black text-slate-700 text-lg" placeholder="0" />
                            </div>
                        </div>
                    ) : atividade === 'compaz' ? (
                        <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 space-y-6 animate-fade-in">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">2. Chamada de Participantes</h3>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-3">Metodologia Aplicada</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <label className="flex items-center p-3 rounded-xl border-2 border-slate-100 hover:bg-indigo-50 cursor-pointer transition">
                                        <input type="radio" name="compaz_type" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="ml-2 text-xs font-bold text-slate-700">Círculo de Construção de Paz</span>
                                    </label>
                                    <label className="flex items-center p-3 rounded-xl border-2 border-slate-100 hover:bg-indigo-50 cursor-pointer transition">
                                        <input type="radio" name="compaz_type" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="ml-2 text-xs font-bold text-slate-700">Justiça Restaurativa</span>
                                    </label>
                                    <label className="flex items-center p-3 rounded-xl border-2 border-slate-100 hover:bg-indigo-50 cursor-pointer transition">
                                        <input type="radio" name="compaz_type" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="ml-2 text-xs font-bold text-slate-700">Mediação de Conflitos</span>
                                    </label>
                                    <label className="flex items-center p-3 rounded-xl border-2 border-slate-100 hover:bg-indigo-50 cursor-pointer transition">
                                        <input type="radio" name="compaz_type" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="ml-2 text-xs font-bold text-slate-700">CNV (Comunicação Não Violenta)</span>
                                    </label>
                                    <label className="flex items-center p-3 rounded-xl border-2 border-slate-100 hover:bg-indigo-50 cursor-pointer transition col-span-1 md:col-span-2">
                                        <input type="radio" name="compaz_type" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="ml-2 text-xs font-bold text-slate-700">Competências Socioemocionais</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Quantidade de Participantes</label>
                                <input type="number" className="w-full border-slate-200 border-2 rounded-xl p-3 outline-none focus:border-indigo-500 font-black text-slate-700 text-lg" placeholder="0" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    2. Chamada de Participantes
                                    <span className="bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black">
                                        {attendance.length} PRESENTES
                                    </span>
                                </h3>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="bg-white border-2 border-slate-200 text-xs rounded-xl p-2 outline-none focus:border-orange-500 font-black text-slate-600 w-full sm:w-48 shadow-sm">
                                        <option value="todos">Todos os Grupos</option>
                                        <option value="GAP">GAP (Adolescentes)</option>
                                        <option value="GFA">GFA (Famílias)</option>
                                        <option value="GPI">GPI (Idosos)</option>
                                        <option value="ACT">ACT (Parentalidade)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border-2 border-slate-100 max-h-72 overflow-y-auto shadow-inner">
                                {filteredBeneficiarios.length > 0 ? (
                                    <div className="divide-y divide-slate-50">
                                        {filteredBeneficiarios.map(b => {
                                            const isPresent = attendance.includes(b.id);
                                            return (
                                                <div key={b.id} onClick={() => toggleAttendance(b.id)} className={`flex items-center justify-between p-4 cursor-pointer transition select-none hover:bg-orange-50/30 ${isPresent ? 'bg-orange-50' : ''}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${b.avatar_bg} ${b.avatar_text}`}>
                                                            {b.avatar_letter}
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-black ${isPresent ? 'text-orange-900' : 'text-slate-700'}`}>{b.nome}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${b.grupo === 'GAP' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>{b.grupo}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isPresent ? 'bg-orange-500 border-orange-500 text-white scale-110 shadow-md' : 'border-slate-200 text-transparent'}`}><i className="fa-solid fa-check text-xs"></i></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-300 flex flex-col items-center">
                                        <i className="fa-solid fa-users-slash text-4xl mb-3 opacity-20"></i>
                                        <p className="text-sm font-bold">Nenhum participante neste filtro.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex justify-between items-center">
                            3. Evidência Fotográfica
                            <i className="fa-solid fa-camera text-orange-500 text-lg"></i>
                        </h3>

                        <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:bg-orange-50/50 hover:border-orange-200 transition cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                capture="environment"
                                onChange={handleImageChange}
                            />
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 bg-white text-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition duration-500">
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                </div>
                                <p className="font-black text-slate-700">Anexar Fotos da Atividade</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Essencial para o relatório do Mais Infância</p>
                            </div>
                        </div>

                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                {selectedImages.map((img, idx) => (
                                    <div key={idx} className="relative group rounded-3xl overflow-hidden border-2 border-orange-100 shadow-md aspect-square">
                                        <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end pt-6 border-t border-slate-100">
                        <button type="submit" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl flex items-center gap-3 w-full md:w-auto justify-center transition-all hover:-translate-y-1 active:scale-95">
                            <i className="fa-solid fa-cloud-arrow-up text-lg"></i> Salvar Registro & Frequência
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Diario;
