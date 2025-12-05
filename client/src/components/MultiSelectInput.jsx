import React, { useState } from 'react';
import { TagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MultiSelectInput({ label, name, options, selected, onAdd, onRemove }) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = (value) => {
        if (value.trim() && !selected.includes(value.trim())) {
            onAdd(value.trim());
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd(inputValue);
        }
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-vp-text-light/80">
                {label}
            </label>
            
            {/* Display Selected Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((tag) => (
                    <span 
                        key={tag} 
                        className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-vp-secondary text-vp-background"
                    >
                        {tag}
                        <button type="button" onClick={() => onRemove(tag)} className="ml-1 text-vp-background/80 hover:text-white transition">
                            <XMarkIcon className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Input for adding new/custom tags */}
            <div className="flex mt-2">
                <input
                    id={name}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow px-4 py-2 rounded-l-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light text-sm"
                    placeholder="Type condition and press Enter, or select below..."
                />
                <button 
                    type="button" 
                    onClick={() => handleAdd(inputValue)} 
                    className="p-2 rounded-r-lg bg-vp-primary text-white hover:bg-indigo-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Suggested Options */}
            <div className="mt-2 flex flex-wrap gap-2 p-2 rounded-lg bg-vp-background/50 border border-vp-card">
                <TagIcon className="w-4 h-4 text-vp-secondary/70 mt-1" />
                {options.filter(o => !selected.includes(o)).map((option) => (
                    <button 
                        key={option} 
                        type="button"
                        onClick={() => handleAdd(option)}
                        className="text-xs px-2 py-1 border border-vp-secondary/50 rounded-full text-vp-secondary hover:bg-vp-secondary/10 transition"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}