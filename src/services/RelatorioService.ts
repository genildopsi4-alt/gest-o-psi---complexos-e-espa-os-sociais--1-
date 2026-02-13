import { supabase } from './supabase';
import { Atendimento, Beneficiario, AtividadePlanejada } from '../../types';

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

export const RelatorioService = {

    // Internal Helper: Save to LocalStorage
    saveToLocalStorage(record: any) {
        try {
            const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
            let data = existing ? JSON.parse(existing) : [];
            if (!Array.isArray(data)) data = [];
            data.push(record);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            console.log("💾 Salvo no LocalStorage:", record);
        } catch (e) {
            console.error("Erro ao salvar no localStorage:", e);
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
            this.saveToLocalStorage({ ...data, id: atendimento.id, created_at: new Date().toISOString(), source: 'supabase' });

            return { success: true, id: atendimento.id };

        } catch (error) {
            console.warn("⚠️ Falha no Supabase. Usando LocalStorage Fallback.", error);

            const localId = Date.now();
            const localRecord = { ...data, id: localId, created_at: new Date().toISOString(), source: 'local' };
            this.saveToLocalStorage(localRecord);

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

    // 3. Buscar Unidades
    async getUnidades() {
        const { data, error } = await supabase.from('unidades').select('*');

        const defaultUnits = [
            { id: 1, nome: 'CSMI João XXIII', tipo: 'CSMI' },
            { id: 2, nome: 'CSMI Cristo Redentor', tipo: 'CSMI' },
            { id: 3, nome: 'CSMI Curió', tipo: 'CSMI' },
            { id: 4, nome: 'CSMI Barbalha', tipo: 'CSMI' },
            // Espaços Sociais
            { id: 5, nome: 'CRAS João XXIII', tipo: 'Espaço Social' },
            { id: 6, nome: 'CREAS Regional', tipo: 'Espaço Social' },
            { id: 7, nome: 'Centro de Convivência', tipo: 'Espaço Social' },
            { id: 8, nome: 'Espaço Mais Infância', tipo: 'Espaço Social' }
        ];

        if (!error && data && data.length > 0) {
            // Merge or return DB data. Ideally DB mirrors this.
            // For now, if DB lacks 'tipo', we might need to map it.
            // But let's assume if DB exists, use it.
            // To be safe for the "Real Data" request which explicitly asked for these categories:
            // We will append Espaços if they are missing from DB names.
            const dbNames = data.map((u: any) => u.nome);
            const missing = defaultUnits.filter(u => !dbNames.includes(u.nome));
            return [...data, ...missing];
        }

        return defaultUnits;
    }
};
