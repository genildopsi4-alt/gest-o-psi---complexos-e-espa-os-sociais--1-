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
import { Section, Beneficiario, UserProfile } from './types';

type AppView = 'landing' | 'login' | 'app';

const App: React.FC = () => {
  // View State Management
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  // Lifted state for Beneficiarios to ensure persistence across navigation
  const [beneficiariosList, setBeneficiariosList] = useState<Beneficiario[]>([
    {
      id: 1,
      nome: 'Maria da Silva (Dona Maria)',
      responsavel: 'Neta (Joana)',
      grupo: 'GPI',
      unidade: 'João XXIII',
      frequencia: ['falta', 'falta', 'falta', 'futuro'],
      status: 'busca_ativa',
      avatar_bg: 'bg-red-200',
      avatar_text: 'text-red-700',
      avatar_letter: 'M',
      age: '68 anos'
    },
    {
      id: 2,
      nome: 'Pedro Henrique',
      grupo: 'GAP',
      unidade: 'Curió',
      frequencia: ['presente', 'presente', 'falta', 'presente'],
      status: 'regular',
      avatar_bg: 'bg-blue-100',
      avatar_text: 'text-blue-700',
      avatar_letter: 'P',
      age: '15 anos'
    },
    {
      id: 3,
      nome: 'Lucas Oliveira',
      grupo: 'GAP',
      unidade: 'João XXIII',
      frequencia: ['presente', 'presente', 'presente', 'presente'],
      status: 'regular',
      avatar_bg: 'bg-green-100',
      avatar_text: 'text-green-700',
      avatar_letter: 'L',
      age: '14 anos'
    }
  ]);

  const handleEnterSystem = () => {
    setCurrentView('login');
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSection('dashboard');
    setCurrentView('landing');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
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
      case 'diario': return <Diario beneficiarios={beneficiariosList} />;
      case 'grupos': return <Grupos />;
      case 'eventos': return <Eventos />;
      case 'rede': return <Rede />;
      case 'instrumentais': return <Instrumentais user={user} />;
      case 'beneficiarios': return (
        <Beneficiarios
          beneficiarios={beneficiariosList}
          setBeneficiarios={setBeneficiariosList}
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
      {/* Sidebar on the left */}
      <div className="print:hidden h-full">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 print:overflow-visible print:h-auto print:block">
        <div className="print:hidden">
          <Header
            title={getHeaderTitle(activeSection)}
            subtitle={getSubtitle(activeSection)}
            user={user}
          />
        </div>
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 print:p-0 print:overflow-visible">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;
