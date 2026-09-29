

export function AuthCarousel({ slides, currentSlide = 0, onSlideChange }) {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full relative flex flex-col gap-8">
      {/* Image Container with subtle organic feel */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-card transition-all duration-500 hover:scale-[1.01] bg-surface">
        {slides[currentSlide].image ? (
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title || "Carousel slide"} 
            className="w-full h-auto max-h-[45vh] object-cover object-center transition-opacity duration-500"
            key={currentSlide}
          />
        ) : (
          <div className="w-full aspect-[4/3] max-h-[45vh] bg-surface-muted/50 flex flex-col items-center justify-center text-primary-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="font-medium tracking-wide">Image Placeholder</span>
          </div>
        )}
      </div>

      {/* Pagination integrated naturally into the flow */}
      <div className="flex gap-3 items-center px-4 mb-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange?.(index)}
            className={`h-2 rounded-full transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              index === currentSlide 
                ? 'w-16 bg-primary shadow-sm' 
                : 'w-6 bg-primary-200 hover:bg-primary-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
