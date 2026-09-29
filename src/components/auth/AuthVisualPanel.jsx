import { useState, useEffect } from 'react';
import waveImage from '../../assets/images/Wave.png';

export function AuthVisualPanel({ 
  title, 
  description, 
  image, 
  images = [],
  imageAlt = "Visual",
  eyebrow,
  specialties = [],
  titleColor = 'text-primary',
  imageCallouts = [],
  imageBackdrop = false,
  autoSlide = true,
  autoSlideInterval = 3500,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  // Normalize image list
  const imageList = (images && images.length > 0)
    ? images.map((img) => (typeof img === 'string' ? { src: img, alt: imageAlt } : img))
    : (image ? [{ src: image, alt: imageAlt }] : []);

  const totalImages = imageList.length;
  const isCarousel = totalImages > 1;
  const currentImgObj = imageList[currentImageIndex] || imageList[0];

  const hasSpecialties = specialties.length > 0;

  // Auto-slide effect that pauses when hovered
  useEffect(() => {
    if (!autoSlide || !isCarousel || isHovered) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((curr) => (curr + 1) % totalImages);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, isCarousel, isHovered, totalImages, autoSlideInterval]);

  function handlePrev() {
    setCurrentImageIndex((curr) => (curr - 1 + totalImages) % totalImages);
  }

  function handleNext() {
    setCurrentImageIndex((curr) => (curr + 1) % totalImages);
  }

  function handleSliderChange(index) {
    setCurrentImageIndex(Math.min(totalImages - 1, Math.max(0, index)));
  }

  function handleTouchStart(e) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
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
      
      <div className={`relative z-10 flex-1 flex flex-col ${hasSpecialties ? 'pt-6 pb-6 px-5 sm:px-8 lg:pt-8 lg:pb-8 lg:px-10 xl:px-12' : 'pt-10 pb-8 px-8 lg:pt-12 lg:px-14'}`}>
        <div className="max-w-lg">
          {eyebrow && (
            <p className="text-primary font-semibold tracking-wide text-sm mb-3">
              {eyebrow}
            </p>
          )}
          
          <h1 className={`${hasSpecialties ? 'text-2xl sm:text-3xl lg:text-[2rem]' : 'text-[2rem] lg:text-4xl xl:text-[2.75rem]'} font-bold ${titleColor} leading-[1.15] mb-2 lg:mb-3 tracking-tight`}>
            {title}
          </h1>
          
          {!hasSpecialties && (
            <p className="text-lg lg:text-xl text-text-secondary font-normal leading-relaxed max-w-sm">
              {description}
            </p>
          )}
        </div>

        <div className={`${hasSpecialties ? 'mt-3 lg:mt-4' : 'mt-4 lg:mt-6'} justify-start relative flex flex-1 flex-col`}>
          {currentImgObj && (
            <>
              {/* Image Slider Container (Half-page height when hasSpecialties) */}
              <div 
                className={`relative w-full ${hasSpecialties ? 'rounded-2xl mt-0 h-[46vh] lg:h-[48vh] xl:h-[50vh]' : 'rounded-[2rem] mt-2 lg:mt-4'} overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-700`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {imageBackdrop && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[8%] top-[12%] bottom-0 rounded-[2rem] bg-primary-100/80"
                  />
                )}
                <img 
                  key={currentImageIndex}
                  src={currentImgObj.src || currentImgObj} 
                  alt={currentImgObj.alt || imageAlt}
                  className={`relative z-[1] w-full ${hasSpecialties ? 'h-full object-cover object-[center_18%]' : 'h-auto max-h-[50vh] lg:max-h-[54vh] object-contain object-top'} transition-opacity duration-300`}
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

                {/* Carousel Navigation Arrows & Indicators on Image (matching Half Page Slider) */}
                {isCarousel && (
                  <>
                    {/* Left Chevron */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous slide"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all hover:scale-105 cursor-pointer shadow-md focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>

                    {/* Right Chevron */}
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next slide"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all hover:scale-105 cursor-pointer shadow-md focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>

                    {/* Bottom Gradient Overlay for indicator contrast */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10" />

                    {/* Slide Bar Indicators (Segmented dashes at bottom of slider) */}
                    <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center items-center gap-2">
                      {imageList.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSliderChange(index)}
                          aria-label={`Go to slide ${index + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            index === currentImageIndex
                              ? 'w-8 bg-white shadow-sm'
                              : 'w-3 bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {hasSpecialties && (
                <>
                  <p className="mx-auto mt-3 w-full max-w-lg text-center text-sm leading-snug text-text-secondary lg:text-base">
                    {description}
                  </p>
                  <div className="mx-auto mt-3.5 flex w-full max-w-lg flex-col items-center gap-2.5">
                    {[specialties.slice(0, 3), specialties.slice(3)].map((row, rowIndex) => (
                      <div key={rowIndex} className="flex w-full flex-wrap justify-center gap-x-3 gap-y-2.5">
                        {row.map((specialty) => (
                          <span
                            key={specialty}
                            className="inline-flex items-center gap-2 rounded-md border border-white/70 bg-white/90 px-3.5 py-1.5 text-sm font-semibold text-text-primary shadow-sm"
                          >
                            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                            {specialty}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}