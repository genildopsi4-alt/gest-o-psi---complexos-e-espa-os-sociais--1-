import React from 'react';
import { UserProfile, Unidade } from '../types';

interface RelatorioProps {
    user: UserProfile | null;
    unidade?: string;
    month: string;
    data: {
        grupos: {
            nome: string;
            encontros: number;
            beneficiarios: number;
            status: string;
        }[];
        escuta: {
            total: number;
            encaminhamentos: {
                saude: number;
                assistencia: number;
                educacao: number;
            };
        };
        mobilizacao: {
            titulo: string;
            publico: number;
            sintese: string;
        };
        fotos: {
            url: string;
            legenda: string;
            data: string;
        }[];
        parecerGestao?: string;
    };
}

const RelatorioMensalPDF: React.FC<RelatorioProps> = ({ user, unidade, month, data }) => {
    return (
        <div className="hidden print:block font-sans text-xs bg-white text-black p-8 max-w-[210mm] mx-auto">
            {/* --- CABEÇALHO OFICIAL --- */}
            <div className="border border-black mb-6">
                <div className="flex border-b border-black">
                    <div className="w-24 p-2 border-r border-black flex items-center justify-center">
                        {/* Placeholder for Logo */}
                        <div className="text-center font-bold text-[8px]">LOGO SPS</div>
                    </div>
                    <div className="flex-1 p-2 text-center flex flex-col justify-center">
                        <h1 className="font-bold text-lg uppercase">Governo do Estado do Ceará</h1>
                        <h2 className="font-bold text-sm uppercase">Secretaria da Proteção Social - SPS</h2>
                        <h3 className="font-bold text-xs mt-1">Relatório Mensal de Produtividade e Impacto Psicossocial</h3>
                    </div>
                    <div className="w-32 p-2 border-l border-black flex flex-col justify-center text-[10px] font-bold">
                        <span>MÊS REF: {month}</span>
                        <span className="mt-1">ANO: {new Date().getFullYear()}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 text-[10px] uppercase font-bold bg-slate-100">
                    <div className="p-2 border-r border-black border-b border-black">
                        UNIDADE: {unidade || user?.unit || 'Rede Geral'}
                    </div>
                    <div className="p-2 border-b border-black">
                        TÉCNICO RESPONSÁVEL: {user?.role === 'admin' ? 'Genildo Barbosa (Gestor)' : user?.name}
                    </div>
                    <div className="p-2 border-r border-black">
                        FUNÇÃO: {user?.role === 'admin' ? 'Gestor Psicossocial' : 'Psicólogo(a) Social'}
                    </div>
                    <div className="p-2">
                        CRP: {user?.crp}
                    </div>
                </div>
            </div>

            {/* --- 1. METODOLOGIAS DE GRUPO --- */}
            <div className="mb-6">
                <h4 className="font-bold uppercase mb-2 border-b border-black bg-slate-200 p-1 pl-2">1. Consolidação de Grupos e Vínculos</h4>
                <table className="w-full border-collapse border border-black text-[10px]">
                    <thead>
                        <tr className="bg-slate-100 uppercase">
                            <th className="border border-black p-2 text-left">Metodologia / Grupo</th>
                            <th className="border border-black p-2 text-center w-24">Encontros no Mês</th>
                            <th className="border border-black p-2 text-center w-24">Beneficiários Ativos</th>
                            <th className="border border-black p-2 text-center w-32">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.grupos.map((grupo, idx) => (
                            <tr key={idx}>
                                <td className="border border-black p-2 font-bold">{grupo.nome}</td>
                                <td className="border border-black p-2 text-center">{grupo.encontros}</td>
                                <td className="border border-black p-2 text-center">{grupo.beneficiarios}</td>
                                <td className="border border-black p-2 text-center uppercase text-[9px]">{grupo.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- 2. REDE E ESCUTA --- */}
            <div className="mb-6 flex gap-6">
                <div className="flex-1">
                    <h4 className="font-bold uppercase mb-2 border-b border-black bg-slate-200 p-1 pl-2">2. Atendimentos Individuais</h4>
                    <div className="border border-black p-4 text-center">
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Escuta Qualificada (Total)</span>
                        <span className="block text-3xl font-black mt-2">{data.escuta.total}</span>
                        <span className="block text-[9px] mt-1">Atendimentos Realizados</span>
                    </div>
                </div>
                <div className="flex-[2]">
                    <h4 className="font-bold uppercase mb-2 border-b border-black bg-slate-200 p-1 pl-2">3. Articulação de Rede (Encaminhamentos)</h4>
                    <div className="grid grid-cols-3 gap-0 border border-black divide-x divide-black">
                        <div className="p-2 text-center">
                            <span className="block font-bold">SAÚDE</span>
                            <span className="block text-xl font-black mt-1">{data.escuta.encaminhamentos.saude}</span>
                        </div>
                        <div className="p-2 text-center">
                            <span className="block font-bold">ASSISTÊNCIA</span>
                            <span className="block text-xl font-black mt-1">{data.escuta.encaminhamentos.assistencia}</span>
                        </div>
                        <div className="p-2 text-center">
                            <span className="block font-bold">EDUCAÇÃO</span>
                            <span className="block text-xl font-black mt-1">{data.escuta.encaminhamentos.educacao}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 4. MOBILIZAÇÃO COMUNITÁRIA (DIA D) --- */}
            <div className="mb-6">
                <h4 className="font-bold uppercase mb-2 border-b border-black bg-slate-200 p-1 pl-2">4. Mobilização Comunitária (Dia D)</h4>
                <div className="border border-black p-0">
                    <div className="flex border-b border-black">
                        <div className="w-3/4 p-2 border-r border-black">
                            <span className="block font-bold text-[9px] uppercase text-slate-500">Ação Realizada</span>
                            <span className="block font-bold text-sm uppercase">{data.mobilizacao.titulo}</span>
                        </div>
                        <div className="w-1/4 p-2 text-center bg-slate-50">
                            <span className="block font-bold text-[9px] uppercase text-slate-500">Público Atingido</span>
                            <span className="block font-bold text-lg">{data.mobilizacao.publico} Pessoas</span>
                        </div>
                    </div>
                    <div className="p-2 h-32 text-justify text-[10px] leading-relaxed">
                        <span className="block font-bold text-[9px] uppercase text-slate-500 mb-1">Síntese Técnica:</span>
                        {data.mobilizacao.sintese}
                    </div>
                </div>
            </div>

            {/* --- 5. PARECER DO GESTOR --- */}
            {data.parecerGestao && (
                <div className="mb-6 break-inside-avoid">
                    <h4 className="font-bold uppercase mb-2 border-b border-black bg-slate-200 p-1 pl-2">5. Parecer Técnico da Gestão</h4>
                    <div className="border border-black p-4 text-[10px] italic bg-slate-50">
                        <span className="font-bold not-italic mr-1">Parecer:</span>
                        {data.parecerGestao}
                        <div className="mt-4 text-right font-bold uppercase">
                            - Genildo Barbosa (Gestor Psicossocial)
                        </div>
                    </div>
                </div>
            )}

            {/* --- RODAPÉ DE ASSINATURA --- */}
            <div className="mt-12 flex justify-center gap-16 break-inside-avoid">
                <div className="text-center">
                    <div className="w-64 border-t border-black mb-1"></div>
                    <p className="font-bold uppercase">{user?.name}</p>
                    <p className="text-[9px]">Psicólogo(a) Responsável - CRP {user?.crp}</p>
                </div>
                {user?.role === 'admin' ? null : (
                    <div className="text-center">
                        <div className="w-64 border-t border-black mb-1"></div>
                        <p className="font-bold uppercase">Genildo Barbosa</p>
                        <p className="text-[9px]">Gestor Psicossocial - CRP 11/04982</p>
                    </div>
                )}
            </div>

            {/* --- ANEXO FOTOGRÁFICO (QUEBRA DE PÁGINA) --- */}
            {data.fotos && data.fotos.length > 0 && (
                <div className="break-before-page mt-8 pt-8">
                    <h4 className="font-bold uppercase mb-4 border-b-2 border-black pb-2 text-center text-lg">Anexo Fotográfico de Execução</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {data.fotos.map((foto, idx) => (
                            <div key={idx} className="border border-slate-200 p-2 break-inside-avoid">
                                <div className="aspect-video bg-slate-100 mb-2 overflow-hidden flex items-center justify-center">
                                    {/* Image Placeholder if URL fails or just use img tag */}
                                    <img src={foto.url} alt={`Registro ${idx}`} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-[9px] font-bold uppercase text-center text-slate-600 bg-slate-50 py-1">
                                    {foto.data} - {foto.legenda}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatorioMensalPDF;
