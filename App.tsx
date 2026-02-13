import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Diario from './components/Diario';
import Grupos from './components/Grupos';
import Eventos from './components/Eventos';
import Rede from './components/Rede';
import Beneficiarios from './components/Beneficiarios';
import Planejamento from './components/Planejamento';
import Instrumentais from './components/Instrumentais';
import BottomNav from './components/BottomNav';
import DataSeeder from './components/DataSeeder'; // [NEW]
import { Section, Beneficiario, UserProfile } from './types';

type AppView = 'landing' | 'login' | 'app';

const App: React.FC = () => {
  // View State Management
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [showSeeder, setShowSeeder] = useState(false); // [NEW] Control DataSeeder visibility

  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('todos');

  // Lifted state for Beneficiarios to ensure persistence across navigation
  const [beneficiariosList, setBeneficiariosList] = useState<Beneficiario[]>([
    // --- GPI: JOÃO XXIII (Lista Real) ---
    { id: 1, nome: 'ADALEUDA BANDEIRA FERREIRA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'A', age: '60+ anos' },
    { id: 2, nome: 'AILA MARIA OLIVEIRA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-teal-100', avatar_text: 'text-teal-700', avatar_letter: 'A', age: '60+ anos' },
    { id: 3, nome: 'ALZERINA MENDES PEREIRA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'falta', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-700', avatar_letter: 'A', age: '60+ anos' },
    { id: 4, nome: 'ANTÔNIA LEONEL BARROS', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-700', avatar_letter: 'A', age: '60+ anos' },
    { id: 5, nome: 'ANTÔNIA XAVIER ABREU COSTA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-emerald-100', avatar_text: 'text-emerald-700', avatar_letter: 'A', age: '60+ anos' },
    { id: 6, nome: 'AURENIR GONÇALVES MARINHO', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-pink-100', avatar_text: 'text-pink-700', avatar_letter: 'A', age: '60+ anos' },
    { id: 7, nome: 'DJANIRA MAGALHÃES SOUZA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-cyan-100', avatar_text: 'text-cyan-700', avatar_letter: 'D', age: '60+ anos' },
    { id: 8, nome: 'EUGÊNIA CAMELO DE OLIVEIRA MAGALHÃES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'E', age: '60+ anos' },
    { id: 9, nome: 'FLORISA FERREIRA DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-teal-100', avatar_text: 'text-teal-700', avatar_letter: 'F', age: '60+ anos' },
    { id: 10, nome: 'FRANCISCA FERNANDES CAMPOS', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-indigo-100', avatar_text: 'text-indigo-700', avatar_letter: 'F', age: '60+ anos' },
    { id: 11, nome: 'FRANCISCA GALDINO DE SOUSA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'falta', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-700', avatar_letter: 'F', age: '60+ anos' },
    { id: 12, nome: 'FRANCISCA TEODORO DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-700', avatar_letter: 'F', age: '60+ anos' },
    { id: 13, nome: 'IZAUDITE GARCIA LEITE', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-red-100', avatar_text: 'text-red-700', avatar_letter: 'I', age: '60+ anos' },
    { id: 14, nome: 'JOANA D\'ARC SAMPAIO DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-yellow-100', avatar_text: 'text-yellow-700', avatar_letter: 'J', age: '60+ anos' },
    { id: 15, nome: 'JOÃO BEZERRA DE OLIVEIRA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-green-100', avatar_text: 'text-green-700', avatar_letter: 'J', age: '60+ anos' },
    { id: 16, nome: 'JOSEFA SILVA DE ARRUDA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-teal-100', avatar_text: 'text-teal-700', avatar_letter: 'J', age: '60+ anos' },
    { id: 17, nome: 'JOSELINA DE LIMA SANTOS', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'J', age: '60+ anos' },
    { id: 18, nome: 'LUCIA MARIA BATISTA OLIVEIRA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-pink-100', avatar_text: 'text-pink-700', avatar_letter: 'L', age: '60+ anos' },
    { id: 19, nome: 'LUIZ ANTÔNIO DE SOUSA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'falta', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-cyan-100', avatar_text: 'text-cyan-700', avatar_letter: 'L', age: '60+ anos' },
    { id: 20, nome: 'LUIZA ALVES DO NASCIMENTO', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-700', avatar_letter: 'L', age: '60+ anos' },
    { id: 21, nome: 'MARIA ALZERINA DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 22, nome: 'MARIA AUGUSTA BERNARDINO DE SOUZA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-emerald-100', avatar_text: 'text-emerald-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 23, nome: 'MARIA CLEIDE JARDIM FERNANDES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-red-100', avatar_text: 'text-red-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 24, nome: 'MARIA DA CONCEIÇÃO GOMES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-yellow-100', avatar_text: 'text-yellow-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 25, nome: 'MARIA DAS GRAÇAS DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 26, nome: 'MARIA DAS GRAÇAS DA SILVA MAGALHÃES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-teal-100', avatar_text: 'text-teal-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 27, nome: 'MARIA DAS GRAÇAS MENEZES DE SÁ', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 28, nome: 'MARIA DAS GRAÇAS OLIVEIRA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-indigo-100', avatar_text: 'text-indigo-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 29, nome: 'MARIA DE FÁTIMA DA SILVA BRAGA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 30, nome: 'MARIA DE JESUS ALBUQUERQUE', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-pink-100', avatar_text: 'text-pink-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 31, nome: 'MARIA DE LOURDES ALBUQUERQUE', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-cyan-100', avatar_text: 'text-cyan-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 32, nome: 'MARIA DO CARMO ARAGÃO LOPES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-green-100', avatar_text: 'text-green-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 33, nome: 'MARIA DO CARMO LIMA VIEIRA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 34, nome: 'MARIA JOSÉLIA GOIS', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 35, nome: 'MARIA JOSINETE DO NASCIMENTO COSTA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-teal-100', avatar_text: 'text-teal-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 36, nome: 'MARIA LEDA COSTA DE SOUSA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 37, nome: 'MARIA MARLENE SILVEIRA COSTA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-emerald-100', avatar_text: 'text-emerald-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 38, nome: 'MARIA OLGARINA GALDINO DE SOUSA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-red-100', avatar_text: 'text-red-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 39, nome: 'MARIA PEREIRA ESCÓSSIO SALES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-yellow-100', avatar_text: 'text-yellow-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 40, nome: 'MARIA SALETE FRANÇA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'M', age: '60+ anos' },
    { id: 41, nome: 'PAULO MOURÃO DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-indigo-100', avatar_text: 'text-indigo-700', avatar_letter: 'P', age: '60+ anos' },
    { id: 42, nome: 'RAIMUNDA ALVES SANTIAGO', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-green-100', avatar_text: 'text-green-700', avatar_letter: 'R', age: '60+ anos' },
    { id: 43, nome: 'RAIMUNDO ALDENOR ESCÓSSIO SALES', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-700', avatar_letter: 'R', age: '60+ anos' },
    { id: 44, nome: 'SANTINA MARIA DE JESUS SOUSA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-700', avatar_letter: 'S', age: '60+ anos' },
    { id: 45, nome: 'TEREZA FERREIRA DA SILVA', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-teal-100', avatar_text: 'text-teal-700', avatar_letter: 'T', age: '60+ anos' },
    { id: 46, nome: 'TEREZINHA DE OLIVEIRA BOVWTAIF', grupo: 'GPI', unidade: 'João XXIII', frequencia: ['presente', 'presente', 'presente', 'presente'], status: 'regular', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-700', avatar_letter: 'T', age: '60+ anos' },
  ]);

  // Session Persistence
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    const view = localStorage.getItem('app_view');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      if (view === 'app') {
        setCurrentView('app');
      }
    }
  }, []);

  const handleEnterSystem = () => {
    setCurrentView('login');
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('app');
    localStorage.setItem('user_session', JSON.stringify(userData));
    localStorage.setItem('app_view', 'app');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSection('dashboard');
    setCurrentView('landing');
    localStorage.removeItem('user_session');
    localStorage.removeItem('app_view');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleNavigateToGroup = (section: Section, group: string) => {
    setSelectedGroupFilter(group);
    setActiveSection(section);
  };

  const getHeaderTitle = (section: Section): string => {
    switch (section) {
      case 'dashboard': return 'Painel de Controle';
      case 'diario': return 'Novo Registro';
      case 'grupos': return 'Chamada Digital';
      case 'instrumentais': return 'Instrumentais';
      case 'planejamento': return 'Relatórios';
      case 'beneficiarios': return 'Busca Ativa';
      case 'rede': return 'Rede de Apoio';
      case 'eventos': return 'Eventos';
      default: return 'Gestão PSI';
    }
  };

  const getSubtitle = (section: Section): string => {
    if (section === 'dashboard') return 'Complexos e Espaços Sociais • 29/01/2026';
    if (section === 'diario') return 'Lançamento diário, registro fotográfico e frequência.';
    if (section === 'beneficiarios') return 'Monitoramento de vínculos e gestão de casos.';
    return 'Complexos e Espaços Sociais';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'diario': return <Diario beneficiarios={beneficiariosList} initialGroupFilter={selectedGroupFilter} />;
      case 'grupos': return <Grupos onNavigate={handleNavigateToGroup} />;
      case 'eventos': return <Eventos />;
      case 'rede': return <Rede />;
      case 'instrumentais': return <Instrumentais user={user} />;
      case 'beneficiarios': return (
        <Beneficiarios
          beneficiarios={beneficiariosList}
          setBeneficiarios={setBeneficiariosList}
          initialGroupFilter={selectedGroupFilter}
        />
      );
      case 'planejamento': return <Planejamento />;
      default: return <Dashboard />;
    }
  };

  // RENDER LOGIC

  if (currentView === 'landing') {
    return <LandingPage onEnterSystem={handleEnterSystem} />;
  }

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onBack={handleBackToLanding} />;
  }

  // App View
  return (
    <div className="flex h-screen bg-[#FFFBEB] font-sans overflow-hidden">
      {/* Sidebar on the left (Desktop) */}
      <div className="print:hidden h-full hidden md:block">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
        />
      </div>

      {/* Bottom Nav (Mobile) */}
      <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 print:overflow-visible print:h-auto print:block pb-20 md:pb-0">
        <div className="print:hidden">
          <Header
            title={getHeaderTitle(activeSection)}
            subtitle={getSubtitle(activeSection)}
            user={user}
          />
        </div>

        {/* [NEW] Dev Tool: Data Seeder Trigger */}
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowSeeder(true)}
            className="fixed bottom-4 right-4 z-50 bg-slate-800 text-white p-3 rounded-full shadow-xl hover:bg-slate-700 transition"
            title="Abrir Ferramentas de Admin"
          >
            <i className="fa-solid fa-database"></i>
          </button>
        )}

        {/* [NEW] Data Seeder Modal */}
        {showSeeder && <DataSeeder />}

        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 print:p-0 print:overflow-visible">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;
