import { supabase } from './supabase';
import { Atendimento, Beneficiario, AtividadePlanejada, RelatorioMensal, Unidade } from '../../types';

// Tipo para o objeto de dados salvo
export interface AtendimentoDB {
    unidade: string;
    tipo_acao: string;
    atividade_especifica: string;
    data_registro: string;
    qtd_participantes: number;
    act_sessao?: number | null;
    compaz_metodologia?: string | null;
    fotos_urls: string[];
    observacoes: string;
    participantes_ids?: number[];
}

const LOCAL_STORAGE_KEY = 'psi_diario_db';
const CONSOLIDATED_REPORTS_KEY = 'psi_consolidated_reports';

export const RelatorioService = {

    // Internal Helper: Save to LocalStorage
    saveToLocalStorage(key: string, record: any) {
        try {
            const existing = localStorage.getItem(key);
            let data = existing ? JSON.parse(existing) : [];
            if (!Array.isArray(data)) data = [];
            data.push(record);
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Erro ao salvar no localStorage (${key}):`, e);
        }
    },

    // 1. Salvar Atendimento (Fallback LocalStorage)
    async saveAtendimento(data: AtendimentoDB, participantes: Beneficiario[]) {
        try {
            console.log("💾 Tentando salvar no Supabase...", data);

            const { data: atendimento, error: atendimentoError } = await supabase
                .from('atendimentos')
                .insert([{
                    unidade: data.unidade,
                    tipo_acao: data.tipo_acao,
                    atividade_especifica: data.atividade_especifica,
                    data_registro: data.data_registro,
                    qtd_participantes: data.qtd_participantes,
                    act_sessao: data.act_sessao,
                    compaz_metodologia: data.compaz_metodologia,
                    fotos_urls: data.fotos_urls,
                    observacoes: data.observacoes
                }])
                .select()
                .single();

            if (atendimentoError) throw atendimentoError;

            // Salvar presenças se houver
            if (atendimento && participantes.length > 0) {
                const presencas = participantes.map(p => ({
                    atendimento_id: atendimento.id,
                    beneficiario_id: p.id,
                    presente: true
                }));
                const { error: presencaError } = await supabase.from('presencas').insert(presencas);
                if (presencaError) console.error("Erro ao salvar presenças:", presencaError);
            }

            // Backup Local
            this.saveToLocalStorage(LOCAL_STORAGE_KEY, { ...data, id: atendimento.id, created_at: new Date().toISOString(), source: 'supabase' });

            return { success: true, id: atendimento.id };

        } catch (error) {
            console.warn("⚠️ Falha no Supabase. Usando LocalStorage Fallback.", error);

            const localId = Date.now();
            const localRecord = { ...data, id: localId, created_at: new Date().toISOString(), source: 'local' };
            this.saveToLocalStorage(LOCAL_STORAGE_KEY, localRecord);

            return { success: true, id: localId, local: true };
        }
    },

    // 2. Buscar Dados para Relatório (Supabase + LocalStorage)
    async getRelatorioData(startDate: string, endDate: string, unidade?: string, profissional?: string) {
        let supabaseData: any[] = [];
        let localData: any[] = [];

        // A. Tentar Supabase
        try {
            let query = supabase
                .from('atendimentos')
                .select(`*, presencas ( beneficiario_id, beneficiarios ( nome, grupo, status ) )`)
                .gte('data_registro', startDate)
                .lte('data_registro', endDate)
                .order('data_registro', { ascending: true });

            if (unidade) {
                query = query.eq('unidade', unidade);
            }

            const { data, error } = await query;
            if (!error && data) {
                supabaseData = data;
            }
        } catch (e) {
            console.error("Erro ao buscar do Supabase:", e);
        }

        // B. Buscar LocalStorage
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            let parsedData = storedData ? JSON.parse(storedData) : [];

            if (Array.isArray(parsedData)) {
                localData = parsedData.filter((item: any) => {
                    const itemDate = new Date(item.data_registro);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return itemDate >= start && itemDate <= end;
                });
            }
        } catch (e) {
            console.error("Erro ao ler LocalStorage:", e);
        }

        return [...supabaseData, ...localData];
    },

    // 3. Buscar Unidades do Supabase (com fallback hardcoded)
    async getUnidades(): Promise<Unidade[]> {
        try {
            const { data, error } = await supabase
                .from('unidades')
                .select('*')
                .order('id', { ascending: true });

            if (!error && data && data.length > 0) {
                console.log('✅ Unidades carregadas do Supabase:', data.length);
                return data.map((u: any) => ({
                    id: u.id,
                    nome: u.nome,
                    tipo: u.tipo,
                    bairro: u.endereco || u.nome.split(' ').pop() || ''
                }));
            }
        } catch (e) {
            console.warn('⚠️ Falha ao buscar unidades do Supabase, usando fallback local.', e);
        }

        // Fallback hardcoded (caso o banco esteja vazio ou offline)
        return [
            { id: 1, nome: 'CSMI João XXIII', tipo: 'CSMI', bairro: 'João XXIII' },
            { id: 2, nome: 'CSMI Curió', tipo: 'CSMI', bairro: 'Curió' },
            { id: 3, nome: 'CSMI Barbalha', tipo: 'CSMI', bairro: 'Barbalha' },
            { id: 4, nome: 'CSMI Cristo Redentor', tipo: 'CSMI', bairro: 'Cristo Redentor' },
            { id: 5, nome: 'CSMI Quintino Cunha', tipo: 'CSMI', bairro: 'Quintino Cunha' },
            { id: 6, nome: 'Espaço Social Palmeiras', tipo: 'Espaço Social', bairro: 'Palmeiras' },
            { id: 7, nome: 'Espaço Social Prefeito José Walter', tipo: 'Espaço Social', bairro: 'José Walter' },
            { id: 8, nome: 'Espaço Social Jangurussu', tipo: 'Espaço Social', bairro: 'Jangurussu' }
        ];
    },

    // 4. Salvar Relatório Consolidado no Supabase (com backup localStorage)
    async saveRelatorioConsolidado(report: RelatorioMensal) {
        try {
            const { error } = await supabase
                .from('relatorios_consolidados')
                .upsert({
                    id: report.id,
                    unidade_id: report.unidadeId,
                    unidade_nome: report.unidadeNome,
                    unidade_tipo: report.unidadeTipo || '',
                    mes: report.mes,
                    ano: report.ano,
                    qtd_atendimentos: report.qtdAtendimentos,
                    timestamp: report.timestamp || new Date().toISOString()
                }, { onConflict: 'id' });

            if (error) throw error;
            console.log('✅ Relatório Consolidado salvo no Supabase:', report.id);
        } catch (e) {
            console.warn('⚠️ Falha ao salvar no Supabase, salvando no localStorage.', e);
        }

        // Backup localStorage sempre
        const existingJSON = localStorage.getItem(CONSOLIDATED_REPORTS_KEY);
        let reports: RelatorioMensal[] = existingJSON ? JSON.parse(existingJSON) : [];
        reports = reports.filter(r => r.id !== report.id);
        reports.push(report);
        localStorage.setItem(CONSOLIDATED_REPORTS_KEY, JSON.stringify(reports));
    },

    // 5. Buscar Relatórios Consolidados do Supabase (com fallback localStorage)
    async getRelatoriosConsolidados(): Promise<RelatorioMensal[]> {
        try {
            const { data, error } = await supabase
                .from('relatorios_consolidados')
                .select('*')
                .order('timestamp', { ascending: false });

            if (!error && data && data.length > 0) {
                console.log('✅ Relatórios carregados do Supabase:', data.length);
                return data.map((r: any) => ({
                    id: r.id,
                    unidadeId: r.unidade_id,
                    unidadeNome: r.unidade_nome,
                    unidadeTipo: r.unidade_tipo,
                    mes: r.mes,
                    ano: r.ano,
                    qtdAtendimentos: r.qtd_atendimentos,
                    timestamp: r.timestamp
                }));
            }
        } catch (e) {
            console.warn('⚠️ Falha ao buscar do Supabase, usando localStorage.', e);
        }

        // Fallback localStorage
        const existingJSON = localStorage.getItem(CONSOLIDATED_REPORTS_KEY);
        return existingJSON ? JSON.parse(existingJSON) : [];
    }
};
