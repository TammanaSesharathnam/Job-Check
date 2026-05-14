import React from 'react';

const Input = ({ label, id, type = 'text', error, ...props }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label htmlFor={id} className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                    {label} <span className="text-red-500">*</span>
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`
          w-full bg-[var(--color-dark-surface)] border rounded px-4 py-3 text-white 
          focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300
          ${error ? 'border-red-500' : 'border-[var(--color-dark-border)]'}
        `}
                {...props}
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    );
};

export default Input;
