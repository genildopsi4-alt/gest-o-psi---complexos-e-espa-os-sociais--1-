import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserProfile } from '../../types';
import { MOCK_UNIDADES } from './mockData';

interface ReportOptions {
    startDate: string;
    endDate: string;
    unit: string; // 'consolidado' ou nome da unidade
    user: UserProfile;
    data: any[]; // Dados vindos do RelatorioService
}

export const PDFGenerator = {
    generateRelatorioMensal: (options: ReportOptions) => {
        const doc = new jsPDF();
        const { startDate, endDate, unit, user, data } = options;

        // --- HEADER ---
        const drawHeader = (pageUnit: string) => {
            doc.setFillColor(23, 37, 84); // blue-950 roughly
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('GOVERNO DO ESTADO DO CEARÁ', 105, 15, { align: 'center' });
            doc.setFontSize(12);
            doc.text('SECRETARIA DE PROTEÇÃO SOCIAL - SPS', 105, 22, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`RELATÓRIO MENSAL DE ATIVIDADES - ${pageUnit.toUpperCase()}`, 105, 32, { align: 'center' });
        };

        // Se for consolidado, iteramos por unidade. Se não, apenas uma.
        const unitsToProcess = unit === 'Overview Geral' || unit === 'consolidado'
            ? MOCK_UNIDADES.map(u => u.nome) // Todas as unidades
            : [unit];

        let pageCount = 0;

        unitsToProcess.forEach((currentUnitName, index) => {
            // Filtrar dados desta unidade
            const unitData = data.filter((d: any) => d.unidade === currentUnitName || (unit !== 'consolidado' && unit === currentUnitName));

            if (index > 0) doc.addPage();
            pageCount++;

            drawHeader(currentUnitName);

            let currentY = 50;

            // --- INFO BLOCK ---
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Período: ${startDate.split('-').reverse().join('/')} a ${endDate.split('-').reverse().join('/')}`, 14, currentY);
            doc.text(`Responsável Técnico: ${user.name}`, 14, currentY + 6);
            currentY += 15;

            // --- TABELA DE RESUMO ---
            const atividades = unitData.length;
            const participantes = unitData.reduce((acc: number, curr: any) => acc + (curr.qtd_participantes || 0), 0);

            autoTable(doc, {
                startY: currentY,
                head: [['Indicadores', 'Total']],
                body: [
                    ['Atividades Realizadas', atividades],
                    ['Total de Participantes', participantes],
                ],
                theme: 'grid',
                headStyles: { fillColor: [40, 167, 69] } // Green
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;

            // --- DETALHAMENTO DAS ATIVIDADES ---
            doc.text('Detalhamento das Atividades:', 14, currentY);
            currentY += 5;

            // Mapear dados para tabela
            const rows = unitData.map((atend: any) => [
                atend.data_registro.split('-').reverse().join('/'),
                atend.tipo_acao.toUpperCase(),
                atend.atividade_especifica,
                atend.qtd_participantes,
                atend.observacoes ? atend.observacoes.substring(0, 50) + '...' : '-'
            ]);

            autoTable(doc, {
                startY: currentY,
                head: [['Data', 'Tipo', 'Atividade', 'Qtd', 'Resumo']],
                body: rows,
                theme: 'striped',
                headStyles: { fillColor: [23, 162, 184] }
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;

            // --- IMAGENS (Se houver) ---
            const images = unitData.flatMap((d: any) => d.fotos_urls || []);
            if (images.length > 0) {
                if (currentY > 250) { doc.addPage(); pageCount++; currentY = 20; }

                doc.setFontSize(12);
                doc.text('Registro Fotográfico:', 14, currentY);
                currentY += 10;

                let xPos = 14;
                images.forEach((imgUrl: string, i: number) => {
                    // Try to add image (assumes valid DataURL or URL supported by jspdf)
                    try {
                        // Limit to 4 images per page for simplicity in this version
                        if (i < 4) {
                            doc.text(`Foto ${i + 1}`, xPos, currentY);
                            // Placeholder rect if image fails loading in pure JS context without async fetching
                            doc.rect(xPos, currentY + 2, 40, 30);
                            // doc.addImage(imgUrl, 'JPEG', xPos, currentY + 2, 40, 30);
                            // NOTE: addImage sync requires Base64. If URLs are remote, we need to fetch them first.
                            // For this iteration, we place placeholders or assume Base64 in state.
                        }
                        xPos += 50;
                    } catch (e) {
                        console.warn('Erro ao adionar imagem PDF', e);
                    }
                });
            }
        });

        // Save
        doc.save(`Relatorio_Mensal_${user.unit}_${startDate}.pdf`);
    }
};
