import { Unidade, Atendimento } from '../../types';

export const MOCK_UNIDADES: Unidade[] = [
    {
        id: 1,
        nome: "CSMI João XXIII",
        full_name: "Complexo Social Mais Infância João XXIII",
        tipo: 'CSMI',
        bairro: "João XXIII",
        address: "Rua Araguaiana, 77 - João XXIII, Fortaleza - CE",
        email: "complexojoho23@sps.ce.gov.br",
        last_activity_date: "2026-02-02"
    },
    {
        id: 2,
        nome: "CSMI Cristo Redentor",
        full_name: "Complexo Social Mais Infância Cristo Redentor",
        tipo: 'CSMI',
        bairro: "Cristo Redentor",
        address: "Rua Camélia, 450 - Cristo Redentor, Fortaleza - CE",
        email: "complexocristoredentor@sps.ce.gov.br",
        last_activity_date: "2026-02-03"
    },
    {
        id: 3,
        nome: "CSMI Curió",
        full_name: "Complexo Social Mais Infância Curió",
        tipo: 'CSMI',
        bairro: "Curió",
        address: "Rua Eduardo Campos, s/n - Curió, Fortaleza - CE",
        email: "complexocurio@sps.ce.gov.br",
        last_activity_date: "2026-02-01"
    },
    {
        id: 4,
        nome: "CSMI Barbalha",
        full_name: "Complexo Social Mais Infância Barbalha",
        tipo: 'CSMI',
        bairro: "Barbalha",
        address: "Av. Perimetral Leste, s/n - Barbalha - CE",
        email: "complexobarbalha@sps.ce.gov.br",
        last_activity_date: "2026-01-25"
    }, // Inactive alert test
    {
        id: 5,
        nome: "Espaço Social Quintino Cunha",
        full_name: "Espaço Social Quintino Cunha",
        tipo: 'Espaço Social',
        bairro: "Quintino Cunha",
        address: "Rua Ilha do Bote, 334 - Quintino Cunha",
        email: "espacoquintino@sps.ce.gov.br",
        last_activity_date: "2026-02-02"
    },
    {
        id: 6,
        nome: "Espaço Social Barra do Ceará",
        full_name: "Espaço Social Barra do Ceará",
        tipo: 'Espaço Social',
        bairro: "Barra do Ceará",
        address: "Rua G, 100 - Barra do Ceará",
        email: "espacobarra@sps.ce.gov.br",
        last_activity_date: "2026-02-03"
    },
    {
        id: 7,
        nome: "Espaço Social Dias Macedo",
        full_name: "Espaço Social Dias Macedo",
        tipo: 'Espaço Social',
        bairro: "Dias Macedo",
        address: "Rua C, 50 - Dias Macedo",
        email: "espacodiasmacedo@sps.ce.gov.br",
        last_activity_date: "2026-02-03"
    }
];

export const MOCK_ATENDIMENTOS: Atendimento[] = [
    // João XXIII
    { id: 1, unidade_id: 1, psicologo_id: "11/04982", tipo_grupo: 'GPI', data_atendimento: "2026-01-15", presenca_count: 15 },
    { id: 2, unidade_id: 1, psicologo_id: "11/04982", tipo_grupo: 'GAP', data_atendimento: "2026-01-20", presenca_count: 22 },
    { id: 3, unidade_id: 1, psicologo_id: "11/04982", tipo_grupo: 'Individual', data_atendimento: "2026-02-01", presenca_count: 1 },

    // Cristo Redentor
    { id: 4, unidade_id: 2, psicologo_id: "11/99999", tipo_grupo: 'ACT', data_atendimento: "2026-01-28", presenca_count: 8 },
    { id: 5, unidade_id: 2, psicologo_id: "11/99999", tipo_grupo: 'GFA', data_atendimento: "2026-02-02", presenca_count: 5 },

    // Barbalha (Pouca atividade)
    { id: 6, unidade_id: 4, psicologo_id: "11/88888", tipo_grupo: 'Individual', data_atendimento: "2026-01-20", presenca_count: 1 },
];

export const getUnidades = (): Promise<Unidade[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_UNIDADES), 500);
    });
};

export const getAtendimentos = (unidadeId?: number): Promise<Atendimento[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (unidadeId) {
                resolve(MOCK_ATENDIMENTOS.filter(a => a.unidade_id === unidadeId));
            } else {
                resolve(MOCK_ATENDIMENTOS); // Admin sees all
            }
        }, 500);
    });
};
