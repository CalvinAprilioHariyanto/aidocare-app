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
      <div className="flex items-center h-6">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 text-primary bg-surface border-border rounded-[6px] focus:ring-primary focus:ring-4 focus:ring-opacity-20 focus:outline-none accent-primary transition-all duration-200 cursor-pointer"
          {...props}
        />
      </div>
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-text-secondary cursor-pointer pt-0.5 leading-relaxed hover:text-text-primary transition-colors">
          {label}
        </label>
      )}
    </div>
  );
}
