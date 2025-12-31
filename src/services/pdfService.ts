export const generatePdf = async (htmlContent: string): Promise<void> => {
    // html2pdf is loaded from a script tag in index.html
    const html2pdf = (window as any).html2pdf;

    if (!html2pdf) {
        console.error("html2pdf.js is not loaded.");
        throw new Error("PDF generation library is not available.");
    }

    const opt = {
        margin: 1, // in cm
        filename: 'analysis-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'css', after: '.page-break' }
    };

    // The save() method returns a promise that resolves when the file is saved.
    await html2pdf().from(htmlContent).set(opt).save();
};
