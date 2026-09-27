import React from 'react';

export function AuthLayout({ children, visualPanel, compact = false, topAlignForm = false }) {
  return (
    <div className={`auth-layout min-h-screen bg-background flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden p-3 lg:p-4 gap-6 lg:gap-8 font-sans overflow-x-hidden ${compact ? 'auth-layout--compact' : ''}`}>
      {/* Left side: Visual Panel */}
      <div className="w-full lg:w-[calc(48%-1rem)] xl:w-[calc(50%-1rem)] flex-shrink-0 min-h-[400px] lg:h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-2rem)] rounded-[2rem] overflow-hidden shadow-sm">
        {visualPanel}
      </div>

      {/* Right side: Form Area */}
      <div className="auth-form-area w-full min-w-0 lg:min-h-0 lg:flex-1 flex flex-col px-4 py-8 sm:px-8 lg:py-12 lg:px-16 xl:px-28">
        <div className="w-full max-w-[420px] mx-auto lg:min-h-0 flex-1 flex flex-col">
          <div className={`auth-form-content flex-1 flex flex-col ${topAlignForm ? 'justify-start' : 'justify-center'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}