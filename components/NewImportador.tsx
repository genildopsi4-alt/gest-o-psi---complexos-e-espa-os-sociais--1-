import React, { useState, useEffect, useCallback } from 'react';
import { RelatorioService } from '../src/services/RelatorioService';
import { Unidade, RelatorioMensal } from '../types';

interface ImportadorProps {
    onClose: () => void;
    onSuccess: () => void;
}

type ImportStep = 'upload' | 'review' | 'done';

const NewImportador: React.FC<ImportadorProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState<ImportStep>('upload');
    const [units, setUnits] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Extracted data
    const [extractedText, setExtractedText] = useState('');
    const [fileName, setFileName] = useState('');

    // Form Data
    const [selectedUnitId, setSelectedUnitId] = useState<number | ''>('');
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const [qtdAtendimentos, setQtdAtendimentos] = useState<number>(0);

    useEffect(() => {
        const loadUnits = async () => {
            const data = await RelatorioService.getUnidades();
            setUnits(data);
            setLoading(false);
        };
        loadUnits();
    }, []);

    // Try to extract a number from text (heuristic for "atendimentos")
    const extractAtendimentosFromText = useCallback((text: string): number => {
        // Look for patterns like "Total: 45" or "Atendimentos: 123" or just standalone numbers
        const patterns = [
            /(?:total|atendimentos|atendidas|atendidos|benefici[áa]rios)\s*[:=]?\s*(\d+)/i,
            /(\d+)\s*(?:atendimentos|benefici[áa]rios|atendidas|atendidos)/i,
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) return parseInt(match[1]);
        }
        return 0;
    }, []);

    // Try to detect unit name from text
    const detectUnitFromText = useCallback((text: string): number | '' => {
        const lower = text.toLowerCase();
        for (const unit of units) {
            if (lower.includes(unit.nome.toLowerCase())) return unit.id;
            // Also check partial matches
            const parts = unit.nome.split(' ');
            for (const part of parts) {
                if (part.length > 4 && lower.includes(part.toLowerCase())) return unit.id;
            }
        }
        return '';
    }, [units]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        setFileName(file.name);
        setErrorMsg(null);
        setProcessing(true);

        const ext = file.name.split('.').pop()?.toLowerCase();

        try {
            if (ext === 'pdf') {
                await processPDF(file);
            } else if (ext === 'doc' || ext === 'docx' || ext === 'odt') {
                // For Word/ODT files, we can't easily extract text in the browser.
                // Just accept the file and let the user fill in the data manually.
                setExtractedText(`[Documento Word/ODT carregado: ${file.name}]\n\nO conteúdo de arquivos .doc/.docx/.odt não pode ser extraído automaticamente no navegador. Por favor, preencha os dados manualmente abaixo.`);
                setStep('review');
            } else {
                setErrorMsg(`Formato .${ext} não suportado. Use PDF, Word (.doc/.docx) ou ODT.`);
            }
        } catch (err: any) {
            console.error('Erro ao processar arquivo:', err);
            setErrorMsg(null); // Don't show error, just go to manual input
            setExtractedText(`[Não foi possível extrair dados automaticamente de: ${file.name}]\n\nPor favor, preencha os dados manualmente.`);
            setStep('review');
        } finally {
            setProcessing(false);
        }
    };

    const processPDF = async (file: File) => {
        try {
            // Dynamic import to avoid SSR issues
            const pdfjsLib = await import('pdfjs-dist');

            // Set worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let fullText = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }

            setExtractedText(fullText);

            // Try to auto-detect data
            const detectedQtd = extractAtendimentosFromText(fullText);
            if (detectedQtd > 0) setQtdAtendimentos(detectedQtd);

            const detectedUnit = detectUnitFromText(fullText);
            if (detectedUnit !== '') setSelectedUnitId(detectedUnit);

            // Auto-advance to review step
            setStep('review');

        } catch (err: any) {
            console.error('Erro ao ler PDF:', err);
            // Don't block the user — just go to manual input
            setExtractedText(`[PDF carregado: ${file.name}]\n\nNão foi possível extrair o texto automaticamente. Preencha os dados manualmente.`);
            setStep('review');
        }
    };

    const handleSave = async () => {
        if (!selectedUnitId) {
            setErrorMsg('Selecione uma unidade.');
            return;
        }

        const unit = units.find(u => u.id === Number(selectedUnitId));
        if (!unit) return;

        const report: RelatorioMensal = {
            id: `${unit.id}-${selectedMonth}-${selectedYear}`,
            unidadeId: unit.id,
            unidadeNome: unit.nome,
            unidadeTipo: unit.tipo,
            mes: parseInt(selectedMonth) - 1, // JS Month 0-11
            ano: parseInt(selectedYear),
            qtdAtendimentos: Number(qtdAtendimentos),
            timestamp: new Date().toISOString()
        };

        await RelatorioService.saveRelatorioConsolidado(report);
        setStep('done');

        // Auto-close after showing success
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-white">Importar Documento</h2>
                        <p className="text-xs text-teal-100 font-bold uppercase tracking-wider mt-1">
                            PDF • Word (.docx) • ODT — Extração automática
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition text-xl" aria-label="Fechar">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <i className="fa-solid fa-spinner fa-spin text-3xl text-teal-500"></i>
                            <p className="text-xs text-slate-400 font-bold uppercase">Carregando unidades...</p>
                        </div>
                    ) : step === 'done' ? (
                        /* SUCCESS STATE */
                        <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                                <i className="fa-solid fa-check text-4xl text-emerald-600"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-800">Importação Concluída!</h3>
                            <p className="text-sm text-slate-500 text-center">
                                Os dados foram salvos com sucesso e o Dashboard será atualizado.
                            </p>
                        </div>
                    ) : step === 'upload' ? (
                        /* UPLOAD STEP */
                        <div className="space-y-6">
                            {/* Error Message */}
                            {errorMsg && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-sm text-amber-800">
                                    <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                                    <span className="font-medium">{errorMsg}</span>
                                </div>
                            )}

                            {/* File Upload Area */}
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition relative group cursor-pointer ${processing ? 'border-teal-400 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-teal-50/30'}`}>
                                <input
                                    type="file"
                                    title="Selecionar documento (PDF, Word ou ODT)"
                                    accept=".pdf,.doc,.docx,.odt"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={processing}
                                />
                                <div className="pointer-events-none">
                                    {processing ? (
                                        <>
                                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-4 animate-pulse">
                                                <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
                                            </div>
                                            <h3 className="font-bold text-teal-700 text-sm">Processando documento...</h3>
                                            <p className="text-[10px] text-teal-500 mt-1 uppercase font-bold">
                                                Extraindo texto e dados automaticamente
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-4 group-hover:scale-110 transition">
                                                <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                            </div>
                                            <h3 className="font-bold text-slate-700 text-sm">
                                                Clique para selecionar o Relatório
                                            </h3>
                                            <p className="text-[11px] text-slate-400 mt-2 font-bold">
                                                Aceita: <span className="text-teal-600">PDF</span>, <span className="text-blue-600">Word (.doc/.docx)</span>, <span className="text-orange-600">ODT</span>
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                O sistema tentará extrair os dados automaticamente do PDF
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Or manual input */}
                            <div className="text-center">
                                <button
                                    onClick={() => setStep('review')}
                                    className="text-xs text-slate-400 hover:text-teal-600 font-bold uppercase tracking-wider transition"
                                >
                                    <i className="fa-solid fa-keyboard mr-1"></i> Ou preencher manualmente
                                </button>
                            </div>
                        </div>
                    ) : step === 'review' ? (
                        /* REVIEW STEP */
                        <div className="space-y-5 animate-fade-in">

                            {/* File indicator */}
                            {fileName && (
                                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-file-lines text-teal-600 text-sm"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-teal-800 truncate">{fileName}</p>
                                        <p className="text-[10px] text-teal-500">Documento carregado com sucesso</p>
                                    </div>
                                    <i className="fa-solid fa-circle-check text-teal-500"></i>
                                </div>
                            )}

                            {/* Extracted text preview */}
                            {extractedText && (
                                <details className="group">
                                    <summary className="text-[10px] font-black text-slate-400 uppercase cursor-pointer hover:text-teal-600 transition">
                                        <i className="fa-solid fa-eye mr-1"></i> Ver texto extraído
                                    </summary>
                                    <div className="mt-2 bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 max-h-32 overflow-y-auto border border-slate-200 leading-relaxed whitespace-pre-wrap">
                                        {extractedText.slice(0, 1000)}
                                        {extractedText.length > 1000 && '...'}
                                    </div>
                                </details>
                            )}

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Confirme os dados
                                    </span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {errorMsg && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-sm text-amber-800">
                                    <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                                    <span className="font-medium">{errorMsg}</span>
                                </div>
                            )}

                            {/* Unit Selection */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                                    Unidade / Equipamento
                                </label>
                                <select
                                    value={selectedUnitId}
                                    onChange={(e) => { setSelectedUnitId(Number(e.target.value)); setErrorMsg(null); }}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                    title="Selecionar Unidade"
                                >
                                    <option value="">Selecione a Unidade...</option>
                                    <optgroup label="Complexos Sociais (CSMI)">
                                        {units.filter(u => u.tipo === 'CSMI').map(u => (
                                            <option key={u.id} value={u.id}>{u.nome}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Espaços Sociais">
                                        {units.filter(u => u.tipo === 'Espaço Social').map(u => (
                                            <option key={u.id} value={u.id}>{u.nome}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                                        Mês de Referência
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                            className="w-2/3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                            title="Selecionar Mês"
                                        >
                                            <option value="01">Janeiro</option>
                                            <option value="02">Fevereiro</option>
                                            <option value="03">Março</option>
                                            <option value="04">Abril</option>
                                            <option value="05">Maio</option>
                                            <option value="06">Junho</option>
                                            <option value="07">Julho</option>
                                            <option value="08">Agosto</option>
                                            <option value="09">Setembro</option>
                                            <option value="10">Outubro</option>
                                            <option value="11">Novembro</option>
                                            <option value="12">Dezembro</option>
                                        </select>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                            title="Selecionar Ano"
                                        >
                                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Quantity Input */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                                        Total Atendimentos
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={qtdAtendimentos}
                                            onChange={(e) => setQtdAtendimentos(Number(e.target.value))}
                                            className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                            title="Inserir Total de Atendimentos"
                                        />
                                        <i className="fa-solid fa-users absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {step !== 'done' && (
                    <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-between items-center">
                        {step === 'review' && (
                            <button
                                onClick={() => { setStep('upload'); setExtractedText(''); setFileName(''); setErrorMsg(null); }}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
                            >
                                <i className="fa-solid fa-arrow-left"></i> Voltar
                            </button>
                        )}
                        {step === 'upload' && <div></div>}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-200 transition"
                                aria-label="Cancelar Importação"
                            >
                                Cancelar
                            </button>
                            {step === 'review' && (
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-700 transition shadow-lg shadow-teal-200 flex items-center gap-2"
                                    aria-label="Confirmar Importação"
                                >
                                    <i className="fa-solid fa-check"></i> Confirmar
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewImportador;
