import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const barData = {
    labels: ['João XXIII', 'Cristo R.', 'Curió', 'Barbalha', 'Q. Cunha', 'Barra', 'D. Macedo'],
    datasets: [
      {
        label: 'Adesão para a Meta (%)',
        data: [92, 88, 85, 79, 94, 82, 90],
        backgroundColor: [
          '#F59E0B', // João XXIII - Laranja
          '#0D9488', // Cristo R. - Turquesa
          '#7C3AED', // Curió - Roxo
          '#0284C7', // Barbalha - Azul Sky
          '#D97706', // Q. Cunha - Âmbar
          '#059669', // Barra - Esmeralda
          '#E11D48'  // D. Macedo - Rosa
        ],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { callback: (value: any) => value + '%' } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Adesão: ${context.raw}%`
        }
      }
    },
  };

  const doughnutData = {
    labels: ['Brincar Livre', 'Oficinas Dirigidas', 'Eventos Família'],
    datasets: [
      {
        data: [50, 30, 20],
        backgroundColor: ['#F59E0B', '#fbbf24', '#fef3c7'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="p-4 md:p-8 animate-fade-in min-h-full">

      {/* --- PRIORIDADE MÁXIMA: TEMPO DE BRINCAR --- */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 rounded-[2rem] p-1 shadow-xl">
          <div className="bg-white rounded-[1.8rem] p-8 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-orange-50 rounded-full opacity-40 z-0"></div>

            <div className="flex-1 z-10 text-center lg:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <span className="bg-orange-500 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
                  PLANO ESTRATÉGICO 2026
                </span>
              </div>

              <h2 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter leading-none">
                Complexos & <br />Espaços Sociais
              </h2>

              <p className="text-slate-500 text-lg font-medium italic mb-8 max-w-xl leading-relaxed">
                "O brincar é ferramenta metodológica para a Proteção Social e o Fortalecimento de Vínculos."
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-black text-orange-400 uppercase mb-1 whitespace-nowrap">Adesão para a Meta</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-orange-600">85%</span>
                    <i className="fa-solid fa-arrow-trend-up text-emerald-500 text-xs"></i>
                  </div>
                </div>
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-black text-orange-400 uppercase mb-1 whitespace-nowrap">Atendimentos</p>
                  <span className="text-4xl font-black text-slate-700">1.240</span>
                </div>
              </div>
            </div>

            <div className="w-64 h-64 bg-gradient-to-b from-orange-100 to-orange-50 rounded-3xl flex items-center justify-center relative z-10 shrink-0 shadow-inner group overflow-hidden">
              <img src="/mais-infancia-logo.png" alt="Mais Infância Ceará" className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-700" />
            </div>
          </div>
        </div>
      </div>

      {/* --- GRUPOS E METODOLOGIAS --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap px-2 text-center">
            Grupos de Fortalecimento de Vínculos
          </p>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* GAP CARD */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-purple-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-slate-800 text-lg">GAP</h3>
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">Adolescentes</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Grupo de Adolescentes Participativos</p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 text-justify">
              Fundamentado na Psicologia do Desenvolvimento (Erikson, Aberastury), o grupo atua na fase de <strong>Identidade vs. Confusão de Papéis</strong>, promovendo a elaboração de lutos normais da adolescência e a construção da identidade. Foca no <strong>Protagonismo Juvenil</strong> e no <strong>Projeto de Vida</strong> como ferramentas para a transição saudável para a vida adulta.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Identidade e Projeto de Vida
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Cidadania Ativa e Participação Social
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Planejamento de Carreira e Futuro
              </li>
            </ul>
          </div>

          {/* GPI CARD */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-amber-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-slate-800 text-lg">GPI</h3>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">Idosos</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Grupo da Pessoa Idosa</p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 text-justify">
              A atuação é pautada na promoção da <strong>Senescência</strong> (envelhecimento saudável) e na busca pela <strong>Integridade do Ego</strong> (Erikson). O trabalho técnico foca na autonomia, na ressignificação de histórias de vida e na manutenção das funções cognitivas superiores, indo além do lazer e promovendo a cidadania ativa.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Estimulação Cognitiva
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Resgate da Memória Autobiográfica
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Vínculos Intergeracionais
              </li>
            </ul>
          </div>

          {/* GFA CARD */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-rose-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-slate-800 text-lg">GFA</h3>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">Famílias Atípicas</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Grupo da Família Atípica</p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 text-justify">
              Rede de apoio e acolhimento focada na <strong>Saúde Mental do Cuidador</strong> de pessoas com deficiência (PcD) e TEA. Utiliza a escuta qualificada para validar experiências ("o que ninguém vê") e fortalecer a capacidade de <strong>coping</strong> (enfrentamento) e resiliência familiar.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Empoderamento e Direitos
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Suporte Emocional
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Troca de Vivências
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- PROGRAMAS PARCEIROS --- */}
      <div className="mb-10 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap px-2 text-center">
            Programas Parceiros
          </p>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-8 -mt-8 transition transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Parentalidade
                </span>
                <i className="fa-solid fa-hands-holding-child text-3xl opacity-80"></i>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">ACT</h3>
              <p className="text-rose-100 text-xs font-medium leading-relaxed max-w-sm">
                Programa de fortalecimento de vínculos familiares e prevenção da violência, promovendo estratégias de parentalidade positiva e ambientes seguros para crianças.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-tr-full -ml-8 -mb-8 transition transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Cidadania e Paz
                </span>
                <i className="fa-solid fa-hand-holding-heart text-3xl opacity-80"></i>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">COMPAZ</h3>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed max-w-sm">
                A Coordenação de Mediação, Justiça Restaurativa e Cultura de Paz (Compaz), vinculada à SPS e ao Pacto por um Ceará Pacífico, atua na prevenção da violência e promoção da cultura de paz.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Gráficos de Dados ao Vivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 uppercase tracking-widest">
                <i className="fa-solid fa-chart-simple text-emerald-600"></i> Adesão para a Meta por Unidade
              </h3>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-emerald-600 uppercase">Live Data</span>
              </div>
            </div>
            <div className="h-72"><Bar data={barData} options={barOptions} /></div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-none">Mural de Gestão</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Orientações PSI</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <p className="text-[9px] font-black text-purple-500 uppercase mb-1">GAP - Habilidades Sociais</p>
              <p className="text-xs font-bold text-slate-700 leading-snug">Desenvolvimento de potencialidades socio-históricas dos adolescentes.</p>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-[9px] font-black text-red-500 uppercase mb-1">GFA - Cuidado com o Cuidador</p>
              <p className="text-xs font-bold text-slate-700 leading-snug">Escuta qualificada e fortalecimento emocional das famílias atípicas.</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">GPI - Senescência</p>
              <p className="text-xs font-bold text-slate-700 leading-snug">Atividades de socialização e manutenção da autonomia na pessoa idosa.</p>
            </div>
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
