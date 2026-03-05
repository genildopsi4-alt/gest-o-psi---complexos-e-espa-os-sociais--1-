import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';
import { DocumentContainer, SPSHeader, SPSFooter } from './InstrumentaisShared';

interface InstrumentalGestorProps {
    user: UserProfile | null;
}

const UNIDADES = [
    { value: 'CSMI João XXIII', label: 'João XXIII', tipo: 'CSMI' },
    { value: 'CSMI Cristo Redentor', label: 'Cristo Redentor', tipo: 'CSMI' },
    { value: 'CSMI Curió', label: 'Curió', tipo: 'CSMI' },
    { value: 'CSMI Barbalha', label: 'Barbalha', tipo: 'CSMI' },
    { value: 'Espaço Social Quintino Cunha', label: 'Quintino Cunha', tipo: 'Espaço Social' },
    { value: 'Espaço Social Barra do Ceará', label: 'Barra do Ceará', tipo: 'Espaço Social' },
    { value: 'Espaço Social Dias Macedo', label: 'Dias Macedo', tipo: 'Espaço Social' },
];

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIMENSOES_GESTAO = [
    { id: 'planejamento', label: 'Planejamento Estratégico', icon: 'fa-bullseye', color: 'bg-indigo-600' },
    { id: 'producao', label: 'Produção de Serviços', icon: 'fa-chart-line', color: 'bg-emerald-600' },
    { id: 'rh', label: 'Recursos Humanos', icon: 'fa-users', color: 'bg-blue-600' },
    { id: 'infraestrutura', label: 'Infraestrutura', icon: 'fa-building', color: 'bg-orange-500' },
    { id: 'rede', label: 'Articulação de Rede', icon: 'fa-diagram-project', color: 'bg-teal-600' },
    { id: 'resultado', label: 'Impacto e Resultados', icon: 'fa-star', color: 'bg-purple-600' },
];

type Qualidade = 1 | 2 | 3 | 4 | 5;
interface AvaliacaoDimensao {
    nota: Qualidade | null;
    evidencia: string;
    encaminhamento: string;
}

