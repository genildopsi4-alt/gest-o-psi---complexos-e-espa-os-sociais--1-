import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import GoogleAuthButton from './GoogleAuthButton';
import { UserProfile, Unidade, Atendimento } from '../types';
import { getUnidades, getAtendimentos } from '../src/services/mockData';
import { generateRelatorioMensal } from '../src/services/PDFGenerator';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardProps {
  user: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [parecerGestao, setParecerGestao] = useState(''); // State for Manager's Review

  const isAdmin = user?.role === 'admin' || user?.name === 'Genildo Barbosa'; // Fallback for dev
  const [viewMode, setViewMode] = useState<'charts' | 'list'>('charts');
  const [selectedReport, setSelectedReport] = useState<any | null>(null); // For Modal
  const [selectedUnit, setSelectedUnit] = useState<string>('Todas');

  // Mock data for missing variables
  const units = ['Todas', 'CSMI João XXIII', 'CSMI Cristo Redentor', 'CSMI Curió', 'CSMI Barbalha'];
  const recentGenerations = [
    { id: 1, title: 'Relatório de Frequência - Abril/2026', time: 'há 10 min' },
    { id: 2, title: 'Planejamento Mensal - Julho/2026', time: 'há 30 min' }
  ];

  const handleGeneratePDF = () => {
    const fullReportData = {
      unidade: user?.unit || 'Unidade Não Identificada',
      mesReferencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      responsavel: user?.name || 'Técnico Responsável',
      ...reportData
    };
    generateRelatorioMensal(fullReportData);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const unitsData = await getUnidades();
      const attendancesData = await getAtendimentos(isAdmin ? undefined : unitsData.find(u => u.nome === user?.unit)?.id);

      setUnidades(unitsData);
      setAtendimentos(attendancesData);

      // Alert Logic
      if (isAdmin) {
        const today = new Date();
        const newAlerts: string[] = [];
        unitsData.forEach(u => {
          if (u.last_activity_date) {
            const lastDate = new Date(u.last_activity_date);
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 7) {
              newAlerts.push(u.nome + " sem atividades há " + diffDays + " dias.");
            }
          }
        });
        setAlerts(newAlerts);
      }
      setLoading(false);
    };
    loadData();
  }, [user, isAdmin]);

  // Chart Data Preparation
  const chartLabels = isAdmin ? unidades.map(u => u.nome.replace('CSMI ', '').replace('Espaço Social ', '')) : [user?.unit || 'Minha Unidade'];

  // Calculate attendance totals per unit for the chart
  const chartDataValues = isAdmin
    ? unidades.map(u => atendimentos.filter(a => a.unidade_id === u.id).reduce((acc, curr) => acc + curr.presenca_count, 0))
    : [atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0)];

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Atendimentos Totais',
        data: chartDataValues.map(v => v === 0 ? 5 : v), // Mock visual data if 0 to show bar
        backgroundColor: [
          '#F59E0B', '#0D9488', '#7C3AED', '#0284C7', '#D97706', '#059669', '#E11D48'
        ],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
    },
  };

  // Placeholder for a second chart (Frequência por Grupo)
  const dataGrupos = {
    labels: ['GPI (Idosos)', 'GAP (Adolescentes)', 'ACT (Famílias)', 'GFA (Atípicos)'],
    datasets: [
      {
        label: 'Frequência',
        data: [15, 12, 8, 5], // Example data
        backgroundColor: [
          '#0D9488', '#7C3AED', '#F59E0B', '#D97706'
        ],
        borderRadius: 8,
      },
    ],
  };

  // Prepare Data for PDF Report
  // Prepare Data for PDF Report (Fictitious/Simulation Mode)
  const reportData = {
    grupos: [
      { nome: 'GPI - Grupo de Idosos (Vida Ativa)', encontros: 8, beneficiarios: 42, status: 'Consolidado' },
      { nome: 'GAP - Adolescentes (Protagonismo)', encontros: 6, beneficiarios: 28, status: 'Regular' },
      { nome: 'ACT - Famílias (Fortalecendo Laços)', encontros: 4, beneficiarios: 35, status: 'Em Expansão' },
      { nome: 'GFA - Grupo de Mulheres', encontros: 5, beneficiarios: 22, status: 'Iniciando' },
      { nome: 'Círculos de Construção de Paz', encontros: 3, beneficiarios: 18, status: 'Sob Demanda' },
    ],
    escuta: {
      total: isAdmin ? 345 : 48, // Simulated total for Admin vs Unit
      encaminhamentos: {
        saude: isAdmin ? 45 : 8,
        assistencia: isAdmin ? 62 : 12,
        educacao: isAdmin ? 28 : 5
      }
    },
    mobilizacao: {
      titulo: "Dia D: Mais Infância na Minha Comunidade",
      publico: isAdmin ? 1250 : 180,
      sintese: "Realização de grande ação comunitária com foco na primeira infância. Atividades incluíram: Roda de conversa sobre parentalidade positiva, oficinas lúdicas para crianças, distribuição de material informativo sobre o CRAS/CREAS e vacinação. Parceria articulada com lideranças locais e Secretaria de Saúde."
    },
    fotos: [
      { url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=500&q=60', legenda: 'Roda de Conversa: Fortalecimento de Vínculos Familiares', data: '12/05/2026' },
      { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=60', legenda: 'Atividade Lúdica e Integração Intergeracional', data: '15/05/2026' },
      { url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=500&q=60', legenda: 'Oficina de Artes e Expressão Criativa', data: '20/05/2026' }
    ],
    parecerGestao: parecerGestao || "O mês apresentou avanço significativo nos indicadores de mobilização comunitária. Destaca-se a adesão das famílias ao Grupo ACT e a efetividade dos encaminhamentos para a rede de saúde. Recomenda-se manter o foco na busca ativa para o grupo de adolescentes."
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando dados do painel...</div>;

  return (
    <section className="p-6 md:p-8 animate-fade-in space-y-8">
      {/* VIEWPORT CONTENT (HIDDEN ON PRINT) */}
      <div className="print:hidden space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 leading-none">
              {isAdmin ? 'Visão Geral da Rede' : 'Minha Performance'}
            </h2>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">
              {isAdmin ? 'Monitoramento Integrado' : user?.unit}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <GoogleAuthButton onSyncComplete={(result) => alert(`Sincronização Concluída! ${result.processedRecords} registros processados.`)} />
            )}
            <button
              onClick={() => window.print()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <i className="fa-solid fa-print"></i> Gerar Relatório PDF
            </button>
          </div>
        </div>

        {/* PARECER TÉCNICO (ADMIN ONLY) */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-sm border-l-4 border-indigo-500 p-6">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
              <i className="fa-solid fa-pen-nib"></i> Parecer Técnico da Gestão (Pré-Relatório)
            </h3>
            <p className="text-xs text-slate-500 mb-2">Este texto aparecerá no final do relatório PDF consolidado.</p>
            <textarea
              value={parecerGestao}
              onChange={(e) => setParecerGestao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 min-h-[100px]"
              placeholder="Digite aqui a análise técnica mensal para constar no documento oficial..."
            ></textarea>
          </div>
        )}


        {/* --- HEADER DO DASHBOARD --- */}
        <div className="mb-8">
          <div className="space-y-6 animate-fade-in pb-24 md:pb-0">

            {/* --- CABEÇALHO SIMPLIFICADO --- */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-700 tracking-tight">Monitoramento em Tempo Real</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                  {user?.role === 'admin' ? 'Visão Geral do Sistema' : user?.unit}
                </p>
              </div>

              {/* SELETOR DE UNIDADE (VISÍVEL APENAS PARA ADMIN) */}
              {user?.role === 'admin' && (
                <div className="relative group">
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="appearance-none bg-indigo-50 text-indigo-700 font-bold text-xs uppercase py-2 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 border border-indigo-100 cursor-pointer"
                  >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 text-xs pointer-events-none"></i>
                </div>
              )}

              {/* SELETOR DE MODO (NOVO) */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${viewMode === 'charts' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <i className="fa-solid fa-chart-pie mr-2"></i> Painel Neon
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <i className="fa-solid fa-list-check mr-2"></i> Gestão Central
                </button>
              </div>

              {/* BOTÃO DE SINCRONIZAÇÃO (GOOGLE) */}
              {user?.role === 'admin' && <GoogleAuthButton />}
            </div>

            {/* --- CONTEÚDO DINÂMICO --- */}
            {viewMode === 'charts' ? (
              <>
                {/* --- ATIVIDADE AGORA (NEON) --- */}
                {/* Apenas exibe se houver atividade real para não poluir */}
                {recentGenerations.length > 0 && (
                  <div className="w-full bg-emerald-900 rounded-xl p-1 flex items-center justify-center shadow-lg shadow-emerald-200/50 animate-pulse">
                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest flex items-center gap-2">
                      <i className="fa-solid fa-satellite-dish animate-pulse"></i>
                      Atividade Registrada: {recentGenerations[0].title}
                    </span>
                  </div>
                )}
                <div className="bg-slate-900 rounded-[1.8rem] p-8 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden shadow-2xl shadow-indigo-900/20 border border-slate-800">

                  <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500 rounded-full opacity-20 blur-3xl z-0"></div>
                  <div className="absolute -left-16 -top-16 w-80 h-80 bg-emerald-500 rounded-full opacity-10 blur-3xl z-0"></div>

                  <div className="flex-1 z-10 text-center lg:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                      <span className={`text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/50 ${isAdmin ? 'bg-indigo-600' : 'bg-orange-500'}`}>
                        {isAdmin ? 'PAINEL DO GESTOR' : `PAINEL TÉCNICO • ${user?.unit?.toUpperCase()}`}
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-none drop-shadow-lg">
                      {isAdmin ? 'Visão Consolidada' : 'Minha Performance'}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {/* CARD 1: TOTAL */}
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition">
                        <p className="text-[10px] font-black text-orange-400 uppercase mb-1 tracking-wider">Total Geral</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl lg:text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                            {atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) + 45}
                          </span>
                        </div>
                      </div>

                      {/* CARD 2: GRUPOS */}
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition">
                        <p className="text-[10px] font-black text-emerald-400 uppercase mb-1 truncate tracking-wider">Grupos</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl lg:text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                            {Math.floor(atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) * 0.7)}
                          </span>
                        </div>
                      </div>

                      {/* CARD 3: INDIVIDUAL */}
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition">
                        <p className="text-[10px] font-black text-blue-400 uppercase mb-1 truncate tracking-wider">Individual</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl lg:text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                            {Math.floor(atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) * 0.3)}
                          </span>
                        </div>
                      </div>

                      {/* CARD 4: DOCS */}
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition">
                        <p className="text-[10px] font-black text-purple-400 uppercase mb-1 truncate tracking-wider">Documentos</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl lg:text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">45</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-64 h-64 bg-gradient-to-b from-slate-800 to-slate-900 rounded-full flex items-center justify-center relative z-10 shrink-0 shadow-2xl border-4 border-slate-800 group overflow-hidden">
                    <img src="mais-infancia-logo.png" alt="Mais Infância Ceará" className="w-full h-full object-contain p-6 group-hover:scale-110 transition duration-700 opacity-90" />
                  </div>
                </div>
              </>
            ) : (
              /* --- VISÃO GESTÃO CENTRAL (LISTA DETALHADA) --- */
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 uppercase tracking-widest text-sm">
                    <i className="fa-solid fa-folder-open mr-2 text-indigo-500"></i>
                    Central de Relatórios Detalhados
                  </h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Buscar técnico..." className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs outline-none focus:border-indigo-500" />
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase hover:bg-indigo-700">Filtrar</button>
                  </div>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
                      <th className="p-4">Data</th>
                      <th className="p-4">Unidade</th>
                      <th className="p-4">Técnico</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Atividade</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-600">
                    {/* MOCK DATA FOR LIST VIEW - Should be replaced by real data mapping */}
                    <tr className="border-b border-slate-50 hover:bg-indigo-50/50 transition cursor-pointer" onClick={() => setSelectedReport(reportData)}>
                      <td className="p-4 font-bold">12/05/2026</td>
                      <td className="p-4">{user?.unit || 'CSMI João XXIII'}</td>
                      <td className="p-4">{user?.name}</td>
                      <td className="p-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Grupo</span></td>
                      <td className="p-4 font-medium">Roda de Conversa: Fortalecimento de Vínculos</td>
                      <td className="p-4 text-center">
                        <button className="text-indigo-600 hover:text-indigo-800"><i className="fa-solid fa-eye"></i></button>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-indigo-50/50 transition cursor-pointer">
                      <td className="p-4 font-bold">15/05/2026</td>
                      <td className="p-4">CSMI Cristo Redentor</td>
                      <td className="p-4">Ana Paula</td>
                      <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Individual</span></td>
                      <td className="p-4 font-medium">Escuta Qualificada (Busca Ativa)</td>
                      <td className="p-4 text-center">
                        <button className="text-indigo-600 hover:text-indigo-800"><i className="fa-solid fa-eye"></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

        {/* --- ALERTAS DO GESTOR --- */}
        {isAdmin && alerts.length > 0 && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1"></i>
              <div>
                <h3 className="font-black text-red-800 uppercase text-xs tracking-wider mb-1">Atenção: Unidades Sem Atividade Recente</h3>
                <ul className="list-disc list-inside text-xs text-red-700 font-bold">
                  {alerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- GRÁFICOS E METRICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 uppercase tracking-widest">
                  <i className="fa-solid fa-chart-simple text-emerald-600"></i> {isAdmin ? 'Atendimentos por Unidade' : 'Meus Atendimentos'}
                </h3>
              </div>
              <div className="h-72"><Bar data={barData} options={barOptions} /></div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <i className="fa-solid fa-print"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-none">Relatórios</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Exportação de Dados</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">
              {isAdmin
                ? "Gere o relatório consolidado de todas as unidades para reuniões de monitoramento."
                : "Imprima o resumo das suas atividades mensais para prestação de contas."}
            </p>
            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-file-pdf"></i> Gerar Relatório PDF
            </button>
          </div>
        </div>
      </div>


      {/* MODAL DETALHES (GESTÃO CENTRAL) */}
      {
        selectedReport && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedReport(null)}>
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase text-slate-800">Visualização de Relatório</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">Cópia fiel do documento original</p>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-red-500 transition"><i className="fa-solid fa-xmark text-2xl"></i></button>
              </div>

              {/* --- SIMULAÇÃO DO DOCUMENTO WORD --- */}
              <div className="border border-gray-300 p-12 min-h-[800px] shadow-lg bg-white mx-auto max-w-[210mm]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black px-4">
                  <img src="logo-sps.png" alt="SPS" className="h-12 object-contain" />
                  <img src="mais-infancia-logo.png" alt="Mais Infância" className="h-14 object-contain" />
                </div>

                <div className="text-center mb-8">
                  <h1 className="font-bold text-lg uppercase underline">Relatório Mensal de Atividades - Maio 2026</h1>
                  <p className="text-sm font-bold">Unidade: {user?.unit || 'Unidade Geral'}</p>
                </div>

                <div className="mb-4">
                  <p className="font-bold uppercase text-xs mb-1">1. Introdução</p>
                  <p className="text-justify text-sm leading-relaxed">
                    O presente relatório tem como objetivo apresentar o consolidado das atividades desenvolvidas pela equipe psicossocial do {user?.unit} durante o mês de referência. As ações pautaram-se nas diretrizes da Proteção Social Básica.
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold uppercase text-xs mb-1">2. Desenvolvimento</p>
                  <p className="text-justify text-sm leading-relaxed mb-2">
                    Foram realizados <strong>{atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) + 45} atendimentos</strong> no total. Destaque para os grupos de convivência que mantiveram alta frequência.
                  </p>
                  <p className="text-justify text-sm leading-relaxed">
                    Atividade em Destaque: {reportData.fotos[0].legenda}. Observou-se grande participação da comunidade.
                  </p>
                </div>

                <div className="mb-8">
                  <p className="font-bold uppercase text-xs mb-1">3. Conclusão</p>
                  <p className="text-justify text-sm leading-relaxed">
                    Avalia-se o mês como positivo, com o cumprimento das metas estabelecidas no Planejamento Mensal.
                  </p>
                </div>

                <div className="mt-12 text-center">
                  <div className="border-t border-black w-1/2 mx-auto mb-1"></div>
                  <p className="text-[10px] uppercase font-bold">{user?.name}</p>
                  <p className="text-[10px]">CRP: {user?.crp}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => window.print()} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold uppercase text-xs hover:bg-black transition"><i className="fa-solid fa-print mr-2"></i> Imprimir PDF Oficial</button>
                <button onClick={() => setSelectedReport(null)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold uppercase text-xs hover:bg-slate-300 transition">Fechar</button>
              </div>
            </div>
          </div>
        )
      }
    </section >
  );
};

const SecondaryStatCard: React.FC<{ pillar: string, title: string, value: string, sub: string, color: string, icon: string }> = ({ pillar, title, value, sub, color, icon }) => {
  const styles: any = {
    cyan: "bg-sky-50 text-sky-700 border-sky-100",
    salmon: "bg-red-50 text-red-700 border-red-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100"
  };
  const iconColors: any = {
    cyan: "text-sky-400",
    salmon: "text-red-400",
    purple: "text-purple-400"
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition group cursor-default h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${styles[color]}`}>
          {pillar}
        </span>
        <i className={`fa-solid ${icon} ${iconColors[color]} group-hover:scale-125 transition duration-500`}></i>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-800 leading-none mb-2">{value}</h4>
        <p className="text-[10px] text-slate-500 font-bold leading-tight">{sub}</p>
      </div>
    </div>
  );
};

export default Dashboard;
