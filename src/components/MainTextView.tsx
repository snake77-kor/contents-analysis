import React from 'react';
import type { AnnotatedSentence as ISentence } from '../types';
import { AnnotatedSentence } from './AnnotatedSentence';

interface MainTextViewProps {
    sentences: ISentence[];
}

export const MainTextView: React.FC<MainTextViewProps> = ({ sentences }) => {
    return (
        <div className="space-y-2 h-full">
            <div className="border border-gray-200 rounded-lg p-4 space-y-4 h-full">
                {sentences.map((sentence, index) => (
                    <AnnotatedSentence key={index} sentence={sentence} number={index + 1} />
                ))}
            </div>
        </div>
    );
};
