import React from 'react';
import { BookOpen, Download, RefreshCw, FileText } from 'lucide-react';

interface HeaderProps {
    onReset: () => void;
    showActions: boolean;
    onDownloadPdf: () => void;
    onDownloadHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showActions, onDownloadPdf, onDownloadHtml }) => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={onReset}>
                    <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-2 rounded-lg shadow-sm">
                        <BookOpen className="text-white h-6 w-6" />
                    </div>
                    <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        English Analysis
                    </span>
                </div>

                {showActions && (
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            <button
                                onClick={onDownloadHtml}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Save HTML
                            </button>
                            <button
                                onClick={onDownloadPdf}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Save PDF
                            </button>
                        </div>
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>New Analysis</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
