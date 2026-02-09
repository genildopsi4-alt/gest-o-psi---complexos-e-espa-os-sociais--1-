
import React, { useState } from 'react';
import { DataSyncService } from '../api/DataSyncService';

interface GoogleAuthButtonProps {
    onSyncComplete: (result: any) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSyncComplete }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [status, setStatus] = useState<string>('');

    const handleSync = async () => {
        setIsSyncing(true);
        setStatus('Autenticando...');

        try {
            const isAuthenticated = await DataSyncService.authenticate();
            if (isAuthenticated) {
                setStatus('Buscando arquivos...');
                const files = await DataSyncService.fetchFiles();

                setStatus(`Processando ${files.length} arquivos...`);
                const parsedData = await DataSyncService.parseContent(files);

                setStatus('Sincronizando banco de dados...');
                const result = await DataSyncService.syncToDatabase(parsedData);

                setStatus('Concluído!');
                setTimeout(() => setStatus(''), 2000);
                setTimeout(() => setIsSyncing(false), 2000);

                onSyncComplete(result);
            }
        } catch (error) {
            console.error(error);
            setStatus('Erro na sincronização');
            setTimeout(() => setIsSyncing(false), 2000);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`
                relative overflow-hidden group
                bg-white border-2 border-slate-200 text-slate-600
                font-black uppercase text-[10px] tracking-widest
                py-2 px-4 rounded-xl shadow-sm hover:shadow-md
                transition-all duration-300
                flex items-center gap-2
                ${isSyncing ? 'border-teal-400 text-teal-600' : 'hover:border-teal-400 hover:text-teal-600'}
            `}
        >
            {isSyncing ? (
                <>
                    <i className="fa-solid fa-circle-notch animate-spin text-teal-500"></i>
                    <span>{status}</span>
                </>
            ) : (
                <>
                    <i className="fa-brands fa-google text-slate-400 group-hover:text-teal-500 transition-colors"></i>
                    <span>Sincronizar Nuvem</span>
                </>
            )}

            {/* Neon Effect for Active Sync */}
            {isSyncing && (
                <div className="absolute inset-0 bg-teal-400/10 animate-pulse"></div>
            )}
        </button>
    );
};

export default GoogleAuthButton;
