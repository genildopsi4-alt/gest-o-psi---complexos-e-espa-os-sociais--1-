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
    async getRelatorioData(startDate: string, endDate: string, unidadeFilter?: string) {
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
    async getRelatorioData(startDate: string, endDate: string, unidade ?: string, profissional ?: string) {
                try {
                    // Simulate API Call delay
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Load from LocalStorage
                    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                    let data = storedData ? JSON.parse(storedData) : [];

                    // Filter by Date Range
                    data = data.filter((item: any) => {
                        const itemDate = new Date(item.data_registro);
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        return itemDate >= start && itemDate <= end;
                    });
                    // Merge simples (prioriza Supabase, mas adiciona locais que não estão lá - difícil verificar sem IDs compatíveis, vamos concatenar por enquanto marcando a fonte)
                    return [...supabaseData, ...localData];
                },

    // 3. Buscar Unidades
    async getUnidades() {
                    const { data, error } = await supabase.from('unidades').select('*');
                    if (!error && data) return data;
                    return [
                        { id: 1, nome: 'CSMI João XXIII' },
                        { id: 2, nome: 'CSMI Cristo Redentor' },
                        { id: 3, nome: 'CSMI Curió' },
                        { id: 4, nome: 'CSMI Barbalha' }
                    ];
                }
            };
