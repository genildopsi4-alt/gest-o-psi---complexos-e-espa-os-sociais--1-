import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to CDN to avoid build configuration issues in the immediate term
// In production, this should point to a local file or proper build asset
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedData {
    text: string;
    images: string[]; // Data URLs
    metadata: {
        unidade?: string;
        data?: string;
        profissional?: string;
        participantes?: string[];
    }
}

export const extractDataFromPDF = async (file: File): Promise<ExtractedData> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    const images: string[] = [];

    // Iterate through all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // 1. Extract Text
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';

        // 2. Extract Images (Experimental)
        // This is a simplified approach. Extracting images reliably from PDF Ops is complex.
        try {
            const operatorList = await page.getOperatorList();
            const validObjectTypes = [
                pdfjsLib.OPS.paintImageXObject,
                pdfjsLib.OPS.paintInlineImageXObject,
            ];

            // Iterate over operators to find images
            for (let i = 0; i < operatorList.fnArray.length; i++) {
                const fn = operatorList.fnArray[i];
                if (validObjectTypes.includes(fn)) {
                    const imageName = operatorList.argsArray[i][0];
                    try {
                        // Retrieve image data from page objs
                        const imageObj = await page.objs.get(imageName);
                        if (imageObj) {
                            const dataUrl = await convertImageToDataUrl(imageObj);
                            if (dataUrl) images.push(dataUrl);
                        }
                    } catch (err) {
                        console.warn('Failed to extract image:', imageName, err);
                    }
                }
            }
        } catch (e) {
            console.warn(`Error extracting images from page ${pageNum}:`, e);
        }
    }

    // 3. Heuristic Metadata Extraction
    const metadata = parseMetadataFromText(fullText);

    return {
        text: fullText,
        images,
        metadata
    };
};

// Helper: Convert RAW PDF Image Data to DataURL (PNG)
const convertImageToDataUrl = async (imageObj: any): Promise<string | null> => {
    try {
        const { width, height, data, kind } = imageObj;

        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Create ImageData
        // Note: PDF.js gives distinct kinds of data.
        // kind 1 = Grayscale, 2 = RGB, 3 = RGBA (roughly)

        let imageData = ctx.createImageData(width, height);

        if (kind === 1) { // Grayscale
            // NOT SUPPORTED in this simple snippet, assumes component expansion needs
            // Usually implies expanding 1 byte to 4 bytes (r,g,b,alpha)
            for (let i = 0, j = 0; i < data.length; i++, j += 4) {
                const gray = data[i];
                imageData.data[j] = gray;
                imageData.data[j + 1] = gray;
                imageData.data[j + 2] = gray;
                imageData.data[j + 3] = 255;
            }
        } else if (kind === 2) { // RGB
            for (let i = 0, j = 0; i < data.length - 2; i += 3, j += 4) {
                imageData.data[j] = data[i];
                imageData.data[j + 1] = data[i + 1];
                imageData.data[j + 2] = data[i + 2];
                imageData.data[j + 3] = 255;
            }
        } else if (kind === 3) { // RGBA
            // Copy directly if typed array matches
            for (let i = 0; i < data.length; i++) {
                imageData.data[i] = data[i];
            }
        } else {
            return null; // Unsupported for now
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    } catch (e) {
        console.error("Image conversation failed", e);
        return null;
    }
}

const parseMetadataFromText = (text: string) => {
    const metadata: any = {};

    // Simple Regex Heuristics (Portuguese)

    // 1. Data (e.g., "Data: 12/02/2026" or "12/02/2026")
    const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (dateMatch) {
        const [day, month, year] = dateMatch[1].split('/');
        metadata.data = `${year}-${month}-${day}`; // ISO format for input[type="date"]
    }

    // 2. Unidade
    if (text.toLowerCase().includes('joão xxiii')) metadata.unidade = 'CSMI João XXIII';
    else if (text.toLowerCase().includes('cristo redentor')) metadata.unidade = 'CSMI Cristo Redentor';
    else if (text.toLowerCase().includes('curió')) metadata.unidade = 'CSMI Curió';

    // 3. Profissional (Look for labels like "Psicólogo:", "Profissional:")
    const profMatch = text.match(/(?:Psicólogo|Profissional|Responsável):\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
    if (profMatch) {
        metadata.profissional = profMatch[1].trim();
    }

    return metadata;
}
