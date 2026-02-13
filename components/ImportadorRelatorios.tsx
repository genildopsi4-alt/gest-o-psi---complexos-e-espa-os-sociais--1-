import React, { useState, useRef } from 'react';
import { extractDataFromPDF, ExtractedData } from '../src/utils/PDFParser';
import { RelatorioService, AtendimentoDB } from '../src/services/RelatorioService';
import { Unidade } from '../types';

interface ImportadorRelatoriosProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ImportadorRelatorios: React.FC<ImportadorRelatoriosProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState<'upload' | 'preview'>('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

    // Editable Fields State
    const [unidade, setUnidade] = useState('');
    const [listaUnidades, setListaUnidades] = useState<Unidade[]>([]);
    const [qtdParticipantes, setQtdParticipantes] = useState<number>(0);
    const [dataAtividade, setDataAtividade] = useState('');
    const [atividade, setAtividade] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    React.useEffect(() => {
        const loadUnidades = async () => {
            const data = await RelatorioService.getUnidades();
            setListaUnidades(data);
        };
        loadUnidades();
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await extractDataFromPDF(file);
            console.log("Extracted Data:", data);

            setExtractedData(data);

            // Populate Fields
            setUnidade(data.metadata.unidade || '');
            setDataAtividade(data.metadata.data || new Date().toISOString().split('T')[0]);
            setObservacoes(data.text.substring(0, 500) + '...'); // Preview of text

            // Select all images by default (limit to 10 to avoid performance issues)
            setSelectedImages(data.images.slice(0, 10));

            setStep('preview');
        } catch (err) {
            console.error(err);
            setError("Falha ao ler o arquivo PDF. Verifique se é um arquivo válido.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!unidade || !dataAtividade) {
            setError("Por favor, preencha os campos obrigatórios (Unidade e Data).");
            return;
        }

        setIsLoading(true);

        const novoAtendimento: AtendimentoDB = {
            unidade,
            tipo_acao: 'interna', // Default fallback
            atividade_especifica: atividade || 'Importado de PDF',
            data_registro: dataAtividade,
            qtd_participantes: Number(qtdParticipantes),
            fotos_urls: selectedImages,
            observacoes: `[IMPORTADO VIA PDF]\n\n${observacoes}`
        };

        try {
            // We pass an empty participants array for now as PDF parsing for table data is complex
            const result = await RelatorioService.saveAtendimento(novoAtendimento, []);

            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError("Erro ao salvar no banco de dados.");
            }
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro inesperado ao salvar.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleImageSelection = (imgSrc: string) => {
        if (selectedImages.includes(imgSrc)) {
            setSelectedImages(prev => prev.filter(img => img !== imgSrc));
        } else {
            setSelectedImages(prev => [...prev, imgSrc]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl border-2 border-orange-100 overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-orange-500 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Importar Relatório PDF</h2>
                        <p className="text-orange-100 text-xs font-medium">Extração automática de dados e fotos</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-orange-600 w-8 h-8 rounded-full flex items-center justify-center transition" title="Fechar Data Seeder" aria-label="Fechar">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className="p-8">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100 animate-shake">
                            <i className="fa-solid fa-circle-exclamation text-xl"></i>
                            <p className="font-bold text-sm">{error}</p>
                        </div>
                    )}

                    {step === 'upload' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            {isLoading ? (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                                    <p className="font-bold text-slate-500 animate-pulse">Analisando documento e extraindo imagens...</p>
                                </div>
                            ) : (
                                <div
                                    className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] p-16 text-center hover:bg-orange-50/50 hover:border-orange-200 transition cursor-pointer group w-full max-w-lg"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        title="Selecionar arquivo PDF"
                                        aria-label="Selecionar arquivo PDF"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="w-20 h-20 bg-white text-orange-500 rounded-3xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition duration-500">
                                            <i className="fa-solid fa-file-pdf"></i>
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-slate-700">Clique para carregar PDF</p>
                                            <p className="text-sm font-bold text-slate-400 mt-2">O sistema irá extrair texto e fotos automaticamente.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Form Fields */}
                                <div className="space-y-5">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Dados Identificados</h3>

                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Unidade</label>
                                        <select
                                            value={unidade}
                                            onChange={(e) => setUnidade(e.target.value)}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:border-orange-500 outline-none bg-white"
                                            title="Selecionar Unidade"
                                        >
                                            <option value="">Selecione a Unidade...</option>
                                            {listaUnidades.map(u => (
                                                <option key={u.id} value={u.nome}>{u.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Qtd. Atendimentos</label>
                                        <input
                                            type="number"
                                            value={qtdParticipantes}
                                            onChange={(e) => setQtdParticipantes(Number(e.target.value))}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:border-orange-500 outline-none"
                                            title="Quantidade de Participantes"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Data</label>
                                        <input
                                            type="date"
                                            value={dataAtividade}
                                            onChange={(e) => setDataAtividade(e.target.value)}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:border-orange-500 outline-none"
                                            title="Data da Atividade"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Atividade / Título</label>
                                        <input
                                            type="text"
                                            value={atividade}
                                            onChange={(e) => setAtividade(e.target.value)}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:border-orange-500 outline-none"
                                            placeholder="Nome da atividade"
                                            title="Título da Atividade"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Resumo / Observações</label>
                                        <textarea
                                            value={observacoes}
                                            onChange={(e) => setObservacoes(e.target.value)}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium text-slate-600 focus:border-orange-500 outline-none h-32 text-xs resize-none"
                                            title="Observações e Resumo"
                                        />
                                    </div>
                                </div>

                                {/* Image Selection */}
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Fotos Extraídas ({selectedImages.length} selecionadas)</h3>
                                        <span className="text-[10px] font-bold text-slate-300 bg-slate-100 px-2 py-1 rounded">Clique para desmarcar</span>
                                    </div>

                                    {extractedData && extractedData.images.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {extractedData.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => toggleImageSelection(img)}
                                                    className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${selectedImages.includes(img) ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent opacity-60 grayscale'}`}
                                                >
                                                    <img src={img} className="w-full h-full object-cover" alt={`Extract ${idx}`} />
                                                    {selectedImages.includes(img) && (
                                                        <div className="absolute top-1 right-1 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow">
                                                            <i className="fa-solid fa-check"></i>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                                            <i className="fa-regular fa-image text-3xl text-slate-300 mb-2"></i>
                                            <p className="text-xs font-bold text-slate-400">Nenhuma imagem detectada no PDF.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step === 'preview' && (
                    <div className="bg-slate-50 p-6 flex justify-end gap-3 border-t border-slate-100">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 shadow-lg hover:shadow-orange-500/20 transition flex items-center gap-2"
                        >
                            {isLoading ? 'Salvando...' : (
                                <>
                                    <i className="fa-solid fa-cloud-arrow-up"></i> Confirmar Importação
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportadorRelatorios;
