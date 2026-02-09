import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { RelatorioService } from '../src/services/RelatorioService';
import TimeSlider from './TimeSlider';
import ProfileFilter, { mockProfessionals } from './ProfileFilter';

interface InstrumentaisProps {
    user: UserProfile | null;
}

type InstrumentalType = 'planejamento' | 'triagem' | 'escuta' | 'orientacao' | 'cadastro' | 'frequencia' | 'relatorio' | 'visita_domiciliar' | 'encaminhamento' | 'ci';

const unitMap: Record<string, { name: string; address: string; email: string }> = {
    "CSMI João XXIII": {
        name: "Complexo Social Mais Infância João XXIII",
        address: "Rua Araguaiana, 77 - João XXIII, Fortaleza - CE",
        email: "complexojoho23@sps.ce.gov.br"
    },
    "CSMI Cristo Redentor": {
        name: "Complexo Social Mais Infância Cristo Redentor",
        address: "Rua Camélia, 450 - Cristo Redentor, Fortaleza - CE",
        email: "complexocristoredentor@sps.ce.gov.br"
    },
    "CSMI Curió": {
        name: "Complexo Social Mais Infância Curió",
        address: "Rua Eduardo Campos, s/n - Curió, Fortaleza - CE",
        email: "complexocurio@sps.ce.gov.br"
    },
    "CSMI Barbalha": {
        name: "Complexo Social Mais Infância Barbalha",
        address: "Av. Perimetral Leste, s/n - Barbalha - CE",
        email: "complexobarbalha@sps.ce.gov.br"
    },
    "Espaço Social Quintino Cunha": {
        name: "Espaço Social Quintino Cunha",
        address: "Rua Ilha do Bote, 334 - Quintino Cunha",
        email: "espacoquintino@sps.ce.gov.br"
    },
    "Espaço Social Barra do Ceará": {
        name: "Espaço Social Barra do Ceará",
        address: "Rua G, 100 - Barra do Ceará",
        email: "espacobarra@sps.ce.gov.br"
    },
    "Espaço Social Dias Macedo": {
        name: "Espaço Social Dias Macedo",
        address: "Rua C, 50 - Dias Macedo",
        email: "espacodiasmacedo@sps.ce.gov.br"
    }
};

