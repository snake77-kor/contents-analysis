import React from 'react';
import type { AfterReadingContent } from '../types';

interface AfterReadingViewProps {
    content: AfterReadingContent;
}

export const AfterReadingView: React.FC<AfterReadingViewProps> = ({ content }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none">
            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-4 bg-teal-50 border-b border-teal-100 print:bg-transparent print:border-b-2 print:border-teal-500">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl print:border print:border-teal-600">
                    M
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">After Reading</h2>
                    <p className="text-sm text-gray-500 mt-1">{content.titleKorean}</p>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 print:p-0 print:gap-8 print:space-y-6">

                {/* Top Section: Fill-in-the-Blank (Left) & True/False (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">

                    {/* 1. Fill in the Blank (Cloze Test) */}
                    <div className="bg-yellow-50/30 border border-yellow-100 rounded-xl overflow-hidden print:bg-transparent print:border-gray-300">
                        <div className="px-4 py-2 border-b border-yellow-100 bg-yellow-50 flex items-center gap-2 print:bg-transparent print:border-b print:border-yellow-300">
                            <span className="font-bold text-yellow-800">1. 빈칸 채우기 (Fill in the Blank)</span>
                        </div>
                        <div className="p-4 space-y-4">
                            {content.fillInTheBlank?.map((q, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold mt-0.5 print:border print:border-yellow-600">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm text-gray-800 leading-snug font-medium">
                                            {q.question}
                                        </p>
                                        {q.options && (
                                            <div className="flex gap-2 mt-1 text-[10px] text-gray-500 italic">
                                                (Options: {q.options.join(', ')})
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. True/False Questions */}
                    <div className="bg-green-50/30 border border-green-100 rounded-xl overflow-hidden print:bg-transparent print:border-gray-300">
                        <div className="px-4 py-2 border-b border-green-100 bg-green-50 flex items-center gap-2 print:bg-transparent print:border-b print:border-green-300">
                            <span className="font-bold text-green-800">2. 내용 일치 (True/False)</span>
                        </div>
                        <div className="p-4 space-y-4">
                            {content.comprehension.trueFalse.map((q, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold mt-0.5 print:border print:border-green-600">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-800 leading-snug mb-1 font-medium">{q.question}</p>
                                        <div className="flex justify-end gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400 border px-1 rounded">Why? __________________</span>
                                            <div className="flex gap-1">
                                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400">T</div>
                                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400">F</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Vocabulary List (Full Width, No Checkbox) */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden print:border-gray-200">
                    <div className="px-4 py-2 border-b bg-indigo-50 border-indigo-100 flex items-center gap-2 print:bg-transparent print:border-b print:border-indigo-300">
                        <span className="font-bold text-indigo-700">3. 핵심 어휘 (Vocabulary)</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {content.vocabularyList?.map((item, idx) => (
                            <div key={idx} className="flex flex-col border border-gray-100 rounded p-2 print:border-gray-300 bg-gray-50/30 print:bg-transparent">
                                <span className="font-bold text-gray-900 text-sm mb-1">{item.word}</span>
                                <span className="text-xs text-gray-600">{item.meaning}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
