import React from 'react';
import type { AnalysisResult } from '../types';
import { AnnotatedSentence } from './AnnotatedSentence';
import { FlowChart } from './FlowChart';

interface AnalysisViewProps {
    analysisResult: AnalysisResult;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysisResult }) => {
    if (!analysisResult) return null;

    const sentences = analysisResult.sentences || [];
    const summaryAnnotations = analysisResult.summaryAnnotations || [];

    // Map sentences to flow steps for the right column (1:1 Translation)
    const translationSteps = sentences.map(sent => ({
        title: "", // No title per user request
        description: sent.translation, // Contains **highlights**
        highlights: [] // Handled by markdown parsing in FlowChart
    }));

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 print:shadow-none print:border-none print:mb-0">
            {/* Header Section */}
            <div className="bg-green-50 px-6 py-3 border-b border-green-100 flex items-center gap-4 print:px-0 print:py-2 print:bg-transparent print:border-b-2 print:border-green-500">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-extrabold flex items-center justify-center text-base print:border print:border-green-600">
                    {analysisResult.passageNumber || "00"}
                </span>
                <div>
                    <h2 className="text-lg font-bold text-green-900 print:text-black leading-tight">
                        {analysisResult.titleEnglish}
                    </h2>
                    <p className="text-xs font-bold text-green-700 print:text-gray-600">
                        {analysisResult.titleKorean}
                    </p>
                </div>
            </div>

            {/* Summary Box - Compact */}
            <div className="bg-pink-50 p-3 border-l-4 border-pink-400 mx-6 mt-4 mb-2 rounded-r-lg print:mx-0 print:mt-2 print:mb-4 print:p-2">
                <div className="flex gap-2 items-start">
                    <span className="text-pink-600 font-bold uppercase text-xs mt-0.5 flex-shrink-0">Summary</span>
                    <div className="flex-1">
                        <p className="text-gray-900 font-bold leading-snug mb-0.5 text-sm">
                            {analysisResult.summaryEnglish}
                        </p>
                        <p className="text-gray-600 text-xs leading-snug">
                            {analysisResult.summaryKorean}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content: Row-based Layout - Compact for Print */}
            <div className="p-6 md:p-8 space-y-4 print:p-0 print:space-y-1">
                {sentences.map((sent, idx) => (
                    <div key={idx} className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0 print:grid-cols-[7fr_3fr] print:gap-4 print:pb-2 print:mb-1 print:border-gray-200">

                        {/* Left: English Analysis */}
                        <div className="relative">
                            <AnnotatedSentence sentence={sent} number={idx + 1} />
                        </div>

                        {/* Right: Korean Translation (Logic Flow) */}
                        <div className="h-full border-l pl-6 border-gray-100 print:border-gray-200 flex flex-col justify-center">
                            <div className="flex gap-3">
                                {/* Number Circle matching Left side */}
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1
                                     bg-gray-100 text-gray-500`}>
                                    {idx + 1}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    {/* Inline logic for rendering highlights **...** */}
                                    {sent.translation.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return (
                                                <span key={i} className="bg-yellow-100 text-yellow-900 border-b-2 border-yellow-300 px-1 rounded mx-0.5 font-bold box-decoration-clone">
                                                    {part.slice(2, -2)}
                                                </span>
                                            );
                                        }
                                        return <span key={i}>{part}</span>;
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
