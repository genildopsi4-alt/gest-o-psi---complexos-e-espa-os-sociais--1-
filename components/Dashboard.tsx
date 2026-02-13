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
import { Bar, Doughnut } from 'react-chartjs-2';
import GoogleAuthButton from './GoogleAuthButton';
import { UserProfile, Unidade, Atendimento } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';
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
  const [loading, setLoading] = useState(true);
  const [parecerGestao, setParecerGestao] = useState('');

  const isAdmin = user?.role === 'admin' || user?.name === 'Genildo Barbosa';
  const [selectedUnit, setSelectedUnit] = useState<string>('Todas');

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const unitsData = await RelatorioService.getUnidades();
        // Fetch all data for current context (simplifying to full year 2026 for now)
        const attendimentosData = await RelatorioService.getRelatorioData('2026-01-01', '2026-12-31');

        setUnidades(unitsData);
        setAtendimentos(attendimentosData);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, isAdmin]);

  // Derived State for UI
  const unitsNames = ['Todas', ...unidades.map(u => u.nome)];

  // Filter Logic
  const filteredAtendimentos = selectedUnit === 'Todas'
    ? atendimentos
    : atendimentos.filter(a => a.unidade === selectedUnit);

  // Metrics Calculations
  // Notes: 'presenca_count' comes from Supabase/Local, 'qtd_participantes' from PDF import. Summing both safely.
  const totalGeral = filteredAtendimentos.reduce((acc, curr) => acc + (curr.qtd_participantes || curr.presenca_count || 0), 0);

  // Mocking categorization for now based on strings since we don't have explicit types for everything yet
  const diariosGrupo = filteredAtendimentos.filter(a => a.atividade_especifica?.toLowerCase().includes('grupo') || a.tipo_grupo).length;
  const fichasIndividuais = filteredAtendimentos.filter(a => !a.atividade_especifica?.toLowerCase().includes('grupo') && !a.tipo_grupo).length;
  const encaminhamentos = Math.floor(totalGeral * 0.1); // Estimated for now

  // --- CHART DATA PREPARATION ---

  // 1. Bar Chart: Atendimentos por Unidade (Top 5 + Espaços)
  const barChartData = {
    labels: unidades.map(u => u.nome.replace('CSMI ', '').replace('Espaço ', '')),
    datasets: [{
      label: 'Atendimentos',
      data: unidades.map(u => {
        return atendimentos
          .filter(a => a.unidade === u.nome)
          .reduce((acc, curr) => acc + (curr.qtd_participantes || curr.presenca_count || 0), 0);
      }),
      backgroundColor: unidades.map(u => u.tipo === 'CSMI' ? '#10B981' : '#F97316'), // Emerald vs Orange
      borderRadius: 8,
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Atendimentos por Unidade', color: '#64748B', font: { size: 12 } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
      x: { grid: { display: false } }
    }
  };

  // 2. Doughnut Chart: CSMI vs Espaços Sociais
  const csmiTotal = atendimentos
    .filter(a => unidades.find(u => u.nome === a.unidade)?.tipo === 'CSMI')
    .reduce((acc, curr) => acc + (curr.qtd_participantes || curr.presenca_count || 0), 0);

  const espacosTotal = totalGeral - csmiTotal; // Remaining are Espaços Sociais (filtered by Todas) or calculate explicitly
  // Re-calculate explicitly for 'Todas' context to be accurate
  const espacosTotalEx = atendimentos
    .filter(a => unidades.find(u => u.nome === a.unidade)?.tipo === 'Espaço Social')
    .reduce((acc, curr) => acc + (curr.qtd_participantes || curr.presenca_count || 0), 0);

  const doughnutData = {
    labels: ['Complexos Sociais', 'Espaços Sociais'],
    datasets: [{
      data: [csmiTotal, espacosTotalEx],
      backgroundColor: ['#10B981', '#F97316'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 4,
    }]
  };

  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8 } }
    }
  };


  if (loading) return <div className="p-8 text-center text-slate-500">Carregando dados...</div>;

  return (
    <section className="p-4 md:p-8 animate-fade-in space-y-8 bg-slate-50/50 min-h-screen">

      {/* --- VISÃO CONSOLIDADA (Main Card) --- */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-4 border-emerald-400/30 relative overflow-hidden">

        {/* Background Decor (Subtle) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT COLUMN: Header & Metrics */}
          <div className="flex-1 space-y-10">

            {/* Header */}
            <div>
              <span className="inline-block bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 shadow-lg shadow-purple-200">
                Painel do Gestor
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter leading-none mb-2">
                Visão Consolidada
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Monitoramento em Tempo Real • {selectedUnit}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* Card 1: Total Geral (Orange) */}
              <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 hover:border-orange-300 transition group">
                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">Total Geral</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-orange-500 group-hover:scale-110 transition duration-300 block">{totalGeral}</span>
                </div>
              </div>

              {/* Card 2: Diários de Grupo (Green) */}
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition group">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Diários de Grupo</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-emerald-600 group-hover:scale-110 transition duration-300 block">{diariosGrupo}</span>
                  <i className="fa-solid fa-users text-emerald-300 text-xs"></i>
                </div>
              </div>

              {/* Card 3: Fichas Individuais (Blue) */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 hover:border-blue-300 transition group">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Fichas Individuais</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-blue-500 group-hover:scale-110 transition duration-300 block">{fichasIndividuais}</span>
                  <i className="fa-solid fa-user text-blue-300 text-xs"></i>
                </div>
              </div>

              {/* Card 4: Encaminhamentos (Purple) */}
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 hover:border-purple-300 transition group">
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">Encaminhamentos & Visitas</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-purple-500 group-hover:scale-110 transition duration-300 block">{encaminhamentos}</span>
                  <i className="fa-solid fa-share text-purple-300 text-xs"></i>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Active Now (Mais Infância) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-[#FFF8E7] rounded-[2.5rem] p-8 h-full min-h-[300px] flex flex-col items-center justify-center text-center relative border border-orange-100 shadow-lg shadow-orange-100/50">

              {/* Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-md shadow-emerald-200 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                Em Atividade Agora
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center py-6">
                <img src="mais-infancia-logo.png" alt="Mais Infância Ceará" className="w-48 object-contain drop-shadow-xl" />
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-orange-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atividade Atual</p>
                <p className="text-sm font-black text-slate-800">Grupo GAP - Roda de Conversa</p>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* --- GRÁFICOS E COMPARATIVOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Gráfico de Barras - Unidades */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-700 uppercase tracking-tight">Desempenho por Unidade</h3>
            <i className="fa-solid fa-chart-column text-emerald-200 text-xl"></i>
          </div>
          <div className="h-64">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        {/* Gráfico de Donut - Categorias */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="font-black text-slate-700 uppercase tracking-tight mb-6 w-full text-left">Distribuição</h3>
          <div className="relative w-48 h-48">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-black text-slate-800">{((csmiTotal / (csmiTotal + espacosTotalEx || 1)) * 100).toFixed(0)}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">CSMI</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- EXTRA CONTROLS (Hidden but accessible for Admin) --- */}
      {
        isAdmin && (
          <div className="flex justify-end gap-2 opacity-50 hover:opacity-100 transition p-4">
            <select
              value={selectedUnit}
              title="Selecionar Unidade (Filtro)"
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="text-xs border rounded p-1 bg-transparent"
            >
              {unitsNames.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button onClick={() => window.print()} className="text-xs font-bold uppercase"><i className="fa-solid fa-print"></i> Relatório</button>
          </div>
        )
      }

      {/* --- GALERIA DE FOTOS (ATVIDADES RECENTES) --- */}
      <div className="mt-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-200"></div>
          <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <i className="fa-solid fa-camera text-slate-300"></i>
            Registros dos Complexos
          </h3>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Random Photos Logic - In real app, shuffle reportData.fotos */}
          {[
            { url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=500&q=60', label: 'Roda de Conversa', unit: 'CSMI João XXIII' },
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=60', label: 'Oficina Lúdica', unit: 'CSMI Curió' },
            { url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=500&q=60', label: 'Artes e Cultura', unit: 'CSMI Barbalha' }
          ].map((foto, idx) => (
            <div key={idx} className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-all duration-500"></div>
              <img src={foto.url} alt={foto.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {foto.unit}
                </span>
                <p className="text-white font-bold leading-tight">{foto.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section >
  );
};

export default Dashboard;
