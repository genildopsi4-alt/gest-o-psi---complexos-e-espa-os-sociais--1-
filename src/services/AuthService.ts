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
                    name: 'Genildo Barbosa',
                    role: 'admin',
                    crp: '11/17780',
                    unit: 'CSMI João XXIII',
                    avatar: '/avatars/avatar_01.png',
                    qualificacoes: [
                        'ACT - Parentalidade Positiva',
                        'Círculo de Construção de Paz',
                        'CNV - Comunicação Não Violenta',
                        'Justiça Restaurativa',
                        'Competências Socioemocionais',
                        'Mediação de Conflitos'
                    ]
                },
                error: null
            };
        }


        try {
            // Remove máscara do CPF para busca consistente
            const cleanLoginCpf = cpf.replace(/\D/g, '');
            console.log(`[AuthService] Tentando login para CPF: ${cleanLoginCpf}`);

            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('cpf', cleanLoginCpf)
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
                qualificacoes: data.qualificacoes || []
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
            // Limpa CPF (remove máscara) para armazenar apenas dígitos
            const cleanCpf = userData.cpf.replace(/\D/g, '');
            const finalRole = cleanCpf === '03116882339' ? 'admin' : userData.role;

            console.log('[AuthService] Tentando registrar:', {
                cpf: cleanCpf,
                nome: userData.nome,
                perfil: finalRole,
                unidade: userData.unidade
            });

            const { data, error } = await supabase
                .from('usuarios')
                .insert([
                    {
                        cpf: cleanCpf,
                        senha: userData.senha,
                        nome: userData.nome,
                        crp: userData.crp,
                        unidade: userData.unidade,
                        avatar_url: userData.avatar,
                        perfil: finalRole
                    }
                ])
                .select();

            if (error) {
                console.error('[AuthService] Erro no registro:', error);
                console.error('[AuthService] Código:', error.code, 'Mensagem:', error.message, 'Detalhes:', error.details, 'Hint:', error.hint);

                if (error.code === '23505') {
                    return { success: false, error: 'CPF já cadastrado no sistema.' };
                }
                if (error.code === '42501' || error.message?.includes('policy')) {
                    return { success: false, error: 'Erro de permissão no banco de dados. Verifique as políticas RLS da tabela "usuarios" no Supabase.' };
                }
                if (error.code === '23514') {
                    return { success: false, error: 'Valor inválido para o campo "perfil". Valores aceitos: admin, tecnico, Psicólogo Social.' };
                }
                if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
                    return { success: false, error: 'A tabela "usuarios" não existe no banco de dados. Execute o script SQL de criação.' };
                }
                return { success: false, error: 'Erro ao salvar cadastro: ' + error.message };
            }

            console.log('[AuthService] Registro realizado com sucesso:', data);
            return { success: true, error: null };
        } catch (err: any) {
            console.error('[AuthService] Erro crítico no cadastro:', err);
            if (err.message?.includes('fetch')) {
                return { success: false, error: 'Falha de conexão com a Internet ou Banco de Dados.' };
            }
            return { success: false, error: 'Erro inesperado no cadastro: ' + (err.message || 'Consulte o console.') };
        }
    }
};
