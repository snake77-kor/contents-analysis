import React from 'react';
import type { FlowStep } from '../types';

const renderHighlightedText = (text: string, highlights: string[] | undefined) => {
    if (!highlights || highlights.length === 0) {
        return <>{text}</>;
    }
    const highlight = highlights[0];
    if (!text.includes(highlight)) {
        return <>{text}</>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'g'));
    return parts.map((part, index) =>
        part === highlight ? (
            <span key={index} className="bg-sky-100 text-sky-800 px-1 rounded-md">
                {part}
            </span>
        ) : (
            part
        )
    );
};


const FlowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l-5 5M21 3l-6 6" />
    </svg>
);

// FIX: Define props interface for FlowChart component
interface FlowChartProps {
    title: string;
    steps: FlowStep[];
}

export const FlowChart: React.FC<FlowChartProps> = ({ title, steps }) => {
    return (
        <div className="border-2 border-pink-100 rounded-lg p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-pink-200">
                <FlowIcon />
                <h3 className="text-base font-bold text-gray-800">{title}</h3>
            </div>
            <div className="flex-grow overflow-y-auto -mr-4 pr-4">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold text-white bg-teal-700 rounded-full text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-gray-800">{step.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{renderHighlightedText(step.description, step.highlights)}</p>
                            </div>
                        </div>

                        {index < steps.length - 1 && (
                            <div className="my-2 flex flex-col items-center justify-center space-y-2">
                                {step.connectorLabel && (
                                    <span className="text-xs text-yellow-800 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
                                        {step.connectorLabel}
                                    </span>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v12.59l3.22-3.22a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.97 12.03a.75.75 0 011.06-1.06l3.22 3.22V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
