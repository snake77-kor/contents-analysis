import React from 'react';
import type { AfterReadingContent } from '../types';

interface AfterReadingViewProps {
    content: AfterReadingContent;
}

export const AfterReadingView: React.FC<AfterReadingViewProps> = ({ content }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-white">
                <h2 className="text-xl font-bold text-gray-800">After Reading Activities</h2>
                <p className="text-sm text-gray-500 mt-1">{content.titleKorean} - {content.summaryKorean}</p>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Visual Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-bold text-sky-700 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sm">1</span>
                        Visual Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {content.visualSummary.map((item, idx) => (
                            <div key={idx} className="group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <p className="font-bold text-sm text-gray-800 text-center">{item.title}</p>
                                <p className="text-xs text-gray-500 text-center line-clamp-2">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Comprehension Check */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm">2</span>
                        True / False Check
                    </h3>
                    <div className="space-y-3">
                        {content.comprehension.trueFalse.map((q, idx) => (
                            <div key={idx} className="flex gap-3 text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <span className="font-bold text-gray-400 min-w-[1.5rem]">{idx + 1}.</span>
                                <div>
                                    <p className="text-gray-800 font-medium mb-1">{q.question}</p>
                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        {q.annotations.map((ann, i) => (
                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 rounded">
                                                {ann.englishWord}:{ann.koreanAnnotation}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-1 cursor-not-allowed opacity-70">
                                            <input type="radio" checked={q.answer === true} readOnly className="text-indigo-600 focus:ring-indigo-500" />
                                            <span className={`font-bold ${q.answer ? 'text-indigo-600' : 'text-gray-400'}`}>TRUE</span>
                                        </label>
                                        <label className="flex items-center gap-1 cursor-not-allowed opacity-70">
                                            <input type="radio" checked={q.answer === false} readOnly className="text-indigo-600 focus:ring-indigo-500" />
                                            <span className={`font-bold ${!q.answer ? 'text-indigo-600' : 'text-gray-400'}`}>FALSE</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Simplified Reading */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 md:col-span-2">
                    <h3 className="text-lg font-bold text-teal-700 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-sm">3</span>
                        Simplified Reading
                    </h3>
                    <div className="bg-teal-50 rounded-lg p-4 leading-relaxed text-gray-800">
                        {(() => {
                            let text = content.simplified.text;
                            // Very naive replacement for demo purposes. 
                            // Ideally we would return the simplified text as an array of tokens or similar.
                            // Here we just display the text and list annotations below.
                            return <p>{text}</p>;
                        })()}
                    </div>
                    {content.simplified.annotations.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {content.simplified.annotations.map((ann, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-teal-200 rounded-lg text-sm text-teal-700 shadow-sm">
                                    <span className="font-bold">{ann.englishWord}</span>
                                    <span className="text-teal-300">|</span>
                                    <span className="text-gray-600">{ann.koreanAnnotation}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
