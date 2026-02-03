import React, { useState } from 'react';
import { UserProfile } from '../types';

interface InstrumentaisProps {
    user: UserProfile | null;
}

type InstrumentalType = 'planejamento' | 'escuta' | 'cadastro' | 'frequencia' | 'relatorio' | 'visita_domiciliar' | 'encaminhamento' | 'ci';

const Instrumentais: React.FC<InstrumentaisProps> = ({ user }) => {
    const [activeInstrumental, setActiveInstrumental] = useState<InstrumentalType>('planejamento');

    // Helper para gerar a assinatura em texto (para tabelas/textareas)
    const getSignatureText = () => {
        if (!user) return "PROFISSIONAL RESPONSÁVEL\n(Assinatura)";
        return `${user.name.toUpperCase()}\n${user.role.toUpperCase()}\nCRP: ${user.crp}`;
    };

    const signatureText = getSignatureText();

    // Helper para renderizar o bloco de assinatura do profissional (Estilo Rodapé)
    const ProfessionalSignatureBlock = () => (
        <div className="text-center">
            {/* Espaço para a assinatura física */}
            <div className="h-8"></div>
            <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
            <div className="text-[10px] uppercase font-bold leading-tight text-black">
                {user ? (
                    <>
                        <p>{user.name}</p>
                        <p>{user.role}</p>
                        <p>CRP: {user.crp}</p>
                        <p className="mt-1">Fortaleza - Ceará</p>
                    </>
                ) : (
                    <p>PSICÓLOGO(A) RESPONSÁVEL</p>
                )}
            </div>
        </div>
    );

    const renderInstrumental = () => {
        switch (activeInstrumental) {
            case 'planejamento':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-8">
                            {/* Título da Tabela */}
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Planejamento Mensal
                            </div>

                            {/* Linhas de Dados */}
                            <TableRow label="Tema:" content="Carnaval da alegria" contentInput />
                            <TableRow label="Subtema:" content="Ritmos, fantasias e tradições." contentInput />
                            <TableRow label="Área de Atuação:" content={user?.role || "Psicologia Social"} contentInput />
                            <TableRow label="Unidade/Equipamento:" content="Complexo Social Mais Infância - Cristo Redentor" contentInput />
                            <TableRow label="Endereço:" content="Rua Camélia, 450 - Cristo Redentor" contentInput />
                            <TableRow label="OSC Executora:" content="Centro de Formação e Inclusão Social Nossa Senhora de Fátima" contentInput />
                            <TableRow label="Mês/Ano:" content="FEVEREIRO/2026" contentInput />
                        </div>

                        {/* Tabela de Atividades */}
                        <div className="border-2 border-black mb-4">
                            <div className="grid grid-cols-12 divide-x-2 divide-black bg-blue-200 border-b-2 border-black text-center text-[10px] font-bold uppercase leading-tight">
                                <div className="col-span-1 p-2 flex items-center justify-center">Data/<br />Horário</div>
                                <div className="col-span-2 p-2 flex items-center justify-center">Atividade</div>
                                <div className="col-span-4 p-2 flex items-center justify-center">Metodologia</div>
                                <div className="col-span-2 p-2 flex items-center justify-center">Recursos</div>
                                <div className="col-span-2 p-2 flex items-center justify-center">Público Alvo</div>
                                <div className="col-span-1 p-2 flex items-center justify-center">Profissional</div>
                            </div>

                            {/* Linha 1 (Editável) */}
                            <div className="grid grid-cols-12 divide-x-2 divide-black border-b border-black text-xs">
                                <div className="col-span-1 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center bg-transparent" defaultValue={"03/02\n09:00h"}></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none font-bold bg-transparent" defaultValue="“Painel coletivo de carnaval.”"></textarea>
                                </div>
                                <div className="col-span-4 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-[11px] leading-snug bg-transparent text-justify" defaultValue={"Objetivo: Estimular a socialização e memória afetiva.\n\nA atividade terá início com roda de conversa sobre o significado do Carnaval. Na sequência, construção coletiva de painel temático com desenhos e colagens."}></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-[11px] bg-transparent" defaultValue="Cartolina, tesoura, cola, lápis de cor."></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center font-bold text-[10px] bg-transparent" defaultValue="GRUPO DA PESSOA IDOSA (GPI)"></textarea>
                                </div>
                                <div className="col-span-1 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center font-bold text-[9px] bg-transparent" defaultValue={signatureText}></textarea>
                                </div>
                            </div>

                            {/* Linha 2 (Editável) */}
                            <div className="grid grid-cols-12 divide-x-2 divide-black border-b border-black text-xs bg-slate-50">
                                <div className="col-span-1 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center bg-transparent" defaultValue={"05/02\n09:00h"}></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none font-bold bg-transparent" defaultValue="Jogo “Quem Sou Eu?”"></textarea>
                                </div>
                                <div className="col-span-4 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-[11px] leading-snug bg-transparent text-justify" defaultValue={"Objetivo: Estimular memória e raciocínio lógico.\n\nIdosos organizados em círculo. Cada um recebe um cartão na testa e deve adivinhar sua identidade fazendo perguntas de \"sim\" ou \"não\"."}></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-[11px] bg-transparent" defaultValue="Cartões com imagens impressas."></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center font-bold text-[10px] bg-transparent" defaultValue="GRUPO DA PESSOA IDOSA (GPI)"></textarea>
                                </div>
                                <div className="col-span-1 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center font-bold text-[9px] bg-transparent" defaultValue={signatureText}></textarea>
                                </div>
                            </div>

                            {/* Linha 3 (Vazia para preenchimento) */}
                            <div className="grid grid-cols-12 divide-x-2 divide-black border-b border-black text-xs">
                                <div className="col-span-1 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-center bg-transparent" placeholder="Data"></textarea></div>
                                <div className="col-span-2 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none font-bold bg-transparent" placeholder="Atividade"></textarea></div>
                                <div className="col-span-4 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-[11px] leading-snug bg-transparent" placeholder="Descreva a metodologia..."></textarea></div>
                                <div className="col-span-2 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-[11px] bg-transparent" placeholder="Recursos"></textarea></div>
                                <div className="col-span-2 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-center font-bold text-[10px] bg-transparent" placeholder="Público Alvo"></textarea></div>
                                <div className="col-span-1 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-center font-bold text-[9px] bg-transparent" placeholder="Resp."></textarea></div>
                            </div>
                        </div>

                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'escuta':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-6">
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Agenda de Escuta Qualificada
                            </div>
                            <TableRow label="Nome do Usuário:" contentInput />
                            <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
                                <div className="flex">
                                    <div className="bg-blue-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">DATA/HORA:</div>
                                    <input className="w-full p-2 outline-none text-sm bg-white" type="datetime-local" />
                                </div>
                                <div className="flex">
                                    <div className="bg-blue-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">UNIDADE:</div>
                                    <select className="w-full p-2 outline-none text-sm bg-white">
                                        <option>João XXIII</option>
                                        <option>Cristo Redentor</option>
                                        <option>Curió</option>
                                        <option>Barbalha</option>
                                        <option>Quintino Cunha</option>
                                        <option>Barra do Ceará</option>
                                        <option>Dias Macedo</option>
                                    </select>
                                </div>
                            </div>
                            <TableRow label="Encaminhado por:" contentInput />
                        </div>

                        <div className="space-y-0 border-2 border-black mb-8">
                            <TextAreaBlock label="1. DEMANDA INICIAL / QUEIXA PRINCIPAL" height="h-32" />
                            <TextAreaBlock label="2. EVOLUÇÃO TÉCNICA / INTERVENÇÃO (PROTEÇÃO SOCIAL)" height="h-64" />
                            <TextAreaBlock label="3. ENCAMINHAMENTOS / ACORDOS" height="h-32" />
                        </div>

                        <div className="grid grid-cols-2 gap-20 mt-12 mb-8 items-end">
                            <div className="text-center">
                                <div className="h-8"></div>
                                <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                                <p className="text-[10px] uppercase font-bold text-black">BENEFICIÁRIO</p>
                            </div>
                            <ProfessionalSignatureBlock />
                        </div>

                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'cadastro':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-6">
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Ficha de Inscrição - Grupos de Convivência
                            </div>
                            <TableRow label="Nome Completo:" contentInput />
                            <div className="grid grid-cols-3 divide-x divide-black border-b border-black">
                                <div className="flex col-span-2">
                                    <div className="bg-blue-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">NASCIMENTO:</div>
                                    <input type="date" className="w-full p-1 outline-none" />
                                </div>
                                <div className="flex col-span-1">
                                    <div className="bg-blue-200 w-20 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">SEXO:</div>
                                    <select className="w-full p-1 outline-none"><option>M</option><option>F</option></select>
                                </div>
                            </div>
                            <TableRow label="Endereço:" contentInput />
                            <TableRow label="Nome do Responsável:" contentInput />
                            <div className="flex border-b border-black">
                                <div className="bg-blue-200 w-48 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center text-red-700">GRUPO DE INSERÇÃO:</div>
                                <select className="w-full p-2 outline-none font-bold text-sm">
                                    <option>GAP (Grupo de Adolescentes Participativos)</option>
                                    <option>GPI (Grupo da Pessoa Idosa)</option>
                                    <option>GFA (Grupo de Famílias Atípicas)</option>
                                    <option>ACT (Parentalidade)</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-2 border-black p-4 mb-8 text-justify text-xs leading-relaxed">
                            <p className="font-bold mb-2 uppercase">Termo de Declaração:</p>
                            <p>Declaro ter ciência de que o Complexo Social Mais Infância é um equipamento de Proteção Social Básica. Autorizo a participação nas atividades de fortalecimento de vínculos e o uso de imagem para fins institucionais da Secretaria de Proteção Social (SPS).</p>
                        </div>

                        <div className="mt-12 mb-8 text-center">
                            <div className="border-t border-black w-1/2 mx-auto mb-1"></div>
                            <p className="text-[10px] uppercase font-bold text-black">BENEFICIÁRIO</p>
                        </div>

                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'frequencia':
                return (
                    <DocumentContainer landscape>
                        <SPSHeader />
                        <div className="border-2 border-black mb-4">
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Diário de Frequência Mensal
                            </div>
                            <div className="grid grid-cols-3 divide-x divide-black border-b border-black">
                                <div className="flex"><div className="bg-blue-200 px-2 py-1 text-xs font-bold border-r border-black w-24">GRUPO:</div><input className="w-full px-2 outline-none uppercase font-bold" /></div>
                                <div className="flex"><div className="bg-blue-200 px-2 py-1 text-xs font-bold border-r border-black w-24">MÊS/ANO:</div><input className="w-full px-2 outline-none uppercase font-bold" /></div>
                                <div className="flex"><div className="bg-blue-200 px-2 py-1 text-xs font-bold border-r border-black w-24">TÉCNICO:</div><input className="w-full px-2 outline-none uppercase font-bold" defaultValue={user?.name} /></div>
                            </div>
                        </div>

                        <table className="w-full border-collapse border border-black text-[10px]">
                            <thead>
                                <tr>
                                    <th className="border border-black bg-blue-200 w-8">Nº</th>
                                    <th className="border border-black bg-blue-200 text-left pl-2">NOME DO PARTICIPANTE</th>
                                    {Array.from({ length: 31 }, (_, i) => <th key={i} className="border border-black bg-blue-200 w-5">{i + 1}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 15 }, (_, i) => (
                                    <tr key={i}>
                                        <td className="border border-black text-center bg-slate-50">{i + 1}</td>
                                        <td className="border border-black"><input className="w-full h-full px-1 outline-none uppercase" /></td>
                                        {Array.from({ length: 31 }, (_, j) => <td key={j} className="border border-black text-center"></td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-2 text-[10px] font-bold">Legenda: P (Presente) | F (Falta) | J (Justificada)</div>
                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'relatorio':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-6">
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Relatório Mensal de Atividades
                            </div>
                            <TableRow label="Unidade:" content="Complexo Social Mais Infância" />
                            <TableRow label="Mês de Referência:" contentInput />
                            <TableRow label="Técnico Responsável:" content={user?.name || ''} contentInput />
                        </div>

                        <div className="border-2 border-black mb-6">
                            <TextAreaBlock label="1. RESUMO DAS ATIVIDADES REALIZADAS" height="h-48" noBorder />
                            <div className="border-t-2 border-black"></div>
                            <TextAreaBlock label="2. ANÁLISE QUALITATIVA / IMPACTOS OBSERVADOS" height="h-48" noBorder />
                            <div className="border-t-2 border-black"></div>
                            <TextAreaBlock label="3. DIFICULDADES E ENCAMINHAMENTOS" height="h-32" noBorder />
                        </div>
                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'visita_domiciliar':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-6">
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Relatório de Visita Domiciliar
                            </div>
                            <TableRow label="Beneficiário:" contentInput />
                            <TableRow label="Endereço:" contentInput />
                            <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
                                <div className="flex"><div className="bg-blue-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">DATA DA VISITA:</div><input type="date" className="w-full p-1 outline-none" /></div>
                                <div className="flex"><div className="bg-blue-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">MOTIVO:</div><input className="w-full p-1 outline-none" placeholder="Busca Ativa / Acompanhamento" /></div>
                            </div>
                        </div>
                        <div className="border-2 border-black mb-6">
                            <TextAreaBlock label="RELATO DA VISITA E OBSERVAÇÕES TÉCNICAS" height="h-96" noBorder />
                        </div>
                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'encaminhamento':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-8 p-8">
                            <h2 className="text-center font-bold text-xl uppercase underline mb-8">GUIA DE ENCAMINHAMENTO</h2>

                            <div className="mb-6 text-sm leading-loose">
                                <p><strong>De:</strong> Complexo Social Mais Infância (SPS)</p>
                                <div className="flex items-end gap-2">
                                    <strong>Para:</strong>
                                    <input className="flex-1 border-b border-black outline-none px-2 font-bold uppercase" placeholder="Nome da Instituição Destino (Ex: CRAS, CAPS...)" />
                                </div>
                            </div>

                            <div className="mb-6 text-sm leading-loose">
                                <p>Encaminhamos o(a) Sr(a) <input className="w-3/4 border-b border-black outline-none font-bold uppercase" />, residente em <input className="w-full border-b border-black outline-none" />, para:</p>
                            </div>

                            <div className="border border-black p-4 h-64 mb-6">
                                <p className="text-xs font-bold mb-2 text-gray-500 uppercase">MOTIVO / HISTÓRICO BREVE:</p>
                                <textarea className="w-full h-full resize-none outline-none font-serif italic"></textarea>
                            </div>

                            <p className="text-center text-sm font-bold mt-12">Atenciosamente,</p>
                            <div className="mt-4 mb-4 text-center">
                                <div className="w-1/2 mx-auto">
                                    <ProfessionalSignatureBlock />
                                </div>
                            </div>
                        </div>
                        <SPSFooter />
                    </DocumentContainer>
                );

            case 'ci':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="px-8 py-4">
                            <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-8">
                                <h1 className="text-2xl font-black uppercase">Comunicação Interna</h1>
                                <p className="font-bold">Nº ______ / 2026</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex"><span className="font-bold w-20">PARA:</span> <input className="flex-1 border-b border-gray-400 outline-none" /></div>
                                <div className="flex"><span className="font-bold w-20">DE:</span> <input className="flex-1 border-b border-gray-400 outline-none" defaultValue={user ? `${user.name} (${user.role})` : ''} /></div>
                                <div className="flex"><span className="font-bold w-20">ASSUNTO:</span> <input className="flex-1 border-b border-gray-400 outline-none font-bold uppercase" /></div>
                            </div>
                            <textarea className="w-full h-[500px] resize-none outline-none text-justify leading-relaxed p-4 border border-gray-300"></textarea>

                            <div className="mt-4 mb-4 text-center">
                                <div className="w-1/3 mx-auto">
                                    <ProfessionalSignatureBlock />
                                </div>
                            </div>
                        </div>
                        <SPSFooter />
                    </DocumentContainer>
                );

            default: return null;
        }
    };

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-orange-50/50 min-h-full">
            <div className="mb-8 border-b-2 border-orange-200 pb-4 overflow-x-auto print:hidden">
                <div className="flex bg-white p-1.5 rounded-2xl border border-orange-100 shadow-sm min-w-max gap-2">
                    <InstrumentalTab label="Planejamento" active={activeInstrumental === 'planejamento'} onClick={() => setActiveInstrumental('planejamento')} icon="fa-calendar-days" />
                    <InstrumentalTab label="Escuta Qualificada" active={activeInstrumental === 'escuta'} onClick={() => setActiveInstrumental('escuta')} icon="fa-ear-listen" />
                    <InstrumentalTab label="Ficha Inscrição" active={activeInstrumental === 'cadastro'} onClick={() => setActiveInstrumental('cadastro')} icon="fa-address-card" />
                    <InstrumentalTab label="Frequência" active={activeInstrumental === 'frequencia'} onClick={() => setActiveInstrumental('frequencia')} icon="fa-list-check" />
                    <InstrumentalTab label="Relatório Mensal" active={activeInstrumental === 'relatorio'} onClick={() => setActiveInstrumental('relatorio')} icon="fa-file-invoice" />
                    <InstrumentalTab label="Visita Domiciliar" active={activeInstrumental === 'visita_domiciliar'} onClick={() => setActiveInstrumental('visita_domiciliar')} icon="fa-house-circle-check" />
                    <InstrumentalTab label="Encaminhamento" active={activeInstrumental === 'encaminhamento'} onClick={() => setActiveInstrumental('encaminhamento')} icon="fa-share-nodes" />
                    <InstrumentalTab label="C.I Interna" active={activeInstrumental === 'ci'} onClick={() => setActiveInstrumental('ci')} icon="fa-envelope-open-text" />
                </div>
            </div>
            {renderInstrumental()}
        </section>
    );
};

/* --- Componentes Padronizados SPS (Lei 17.380) --- */

const DocumentContainer: React.FC<{ children: React.ReactNode, landscape?: boolean }> = ({ children, landscape }) => (
    <div className={`mx-auto bg-white shadow-xl rounded-sm p-8 md:p-12 font-sans text-black animate-fade-in print:shadow-none print:p-0 border border-gray-100 ${landscape ? 'max-w-[1400px]' : 'max-w-[210mm] min-h-[297mm]'}`}>
        {children}
    </div>
);

const SPSHeader: React.FC = () => (
    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black px-4">
        <img src="/logo-sps.png" alt="SPS - Secretaria da Proteção Social" className="h-16 object-contain" />
        <img src="/logo-mais-infancia-new.png" alt="Mais Infância Ceará" className="h-20 object-contain" />
    </div>
);

const SPSFooter: React.FC = () => (
    <footer className="mt-auto pt-2 border-t-[3px] border-black text-sm print:fixed print:bottom-0 print:left-0 print:w-full print:bg-white print:px-8 print:pb-8">
        <p className="font-bold">Complexo Mais Infância Padre Caetano Cristo Redentor</p>
        <p>Endereço: Rua Camélia, 450 - Cristo Redentor, Fortaleza - CE.</p>
        <p>E-mail: complexocristoredentor@sps.ce.gov.br</p>
        <button className="print:hidden mt-4 bg-teal-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-teal-700 shadow-lg transition transform hover:-translate-y-1" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i> Imprimir Documento
        </button>
    </footer>
);

const TableRow: React.FC<{ label: string; content?: string; contentInput?: boolean }> = ({ label, content, contentInput }) => (
    <div className="flex border-b border-black last:border-b-0">
        <div className="bg-blue-200 w-48 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">
            {label}
        </div>
        <div className="flex-1 p-2 text-sm">
            {contentInput ? (
                <input className="w-full h-full outline-none bg-transparent" defaultValue={content} />
            ) : (
                content
            )}
        </div>
    </div>
);

const TextAreaBlock: React.FC<{ label: string, height: string, noBorder?: boolean }> = ({ label, height, noBorder }) => (
    <div className={noBorder ? "" : "border-b border-black last:border-b-0"}>
        <div className="bg-blue-200 p-1 text-center font-bold text-[10px] uppercase border-b border-black text-black">
            {label}
        </div>
        <textarea className={`w-full ${height} p-2 outline-none resize-none text-sm`}></textarea>
    </div>
);

const InstrumentalTab: React.FC<{ label: string; active: boolean; onClick: () => void; icon: string }> = ({ label, active, onClick, icon }) => (
    <button onClick={onClick} className={`flex items-center gap-2 py-2 px-4 text-[11px] font-black uppercase transition-all rounded-xl border-2 ${active ? 'bg-teal-500 text-white border-teal-500 shadow-md' : 'bg-white text-slate-500 border-transparent hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100'}`}>
        <i className={`fa-solid ${icon}`}></i> {label}
    </button>
);

export default Instrumentais;
