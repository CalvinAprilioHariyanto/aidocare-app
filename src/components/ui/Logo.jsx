import React from 'react';
import logoUrl from '../../assets/images/logo.png';

export function Logo({ className = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoUrl}
        alt="Aido Care Logo"
        className="h-10 w-auto object-contain"
      />
    </div>
  );
}
