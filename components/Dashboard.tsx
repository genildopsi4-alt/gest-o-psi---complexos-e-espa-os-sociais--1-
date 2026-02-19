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
import { UserProfile, Unidade, RelatorioMensal } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';
import NewImportador from './NewImportador';

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
  const [reports, setReports] = useState<RelatorioMensal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportador, setShowImportador] = useState(false);

  // Filter State
  const [selectedUnit, setSelectedUnit] = useState<string>('Todas');
  const [selectedType, setSelectedType] = useState<'Todos' | 'CSMI' | 'Espaço Social'>('Todos');

  const isAdmin = user?.role === 'admin' || user?.name === 'Genildo Barbosa';

  // Fetch Data
  const loadData = async () => {
    setLoading(true);
    try {
      const unitsData = await RelatorioService.getUnidades();
      // Fetch consolidated monthly reports
      const reportsData = await RelatorioService.getRelatoriosConsolidados();

      setUnidades(unitsData);
      setReports(reportsData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Derived State
  const uniqueYears = Array.from(new Set(reports.map(r => r.ano))).sort((a: number, b: number) => b - a);
  const currentYear = uniqueYears[0] || new Date().getFullYear();

  // Filter Logic
  const filteredReports = reports.filter(r => {
    const unitMatch = selectedUnit === 'Todas' || r.unidadeNome === selectedUnit;
    const typeMatch = selectedType === 'Todos' || r.unidadeTipo === selectedType;
    return unitMatch && typeMatch && r.ano === currentYear;
  });

  const totalAtendimentos = filteredReports.reduce((acc, curr) => acc + curr.qtdAtendimentos, 0);

  // --- CHART DATA PREPARATION ---

  // 1. Bar Chart: Volume por Unidade (Vertical)
  // Aggregating by Unit Name to handle multiple months if needed, or just show total for selected period
  // Group by Unit
  const unitGroups: Record<string, number> = {};
  filteredReports.forEach(r => {
    unitGroups[r.unidadeNome] = (unitGroups[r.unidadeNome] || 0) + r.qtdAtendimentos;
  });

  // Create sorted array for chart
  const sortedUnits = Object.entries(unitGroups).sort((a, b) => b[1] - a[1]); // Descending

  const barChartData = {
    labels: sortedUnits.map(([name]) => name.replace('CSMI ', '').replace('Espaço ', '')),
    datasets: [{
      label: 'Atendimentos',
      data: sortedUnits.map(([_, count]) => count),
      backgroundColor: sortedUnits.map(([name]) => {
        const unit = unidades.find(u => u.nome === name);
        return unit?.tipo === 'CSMI' ? '#10B981' : '#F97316'; // Emerald vs Orange
      }),
      borderRadius: 8,
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Volume de Atendimentos por Unidade', color: '#64748B', font: { size: 12 } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
      x: { grid: { display: false } }
    }
  };

  // 2. Doughnut Chart: CSMI vs Espaços Sociais
  // Calculate totals based on ALL data (or filtered by Year/Month context, but disregarding Unit filter to show distribution)
  const distributionReports = reports.filter(r => r.ano === currentYear);
  const csmiTotal = distributionReports.filter(r => r.unidadeTipo === 'CSMI').reduce((acc, curr) => acc + curr.qtdAtendimentos, 0);
  const espacosTotal = distributionReports.filter(r => r.unidadeTipo === 'Espaço Social').reduce((acc, curr) => acc + curr.qtdAtendimentos, 0);

  const doughnutData = {
    labels: ['Complexos Sociais', 'Espaços Sociais'],
    datasets: [{
      data: [csmiTotal, espacosTotal],
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

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT COLUMN: Header & Metrics */}
          <div className="flex-1 space-y-10">
            {/* Header with Actions */}
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 shadow-lg shadow-purple-200">
                  Painel do Gestor
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-none mb-2">
                  Visão Consolidada
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Dados Reais • {currentYear}
                </p>
              </div>

              {/* Import Button */}
              <button
                onClick={() => setShowImportador(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2"
                title="Importar Relatório PDF ou Manual"
              >
                <i className="fa-solid fa-file-import"></i> <span className="hidden md:inline">Importar Dados</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                title="Filtrar por Tipo"
              >
                <option value="Todos">Todos os Tipos</option>
                <option value="CSMI">Complexos</option>
                <option value="Espaço Social">Espaços</option>
              </select>

              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                title="Filtrar por Unidade"
              >
                <option value="Todas">Todas as Unidades</option>
                {unidades
                  .filter(u => selectedType === 'Todos' || u.tipo === selectedType)
                  .map(u => (
                    <option key={u.id} value={u.nome}>{u.nome}</option>
                  ))}
              </select>
            </div>

            {/* TOTAL METRIC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 hover:border-orange-300 transition group">
                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">Total de Atendimentos</p>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-orange-500 group-hover:scale-105 transition duration-300 block">
                    {totalAtendimentos.toLocaleString('pt-BR')}
                  </span>
                  {totalAtendimentos === 0 && (
                    <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded-full border border-slate-100">
                      Sem dados
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold leading-tight">
                  Soma consolidada dos relatórios importados no período.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Active Now (Mais Infância) */}
          <div className="w-full lg:w-80 shrink-0 hidden lg:block">
            <div className="bg-[#FFF8E7] rounded-[2.5rem] p-8 h-full min-h-[300px] flex flex-col items-center justify-center text-center relative border border-orange-100 shadow-lg shadow-orange-100/50">
              {/* Content */}
              <div className="flex-1 flex items-center justify-center py-6">
                <img src="mais-infancia-logo.png" alt="Mais Infância Ceará" className="w-48 object-contain drop-shadow-xl opacity-80" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-orange-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gestão PSI</p>
                <p className="text-[10px] font-black text-slate-400 mt-1">CÉLULA DE GESTÃO DOS COMPLEXOS E ESPAÇOS SOCIAIS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Gráfico de Barras - Unidades */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-slate-700 uppercase tracking-tight">Comparativo por Unidade</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Volume total no período selecionado</p>
            </div>
            <i className="fa-solid fa-chart-column text-emerald-200 text-xl"></i>
          </div>
          <div className="h-64">
            {totalAtendimentos > 0 ? (
              <Bar data={barChartData} options={barOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <i className="fa-solid fa-chart-simple text-4xl mb-3 opacity-20"></i>
                <span className="text-xs font-bold uppercase">Nenhum dado para exibir</span>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Donut - Categorias */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="font-black text-slate-700 uppercase tracking-tight mb-2 w-full text-left">Distribuição %</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase w-full text-left mb-6">Complexos vs Espaços Sociais</p>

          <div className="relative w-48 h-48">
            {(csmiTotal + espacosTotal) > 0 ? (
              <>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-slate-800">
                      {((csmiTotal / (csmiTotal + espacosTotal || 1)) * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">CSMI</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <i className="fa-solid fa-chart-pie text-4xl mb-3 opacity-20"></i>
                <span className="text-xs font-bold uppercase">Sem dados</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL IMPORTADOR --- */}
      {showImportador && (
        <NewImportador
          onClose={() => setShowImportador(false)}
          onSuccess={loadData}
        />
      )}

    </section>
  );
};

export default Dashboard;
