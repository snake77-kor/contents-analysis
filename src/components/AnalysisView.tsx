import React from 'react';
import type { AnalysisResult } from '../types';
import { MainTextView } from './MainTextView';
import { FlowChart } from './FlowChart';

interface AnalysisViewProps {
    analysisResult: AnalysisResult;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysisResult }) => {
    if (!analysisResult) return null;

    const sentences = analysisResult.sentences || [];
    const flowTitle = analysisResult.flow?.title || "Flow Chart";
    const flowSteps = analysisResult.flow?.steps || [];
    const summaryAnnotations = analysisResult.summaryAnnotations || [];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-sm font-extrabold uppercase tracking-wide">
                            {analysisResult.passageNumber || "N/A"}
                        </span>
                        {analysisResult.titleEnglish || "Untitled"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 ml-1">{analysisResult.titleKorean || "제목 없음"}</p>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
                {/* Summary Section */}
                <div className="bg-fuchsia-50 rounded-xl p-6 border border-fuchsia-100">
                    <h3 className="text-sm font-bold text-fuchsia-800 uppercase tracking-wider mb-2">Summary</h3>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium">
                        {analysisResult.summaryEnglish || "No summary available."}
                    </p>
                    {summaryAnnotations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {summaryAnnotations.map((ann, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-fuchsia-200 rounded-full text-sm text-fuchsia-700 shadow-sm">
                                    <span className="font-bold">{ann.englishWord}</span>
                                    <span className="text-xs text-fuchsia-400">•</span>
                                    <span className="text-gray-600">{ann.koreanAnnotation}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Detailed Sentence Analysis */}
                    <div className="h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Detailed Analysis</h3>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>
                        <MainTextView sentences={sentences} />
                    </div>

                    {/* Right Column: Logic Flow */}
                    <div className="h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Logic Flow</h3>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>
                        <FlowChart title={flowTitle} steps={flowSteps} />
                    </div>
                </div>
            </div>
        </div>
    );
};
