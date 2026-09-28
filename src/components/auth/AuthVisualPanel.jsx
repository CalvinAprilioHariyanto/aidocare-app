import React, { useState } from 'react';
import { AuthCarousel } from './AuthCarousel';
import waveImage from '../../assets/images/Wave.png';

export function AuthVisualPanel({ 
  title, 
  description, 
  image, 
  imageAlt = "Visual",
  eyebrow,
  carousel = false,
  slides = [],
  specialties = [],
  titleColor = 'text-primary',
  imageCallouts = [],
  imageBackdrop = false
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(35);
  const hasSpecialties = specialties.length > 0;

  function moveSlider(direction) {
    setSliderPosition((current) => Math.min(100, Math.max(0, current + direction * 20)));
  }

  return (
    <div className="h-full w-full bg-linear-to-br from-primary-100 via-surface-mint to-white flex flex-col relative overflow-hidden rounded-b-[2rem] lg:rounded-b-none lg:rounded-r-[2rem]">
      {/* Organic Background Decoration */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply transition-all duration-700"
        style={{
          background: 'radial-gradient(circle at 10% 20%, var(--color-primary-100) 0%, transparent 40%), radial-gradient(circle at 90% 80%, var(--color-primary-100) 0%, transparent 40%)'
        }}
      />
      
      {/* Abstract topographic contours */}
      <svg className="absolute inset-0 w-full h-full text-slate-500/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path d="M-100,0 Q150,100 400,0 T1000,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,50 Q150,150 400,50 T1000,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,100 Q150,200 400,100 T1000,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,150 Q150,250 400,150 T1000,200" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-100,200 Q150,300 400,200 T1000,250" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,600 Q200,500 500,650 T1200,600" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,650 Q200,550 500,700 T1200,650" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,700 Q200,600 500,750 T1200,700" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,750 Q200,650 500,800 T1200,750" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,800 Q200,700 500,850 T1200,800" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50,850 Q200,750 500,900 T1200,850" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {hasSpecialties && (
        <img
          src={waveImage}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 w-full grayscale object-cover object-bottom opacity-40 mix-blend-multiply sm:h-56 lg:h-64"
        />
      )}
      
      <div className={`relative z-10 flex-1 flex flex-col ${hasSpecialties ? 'pt-8 pb-12 px-5 sm:px-8 lg:pt-10 lg:pb-14 lg:px-10 xl:px-12' : 'pt-10 pb-8 px-8 lg:pt-12 lg:px-14'}`}>
        <div className="max-w-lg">
          {eyebrow && (
            <p className="text-primary font-semibold tracking-wide text-sm mb-4">
              {eyebrow}
            </p>
          )}
          
          <h1 className={`${hasSpecialties ? 'text-3xl lg:text-4xl' : 'text-[2rem] lg:text-4xl xl:text-[2.75rem]'} font-bold ${titleColor} leading-[1.15] mb-3 lg:mb-4 tracking-tight`}>
            {carousel && slides.length > 0 ? slides[currentSlide].title : title}
          </h1>
          
          {!hasSpecialties && (
            <p className="text-lg lg:text-xl text-text-secondary font-normal leading-relaxed max-w-sm">
              {carousel && slides.length > 0 ? slides[currentSlide].description : description}
            </p>
          )}
        </div>

        <div className={`${hasSpecialties ? 'mt-5 lg:mt-7' : 'mt-4 lg:mt-6'} justify-start relative flex flex-1 flex-col`}>
          {carousel && slides.length > 0 ? (
            <AuthCarousel 
              slides={slides} 
              currentSlide={currentSlide} 
              onSlideChange={setCurrentSlide} 
            />
          ) : (
            image && (
              <>
              <div className={`relative w-full ${hasSpecialties ? 'rounded-md mt-0' : 'rounded-[2rem] mt-2 lg:mt-4'} overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-700 hover:scale-[1.01]`}>
                {imageBackdrop && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[8%] top-[12%] bottom-0 rounded-[2rem] bg-primary-100/80"
                  />
                )}
                <img 
                  src={image} 
                  alt={imageAlt}
                  className={`relative z-[1] w-full h-auto ${hasSpecialties ? 'max-h-[36vh] object-cover object-[center_24%]' : 'max-h-[50vh] lg:max-h-[54vh] object-contain object-top'}`}
                />
                {imageCallouts.map(({ label, icon, position }) => (
                  <div
                    key={label}
                    className={`absolute z-10 inline-flex max-w-[80%] items-center gap-1.5 rounded-md bg-white px-2.5 py-2 text-[10px] font-semibold text-text-primary shadow-card sm:text-xs ${position === 'bottom-left' ? 'bottom-[28%] left-[4%]' : 'right-[3%] top-[42%]'}`}
                  >
                    <span className="shrink-0 text-info" aria-hidden="true">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              {hasSpecialties && (
                <>
                  <p className="mx-auto mt-3 w-full max-w-lg text-center text-sm leading-snug text-text-secondary lg:text-base">
                    {description}
                  </p>
                  <div className="mx-auto mt-10 flex w-full max-w-lg flex-col items-center gap-4">
                    {[specialties.slice(0, 3), specialties.slice(3)].map((row, rowIndex) => (
                      <div key={rowIndex} className="flex w-full flex-wrap justify-center gap-x-4 gap-y-4">
                        {row.map((specialty) => (
                          <span
                            key={specialty}
                            className="inline-flex items-center gap-2 rounded-md border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-text-primary shadow-sm"
                          >
                            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                            {specialty}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mx-auto mt-10 flex w-full max-w-lg items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous specialty"
                      onClick={() => moveSlider(-1)}
                      className="grid h-7 w-7 shrink-0 place-items-center text-primary transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>

                    <div className="relative h-2 flex-1 rounded-full bg-white shadow-sm">
                      <div
                        className="absolute top-0 h-full w-1/4 rounded-full bg-primary transition-[left] duration-500 ease-out"
                        style={{ left: `${sliderPosition * 0.75}%` }}
                        aria-hidden="true"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={sliderPosition}
                        onChange={(event) => setSliderPosition(Number(event.target.value))}
                        aria-label="Move the carousel position"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>

                    <button
                      type="button"
                      aria-label="Next specialty"
                      onClick={() => moveSlider(1)}
                      className="grid h-7 w-7 shrink-0 place-items-center text-primary transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}