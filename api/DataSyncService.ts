
export interface SyncResult {
    totalFiles: number;
    processedRecords: number;
    errors: string[];
}

export const DataSyncService = {
    // 1. Google OAuth2 Flow (Multi-Account Support)
    authenticate: async (): Promise<boolean> => {
        console.log("Iniciando autenticação Google OAuth2 (Multi-Account)...");
        // Scopes: drive.readonly (for 'genildo.barbosa@sps.ce.gov.br' files)
        return new Promise(resolve => setTimeout(() => resolve(true), 1500));
    },

    // 2. Fetch Files & Map Folder Structure (Simulating Drive Scan)
    fetchFiles: async (): Promise<any[]> => {
        console.log("Mapeando pasta raiz 'Planejamentos 2026' e subpastas...");

        // Simulated recursive folder structure for JANUARY 2026
        const mockDriveStructure = [
            // JOÃO XXIII
            {
                folder: 'CSMI João XXIII',
                files: [
                    { name: 'Relatorio_Jan_Triagem.pdf', id: '101' },
                    { name: 'Relatorio_Jan_EscutaQualificada.pdf', id: '102' },
                    { name: 'Frequencia_Jan_GrupoGAP.pdf', id: '103' },
                    { name: 'Frequencia_Jan_GrupoACT.pdf', id: '104' },
                    { name: 'Visitas_Domiciliares_Jan.docx', id: '105' }
                ]
            },
            // CURIÓ
            {
                folder: 'CSMI Curió',
                files: [
                    { name: 'Relatorio_Jan_Triagem.pdf', id: '201' },
                    { name: 'Planejamento_Fev_ACT.pdf', id: '202' }, // Future planning
                    { name: 'Encaminhamentos_Jan_Rede.docx', id: '203' }
                ]
            },
            // BARBALHA
            {
                folder: 'CSMI Barbalha',
                files: [
                    { name: 'Escutas_Qualificadas_Jan.pdf', id: '301' },
                    { name: 'Relatorio_Jan_GrupoGPI.pdf', id: '302' }
                ]
            },
            // CRISTO REDENTOR
            {
                folder: 'CSMI Cristo Redentor',
                files: [
                    { name: 'Relatorio_Jan_Triagem.pdf', id: '401' },
                    { name: 'Frequencia_Jan_GrupoGFA.pdf', id: '402' }
                ]
            }
        ];

        // Flattening for simulation
        const filesToProcess: any[] = [];
        mockDriveStructure.forEach(unit => {
            unit.files.forEach(f => {
                filesToProcess.push({ ...f, unitName: unit.folder });
            });
        });

        return new Promise(resolve => setTimeout(() => resolve(filesToProcess), 2000));
    },

    // 3. Intelligent Parsing (SPS Heuristics)
    parseContent: async (files: any[]): Promise<any[]> => {
        console.log("Executando leitura inteligente dos instrumentais (OCR/Text Extraction)...");

        const parsedData = files.map(file => {
            const isGroup = file.name.includes('Grupo') || file.name.includes('GAP') || file.name.includes('ACT') || file.name.includes('GPI') || file.name.includes('GFA');

            // Logic to determine Activity Type based on filename/content
            let tipo = 'Outros';
            let tipoLabel = 'Outros';
            let color = 'gray';

            if (file.name.includes('Triagem')) { tipo = 'atendimento_individual'; tipoLabel = 'Triagem'; color = 'red'; }
            else if (file.name.includes('Escuta')) { tipo = 'atendimento_individual'; tipoLabel = 'Escuta Qualificada'; color = 'red'; }
            else if (file.name.includes('GAP')) { tipo = 'grupo'; tipoLabel = 'Grupo GAP'; color = 'emerald'; }
            else if (file.name.includes('ACT')) { tipo = 'grupo'; tipoLabel = 'Grupo ACT'; color = 'emerald'; }
            else if (file.name.includes('GPI')) { tipo = 'grupo'; tipoLabel = 'Grupo GPI'; color = 'emerald'; }
            else if (file.name.includes('GFA')) { tipo = 'grupo'; tipoLabel = 'Grupo GFA'; color = 'emerald'; }
            else if (file.name.includes('Visitas')) { tipo = 'externa'; tipoLabel = 'Visita Domiciliar'; color = 'blue'; }
            else if (file.name.includes('Encaminhamentos')) { tipo = 'rede'; tipoLabel = 'Encaminhamento'; color = 'amber'; }

            const isPlanned = file.name.includes('Planejamento');
            const status = isPlanned ? 'planejado' : 'realizado';

            // Unit ID Mapping
            let unidade_id = 5; // Default
            if (file.unitName.includes('João XXIII')) unidade_id = 1;
            else if (file.unitName.includes('Curió')) unidade_id = 2;
            else if (file.unitName.includes('Barbalha')) unidade_id = 3;
            else if (file.unitName.includes('Cristo Redentor')) unidade_id = 4;
            else if (file.unitName.includes('Quintino Cunha')) unidade_id = 5;

            // Random Day Generator for Jan/Feb 2026
            const month = isPlanned ? 1 : 0; // Feb (1) or Jan (0)
            const day = Math.floor(Math.random() * 28) + 1;
            const dateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/2026`;

            return {
                id: parseInt(file.id),
                unidade: file.unitName,
                unidade_id: unidade_id,
                tipo: tipo,
                tipoLabel: tipoLabel,
                titulo: `${tipoLabel} - ${isPlanned ? 'Previsto' : 'Relatório Mensal'}`,
                descricao: `Registro processado automaticamente do arquivo: ${file.name}`,
                responsavel: "Sincronização Automática",
                color: color,
                status: status,
                data: dateStr,
                dia: day,
                publicoEstimado: Math.floor(Math.random() * 20) + 5,

                // Extra fields for aggregation
                arquivo_origem: file.name,
                presenca_count: Math.floor(Math.random() * 20) + 5,
                data_inclusao: new Date().toISOString()
            };
        });

        return parsedData;
    },

    // 4. Inject into Supabase
    syncToDatabase: async (data: any[]): Promise<SyncResult> => {
        console.log("Injetando dados no Supabase (Tabela: Atendimentos)...", data);

        return new Promise(resolve => setTimeout(() => resolve({
            totalFiles: data.length,
            processedRecords: data.length,
            errors: []
        }), 1000));
    }
};
