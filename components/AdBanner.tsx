'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Img } from './Img';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdBannerProps {
  imageUrl: string;
  link: string;
  alt: string;
  className?: string;
}

interface AdSliderProps {
  ads: {
    id: number;
    imageUrl: string;
    link: string;
    alt: string;
  }[];
}

const AdBanner: React.FC<AdBannerProps> = ({ imageUrl, link, alt, className = '' }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${className}`}
    >
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={alt}
          width={2090}
          height={2787}
          className="object-fit"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 250px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </a>
  );
};

export const AdSlider: React.FC<AdSliderProps> = ({ ads }) => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [ads.length, mounted]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return (
      <div className="relative w-full h-[300px] overflow-hidden rounded-xl bg-gray-100">
        <AdBanner
          imageUrl={ads[0].imageUrl}
          link={ads[0].link}
          alt={ads[0].alt}
          className="h-full"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-xl">
      <div 
        className="flex h-full"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${ads.length * 100}%`,
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {ads.map((ad) => (
          <div 
            key={ad.id} 
            className="flex-shrink-0 h-full"
            style={{ width: `${100 / ads.length}%` }}
          >
            <AdBanner
              imageUrl={ad.imageUrl}
              link={ad.link}
              alt={ad.alt}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdBanner; 