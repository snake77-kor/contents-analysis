import React, { useState, useEffect } from 'react';

interface TextInputAreaProps {
    onAnalyze: (passages: Array<{ title: string; text: string }>) => void;
    initialText: string;
    isInitial: boolean;
}

interface PassageInput {
    id: number;
    titleSelection: string;
    customTitle: string;
    text: string;
}

// Generate title options: 18-40, excluding specified numbers, plus custom ranges.
const excluded = [25, 27, 28, 29];
const numbers = Array.from({ length: 40 - 18 + 1 }, (_, i) => 18 + i)
    .filter(n => !excluded.includes(n));

const titleOptions = [
    { value: 'custom', label: '직접입력' },
    ...numbers.map(n => ({ value: String(n), label: `${n}번` })),
    { value: '41-42', label: '41~42번' },
    { value: '43-45', label: '43~45번' },
];

export const TextInputArea: React.FC<TextInputAreaProps> = ({ onAnalyze, initialText, isInitial }) => {
    const getInitialState = () => isInitial
        ? [{ id: 1, titleSelection: 'custom', customTitle: '', text: initialText }]
        : [{ id: Date.now(), titleSelection: '18', customTitle: '', text: '' }];

    const [passages, setPassages] = useState<PassageInput[]>(getInitialState);

    useEffect(() => {
        setPassages(getInitialState());
    }, [isInitial, initialText]);


    const handlePassageChange = (id: number, field: keyof Omit<PassageInput, 'id'>, value: string) => {
        setPassages(passages.map(p => {
            if (p.id === id) {
                const updatedPassage = { ...p, [field]: value };
                if (field === 'titleSelection' && value !== 'custom') {
                    updatedPassage.customTitle = '';
                }
                return updatedPassage;
            }
            return p;
        }));
    };

    const addPassage = () => {
        const lastSelection = passages.length > 0 ? passages[passages.length - 1].titleSelection : '18';
        const lastNumber = parseInt(lastSelection);
        const nextNumber = isNaN(lastNumber) ? 19 : lastNumber + 1;
        const nextDefaultSelection = titleOptions.find(opt => opt.value === String(nextNumber)) ? String(nextNumber) : 'custom';

        setPassages([
            ...passages,
            { id: Date.now(), titleSelection: nextDefaultSelection, customTitle: '', text: '' }
        ]);
    };

    const removePassage = (id: number) => {
        setPassages(passages.filter(p => p.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nonEmptyPassages = passages.filter(p => p.text.trim() !== '');

        if (nonEmptyPassages.length > 0) {
            const passagesToAnalyze = nonEmptyPassages.map(p => {
                const title = p.titleSelection === 'custom'
                    ? p.customTitle.trim() || `Untitled Passage`
                    : `${p.titleSelection.replace('-', '~')}번`;
                return { title, text: p.text.trim() };
            });

            onAnalyze(passagesToAnalyze);
        }
    };

    const canSubmit = passages.some(p => p.text.trim() !== '');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{isInitial ? 'Start Your Analysis' : 'Analyze Another Passage'}</h2>
                <p className="text-gray-600 mb-6">{isInitial ? 'Paste your English text and set a title to generate a complete breakdown.' : 'Add one or more passages to continue.'}</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {passages.map((passage, index) => (
                            <div key={passage.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 relative">
                                {passages.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePassage(passage.id)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-lg leading-none shadow-md"
                                        aria-label="Remove passage"
                                    >
                                        <span>&times;</span>
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <div className="md:col-span-1">
                                        <label htmlFor={`title-select-${passage.id}`} className="block text-sm font-medium text-gray-700 mb-1">Passage Category</label>
                                        <select
                                            id={`title-select-${passage.id}`}
                                            value={passage.titleSelection}
                                            onChange={(e) => handlePassageChange(passage.id, 'titleSelection', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white"
                                        >
                                            {titleOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {passage.titleSelection === 'custom' && (
                                        <div className="md:col-span-2">
                                            <label htmlFor={`custom-title-${passage.id}`} className="block text-sm font-medium text-gray-700 mb-1">Custom Title</label>
                                            <input
                                                id={`custom-title-${passage.id}`}
                                                type="text"
                                                value={passage.customTitle}
                                                onChange={(e) => handlePassageChange(passage.id, 'customTitle', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                                                placeholder="e.g. The Principle of Salt Absorption"
                                            />
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    value={passage.text}
                                    onChange={(e) => handlePassageChange(passage.id, 'text', e.target.value)}
                                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-shadow resize-y"
                                    placeholder={`Enter English text for passage ${index + 1}...`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={addPassage}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors text-sm"
                        >
                            + 추가 지문
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
                            disabled={!canSubmit}
                        >
                            {isInitial ? 'Analyze Text' : 'Analyze New Text'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
