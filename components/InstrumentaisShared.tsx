import React from 'react';

export const DocumentContainer: React.FC<{ children: React.ReactNode, landscape?: boolean }> = ({ children, landscape }) => (
    <div className={`mx-auto bg-white shadow-xl rounded-sm p-8 md:p-12 font-sans text-black animate-fade-in print:shadow-none print:p-0 border border-gray-100 ${landscape ? 'max-w-[1400px]' : 'max-w-[210mm] min-h-[297mm]'}`}>
        {children}
    </div>
);

export const SPSHeader: React.FC = () => (
    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black px-4">
        <img src="logo-sps.png" alt="SPS - Secretaria da Proteção Social" className="h-16 object-contain" />
        <img src="mais-infancia-logo.png" alt="Mais Infância Ceará" className="h-20 object-contain" />
    </div>
);

export const SPSFooter: React.FC<{ unit: { name: string; address: string; email: string } }> = ({ unit }) => (
    <footer className="mt-auto pt-2 border-t-[3px] border-black text-sm print:fixed print:bottom-0 print:left-0 print:w-full print:bg-white print:px-8 print:pb-8">
        <p className="font-bold">{unit.name}</p>
        <p>Endereço: {unit.address}</p>
        <p>E-mail: celuladegestao@sps.ce.gov.br</p>
        <button className="print:hidden mt-4 bg-teal-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-teal-700 shadow-lg transition transform hover:-translate-y-1" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i> Imprimir Documento
        </button>
    </footer>
);

export const TableRow: React.FC<{ label: string; content?: string; contentInput?: boolean }> = ({ label, content, contentInput }) => (
    <div className="flex border-b border-black last:border-b-0">
        <div className="bg-blue-200 w-48 p-2 text-xs font-bold border-r border-black flex-shrink-0 flex items-center">
            {label}
        </div>
        <div className="flex-1 p-2 text-sm">
            {contentInput ? (
                <input className="w-full h-full outline-none bg-transparent" defaultValue={content} title={label.replace(':', '')} />
            ) : (
                content
            )}
        </div>
    </div>
);

export const TextAreaBlock: React.FC<{ label: string, height: string, noBorder?: boolean }> = ({ label, height, noBorder }) => (
    <div className={noBorder ? "" : "border-b border-black last:border-b-0"}>
        <div className="bg-blue-200 p-1 text-center font-bold text-[10px] uppercase border-b border-black text-black">
            {label}
        </div>
        <textarea className={`w-full ${height} p-2 outline-none resize-none text-sm font-sans`} title={label}></textarea>
    </div>
);