const Instrumentais: React.FC<InstrumentaisProps> = ({ user }) => {
    const [activeInstrumental, setActiveInstrumental] = useState<InstrumentalType>('planejamento');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);

    const [reportTotals, setReportTotals] = useState({ total: 0, coletivas: 0, rede: 0 });
    const [reportData, setReportData] = useState<any[]>([]);

    useEffect(() => {
        if (activeInstrumental === 'relatorio') {
            const today = currentDate;
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            RelatorioService.getRelatorioData(firstDay, lastDay, undefined, selectedProfessional || undefined).then(data => {
                setReportData(data);
                // Calculate Totals
                const total = data.length;
                const coletivas = data.filter((i: any) => i.tipo_acao === 'interna' || i.tipo_acao === 'comunitaria').length;
                const rede = data.filter((i: any) => i.tipo_acao === 'rede').length;
                setReportTotals({ total, coletivas, rede });
            });
        }
    }, [activeInstrumental]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // Simulate Upload Process
            alert(`📸 Iniciando digitalização de: ${file.name}\n\nO arquivo será enviado automaticamente para a pasta 'Relatórios 2026' no Google Drive.`);
        }
    };

    const defaultUnit = unitMap["CSMI Cristo Redentor"];
    const currentUnit = user?.unit && unitMap[user.unit] ? unitMap[user.unit] : defaultUnit;

    const getSignatureText = () => {
        if (!user) return "PROFISSIONAL RESPONSÁVEL\n(Assinatura)";
        return `${user.name.toUpperCase()}\n${user.role.toUpperCase()}\nCRP: ${user.crp}`;
    };

    const signatureText = getSignatureText();

    const ProfessionalSignatureBlock = () => {
        let name = user?.name;
        let role = user?.role;
        let crp = user?.crp;

        if (selectedProfessional) {
            const prof = mockProfessionals.find(p => p.id === selectedProfessional);
            if (prof) {
                name = prof.name;
                role = prof.role;
                crp = prof.crp;
            }
        }

        return (
            <div className="text-center">
                <div className="h-8"></div>
                <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                <div className="text-[10px] uppercase font-bold leading-tight text-black">
                    {name ? (
                        <>
                            <p>{name}</p>
                            <p>{role}</p>
                            <p>CRP: {crp}</p>
                            <p className="mt-1">Fortaleza - Ceará</p>
                        </>
                    ) : (
                        <p>PSICÓLOGO(A) RESPONSÁVEL</p>
                    )}
                </div>
            </div>
        );
    };

    const renderInstrumental = () => {
        switch (activeInstrumental) {
            case 'planejamento':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-8">
                            <div className="bg-blue-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Planejamento Mensal
                            </div>
                            <TableRow label="Tema:" content="Carnaval da alegria" contentInput />
                            <TableRow label="Subtema:" content="Ritmos, fantasias e tradições." contentInput />
                            <TableRow label="Área de Atuação:" content={user?.role || "Psicologia Social"} contentInput />
                            <TableRow label="Unidade/Equipamento:" content={currentUnit.name} contentInput />
                            <TableRow label="Endereço:" content={currentUnit.address} contentInput />
                            <TableRow label="OSC Executora:" content="Centro de Formação e Inclusão Social Nossa Senhora de Fátima" contentInput />
                            <TableRow label="Mês/Ano:" content={`${currentDate.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()}/${currentDate.getFullYear()}`} contentInput />
                        </div>

                        <div className="border-2 border-black mb-4">
                            <div className="grid grid-cols-12 divide-x-2 divide-black bg-blue-200 border-b-2 border-black text-center text-[10px] font-bold uppercase leading-tight">
                                <div className="col-span-1 p-2 flex items-center justify-center">Data/<br />Horário</div>
                                <div className="col-span-3 p-2 flex items-center justify-center">Atividade</div>
                                <div className="col-span-4 p-2 flex items-center justify-center">Metodologia</div>
                                <div className="col-span-2 p-2 flex items-center justify-center">Público Alvo</div>
                                <div className="col-span-2 p-2 flex items-center justify-center">Técnico Responsável</div>
                            </div>

                            <div className="grid grid-cols-12 divide-x-2 divide-black border-b border-black text-xs">
                                <div className="col-span-1 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center bg-transparent" defaultValue={"03/02\n09:00h"}></textarea>
                                </div>
                                <div className="col-span-3 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none font-bold bg-transparent" defaultValue="“Painel coletivo de carnaval.”"></textarea>
                                </div>
                                <div className="col-span-4 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-[11px] leading-snug bg-transparent text-justify" defaultValue={"Objetivo: Estimular a socialização.\n\nRoda de conversa e construção de painel."}></textarea>
                                </div>
                                <div className="col-span-2 p-0">
                                    <textarea className="w-full h-32 p-2 resize-none outline-none text-center font-bold text-[10px] bg-transparent" defaultValue="GPI"></textarea>
                                </div>
                                <div className="col-span-2 p-0 flex items-center justify-center">
                                    <div className="text-[10px] items-center justify-center flex p-2 text-center">{user?.name || 'Genildo Barbosa'}</div>
                                </div>
                            </div>

                            {/* Empty Rows Loop */}
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="grid grid-cols-12 divide-x-2 divide-black border-b border-black text-xs bg-slate-50">
                                    <div className="col-span-1 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-center bg-transparent"></textarea></div>
                                    <div className="col-span-3 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none bg-transparent"></textarea></div>
                                    <div className="col-span-4 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none bg-transparent"></textarea></div>
                                    <div className="col-span-2 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-center bg-transparent"></textarea></div>
                                    <div className="col-span-2 p-0"><textarea className="w-full h-24 p-2 resize-none outline-none text-center bg-transparent"></textarea></div>
                                </div>
                            ))}
                        </div>

                        <SPSFooter unit={currentUnit} />
                    </DocumentContainer>
                );

            // --- ATENDIMENTO INDIVIDUAL: TRIAGEM ---
            case 'triagem':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-6">
                            <div className="bg-yellow-300 border-b border-black p-2 text-center font-bold uppercase text-sm text-black">
                                Ficha de Triagem Simplificada
                            </div>
                            <TableRow label="Nome Completo:" contentInput />
                            <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
                                <div className="flex">
                                    <div className="bg-yellow-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">DATA:</div>
                                    <input className="w-full p-2 outline-none text-sm bg-white" type="date" />
                                </div>
                                <div className="flex">
                                    <div className="bg-yellow-200 w-32 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">TELEFONE:</div>
                                    <input className="w-full p-2 outline-none text-sm bg-white" placeholder="(85) 90000-0000" />
                                </div>
                            </div>
                            <TableRow label="Motivo da Procura:" contentInput />
                        </div>

                        <div className="space-y-0 border-2 border-black mb-8">
                            <TextAreaBlock label="BREVE RELATO / DEMANDA APRESENTADA" height="h-48" />
                            <TextAreaBlock label="OBSERVAÇÕES DO TÉCNICO" height="h-32" />
                        </div>

                        <div className="grid grid-cols-2 gap-20 mt-12 mb-8 items-end">
                            <div className="text-center">
                                <div className="h-8"></div>
                                <div className="border-t border-black w-3/4 mx-auto mb-1"></div>
                                <p className="text-[10px] uppercase font-bold text-black">BENEFICIÁRIO / RESPONSÁVEL</p>
                            </div>
                            <ProfessionalSignatureBlock />
                        </div>

                        <SPSFooter unit={currentUnit} />
                    </DocumentContainer>
                );

            // --- ATENDIMENTO INDIVIDUAL: ESCUTA QUALIFICADA ---
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
                                        <option>{currentUnit.name}</option>
                                        <option>CSMI João XXIII</option>
                                        <option>CSMI Cristo Redentor</option>
                                        <option>CSMI Curió</option>
                                        <option>CSMI Barbalha</option>
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

                        <SPSFooter unit={currentUnit} />
                    </DocumentContainer>
                );

            // --- ATENDIMENTO INDIVIDUAL: ORIENTAÇÕES ---
            case 'orientacao':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-8 p-8 bg-white">
                            <h2 className="text-center font-bold text-xl uppercase underline mb-8">REGISTRO DE ORIENTAÇÃO TÉCNICA</h2>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="flex gap-2">
                                    <strong>Data:</strong>
                                    <input type="date" className="border-b border-black outline-none flex-1" />
                                </div>
                                <div className="flex gap-2">
                                    <strong>Beneficiário:</strong>
                                    <input className="border-b border-black outline-none flex-1 uppercase" />
                                </div>
                            </div>

                            <div className="border border-black p-4 mb-6 min-h-[400px]">
                                <p className="text-xs font-bold mb-2 text-gray-500 uppercase">DESCRIÇÃO DA ORIENTAÇÃO PRESTADA:</p>
                                <textarea className="w-full h-[360px] resize-none outline-none text-justify leading-relaxed font-sans"></textarea>
                            </div>

                            <div className="mt-8 text-center">
                                <div className="w-1/2 mx-auto">
                                    <ProfessionalSignatureBlock />
                                </div>
                            </div>
                        </div>
                        <SPSFooter unit={currentUnit} />
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
                            <p>Declaro ter ciência de que o {currentUnit.name} é um equipamento de Proteção Social Básica. Autorizo a participação nas atividades de fortalecimento de vínculos e o uso de imagem para fins institucionais da Secretaria de Proteção Social (SPS).</p>
                        </div>

                        <div className="mt-12 mb-8 text-center">
                            <div className="border-t border-black w-1/2 mx-auto mb-1"></div>
                            <p className="text-[10px] uppercase font-bold text-black">BENEFICIÁRIO</p>
                        </div>

                        <SPSFooter unit={currentUnit} />
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
                        <SPSFooter unit={currentUnit} />
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
                            <TableRow label="Unidade:" content={currentUnit.name} />
                            <TableRow label="Mês de Referência:" contentInput />
                            <TableRow label="Técnico Responsável:" content={user?.name || ''} contentInput />
                        </div>

                        <div className="border-2 border-black mb-6">
                            {/* INDICADORES (NOVO) */}
                            <div className="grid grid-cols-3 divide-x-2 divide-black border-b-2 border-black">
                                <div className="p-4 text-center">
                                    <p className="text-[10px] font-bold uppercase mb-1">Total Atendimentos</p>
                                    <p className="text-3xl font-black">{reportTotals.total}</p>
                                </div>
                                <div className="p-4 text-center bg-blue-50">
                                    <p className="text-[10px] font-bold uppercase mb-1">Ações Coletivas</p>
                                    <p className="text-3xl font-black text-blue-700">{reportTotals.coletivas}</p>
                                </div>
                                <div className="p-4 text-center bg-green-50">
                                    <p className="text-[10px] font-bold uppercase mb-1">Articulação Rede</p>
                                    <p className="text-3xl font-black text-green-700">{reportTotals.rede}</p>
                                </div>
                            </div>

                            <TextAreaBlock label="1. RESUMO DAS ATIVIDADES REALIZADAS" height="h-32" noBorder />
                            <div className="border-t-2 border-black"></div>
                            <TextAreaBlock label="2. ANÁLISE QUALITATIVA / IMPACTOS OBSERVADOS" height="h-32" noBorder />
                            <div className="border-t-2 border-black"></div>
                            <TextAreaBlock label="3. DIFICULDADES E ENCAMINHAMENTOS" height="h-24" noBorder />
                        </div>

                        {/* MOSTRUÁRIO DE ATIVIDADES (NOVO) */}
                        {reportData.map((item, index) => (
                            <div key={index} className="border-2 border-black mb-8 break-inside-avoid bg-white shadow-sm">
                                {/* Header do Card */}
                                <div className="bg-slate-100 border-b-2 border-black p-2 text-center">
                                    <p className="font-bold text-xs uppercase tracking-widest mb-1 text-slate-500">ATIVIDADES</p>
                                    <p className="font-black text-base uppercase">RELATÓRIO MENSAL DE ATIVIDADES DA PSICOLOGIA {new Date().getFullYear()}</p>
                                </div>

                                {/* Tabela de Informações */}
                                <div className="text-xs">
                                    <div className="flex border-b border-black">
                                        <div className="bg-blue-200 w-32 p-2 font-bold border-r border-black flex-shrink-0 flex items-center">Unidade:</div>
                                        <div className="p-2 font-bold uppercase flex-1">{item.unidade}</div>
                                    </div>
                                    <div className="flex border-b border-black">
                                        <div className="bg-blue-200 w-32 p-2 font-bold border-r border-black flex-shrink-0 flex items-center">Endereço:</div>
                                        <div className="p-2 flex-1">{unitMap[item.unidade]?.address || 'Endereço não cadastrado'}</div>
                                    </div>
                                    <div className="flex border-b border-black">
                                        <div className="bg-blue-200 w-32 p-2 font-bold border-r border-black flex-shrink-0 flex items-center">Objetivo:</div>
                                        <div className="p-2 flex-1 font-medium">{item.atividade_especifica.replace(/_/g, " ").toUpperCase()}</div>
                                    </div>
                                    <div className="flex border-b border-black">
                                        <div className="bg-blue-200 w-32 p-2 font-bold border-r border-black flex-shrink-0 flex items-center">Data:</div>
                                        <div className="p-2 flex-1 font-bold">{item.data_registro.split('-').reverse().join('/')}</div>
                                    </div>
                                    <div className="flex border-b border-black">
                                        <div className="bg-blue-200 w-32 p-2 font-bold border-r border-black flex-shrink-0 flex items-center">Téc. Responsável:</div>
                                        <div className="p-2 flex-1">{user?.name || 'Técnico Responsável'}</div>
                                    </div>
                                    <div className="flex border-b border-black">
                                        <div className="bg-blue-200 w-32 p-2 font-bold border-r border-black flex-shrink-0 flex items-center">Público Alvo:</div>
                                        <div className="p-2 flex-1">Beneficiários do Complexo</div>
                                    </div>
                                </div>

                                {/* Foto */}
                                <div className="border-b border-black p-2 flex justify-center bg-slate-50 min-h-[250px] items-center">
                                    {item.fotos_urls && item.fotos_urls.length > 0 ? (
                                        <img src={item.fotos_urls[0]} alt="Registro da Atividade" className="max-h-[300px] max-w-full object-contain rounded shadow-sm border border-slate-200" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                            <i className="fa-regular fa-image text-4xl mb-2"></i>
                                            <p className="text-xs italic font-medium">Sem registro fotográfico anexado.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Descrição */}
                                <div className="p-4 bg-white text-xs leading-relaxed text-justify">
                                    <span className="font-black mr-2 uppercase text-slate-700">Descrição:</span>
                                    <span className="font-medium text-slate-800">{item.observacoes || "Nenhuma descrição registrada para esta atividade."}</span>
                                </div>
                            </div>
                        ))}
                        <SPSFooter unit={currentUnit} />
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
                        <SPSFooter unit={currentUnit} />
                    </DocumentContainer>
                );

            case 'encaminhamento':
                return (
                    <DocumentContainer>
                        <SPSHeader />
                        <div className="border-2 border-black mb-8 p-8">
                            <h2 className="text-center font-bold text-xl uppercase underline mb-8">GUIA DE ENCAMINHAMENTO</h2>

                            <div className="mb-6 text-sm leading-loose">
                                <p><strong>De:</strong> {currentUnit.name} (SPS)</p>
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
                        <SPSFooter unit={currentUnit} />
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
                        <SPSFooter unit={currentUnit} />
                    </DocumentContainer>
                );

            default: return null;
        }
    };

    return (
        <section className="p-4 md:p-8 animate-fade-in bg-orange-50/50 min-h-full">
            {/* GLOBAL FILTERS */}
            <div className="mb-8 print:hidden space-y-4">
                <TimeSlider currentDate={currentDate} onDateChange={setCurrentDate} />
                <ProfileFilter selectedProfessionalId={selectedProfessional} onSelectProfessional={setSelectedProfessional} />
            </div>
            <div className="mb-4 flex justify-between items-center px-2 print:hidden">
                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Menu de Instrumentais</span>
                <label className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition transform active:scale-95">
                    <i className="fa-solid fa-camera animate-pulse sm:animate-none"></i>
                    <span className="font-bold text-[10px] uppercase tracking-wider">Digitalizar (Drive)</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>
            <div className="mb-8 border-b-2 border-orange-200 pb-4 overflow-x-auto print:hidden">
                <div className="flex bg-white p-2 rounded-2xl border border-orange-100 shadow-sm min-w-max gap-2 items-center">

                    <InstrumentalTab label="Planejamento" active={activeInstrumental === 'planejamento'} onClick={() => setActiveInstrumental('planejamento')} icon="fa-calendar-days" />

                    {/* SEPARADOR: ATENDIMENTO INDIVIDUAL */}
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <div className="flex flex-col gap-1 items-center px-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Atendimento Individual</span>
                        <div className="flex gap-2">
                            <InstrumentalTab label="Triagem" active={activeInstrumental === 'triagem'} onClick={() => setActiveInstrumental('triagem')} icon="fa-filter" color="yellow" />
                            <InstrumentalTab label="Escuta Qualificada" active={activeInstrumental === 'escuta'} onClick={() => setActiveInstrumental('escuta')} icon="fa-ear-listen" color="blue" />
                            <InstrumentalTab label="Orientações" active={activeInstrumental === 'orientacao'} onClick={() => setActiveInstrumental('orientacao')} icon="fa-circle-info" color="green" />
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2"></div>

                    <InstrumentalTab label="Ficha Inscrição" active={activeInstrumental === 'cadastro'} onClick={() => setActiveInstrumental('cadastro')} icon="fa-address-card" />
                    <InstrumentalTab label="Frequência" active={activeInstrumental === 'frequencia'} onClick={() => setActiveInstrumental('frequencia')} icon="fa-list-check" />
                    <InstrumentalTab label="Relatório Mensal" active={activeInstrumental === 'relatorio'} onClick={() => setActiveInstrumental('relatorio')} icon="fa-file-invoice" />
                    <InstrumentalTab label="Visita" active={activeInstrumental === 'visita_domiciliar'} onClick={() => setActiveInstrumental('visita_domiciliar')} icon="fa-house-circle-check" />
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
        <img src="logo-sps.png" alt="SPS - Secretaria da Proteção Social" className="h-16 object-contain" />
        <img src="mais-infancia-logo.png" alt="Mais Infância Ceará" className="h-20 object-contain" />
    </div>
);

