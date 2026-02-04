import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
    unidade: string;
    mesReferencia: string;
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
    parecerGestao: string;
    responsavel: string;
}

export const generateRelatorioMensal = (data: ReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- HEADER ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text('GOVERNO DO ESTADO DO CEARÁ', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text('Secretaria da Proteção Social - SPS', pageWidth / 2, 28, { align: 'center' });
    doc.text('Programa Mais Infância Ceará', pageWidth / 2, 34, { align: 'center' });

    // Title
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`RELATÓRIO MENSAL DE ATIVIDADES - ${data.mesReferencia}`, pageWidth / 2, 50, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Unidade: ${data.unidade}`, 15, 60);
    doc.text(`Responsável Técnico: ${data.responsavel}`, 15, 66);

    // --- TABLE 1: GRUPOS ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Atividades Socioeducativas e Grupos', 15, 80);

    autoTable(doc, {
        startY: 85,
        head: [['Grupo / Atividade', 'Encontros', 'Beneficiários', 'Status']],
        body: data.grupos.map(g => [g.nome, g.encontros, g.beneficiarios, g.status]),
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] }, // Red
    });

    let finalY = (doc as any).lastAutoTable.finalY + 15;

    // --- SECTION 2: ESCUTA QUALIFICADA ---
    doc.text('2. Escuta Qualificada e Encaminhamentos', 15, finalY);

    const escutaData = [
        ['Total de Atendimentos', data.escuta.total],
        ['Encaminhamentos Saúde', data.escuta.encaminhamentos.saude],
        ['Encaminhamentos Assistência Social', data.escuta.encaminhamentos.assistencia],
        ['Encaminhamentos Educação', data.escuta.encaminhamentos.educacao],
    ];

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Indicador', 'Quantidade']],
        body: escutaData,
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] }, // Orange
    });

    finalY = (doc as any).lastAutoTable.finalY + 15;

    // --- SECTION 3: MOBILIZAÇÃO ---
    doc.text('3. Mobilização Comunitária', 15, finalY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Evento Destaque: ${data.mobilizacao.titulo}`, 15, finalY + 8);
    doc.text(`Público Estimado: ${data.mobilizacao.publico} pessoas`, 15, finalY + 14);

    const splitText = doc.splitTextToSize(data.mobilizacao.sintese, pageWidth - 30);
    doc.text(splitText, 15, finalY + 22);

    finalY += 22 + (splitText.length * 5) + 10;

    // --- SECTION 4: PARECER TÉCNICO ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Parecer Técnico da Gestão', 15, finalY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitParecer = doc.splitTextToSize(data.parecerGestao, pageWidth - 30);
    doc.text(splitParecer, 15, finalY + 8);

    // --- PHOTOS ---
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Anexo: Registro Fotográfico', pageWidth / 2, 20, { align: 'center' });

    let yPos = 40;
    data.fotos.forEach((foto, index) => {
        if (yPos > 250) {
            doc.addPage();
            yPos = 40;
        }

        // Placeholder logic for image (since we might not have base64)
        // In a real app, 'foto.url' should be base64. Here assuming valid URL might not work in local jsPDF without proxy/CORS.
        // We will draw a rect as placeholder if image fails, or try addImage.

        try {
            // doc.addImage(foto.url, 'JPEG', 15, yPos, 80, 60);
            // Note: addImage is synchronous and requires base64 or loaded image data usually.
            // For simplicity in this demo, we draw a box.

            doc.setDrawColor(200);
            doc.setFillColor(245, 245, 245);
            doc.rect(15, yPos, 180, 80, 'FD');
            doc.setFontSize(10);
            doc.text(`[FOTO ${index + 1}: ${foto.url.substring(0, 30)}...]`, 105, yPos + 40, { align: 'center' });

            doc.setFontSize(9);
            doc.text(foto.legenda, 15, yPos + 85);
            doc.text(foto.data, 180, yPos + 85, { align: 'right' });

            yPos += 100;
        } catch (e) {
            console.error("Error adding image to PDF", e);
        }
    });

    doc.save(`Relatorio_Mensal_${data.unidade}_${data.mesReferencia}.pdf`);
};
