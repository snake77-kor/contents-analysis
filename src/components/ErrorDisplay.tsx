import React from 'react';

export const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm" role="alert">
        <p className="font-bold text-red-700">Error</p>
        <p className="text-red-600">{message}</p>
    </div>
);
