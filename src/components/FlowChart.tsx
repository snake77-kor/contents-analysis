import React from 'react';
import type { FlowStep } from '../types';

const renderHighlightedText = (text: string, _legacyHighlights?: string[]) => {
    // Split by **...**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return (
                        <span key={index} className="bg-yellow-100 text-yellow-900 border-b-2 border-yellow-300 px-1 rounded mx-0.5 font-bold box-decoration-clone">
                            {content}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </>
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
        <div className="h-full flex flex-col pt-2">
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            <div className="flex-grow relative">
                {/* Vertical Line for the whole flow */}
                <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gray-200"></div>

                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="relative flex items-start gap-4 mb-8">
                            {/* Step Number Circle */}
                            <div className="relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-white bg-teal-700 rounded-full text-sm ring-4 ring-white">
                                {index + 1}
                            </div>

                            {/* Step Content */}
                            <div className="pt-1">
                                <p className="font-bold text-gray-900 text-lg mb-1">{step.title}</p>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {renderHighlightedText(step.description, step.highlights)}
                                </p>
                            </div>
                        </div>

                        {/* Connector Button/Capsule between steps */}
                        {index < steps.length - 1 && step.connectorLabel && (
                            <div className="relative z-10 w-fit ml-10 mb-8 -mt-4">
                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 shadow-sm">
                                    {step.connectorLabel}
                                    <span className="block text-center text-[10px] text-yellow-600">↓</span>
                                </span>
                            </div>
                        )}
                        {/* If no connector label but there is a next step, add a simple arrow or just rely on the line */}
                        {index < steps.length - 1 && !step.connectorLabel && (
                            <div className="relative z-10 ml-[1.15rem] mb-6 text-gray-300">
                                ↓
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
