import { supabase } from './supabase';
import { Unidade, Atendimento } from '../../types';

export const getUnidades = async (): Promise<Unidade[]> => {
    try {
        const { data, error } = await supabase
            .from('unidades')
            .select('*');

        if (error) {
            console.error('Error fetching unidades:', error);
            return [];
        }

        return data as Unidade[];
    } catch (err) {
        console.error('Unexpected error fetching unidades:', err);
        return [];
    }
};

export const getAtendimentos = async (unidadeId?: number): Promise<Atendimento[]> => {
    try {
        let query = supabase.from('atendimentos').select('*');

        if (unidadeId) {
            query = query.eq('unidade_id', unidadeId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching atendimentos:', error);
            return [];
        }

        return data as Atendimento[];
    } catch (err) {
        console.error('Unexpected error fetching atendimentos:', err);
        return [];
    }
};

// Keep mocks temporarily if needed, but the user asked to replace them.
// I will not export MOCK_UNIDADES or MOCK_ATENDIMENTOS anymore to enforce usage of real data.
