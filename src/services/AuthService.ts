import { supabase } from './supabase';
import { UserProfile } from '../../types';

export const AuthService = {

    async login(cpf: string, senha: string): Promise<{ user: UserProfile | null, error: string | null }> {
        // ✅ [NOVA LÓGICA] Acesso Mestre para o Gestor Genildo (PRIORIDADE MÁXIMA)
        // Funciona mesmo sem banco de dados ou usuário cadastrado
        const cleanCpf = cpf.replace(/\D/g, '');
        if (cleanCpf === '03116882339' && senha === 'gestor') {
            return {
                user: {
                    id: cleanCpf,
                    name: 'Genildo (Gestor)',
                    role: 'admin',
                    crp: '00/0000',
                    unit: 'Gestão Central',
                    avatar: '/avatars/avatar_01.png',
                    qualificacoes: []
                },
                error: null
            };
        }


        try {
            console.log(`[AuthService] Tentando login para CPF: ${cpf}`);

            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('cpf', cpf)
                .single();

            // 1. Erro de Conexão ou Consulta
            if (error) {
                console.error('[AuthService] Erro do Supabase:', error);

                // Código 'PGRST116' significa que a query .single() não retornou linhas (usuário não encontrado)
                if (error.code === 'PGRST116') {
                    return { user: null, error: 'CPF não encontrado no sistema.' };
                }

                // Erros genéricos de conexão
                return {
                    user: null,
                    error: `Erro de conexão com o servidor. (Cód: ${error.code || 'Desconhecido'})`
                };
            }

            // 2. Erro de Dados (Data é nulo por algum motivo raro)
            if (!data) {
                console.error('[AuthService] Dados retornaram vazios.');
                return { user: null, error: 'Usuário não encontrado.' };
            }

            // 3. Validação de Senha (Comparação Direta - Texto Plano)
            // IMPORTANTE: O sistema atual usa senha em texto plano na tabela 'usuarios'.
            // Não usa hash/criptografia do Supabase Auth.
            if (data.senha !== senha) {
                console.warn(`[AuthService] Senha incorreta para CPF: ${cpf}`);
                return { user: null, error: 'Senha incorreta.' };
            }

            console.log('[AuthService] Login realizado com sucesso:', data.nome);

            // Map database user to UserProfile
            const user: UserProfile = {
                id: data.cpf,
                name: data.nome,
                role: data.perfil,
                crp: data.crp || '',
                unit: data.unidade || '',
                avatar: data.avatar_url,
                qualificacoes: []
            };

            return { user, error: null };
        } catch (err: any) {
            console.error('[AuthService] Erro crítico (Exception):', err);

            // Tenta identificar erro de rede (fetch failed)
            if (err.message && err.message.includes('fetch')) {
                return { user: null, error: 'Falha de conexão com a Internet ou Banco de Dados.' };
            }

            return { user: null, error: 'Erro inesperado ao realizar login. Consulte o console.' };
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
