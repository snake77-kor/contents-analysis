import React from 'react';
import type { AnnotatedSentence as ISentence, WordAnnotation } from '../types';

const WordAnnotationInline: React.FC<{ annotation: WordAnnotation; children: React.ReactNode; }> = ({ annotation, children }) => {

    // Determine style based on type
    const isGrammar = annotation.annotationType === 'grammar';

    let baseClass = "relative inline-block mx-0.5 px-0.5";
    let labelColor = "text-gray-600";

    if (isGrammar) {
        baseClass += " border-b-2 border-dotted border-red-400";
        labelColor = "text-red-600 font-bold";
    } else if (annotation.annotationType === 'vocabulary' || annotation.annotationType === 'keyword') {
        baseClass += " bg-green-50/50 border-b-2 border-green-300";
        labelColor = "text-green-700 font-bold";
    } else if (annotation.annotationType === 'connector') {
        baseClass = "inline-block bg-yellow-100 border border-yellow-300 px-1 rounded mx-1";
        labelColor = "text-yellow-800 font-bold";
    }

    return (
        <span className={baseClass}>
            {/* Grammar Label: Shown ABOVE */}
            {isGrammar && (
                <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 w-[max-content] max-w-[120px] text-[0.45rem] font-medium leading-none text-center ${labelColor} z-10 bg-white/95 px-0.5 rounded shadow-sm border border-red-100`}>
                    {annotation.koreanAnnotation}
                </span>
            )}

            {children}

            {/* Vocabulary/Other Label: Shown BELOW */}
            {!isGrammar && (
                <span className={`block absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-[max-content] max-w-[120px] text-[0.45rem] font-medium leading-tight text-center ${labelColor} z-10 bg-white/95 rounded px-0.5 shadow-sm border border-green-100`}>
                    {annotation.koreanAnnotation}
                </span>
            )}
        </span>
    );
};

const TopicSentenceFlag = () => (
    <div className="absolute -left-2 -top-2 flex items-center bg-white px-1 z-20 shadow-sm border border-gray-100 rounded">
        <svg className="h-3 w-3 text-red-500 fill-current" viewBox="0 0 20 20">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h10a1 1 0 100-2H3zM3 11a1 1 0 000 2h7a1 1 0 100-2H3zM3 15a1 1 0 000 2h4a1 1 0 100-2H3z" />
        </svg>
        <span className="ml-1 text-[9px] font-bold text-red-600 tracking-tight">주제문</span>
    </div>
);

export const AnnotatedSentence: React.FC<{ sentence: ISentence, number: number }> = ({ sentence, number }) => {

    const renderSentence = () => {
        const sortedAnnotations = [...sentence.annotations].sort((a, b) => b.englishWordOrPhrase.length - a.englishWordOrPhrase.length);

        let parts: (string | React.ReactNode)[] = [sentence.original];

        if (sortedAnnotations.length > 0) {
            const regexParts = sortedAnnotations.map(a => a.englishWordOrPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const regex = new RegExp(`(${regexParts.join('|')})`, 'g');
            const splitByAnnotation = sentence.original.split(regex);

            parts = splitByAnnotation.map((part, index) => {
                const annotation = sortedAnnotations.find(a => a.englishWordOrPhrase === part);
                if (annotation) {
                    return (
                        <WordAnnotationInline key={`ann-${index}`} annotation={annotation}>
                            {part}
                        </WordAnnotationInline>
                    );
                }
                return part;
            });
        }

        const finalParts: React.ReactNode[] = [];
        parts.forEach((part, idx) => {
            if (typeof part === 'string') {
                const subParts = part.split('/');
                subParts.forEach((sub, subIdx) => {
                    finalParts.push(<span key={`text-${idx}-${subIdx}`}>{sub}</span>);
                    if (subIdx < subParts.length - 1) {
                        // Styled slash
                        finalParts.push(<span key={`chunk-${idx}-${subIdx}`} className="inline-block mx-1 font-light text-red-300 text-lg select-none">/</span>);
                    }
                });
            } else {
                finalParts.push(part);
            }
        });

        return finalParts;
    };

    const isTopic = sentence.isTopicSentence;
    // Compact layout for print
    const containerClass = isTopic ? "bg-yellow-50/60 border border-yellow-200 rounded-lg p-3 my-2 shadow-sm" : "py-1 my-1 border-b border-gray-50 last:border-0";

    return (
        <div className={`relative ${containerClass}`}>
            {isTopic && <TopicSentenceFlag />}
            <div className="flex gap-3 items-baseline">
                {/* Number Circle */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${isTopic ? 'bg-pink-500 text-white' : 'bg-green-100 text-green-700'}`}>
                    {number}
                </div>

                {/* Text Content */}
                <div className="flex-grow">
                    {/* Compacted line-height (leading-[3]) */}
                    <div className="text-[15px] text-gray-900 leading-[3] font-medium tracking-wide">
                        {renderSentence()}
                    </div>
                </div>
            </div>
        </div>
    );
};
