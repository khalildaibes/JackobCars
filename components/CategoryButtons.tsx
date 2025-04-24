import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryButtonsProps {
  onCategorySelect?: (category: string) => void;
}

export default function CategoryButtons({ onCategorySelect }: CategoryButtonsProps) {
  const t = useTranslations("HomePage");
  const [selectedCategory, setSelectedCategory] = useState<string>('electric');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const categories = [
    'electric',
    'suv',
    'sedan',
    'pickup_truck',
    'luxury',
    'crossover',
    'hybrid',
    'diesel',
    'coupe',
    'hatchback',
    'wagon',
    'convertible'
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect?.(category);
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mt-4 sm:mt-6 mb-4 sm:mb-6 w-full mx-auto px-2 sm:px-4 items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-white text-sm relative overflow-hidden">
        <div className="relative">
          {/* Scroll Buttons */}
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          )}
          
          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          )}

          {/* Categories */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide px-2 sm:px-4 snap-x snap-mandatory"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-all duration-200 text-xs sm:text-sm snap-start ${
                  selectedCategory === category
                    ? 'bg-[#050B20] text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-[#050B20] active:scale-95'
                }`}
              >
                {t(category)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 