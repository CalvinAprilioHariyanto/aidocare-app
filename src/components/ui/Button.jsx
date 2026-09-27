import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-800 shadow-sm hover:shadow-card",
    secondary: "bg-surface-muted text-text-primary hover:bg-border shadow-sm",
    outline: "border-2 border-border text-text-primary hover:border-primary hover:text-primary bg-surface",
    ghost: "bg-transparent text-primary hover:bg-primary-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
