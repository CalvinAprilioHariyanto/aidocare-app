import React from 'react';
import { Logo } from '../ui/Logo';

export function AuthLayout({ children, visualPanel }) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row p-3 lg:p-4 gap-6 lg:gap-8 font-sans overflow-x-hidden">
      {/* Left side: Visual Panel */}
      <div className="w-full lg:w-[45%] xl:w-[48%] flex-shrink-0 min-h-[400px] lg:h-[calc(100vh-2rem)] rounded-[2rem] overflow-hidden shadow-sm">
        {visualPanel}
      </div>

      {/* Right side: Form Area */}
      <div className="w-full lg:w-[55%] xl:w-[52%] flex flex-col px-4 py-8 sm:px-8 lg:py-12 lg:px-16 xl:px-28">
        <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col">
          <div className="flex justify-center lg:justify-start mb-12 lg:mb-16">
            <Logo className="transform transition-transform hover:scale-[1.02] duration-300" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
