import React from 'react';

export function Input({ 
  label, 
  error, 
  helperText, 
  icon,
  rightElement,
  className = '', 
  id,
  ...props 
}) {
  const inputId = id || React.useId();
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted flex items-center transition-colors group-focus-within:text-primary">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full appearance-none px-4 py-3.5 rounded-xl border transition-all duration-200
            outline-none focus:outline-none focus-visible:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
            disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed
            ${icon ? 'pl-11' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${error 
              ? 'border-error text-error focus:border-error focus:ring-error/20 bg-error-light/30' 
              : 'border-border text-text-primary bg-surface hover:border-primary-300'}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-xs ml-1 ${error ? 'text-error font-medium' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}