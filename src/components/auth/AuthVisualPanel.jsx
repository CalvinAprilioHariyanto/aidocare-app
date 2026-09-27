import React, { useState } from 'react';
import { AuthCarousel } from './AuthCarousel';

export function AuthVisualPanel({ 
  title, 
  description, 
  image, 
  imageAlt = "Visual",
  eyebrow,
  carousel = false,
  slides = []
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="h-full w-full bg-surface-mint flex flex-col relative overflow-hidden rounded-[2rem]">
      {/* Organic Background Decoration */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply transition-all duration-700"
        style={{
          background: 'radial-gradient(circle at 10% 20%, var(--color-primary-100) 0%, transparent 40%), radial-gradient(circle at 90% 80%, var(--color-primary-100) 0%, transparent 40%)'
        }}
      />
      
      {/* Abstract topographic contours */}
      <svg className="absolute inset-0 w-full h-full text-primary-200/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path d="M-100,50 Q150,150 400,50 T1000,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,100 Q150,200 400,100 T1000,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,150 Q150,250 400,150 T1000,200" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,700 Q200,600 500,750 T1200,700" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,750 Q200,650 500,800 T1200,750" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,800 Q200,700 500,850 T1200,800" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      
      <div className="relative z-10 flex-1 flex flex-col pt-12 pb-8 px-8 lg:px-14">
        <div className="max-w-lg mt-4 lg:mt-8">
          {eyebrow && (
            <p className="text-primary font-semibold tracking-wide text-sm mb-4">
              {eyebrow}
            </p>
          )}
          
          <h1 className="text-[2rem] lg:text-4xl xl:text-[2.75rem] font-bold text-primary leading-[1.15] mb-5 tracking-tight">
            {carousel && slides.length > 0 ? slides[currentSlide].title : title}
          </h1>
          
          <p className="text-text-secondary text-lg lg:text-xl font-normal leading-relaxed max-w-sm">
            {carousel && slides.length > 0 ? slides[currentSlide].description : description}
          </p>
        </div>

        <div className="mt-8 lg:mt-12 flex-1 flex flex-col justify-end relative">
          {carousel && slides.length > 0 ? (
            <AuthCarousel 
              slides={slides} 
              currentSlide={currentSlide} 
              onSlideChange={setCurrentSlide} 
            />
          ) : (
            image && (
              <div className="relative w-full rounded-[2rem] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-700 hover:scale-[1.01] mt-8">
                <img 
                  src={image} 
                  alt={imageAlt}
                  className="w-full h-auto max-h-[50vh] object-cover object-top"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
