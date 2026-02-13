import React, { useState } from 'react';
import { supabase } from '../src/services/supabase';

const DataSeeder: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const unidades = [
        { id: 1, nome: 'CSMI João XXIII', tipo: 'CSMI', bairro: 'João XXIII' },
        { id: 2, nome: 'CSMI Cristo Redentor', tipo: 'CSMI', bairro: 'Cristo Redentor' },
        { id: 3, nome: 'CSMI Curió', tipo: 'CSMI', bairro: 'Curió' },
        { id: 4, nome: 'CSMI Barbalha', tipo: 'CSMI', bairro: 'Barbalha' }
    ];

    const grupos = ['GPI', 'GAP', 'ACT', 'GFA'];

    const seedUnidades = async () => {
        setStatus(prev => prev + '\nVerificando unidades...');
        for (const u of unidades) {
            const { error } = await supabase.from('unidades').select('*').eq('id', u.id).single();
            if (error && error.code === 'PGRST116') {
                const { error: insertError } = await supabase.from('unidades').insert(u);
                if (!insertError) setStatus(prev => prev + `\n✅ Unidade criada: ${u.nome}`);
                else setStatus(prev => prev + `\n❌ Erro ao criar unidade ${u.nome}: ${insertError.message}`);
            } else {
                setStatus(prev => prev + `\nℹ️ Unidade já existe: ${u.nome}`);
            }
        }
    };

    const seedBeneficiarios = async () => {
        setStatus(prev => prev + '\nCriando beneficiários...');
        const nomes = ['Maria', 'Jose', 'Ana', 'Francisco', 'Antonia', 'Paulo', 'Adriana', 'Carlos', 'Fernanda', 'Luiz'];
        const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'];

        for (let i = 0; i < 20; i++) { // Reduzido para testar rápido
            const nomeCompleto = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`;
            const unidade = unidades[Math.floor(Math.random() * unidades.length)];
            const grupo = grupos[Math.floor(Math.random() * grupos.length)];

            await supabase.from('beneficiarios').insert({
                nome: nomeCompleto,
                grupo: grupo,
                unidade: unidade.nome,
                status: 'regular',
                avatar_bg: 'bg-blue-100',
                avatar_text: 'text-blue-700',
                avatar_letter: nomeCompleto[0]
            });
        }
        setStatus(prev => prev + '\n✅ 20 Beneficiários criados com sucesso!');
    };

    const seedAtendimentos = async () => {
        setStatus(prev => prev + '\nGerando histórico de atendimentos...');
        const today = new Date();

        for (let i = 0; i < 50; i++) { // 50 registros
            const daysAgo = Math.floor(Math.random() * 60); // Últimos 60 dias
            const date = new Date(today);
            date.setDate(date.getDate() - daysAgo);

            const unidade = unidades[Math.floor(Math.random() * unidades.length)];
            const grupo = grupos[Math.floor(Math.random() * grupos.length)];
            const qtd = Math.floor(Math.random() * 15) + 5;

            const { error } = await supabase.from('atendimentos').insert({
                unidade: unidade.nome,
                unidade_id: unidade.id,
                tipo_acao: 'Grupo',
                atividade_especifica: `Encontro ${grupo}`,
                data_registro: date.toISOString().split('T')[0],
                qtd_participantes: qtd,
                observacoes: 'Registro automático de teste (DataSeeder)'
            });

            if (error) console.error('Erro ao inserir atendimento:', error);
        }
        setStatus(prev => prev + '\n✅ 50 Atendimentos gerados com sucesso!');
    };

    const handleSeed = async () => {
        setLoading(true);
        setStatus('🚀 Iniciando processo de povoamento do banco de dados...\n');
        try {
            await seedUnidades();
            await seedBeneficiarios();
            await seedAtendimentos();
            setStatus(prev => prev + '\n\n🏁 PROCESSO CONCLUÍDO COM SUCESSO! Recarregue a página.');
        } catch (error: any) {
            console.error(error);
            setStatus(prev => prev + `\n\n💀 ERRO FATAL: ${error.message || 'Erro desconhecido'}`);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <i className="fa-solid fa-database text-indigo-600"></i>
                        Data Seeder
                    </h2>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">ADMIN TOOL</span>
                </div>

                <p className="mb-6 text-sm text-slate-500 leading-relaxed">
                    Esta ferramenta irá <strong>popular o seu banco de dados Supabase</strong> com dados fictícios para teste (Unidades, Beneficiários e Atendimentos).
                    <br /><br />
                    ⚠️ Use com cautela. Não apaga dados existentes, apenas adiciona novos.
                </p>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 h-64 overflow-y-auto mb-6 shadow-inner">
                    <pre className="text-green-400 font-mono text-[10px] whitespace-pre-wrap leading-tight">
                        {status || '> Aguardando comando...'}
                    </pre>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:text-red-500 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSeed}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-play"></i>}
                        {loading ? 'Processando...' : 'Executar Seeder'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataSeeder;
