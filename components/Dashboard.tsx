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
          {/* NEON EFFECT LOGIC: Checks if activity is happening now (Simulated) */}
          <div className={`bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 rounded-[2rem] p-1 shadow-xl transition-all duration-1000 ${true ? 'shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse border-4 border-emerald-400' : ''}`}>
            <div className="bg-white rounded-[1.8rem] p-8 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden">

              {/* STATUS INDICATOR (AO VIVO) */}
              <div className="absolute top-6 right-6 z-20 flex flex-col items-end animate-bounce">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border-2 border-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                  Em Atividade Agora
                </span>
                <span className="text-[9px] font-bold text-emerald-600 mt-1 bg-white/90 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm border border-emerald-100">
                  Grupo GAP • Roda de Conversa
                </span>
              </div>

              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-orange-50 rounded-full opacity-40 z-0"></div>

              <div className="flex-1 z-10 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <span className={`text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm ${isAdmin ? 'bg-purple-600' : 'bg-orange-500'}`}>
                    {isAdmin ? 'PAINEL DO GESTOR' : `PAINEL TÉCNICO • ${user?.unit?.toUpperCase()}`}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tighter leading-none">
                  {isAdmin ? 'Visão Consolidada' : 'Minha Performance'}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {/* CARD 1: TOTAL */}
                  <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                    <p className="text-[9px] font-black text-orange-400 uppercase mb-1">Total Geral</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl lg:text-3xl font-black text-orange-600">
                        {atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) + 45} {/* +45 simulados de docs */}
                      </span>
                    </div>
                  </div>

                  {/* CARD 2: GRUPOS */}
                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-500 uppercase mb-1 truncate" title="Diários de Grupo">Diários de Grupo</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl lg:text-3xl font-black text-emerald-600">
                        {Math.floor(atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) * 0.7)}
                      </span>
                      <i className="fa-solid fa-users text-emerald-400 text-[10px]"></i>
                    </div>
                  </div>

                  {/* CARD 3: INDIVIDUAL */}
                  <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                    <p className="text-[9px] font-black text-blue-500 uppercase mb-1 truncate" title="Fichas Individuais">Fichas Individuais</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl lg:text-3xl font-black text-blue-600">
                        {Math.floor(atendimentos.reduce((acc, curr) => acc + curr.presenca_count, 0) * 0.3)}
                      </span>
                      <i className="fa-solid fa-user-clock text-blue-400 text-[10px]"></i>
                    </div>
                  </div>

                  {/* CARD 4: DOCS (Encaminhamentos + Visitas) */}
                  <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                    <p className="text-[9px] font-black text-purple-500 uppercase mb-1 truncate" title="Encaminhamentos & Visitas">Encaminhamentos & Visitas</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl lg:text-3xl font-black text-purple-600">45</span>
                      <i className="fa-solid fa-file-signature text-purple-400 text-[10px]"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-64 h-64 bg-gradient-to-b from-orange-100 to-orange-50 rounded-3xl flex items-center justify-center relative z-10 shrink-0 shadow-inner group overflow-hidden">
                <img src="mais-infancia-logo.png" alt="Mais Infância Ceará" className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-700" />
              </div>
            </div>
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
    </section>
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