const SPSFooter: React.FC<{ unit: { name: string; address: string; email: string } }> = ({ unit }) => (
    <footer className="mt-auto pt-2 border-t-[3px] border-black text-sm print:fixed print:bottom-0 print:left-0 print:w-full print:bg-white print:px-8 print:pb-8">
        <p className="font-bold">{unit.name}</p>
        <p>Endereço: {unit.address}</p>
        <p>E-mail: celuladegestao@sps.ce.gov.br</p>
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
        <textarea className={`w-full ${height} p-2 outline-none resize-none text-sm font-sans`}></textarea>
    </div>
);

const InstrumentalTab: React.FC<{ label: string; active: boolean; onClick: () => void; icon: string; color?: 'yellow' | 'blue' | 'green' }> = ({ label, active, onClick, icon, color }) => {
    let activeClass = 'bg-teal-500 text-white border-teal-500 shadow-md';

    if (active) {
        if (color === 'yellow') activeClass = 'bg-yellow-400 text-yellow-900 border-yellow-400 shadow-md';
        if (color === 'blue') activeClass = 'bg-blue-500 text-white border-blue-500 shadow-md';
        if (color === 'green') activeClass = 'bg-emerald-500 text-white border-emerald-500 shadow-md';
    }

    return (
        <button onClick={onClick} className={`flex items-center gap-2 py-2 px-4 text-[11px] font-black uppercase transition-all rounded-xl border-2 whitespace-nowrap ${active ? activeClass : 'bg-white text-slate-500 border-transparent hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100'}`}>
            <i className={`fa-solid ${icon}`}></i> {label}
        </button>
    );
};

export default Instrumentais;
