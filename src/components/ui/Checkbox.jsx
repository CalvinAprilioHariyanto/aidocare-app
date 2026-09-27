import React from 'react';

export function Checkbox({ 
  label, 
  checked, 
  onChange, 
  className = '', 
  id,
  ...props 
}) {
  const checkboxId = id || React.useId();
  
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex h-6 items-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-border bg-surface transition-colors checked:border-primary checked:bg-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          {...props}
        />
        {checked && (
          <svg className="pointer-events-none absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-text-secondary cursor-pointer pt-0.5 leading-relaxed hover:text-text-primary transition-colors">
          {label}
        </label>
      )}
    </div>
  );
}
