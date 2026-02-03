
export type Section = 'dashboard' | 'diario' | 'grupos' | 'eventos' | 'rede' | 'beneficiarios' | 'planejamento' | 'instrumentais';

export interface UserProfile {
  name: string;
  role: string;
  crp: string;
  qualificacoes: string[];
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
    tipo: 'rede' | 'interna' | 'comunitaria';
    tipoLabel: string;
    data: string;
    titulo: string;
    descricao: string;
    responsavel: string;
    color: 'blue' | 'emerald' | 'purple';
}