const InstrumentalGestor: React.FC<InstrumentalGestorProps> = ({ user }) => {
    const now = new Date();
    const [mesRef, setMesRef] = useState(now.getMonth());
    const [anoRef, setAnoRef] = useState(now.getFullYear());
    const [unidadeInspecionada, setUnidadeInspecionada] = useState('');
    const [tipoVisita, setTipoVisita] = useState('');
    const [responsavelVisita, setResponsavelVisita] = useState(user?.name || '');
    const [totalAtend, setTotalAtend] = useState(0);
    const [totalColetivas, setTotalColetivas] = useState(0);
    const [totalRede, setTotalRede] = useState(0);
    const [loading, setLoading] = useState(false);
    const [avaliacoes, setAvaliacoes] = useState<Record<string, AvaliacaoDimensao>>(() =>
        Object.fromEntries(DIMENSOES_GESTAO.map(d => [d.id, { nota: null, evidencia: '', encaminhamento: '' }]))
    );

    // Grupos form state
    const [gruposAtivos, setGruposAtivos] = useState('');
    const [totalParticipantesGrupos, setTotalParticipantesGrupos] = useState('');
    const [taxaFrequencia, setTaxaFrequencia] = useState('');
    const [actSessaoAtual, setActSessaoAtual] = useState('');
    const [compazAcoes, setCompazAcoes] = useState('');
    const [atendimentosIndiv, setAtendimentosIndiv] = useState('');

    // Narrative fields
    const [analiseSituacional, setAnaliseSituacional] = useState('');
    const [acoesRealizadas, setAcoesRealizadas] = useState('');
    const [dificuldades, setDificuldades] = useState('');
    const [planejamentoProximoMes, setPlanejamentoProximoMes] = useState('');
    const [necessidadesRH, setNecessidadesRH] = useState('');
    const [articulacoesRede, setArticulacoesRede] = useState('');

    // Calculated score
    const notasValidas = Object.values(avaliacoes).map(a => a.nota).filter((n): n is Qualidade => n !== null) as number[];
    const mediaGeral = notasValidas.length > 0
        ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1)
        : '—';
    const scoreColor = parseFloat(mediaGeral) >= 4 ? 'text-emerald-600' : parseFloat(mediaGeral) >= 3 ? 'text-amber-500' : 'text-red-500';

    const loadReportData = async () => {
        setLoading(true);
        try {
            const firstDay = new Date(anoRef, mesRef, 1).toISOString().split('T')[0];
            const lastDay = new Date(anoRef, mesRef + 1, 0).toISOString().split('T')[0];
            const data = await RelatorioService.getRelatorioData(firstDay, lastDay, unidadeInspecionada || undefined);
            setTotalAtend(data.length);
            setTotalColetivas(data.filter((i: any) => ['interna', 'comunitaria'].includes(i.tipo_acao)).length);
            setTotalRede(data.filter((i: any) => i.tipo_acao === 'rede').length);
        } catch {
            // ignora
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReportData();
    }, [mesRef, anoRef, unidadeInspecionada]);

    const setNota = (dimId: string, nota: Qualidade) => {
        setAvaliacoes(prev => ({ ...prev, [dimId]: { ...prev[dimId], nota } }));
    };
    const setEvidencia = (dimId: string, v: string) => {
        setAvaliacoes(prev => ({ ...prev, [dimId]: { ...prev[dimId], evidencia: v } }));
    };
    const setEncaminhamento = (dimId: string, v: string) => {
        setAvaliacoes(prev => ({ ...prev, [dimId]: { ...prev[dimId], encaminhamento: v } }));
    };

    const notaLabel: Record<number, string> = { 1: 'Crítico', 2: 'Insuficiente', 3: 'Regular', 4: 'Bom', 5: 'Excelente' };
    const notaColor: Record<number, string> = {
        1: 'bg-red-500 text-white border-red-500',
        2: 'bg-orange-400 text-white border-orange-400',
        3: 'bg-amber-400 text-black border-amber-400',
        4: 'bg-emerald-500 text-white border-emerald-500',
        5: 'bg-indigo-600 text-white border-indigo-600',
    };

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-gradient-to-b from-slate-100 to-white min-h-full">
            {/* ── HEADER GESTOR ── */}
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D5F8A] rounded-[2rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFA6]/10 rounded-full blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <span className="inline-block bg-[#00BFA6] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 shadow-lg">
                            <i className="fa-solid fa-clipboard-check mr-2"></i>Instrumental do Gestor
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            Ficha de Supervisão e Gestão
                        </h1>
                        <p className="text-white/70 text-sm mt-2 font-medium">
                            Célula de Gestão dos Complexos e Espaços Sociais • SPS / Mais Infância Ceará
                        </p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 min-w-[160px]">
                        <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Pontuação Geral</p>
                        <p className={`text-5xl font-black ${parseFloat(mediaGeral) >= 4 ? 'text-[#00BFA6]' : parseFloat(mediaGeral) >= 3 ? 'text-amber-400' : 'text-red-400'}`}>
                            {mediaGeral}
                        </p>
                        <p className="text-[10px] text-white/50 font-bold mt-1">de 5,0</p>
                    </div>
                </div>
            </div>

            {/* ── CONTROLES DO PERÍODO ── */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-lg border border-slate-100 mb-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-indigo-500"></i> Parâmetros da Supervisão
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Mês de Referência</label>
                        <select
                            value={mesRef}
                            onChange={e => setMesRef(parseInt(e.target.value))}
                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition"
                            title="Mês de referência"
                        >
                            {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Ano</label>
                        <input
                            type="number"
                            value={anoRef}
                            onChange={e => setAnoRef(parseInt(e.target.value))}
                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition"
                            title="Ano de referência"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade Inspecionada</label>
                        <select
                            value={unidadeInspecionada}
                            onChange={e => setUnidadeInspecionada(e.target.value)}
                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition"
                            title="Unidade inspecionada"
                        >
                            <option value="">Todas as Unidades</option>
                            {UNIDADES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tipo de Visita</label>
                        <select
                            value={tipoVisita}
                            onChange={e => setTipoVisita(e.target.value)}
                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition"
                            title="Tipo de visita"
                        >
                            <option value="">-- Selecione --</option>
                            <option>Supervisão de Campo</option>
                            <option>Reunião de Colegiado</option>
                            <option>Reunião Técnica de Referência</option>
                            <option>Monitoramento Documental</option>
                            <option>Visita Institucional</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Gestor Responsável</label>
                        <input
                            value={responsavelVisita}
                            onChange={e => setResponsavelVisita(e.target.value)}
                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition"
                            placeholder="Nome do gestor"
                            title="Gestor responsável"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Data da Supervisão</label>
                        <input
                            type="date"
                            defaultValue={now.toISOString().split('T')[0]}
                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition"
                            title="Data"
                        />
                    </div>
                </div>
            </div>

            {/* ── KPIs AUTOMÁTICOS ── */}
            <div className="mb-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-chart-line text-emerald-500"></i> KPIs do Período {loading && <span className="text-[9px] text-indigo-400 animate-pulse">(Carregando...)</span>}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Atendimentos Registrados', value: totalAtend, icon: 'fa-user-clock', color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50', text: 'text-indigo-700' },
                        { label: 'Ações Coletivas', value: totalColetivas, icon: 'fa-people-group', color: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                        { label: 'Articulação de Rede', value: totalRede, icon: 'fa-diagram-project', color: 'from-teal-500 to-teal-700', bg: 'bg-teal-50', text: 'text-teal-700' },
                        { label: 'Índice de Cobertura', value: totalAtend > 0 ? `${Math.min(100, Math.round(totalAtend / 30 * 100))}%` : '—', icon: 'fa-circle-check', color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', text: 'text-purple-700' },
                    ].map((kpi, i) => (
                        <div key={i} className={`${kpi.bg} rounded-[1.5rem] p-5 border border-white shadow-sm hover:shadow-md transition`}>
                            <div className={`w-10 h-10 bg-gradient-to-br ${kpi.color} text-white rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                                <i className={`fa-solid ${kpi.icon} text-sm`}></i>
                            </div>
                            <p className={`text-2xl md:text-3xl font-black ${kpi.text}`}>{kpi.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide leading-tight mt-1">{kpi.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PRODUÇÃO POR PILAR ── */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-lg border border-slate-100 mb-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group text-[#3AADD9]"></i> Produção por Pilar — {MESES[mesRef]}/{anoRef}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Grupos de Vínculo */}
                    <div className="border-2 border-[#3AADD9]/20 rounded-2xl p-4 bg-[#E8F4FD]/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#3AADD9] to-[#5BC0E8] text-white rounded-xl flex items-center justify-center">
                                <i className="fa-solid fa-users text-sm"></i>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-700 uppercase">Grupos de Vínculo</p>
                                <p className="text-[9px] text-slate-400 font-bold">GAP • GPI • GFA</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Grupos Ativos</label>
                                <input value={gruposAtivos} onChange={e => setGruposAtivos(e.target.value)}
                                    type="number" min="0" placeholder="0"
                                    className="w-full border-2 border-[#3AADD9]/20 rounded-xl p-2.5 outline-none focus:border-[#3AADD9] font-black text-slate-700 text-lg transition"
                                    title="Grupos ativos" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Total de Participantes</label>
                                <input value={totalParticipantesGrupos} onChange={e => setTotalParticipantesGrupos(e.target.value)}
                                    type="number" min="0" placeholder="0"
                                    className="w-full border-2 border-[#3AADD9]/20 rounded-xl p-2.5 outline-none focus:border-[#3AADD9] font-bold text-slate-700 transition"
                                    title="Total de participantes" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Taxa de Frequência (%)</label>
                                <input value={taxaFrequencia} onChange={e => setTaxaFrequencia(e.target.value)}
                                    type="number" min="0" max="100" placeholder="0"
                                    className="w-full border-2 border-[#3AADD9]/20 rounded-xl p-2.5 outline-none focus:border-[#3AADD9] font-bold text-slate-700 transition"
                                    title="Taxa de frequência" />
                            </div>
                        </div>
                    </div>

                    {/* ACT */}
                    <div className="border-2 border-[#EDA59E]/20 rounded-2xl p-4 bg-[#FFF0EE]/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#EDA59E] to-[#D4776E] text-white rounded-xl flex items-center justify-center">
                                <i className="fa-solid fa-hands-holding-child text-sm"></i>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-700 uppercase">ACT — Parentalidade</p>
                                <p className="text-[9px] text-slate-400 font-bold">8 Sessões • APA</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Sessão Atual do Ciclo</label>
                                <select value={actSessaoAtual} onChange={e => setActSessaoAtual(e.target.value)}
                                    className="w-full border-2 border-[#EDA59E]/20 rounded-xl p-2.5 outline-none focus:border-[#EDA59E] font-bold text-slate-700 transition"
                                    title="Sessão atual">
                                    <option value="">-- Selecione --</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sessão {s}ª</option>)}
                                    <option value="concluido">Ciclo Concluído ✅</option>
                                    <option value="nao_iniciado">Não Iniciado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Nº de Famílias Participantes</label>
                                <input type="number" min="0" placeholder="0"
                                    className="w-full border-2 border-[#EDA59E]/20 rounded-xl p-2.5 outline-none focus:border-[#EDA59E] font-bold text-slate-700 transition"
                                    title="Nº de famílias" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Observação da Sessão</label>
                                <textarea rows={2} placeholder="Tema trabalhado, dinâmica..."
                                    className="w-full border-2 border-[#EDA59E]/20 rounded-xl p-2.5 outline-none focus:border-[#EDA59E] font-medium text-slate-700 text-xs resize-none transition"
                                    title="Observação" />
                            </div>
                        </div>
                    </div>

                    {/* COMPAZ + Atendimento Individual */}
                    <div className="space-y-4">
                        <div className="border-2 border-[#4D9B8A]/20 rounded-2xl p-4 bg-[#EAF5F2]/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#4D9B8A] to-[#6DB5A5] text-white rounded-xl flex items-center justify-center">
                                    <i className="fa-solid fa-peace text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700 uppercase">COMPAZ</p>
                                    <p className="text-[9px] text-slate-400 font-bold">Cultura de Paz</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Ações COMPAZ no Mês</label>
                                <input value={compazAcoes} onChange={e => setCompazAcoes(e.target.value)}
                                    type="number" min="0" placeholder="0"
                                    className="w-full border-2 border-[#4D9B8A]/20 rounded-xl p-2.5 outline-none focus:border-[#4D9B8A] font-black text-slate-700 text-lg transition"
                                    title="Ações COMPAZ" />
                            </div>
                        </div>

                        <div className="border-2 border-[#7B5EA7]/20 rounded-2xl p-4 bg-[#F3EFF8]/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#7B5EA7] to-[#9B7EC6] text-white rounded-xl flex items-center justify-center">
                                    <i className="fa-solid fa-user-pen text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700 uppercase">Atendimento Individual</p>
                                    <p className="text-[9px] text-slate-400 font-bold">Escutas • Triagens • Visitas</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Total de Atendimentos Indiv.</label>
                                <input value={atendimentosIndiv} onChange={e => setAtendimentosIndiv(e.target.value)}
                                    type="number" min="0" placeholder="0"
                                    className="w-full border-2 border-[#7B5EA7]/20 rounded-xl p-2.5 outline-none focus:border-[#7B5EA7] font-black text-slate-700 text-lg transition"
                                    title="Atendimentos individuais" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── AVALIAÇÃO POR DIMENSÃO ── */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-lg border border-slate-100 mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-star text-amber-400"></i> Avaliação por Dimensão de Gestão
                    </h2>
                    {notasValidas.length > 0 && (
                        <div className="text-right">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Média Atual</p>
                            <p className={`text-2xl font-black ${scoreColor}`}>{mediaGeral}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {DIMENSOES_GESTAO.map(dim => {
                        const aval = avaliacoes[dim.id];
                        return (
                            <div key={dim.id} className="border-2 border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 ${dim.color} text-white rounded-xl flex items-center justify-center`}>
                                        <i className={`fa-solid ${dim.icon} text-sm`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-700">{dim.label}</p>
                                    </div>
                                    {aval.nota && (
                                        <span className={`text-xs font-black px-3 py-1 rounded-full ${notaColor[aval.nota]}`}>
                                            {notaLabel[aval.nota]}
                                        </span>
                                    )}
                                </div>

                                {/* Escala 1-5 */}
                                <div className="flex gap-2 mb-4">
                                    {([1, 2, 3, 4, 5] as Qualidade[]).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setNota(dim.id, n)}
                                            title={notaLabel[n]}
                                            className={`flex-1 py-2.5 rounded-xl border-2 font-black text-sm transition-all ${aval.nota === n
                                                ? notaColor[n]
                                                : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Evidências Observadas</label>
                                        <textarea
                                            rows={2}
                                            value={aval.evidencia}
                                            onChange={e => setEvidencia(dim.id, e.target.value)}
                                            className="w-full border-2 border-slate-100 rounded-xl p-2.5 outline-none focus:border-indigo-400 font-medium text-slate-700 text-xs resize-none transition"
                                            placeholder="Descreva o que foi observado..."
                                            title="Evidências"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Encaminhamento</label>
                                        <textarea
                                            rows={2}
                                            value={aval.encaminhamento}
                                            onChange={e => setEncaminhamento(dim.id, e.target.value)}
                                            className="w-full border-2 border-slate-100 rounded-xl p-2.5 outline-none focus:border-indigo-400 font-medium text-slate-700 text-xs resize-none transition"
                                            placeholder="Ação a ser tomada..."
                                            title="Encaminhamento"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── ANÁLISE NARRATIVA ── */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-lg border border-slate-100 mb-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <i className="fa-solid fa-pen-nib text-purple-500"></i> Análise Narrativa e Estratégica
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                        { label: 'Análise Situacional da Unidade', state: analiseSituacional, setter: setAnaliseSituacional, placeholder: 'Contexto atual: demandas, público, território...', icon: 'fa-magnifying-glass-chart', color: 'indigo' },
                        { label: 'Ações Realizadas no Período', state: acoesRealizadas, setter: setAcoesRealizadas, placeholder: 'Principais atividades desenvolvidas...', icon: 'fa-check-double', color: 'emerald' },
                        { label: 'Dificuldades e Desafios', state: dificuldades, setter: setDificuldades, placeholder: 'Barreiras identificadas: RH, infraestrutura, rede...', icon: 'fa-triangle-exclamation', color: 'amber' },
                        { label: 'Planejamento para o Próximo Mês', state: planejamentoProximoMes, setter: setPlanejamentoProximoMes, placeholder: 'Ações previstas, metas, prioridades...', icon: 'fa-calendar-days', color: 'blue' },
                        { label: 'Necessidades de RH e Capacitação', state: necessidadesRH, setter: setNecessidadesRH, placeholder: 'Demandas de pessoal, formação, supervisão...', icon: 'fa-users-gear', color: 'purple' },
                        { label: 'Articulações de Rede Realizadas', state: articulacoesRede, setter: setArticulacoesRede, placeholder: 'CRAS, CAPS, CREAS, escolas, UBS, Jurídico...', icon: 'fa-diagram-project', color: 'teal' },
                    ].map((field, i) => (
                        <div key={i}>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2">
                                <i className={`fa-solid ${field.icon} text-${field.color}-500`}></i> {field.label}
                            </label>
                            <textarea
                                rows={4}
                                value={field.state}
                                onChange={e => field.setter(e.target.value)}
                                className={`w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-${field.color}-400 font-medium text-slate-700 text-sm resize-none transition`}
                                placeholder={field.placeholder}
                                title={field.label}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── ARTICULAÇÃO DE REDE DETALHADA ── */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-lg border border-slate-100 mb-8">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <i className="fa-solid fa-diagram-project text-teal-500"></i> Mapeamento da Rede de Proteção
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'CRAS', icon: 'fa-house-chimney-user', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'CAPS', icon: 'fa-brain', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                        { label: 'CREAS', icon: 'fa-shield-halved', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                        { label: 'Unidade de Saúde (UBS)', icon: 'fa-hospital', color: 'bg-red-50 border-red-200 text-red-700' },
                        { label: 'Escola / SEDUC', icon: 'fa-school', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                        { label: 'Conselho Tutelar', icon: 'fa-child-reaching', color: 'bg-pink-50 border-pink-200 text-pink-700' },
                        { label: 'Jurídico / Defensoria', icon: 'fa-gavel', color: 'bg-slate-50 border-slate-200 text-slate-700' },
                        { label: 'Outro Parceiro', icon: 'fa-handshake', color: 'bg-teal-50 border-teal-200 text-teal-700' },
                    ].map((rede, i) => (
                        <div key={i} className={`border-2 rounded-xl p-4 ${rede.color}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <i className={`fa-solid ${rede.icon} text-sm`}></i>
                                <p className="text-[10px] font-black uppercase">{rede.label}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id={`rede-${i}`} className="w-4 h-4 accent-teal-600" title={`Articulado: ${rede.label}`} />
                                    <label htmlFor={`rede-${i}`} className="text-[10px] font-bold text-slate-600">Articulado</label>
                                </div>
                                <input
                                    type="number" min="0" max="99" placeholder="0"
                                    className="w-full border border-current/20 rounded-lg p-1.5 outline-none text-xs font-bold bg-white/80 text-slate-700 transition"
                                    title={`Encaminhamentos para ${rede.label}`}
                                />
                                <p className="text-[8px] font-black opacity-60 uppercase">encaminhamentos</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── ASSINATURAS E IMPRESSÃO ── */}
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2D5F8A] rounded-[1.5rem] p-6 text-white mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Documento Oficial</p>
                        <p className="font-black text-lg">Ficha de Supervisão de Gestão — {MESES[mesRef]}/{anoRef}</p>
                        <p className="text-white/70 text-xs mt-1">
                            {unidadeInspecionada || 'Todas as Unidades'} • {tipoVisita || 'Supervisão'} • Responsável: {responsavelVisita}
                        </p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="bg-[#00BFA6] hover:bg-[#00A896] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <i className="fa-solid fa-print text-xl"></i>
                        Imprimir / Salvar PDF
                    </button>
                </div>
            </div>

            {/* ── VERSÃO IMPRESSA ── */}
            <div className="hidden print:block">
                <DocumentContainer>
                    <SPSHeader />
                    <div className="border-2 border-black mb-4">
                        <div className="bg-slate-800 text-white p-3 text-center">
                            <p className="font-black text-base uppercase">Ficha de Supervisão e Gestão — Instrumental do Gestor</p>
                            <p className="text-xs font-bold text-white/70">Célula de Gestão dos Complexos e Espaços Sociais • SPS / Mais Infância Ceará</p>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-black border-b border-black text-xs">
                            <div className="p-2 flex gap-2"><strong>Período:</strong> {MESES[mesRef]}/{anoRef}</div>
                            <div className="p-2 flex gap-2"><strong>Unidade:</strong> {unidadeInspecionada || 'Todas'}</div>
                            <div className="p-2 flex gap-2"><strong>Tipo:</strong> {tipoVisita}</div>
                        </div>
                        <div className="p-2 text-xs flex gap-2 border-b border-black"><strong>Gestor:</strong> {responsavelVisita}</div>
                    </div>

                    {/* KPIs */}
                    <div className="border-2 border-black mb-4 text-xs">
                        <div className="bg-slate-100 p-1 text-center font-black uppercase border-b border-black">Indicadores do Período</div>
                        <div className="grid grid-cols-4 divide-x divide-black">
                            <div className="p-2 text-center"><p className="font-black text-2xl">{totalAtend}</p><p className="text-[9px] uppercase font-bold text-slate-500">Atendimentos</p></div>
                            <div className="p-2 text-center"><p className="font-black text-2xl">{totalColetivas}</p><p className="text-[9px] uppercase font-bold text-slate-500">Ações Coletivas</p></div>
                            <div className="p-2 text-center"><p className="font-black text-2xl">{totalRede}</p><p className="text-[9px] uppercase font-bold text-slate-500">Articulação Rede</p></div>
                            <div className="p-2 text-center"><p className="font-black text-2xl">{mediaGeral}</p><p className="text-[9px] uppercase font-bold text-slate-500">Nota Gestão</p></div>
                        </div>
                    </div>

                    {/* Avaliação por dimensão */}
                    <div className="border-2 border-black mb-4 text-xs">
                        <div className="bg-slate-100 p-1 text-center font-black uppercase border-b border-black">Avaliação por Dimensão de Gestão</div>
                        {DIMENSOES_GESTAO.map(dim => {
                            const aval = avaliacoes[dim.id];
                            return (
                                <div key={dim.id} className="border-b border-black">
                                    <div className="flex">
                                        <div className="bg-slate-50 p-2 font-black w-40 border-r border-black flex items-center">{dim.label}</div>
                                        <div className="p-2 w-16 border-r border-black text-center font-black text-lg">{aval.nota || '—'}/5</div>
                                        <div className="p-2 flex-1 border-r border-black text-[10px]"><strong>Evidência:</strong> {aval.evidencia || '—'}</div>
                                        <div className="p-2 flex-1 text-[10px]"><strong>Encaminhamento:</strong> {aval.encaminhamento || '—'}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Análise narrativa */}
                    {analiseSituacional && (
                        <div className="border-2 border-black mb-4 text-xs">
                            <div className="bg-slate-100 p-1 text-center font-black uppercase border-b border-black">Análise Situacional</div>
                            <div className="p-3 text-justify leading-relaxed">{analiseSituacional}</div>
                        </div>
                    )}
                    {acoesRealizadas && (
                        <div className="border-2 border-black mb-4 text-xs">
                            <div className="bg-slate-100 p-1 text-center font-black uppercase border-b border-black">Ações Realizadas</div>
                            <div className="p-3 text-justify leading-relaxed">{acoesRealizadas}</div>
                        </div>
                    )}
                    {dificuldades && (
                        <div className="border-2 border-black mb-4 text-xs">
                            <div className="bg-slate-100 p-1 text-center font-black uppercase border-b border-black">Dificuldades e Desafios</div>
                            <div className="p-3 text-justify leading-relaxed">{dificuldades}</div>
                        </div>
                    )}
                    {planejamentoProximoMes && (
                        <div className="border-2 border-black mb-4 text-xs">
                            <div className="bg-slate-100 p-1 text-center font-black uppercase border-b border-black">Planejamento — Próximo Mês</div>
                            <div className="p-3 text-justify leading-relaxed">{planejamentoProximoMes}</div>
                        </div>
                    )}

                    {/* Assinaturas */}
                    <div className="grid grid-cols-2 gap-16 mt-12 mb-4 items-end">
                        <div className="text-center text-xs">
                            <div className="h-10"></div>
                            <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                            <p className="font-black uppercase">{responsavelVisita || 'GESTOR RESPONSÁVEL'}</p>
                            <p>{user?.role} {user?.crp ? `• CRP ${user.crp}` : ''}</p>
                        </div>
                        <div className="text-center text-xs">
                            <div className="h-10"></div>
                            <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                            <p className="font-black uppercase">COORDENAÇÃO / REFERÊNCIA TÉCNICA</p>
                            <p>SPS — Secretaria de Proteção Social</p>
                        </div>
                    </div>

                    <SPSFooter unit={{ name: unidadeInspecionada || 'Célula de Gestão', address: 'Fortaleza - CE', email: 'gestaopsi@sps.ce.gov.br' }} />
                </DocumentContainer>
            </div>
        </section>
    );
};

export default InstrumentalGestor;
