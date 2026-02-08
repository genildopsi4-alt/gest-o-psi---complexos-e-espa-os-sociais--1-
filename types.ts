
export type Section = 'dashboard' | 'diario' | 'grupos' | 'eventos' | 'rede' | 'beneficiarios' | 'planejamento' | 'instrumentais';

export interface UserProfile {
    id?: string;
    name: string;
    role: 'admin' | 'tecnico' | 'Psicólogo Social' | string;
    crp: string;
    qualificacoes: string[];
    unit?: string;
    avatar?: string;
}

export interface Unidade {
    id: number;
    nome: string;
    full_name?: string;
    tipo: 'CSMI' | 'Espaço Social';
    bairro: string;
    address?: string; // Endereço completo
    email?: string;   // E-mail da unidade
    last_activity_date?: string; // Para o alerta de inatividade
}

export interface Atendimento {
    id: number;
    unidade_id: number;
    psicologo_id: string; // CRP ou ID do user
    tipo_grupo: 'GAP' | 'GPI' | 'ACT' | 'GFA' | 'Individual';
    data_atendimento: string;
    presenca_count: number;
    encaminhamento_tipo?: string;
}

export interface RedeItem {
    id: number;
    nome: string;
    tipo: string;
    lat: number;
    lng: number;
    regiao: 'joao23' | 'curio' | 'cristo' | 'todas';
    endereco: string;
}

export interface Beneficiario {
    id: number;
    nome: string;
    responsavel?: string;
    grupo: string;
    unidade: string;
    frequencia: ('presente' | 'falta' | 'futuro')[];
    status: 'regular' | 'busca_ativa';
    avatar_bg: string;
    avatar_text: string;
    avatar_letter: string;
    age?: string;
}

export interface Evento {
    id: number;
    data: string;
    titulo: string;
    local: string;
    publico: string;
    responsavel: string;
}

export interface AtividadePlanejada {
    id: number;
    tipo: 'rede' | 'interna' | 'comunitaria' | 'atendimento_crise'; // Updated for SGE-MI
    tipoLabel: string;
    data: string; // "DD/MM" or full date string
    dia?: number; // Day of the month for calendar
    titulo: string;
    descricao: string;
    responsavel: string;
    color: 'blue' | 'emerald' | 'amber' | 'red' | 'purple'; // Expanded colors
    publicoEstimado?: number; // New field
    status?: 'planejado' | 'realizado' | 'cancelado'; // New field
    unidade?: string; // New field
}
