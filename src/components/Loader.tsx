import React from 'react';

export const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-lg text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
);
