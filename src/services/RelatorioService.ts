import { supabase } from './supabase';
import { Atendimento, Beneficiario } from '../../types';
import { getUnidades } from './mockData'; // Using the service function instead of constants

// Tipo para o objeto de dados salvo (compatível com a tabela 'atendimentos')
export interface AtendimentoDB {
    unidade: string;
    tipo_acao: string; // 'interna' | 'rede' | 'tecnica'
    atividade_especifica: string;
    data_registro: string;
    qtd_participantes: number;
    act_sessao?: number | null;
    compaz_metodologia?: string | null;
    fotos_urls: string[]; // URLs das imagens (storage ou base64 se pequeno)
    observacoes: string;
    // Relations managed via separate table 'presencas' usually, but here simplifying for payload
    participantes_ids?: number[];
}

export const RelatorioService = {
    // 1. Salvar Atendimento (Data Logging)
    async saveAtendimento(data: AtendimentoDB, participantes: Beneficiario[]) {
        try {
            console.log("💾 Salvando Atendimento (Supabase)...", data);

            // A. Salvar Atendimento
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

            if (atendimento && participantes.length > 0) {
                // B. Salvar Presenças (Vínculo)
                const presencas = participantes.map(p => ({
                    atendimento_id: atendimento.id,
                    beneficiario_id: p.id,
                    presente: true // Assumindo presença se estã no array
                }));

                const { error: presencaError } = await supabase
                    .from('presencas')
                    .insert(presencas);

                if (presencaError) console.error("Erro ao salvar presenças:", presencaError);
            }

            console.log("✅ Atendimento Salvo com Sucesso!");
            return { success: true, id: atendimento.id };

        } catch (error) {
            console.error("❌ Erro ao salvar atendimento:", error);
            console.warn("⚠️ Usando fallback local (log apenas)");
            // Em produção poderia salvar em localStorage para retry
            return { success: false, error };
        }
    },

    // 2. Buscar Dados para Relatório (Query por Período)
    async getRelatorioData(startDate: string, endDate: string, unidadeFilter?: string) {
        try {
            // Construir Query
            let query = supabase
                .from('atendimentos')
                .select(`
                    *,
                    presencas (
                        beneficiario_id,
                        beneficiarios ( nome, grupo, status )
                    )
                `)
                .gte('data_registro', startDate)
                .lte('data_registro', endDate)
                .order('data_registro', { ascending: true });

            if (unidadeFilter && unidadeFilter !== 'todas') {
                query = query.eq('unidade', unidadeFilter);
            }

            const { data, error } = await query;

            if (error) throw error;

            return data || [];

        } catch (error) {
            console.error("Erro ao buscar dados do relatório:", error);
            return []; // Retorna vazio em caso de erro para não quebrar UI
        }
    },

    // 3. Buscar Unidades (Para consolidação Admin)
    async getUnidades() {
        const { data, error } = await supabase.from('unidades').select('*');
        if (error) {
            console.error('Error fetching units:', error);
            return [];
        }
        return data || [];
    }
};
