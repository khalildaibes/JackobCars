"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar, Car, Fuel, Settings } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Img } from './Img';
import Link from 'next/link';

interface Listing {
  id: number;
  mainImage: string;
  alt: string;
  title: string;
  miles: string;
  fuel: string;
  condition: string;
  transmission: string;
  details: string;
  price: string;
  mileage: string;
  year: number;
  fuelType: string;
  make: string;
  slug: string;
  bodyType: string;
  description: string;
  features: string[];
  category: string[];
}

interface HeroSectionProps {
  listings: Listing[];
}

const HeroSection = ({ listings }: HeroSectionProps) => {
  const t = useTranslations("Hero");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cars, setCars] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (listings && listings.length > 0) {
      // Filter featured cars from the provided listings
      const featuredCars = listings.filter(car => 
        car.category?.includes('featured')
      );
      setCars(featuredCars);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [listings]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cars.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cars.length) % cars.length);
  };

  useEffect(() => {
    if (cars.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [cars.length]);

  if (isLoading) {
    return <div className="min-h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!cars.length) {
    return <div className="min-h-[600px] flex items-center justify-center text-gray-500">
      {t('no_featured_cars_available')}
    </div>;
  }

  const currentArticle = cars[currentIndex];

  return (
    <div className="relative min-h-[400px] sm:min-h-[600px] w-full rounded-xl">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center rounded-xl"
        style={{
          backgroundImage: `url(${currentArticle?.mainImage || '/images/hero-bg.jpg'})`,
          filter: 'brightness(0.8)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))'
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-12">
        <div className="max-w-4xl mx-auto text-center text-white mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            {t('discover_perfect_car')}
          </h1>
          <p className="text-base sm:text-xl md:text-2xl opacity-90">
            {t('exclusive_deals')}
          </p>
        </div>

        {/* Featured Car Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <Link href={`/cars/${currentArticle.id}`}>
              <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex flex-col md:flex-row w-full">
                  {/* Left Section with Icon and Type */}
                  <div className="w-full md:w-[200px] p-3 sm:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="md:mb-2 sm:mb-4">
                      <Car className="w-6 h-6 sm:w-12 sm:h-12 text-gray-700" />
                    </div>
                    <div className="text-right md:text-center">
                      <h3 className="text-sm sm:text-lg font-semibold">{currentArticle?.make || 'Featured Car'}</h3>
                      <p className="text-xs text-gray-500">{currentArticle?.year}</p>
                    </div>
                  </div>

                  {/* Middle Section with Details */}
                  <div className="flex-1 p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{currentArticle?.title}</h2>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{currentArticle?.condition}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg sm:text-2xl font-bold text-blue-600">{currentArticle?.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{currentArticle?.year}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{currentArticle?.fuel || 'Not specified'}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{currentArticle?.transmission || 'Not specified'}</span>
                      </div>
                      {currentArticle?.miles && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1">
                            <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{currentArticle.miles}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Section with Description and Button */}
                  <div className="w-full md:w-[250px] p-3 sm:p-6 flex flex-col items-center justify-center bg-gray-50">
                    <div className="text-center mb-2 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-3">{currentArticle?.description}</p>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-base py-1 sm:py-2"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Circular Image */}
                <div className="absolute top-2 right-2 sm:top-6 sm:right-6 w-12 h-12 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg">
                  <Img
                    external={true}
                    src={currentArticle?.mainImage || '/images/placeholder-car.jpg'}
                    alt={currentArticle?.title || "Featured Car"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Card>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="flex justify-center mt-3 sm:mt-6 gap-3 sm:gap-4">
          <button
            onClick={prevSlide}
            className="p-2 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-2 sm:mt-4 gap-1.5 sm:gap-2">
          {cars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-3 sm:mt-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-white text-xs sm:text-sm">
            <ul className="space-y-1 sm:space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
                {t('info_line_1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
                {t('info_line_2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
                {t('info_line_3')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
