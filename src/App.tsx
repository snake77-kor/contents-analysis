import React, { useState } from 'react';
import { Header } from './components/Header';
import { TextInputArea } from './components/TextInputArea';
import { AnalysisView } from './components/AnalysisView';
import { AfterReadingView } from './components/AfterReadingView';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { analyzePassage, generateAfterReadingContent } from './services/geminiService';
import { generateReportHtml } from './services/markdownService';
import { generatePdf } from './services/pdfService';
import type { AnalysisResult, AfterReadingContent } from './types';

interface AnalysisData {
  id: string;
  analysisResult: AnalysisResult;
  afterReadingContent: AfterReadingContent;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing Your Text...');
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);

  // Removed initial example text as requested
  const initialText = '';


  const handleAnalyze = async (passagesToAnalyze: Array<{ title: string; text: string }>) => {
    setIsLoading(true);
    setError(null);

    const newAnalyses: AnalysisData[] = [];
    try {
      for (let i = 0; i < passagesToAnalyze.length; i++) {
        const passage = passagesToAnalyze[i];
        setLoadingMessage(`Analyzing Passage ${i + 1}/${passagesToAnalyze.length}: "${passage.title}"`);

        const textForApi = `--- Passage: ${passage.title} ---\n${passage.text}`;

        const mainAnalysisPromise = analyzePassage(textForApi);
        const afterReadingPromise = generateAfterReadingContent(textForApi);

        const [mainAnalysis, afterReading] = await Promise.all([mainAnalysisPromise, afterReadingPromise]);

        mainAnalysis.passageNumber = passage.title;

        newAnalyses.push({
          id: `${passage.title}-${Date.now()}`,
          analysisResult: mainAnalysis,
          afterReadingContent: afterReading
        });
      }
      setAnalyses(prevAnalyses => [...newAnalyses.reverse(), ...prevAnalyses]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (analyses.length > 0) {
      setIsLoading(true);
      setLoadingMessage('Generating PDF Report...');
      try {
        const reportHtml = generateReportHtml(analyses);
        await generatePdf(reportHtml);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to generate report.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownloadHtml = () => {
    if (analyses.length > 0) {
      try {
        const reportHtml = generateReportHtml(analyses);
        const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'analysis-report.html');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to generate HTML report.');
      }
    }
  };


  const handleReset = () => {
    setAnalyses([]);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header onReset={handleReset} showActions={analyses.length > 0} onDownloadPdf={handleDownloadPdf} onDownloadHtml={handleDownloadHtml} />
      <main className="container mx-auto p-4 md:p-8">
        {isLoading && <Loader message={loadingMessage} />}

        {!isLoading && (
          <>
            <div className="mb-8">
              <TextInputArea
                onAnalyze={handleAnalyze}
                initialText={analyses.length === 0 ? initialText : ''}
                isInitial={analyses.length === 0}
              />
            </div>
            {error && <ErrorDisplay message={error} />}

            {analyses.length > 0 && (
              <div className="space-y-12">
                {analyses.map((data) => (
                  <div key={data.id}>
                    <AnalysisView
                      analysisResult={data.analysisResult}
                    />
                    <div className="mt-8">
                      <AfterReadingView content={data.afterReadingContent} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
