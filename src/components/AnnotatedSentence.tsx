import React from 'react';
import type { AnnotatedSentence as ISentence, WordAnnotation } from '../types';

const WordAnnotationTooltip: React.FC<{ annotation: WordAnnotation; children: React.ReactNode; }> = ({ annotation, children }) => {
    return (
        <span className="relative group inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {annotation.koreanAnnotation}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
            </div>
        </span>
    );
};

const TopicSentenceFlag = () => (
    <div className="absolute -left-2 -top-2 flex items-center">
        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
        </svg>
        <span className="ml-1 text-xs font-bold text-red-600">주제문</span>
    </div>
);


export const AnnotatedSentence: React.FC<{ sentence: ISentence, number: number }> = ({ sentence, number }) => {

    const renderSentence = () => {
        const sortedAnnotations = [...sentence.annotations].sort((a, b) => b.englishWordOrPhrase.length - a.englishWordOrPhrase.length);
        if (sortedAnnotations.length === 0) return sentence.original;

        const regexParts = sortedAnnotations.map(a => a.englishWordOrPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${regexParts.join('|')})`, 'g');
        const splitSentence = sentence.original.split(regex);

        return splitSentence.map((part, index) => {
            const annotation = sortedAnnotations.find(a => a.englishWordOrPhrase === part);
            if (annotation) {
                let className = 'border-b border-dotted border-black cursor-pointer font-semibold';
                if (annotation.annotationType === 'connector') {
                    className = 'bg-green-200 px-1 rounded-md cursor-pointer font-bold text-green-800';
                } else if (annotation.annotationType === 'grammar') {
                    className = 'bg-red-200 px-1 rounded-md cursor-pointer font-bold text-red-800';
                } else if (annotation.annotationType === 'keyword') {
                    className = 'bg-purple-200 px-1 rounded-md cursor-pointer font-bold text-purple-800';
                }

                return (
                    <WordAnnotationTooltip key={`${index}-${part}`} annotation={annotation}>
                        <span className={className}>{part}</span>
                    </WordAnnotationTooltip>
                );
            }
            return part;
        });
    };

    const numberColors = [
        'bg-green-100 text-green-700', 'bg-sky-100 text-sky-700', 'bg-indigo-100 text-indigo-700',
        'bg-pink-100 text-pink-700', 'bg-amber-100 text-amber-700', 'bg-slate-100 text-slate-700',
        'bg-teal-100 text-teal-700', 'bg-fuchsia-100 text-fuchsia-700', 'bg-rose-100 text-rose-700'
    ];
    const numberClass = numberColors[(number - 1) % numberColors.length];
    const topicSentenceClass = sentence.isTopicSentence ? 'bg-yellow-100 rounded-md p-2' : '';
    const wrapperDivClass = sentence.isTopicSentence ? 'relative' : '';

    return (
        <div className={`border-t border-gray-200 pt-3 first:border-t-0 first:pt-0 ${wrapperDivClass}`}>
            {sentence.isTopicSentence && <TopicSentenceFlag />}
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${numberClass} text-sm font-bold rounded-full`}>
                    {number}
                </div>
                <div className="flex-grow">
                    <p className={`text-base text-gray-800 leading-relaxed ${topicSentenceClass}`}>{renderSentence()}</p>
                    <p className="mt-1 text-gray-500 text-sm">{sentence.translation}</p>
                </div>
            </div>
        </div>
    );
};
