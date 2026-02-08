import { supabase } from './supabase';
import { UserProfile } from '../../types';

export const AuthService = {
    async login(cpf: string, senha: string): Promise<{ user: UserProfile | null, error: string | null }> {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('cpf', cpf)
                .single();

            if (error || !data) {
                return { user: null, error: 'Usuário não encontrado ou erro de conexão.' };
            }


            // ✅ [NOVA LÓGICA] Acesso Mestre para o Gestor Genildo
            // Remove caracteres não numéricos para verificar CPF limpo
            const cleanCpf = cpf.replace(/\D/g, '');
            const isMasterAccess = cleanCpf === '03116882339' && senha === 'gestor';

            // Se for acesso mestre, pula validação de senha
            if (!isMasterAccess) {
                if (data.senha !== senha) {
                    return { user: null, error: 'Senha incorreta.' };
                }
            }

            // Map database user to UserProfile
            const user: UserProfile = {
                id: data.cpf, // Using CPF as ID as requested
                name: data.nome,
                role: data.perfil,
                crp: data.crp || '',
                unit: data.unidade || '',
                avatar: data.avatar_url,
                qualificacoes: [] // Can be expanded later if table supports it
            };

            return { user, error: null };
        } catch (err) {
            console.error(err);
            return { user: null, error: 'Erro inesperado ao realizar login.' };
        }
    },

    async register(userData: {
        nome: string;
        cpf: string;
        crp: string;
        unidade: string;
        senha: string;
        avatar: string;
        role: 'admin' | 'tecnico' | 'Psicólogo Social';
        qualificacoes?: string[];
    }): Promise<{ success: boolean; error: string | null }> {
        try {
            // Force Admin role for specific CPF
            const finalRole = userData.cpf === '031168823-39' ? 'admin' : userData.role;

            const { error } = await supabase
                .from('usuarios')
                .insert([
                    {
                        cpf: userData.cpf,
                        senha: userData.senha,
                        nome: userData.nome,
                        crp: userData.crp,
                        unidade: userData.unidade,
                        avatar_url: userData.avatar,
                        perfil: finalRole
                    }
                ]);

            if (error) {
                console.error('Registration Error:', error);
                if (error.code === '23505') return { success: false, error: 'CPF já cadastrado.' };
                return { success: false, error: 'Erro ao salvar cadastro: ' + error.message };
            }

            return { success: true, error: null };
        } catch (err) {
            console.error(err);
            return { success: false, error: 'Erro inesperado no cadastro.' };
        }
    }
};
