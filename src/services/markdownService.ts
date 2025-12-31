import type { AnalysisResult, AfterReadingContent, AnnotatedSentence, WordAnnotationSimple } from '../types';

interface AnalysisData {
    id: string;
    analysisResult: AnalysisResult;
    afterReadingContent: AfterReadingContent;
}

const generateSentencesHtml = (sentences: AnnotatedSentence[]) => {
    return sentences.map((sentence, index) => {
        const sortedAnnotations = [...sentence.annotations].sort((a, b) => b.englishWordOrPhrase.length - a.englishWordOrPhrase.length);
        let sentenceHtml = sentence.original;

        // Simple text replacement for annotations in static HTML (not interactive)
        // We will just bold them or underline them to show they are important
        sortedAnnotations.forEach(ann => {
            // Escape regex special characters
            const escapedWord = ann.englishWordOrPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedWord})`, 'g');
            sentenceHtml = sentenceHtml.replace(regex, `<span class="annotation" data-korean="${ann.koreanAnnotation}" style="border-bottom: 2px dotted #666; position: relative;">$1<span class="annotation-text" style="display:none;"> (${ann.koreanAnnotation})</span></span>`);
        });

        return `
            <div class="sentence-item" style="margin-bottom: 1rem;">
                <div style="display: flex; gap: 0.5rem;">
                    <span style="font-weight: bold; color: #00897b; min-width: 1.5rem;">${index + 1}</span>
                    <div>
                        <p style="margin: 0; line-height: 1.6; font-size: 1.1rem; color: #1f2937;">${sentenceHtml}</p>
                        <p style="margin: 0.25rem 0 0 0; color: #6b7280; font-size: 0.95rem;">${sentence.translation}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

const generateFlowHtml = (flow: AnalysisResult['flow']) => {
    return flow.steps.map((step, index) => `
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; border-left: 2px solid #e5e7eb; padding-left: 1rem; position: relative;">
            <div style="background-color: #0f766e; color: white; width: 1.5rem; height: 1.5rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: bold; flex-shrink: 0;">${index + 1}</div>
            <div>
                <p style="font-weight: bold; color: #1f2937; margin: 0;">${step.title}</p>
                <p style="color: #4b5563; margin: 0.25rem 0 0 0; font-size: 0.9rem;">${step.description}</p>
            </div>
        </div>
    `).join('');
};

const generateAnalysisHtml = (data: AnalysisData) => {
    const { analysisResult, afterReadingContent } = data;

    return `
        <div class="analysis-section page-break" style="margin-bottom: 2rem; page-break-after: always;">
            <h1 style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 1rem; text-align: center;">${analysisResult.titleEnglish}</h1>
            <h2 style="font-size: 1.5rem; color: #4b5563; margin-bottom: 2rem; text-align: center;">${analysisResult.titleKorean}</h2>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: bold; color: #be185d; margin-bottom: 0.5rem; border-bottom: 2px solid #fbcfe8; padding-bottom: 0.5rem;">Summary</h3>
                <p style="font-size: 1.1rem; line-height: 1.6;">${analysisResult.summaryEnglish}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                     <h3 style="font-size: 1.25rem; font-weight: bold; color: #be185d; margin-bottom: 1rem; border-bottom: 2px solid #fbcfe8; padding-bottom: 0.5rem;">Detailed Analysis</h3>
                     ${generateSentencesHtml(analysisResult.sentences)}
                </div>
            </div>

             <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: bold; color: #be185d; margin-bottom: 1rem; border-bottom: 2px solid #fbcfe8; padding-bottom: 0.5rem;">Logic Flow</h3>
                ${generateFlowHtml(analysisResult.flow)}
             </div>

             <div class="page-break" style="page-break-before: always;">
                <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem;">After Reading Activities</h2>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; font-weight: bold; color: #0369a1; margin-bottom: 0.5rem;">1. Visual Summary</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        ${afterReadingContent.visualSummary.map(item => `
                            <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem;">
                                <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: auto; border-radius: 0.25rem; margin-bottom: 0.5rem;">
                                <p style="font-weight: bold; font-size: 0.9rem; text-align: center;">${item.title}</p>
                                <p style="font-size: 0.8rem; color: #6b7280; text-align: center;">${item.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; font-weight: bold; color: #0369a1; margin-bottom: 0.5rem;">2. Comprehension Check</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${afterReadingContent.comprehension.trueFalse.map((q, i) => `
                            <li style="margin-bottom: 0.5rem;">
                                <span style="font-weight: bold;">Q${i + 1}.</span> ${q.question} (Answer: ${q.answer})
                            </li>
                        `).join('')}
                    </ul>
                </div>

                 <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; font-weight: bold; color: #0369a1; margin-bottom: 0.5rem;">3. Simplified Reading</h3>
                    <p style="line-height: 1.6;">${afterReadingContent.simplified.text}</p>
                </div>
             </div>
        </div>
    `;
};

export const generateReportHtml = (analyses: AnalysisData[]): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analysis Report</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; background-color: white; }
        .page-break { page-break-after: always; }
        @media print {
            body { padding: 0; }
            .page-break { page-break-after: always; }
        }
    </style>
</head>
<body>
    ${analyses.map(generateAnalysisHtml).join('<hr style="margin: 3rem 0; border: 0; border-top: 1px solid #e5e7eb;" />')}
    <footer style="text-align: center; margin-top: 3rem; color: #9ca3af; font-size: 0.875rem;">
        Generated by English Analysis Tool
    </footer>
</body>
</html>
    `;
};
