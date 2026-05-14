import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "w-full font-bold py-3 px-6 rounded transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)] text-[var(--color-dark)] shadow-lg shadow-[var(--color-gold)]/20",
        outline: "border-2 border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-dark)]",
        ghost: "text-gray-400 hover:text-[var(--color-gold)] bg-transparent"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
