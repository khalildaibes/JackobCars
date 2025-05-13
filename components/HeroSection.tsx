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
    return <div className="min-h-[400px] flex items-center justify-center max-h-[400px]">
      <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500 "></div>
    </div>;
  }

  if (!cars.length) {
    return <div className="min-h-[400px] flex items-center justify-center text-gray-500 max-h-[400px]">
      {t('no_featured_cars_available')}
    </div>;
  }

  const currentArticle = cars[currentIndex];

  return (
    <div className="relative  w-full rounded-xl h-full overflow-hidden justify-center items-center">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 rounded-xl  h-full overflow-hidden justify-center items-center">
        <Img
          external={currentArticle?.mainImage ? true : false}
          src={currentArticle?.mainImage || '/images/hero-bg.jpg'}
          alt={currentArticle?.title || "Hero Background"}
          width={1290}
          height={1290}
          className="w-full h-full object-cover brightness-[0.8] "
        />
      </div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))'
        }}
      />

      {/* Content */}
      <div className="absolute container mx-auto px-2 sm:px-4 py-1 justify-center items-center  h-full">
        <div className="max-w-4xl mx-auto text-center text-white mb-2 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold line-clamp-1">
            {t('discover_perfect_car')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg opacity-90 line-clamp-1">
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
            className="max-w-4xl w-full mx-auto mt-6 flex justify-center items-center h-[70%]"
          >
            <Link href={`/cars/${currentArticle.id}`}>
              <Card className="relative overflow-visible bg-white/95 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-center items-center min-h-[120px] px-8 w-full">
                <div className="flex flex-col md:flex-row w-full items-center justify-center">
                  {/* Left Section with Icon and Type */}
                  <div className="w-full md:w-[90px] p-1 flex flex-row md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-gray-200 min-h-[60px]">
                    <div className="md:mb-1">
                      <Car className="w-3 h-3 sm:w-6 sm:h-6 text-gray-700" />
                    </div>
                    <div className="text-right md:text-center">
                      <h3 className="text-xs font-semibold text-gray-800">{currentArticle?.make || 'Featured Car'}</h3>
                      <p className="text-[10px] text-gray-500">{currentArticle?.year}</p>
                    </div>
                  </div>

                  {/* Middle Section with Details */}
                  <div className="flex-1 p-1 flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-0.5 sm:gap-0 mb-1 sm:mb-2">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold mb-0.5 text-gray-900">{currentArticle?.title}</h2>
                        <div className="flex items-center gap-0.5 text-[10px] text-gray-700">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{currentArticle?.condition}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm sm:text-base font-bold text-blue-700">{currentArticle?.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-0.5 sm:gap-2 text-[10px] text-gray-700 justify-center">
                      <div className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{currentArticle?.year}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-0.5">
                        <Fuel className="w-2.5 h-2.5" />
                        <span>{currentArticle?.fuel || 'Not specified'}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-0.5">
                        <Settings className="w-2.5 h-2.5" />
                        <span>{currentArticle?.transmission || 'Not specified'}</span>
                      </div>
                      {currentArticle?.miles && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-0.5">
                            <Car className="w-2.5 h-2.5" />
                            <span>{currentArticle.miles}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Section with Description and Button */}
                  <div className="w-full md:w-[110px] p-1 flex flex-col items-center justify-center bg-gray-100 rounded-xl min-h-[60px]">
                    <div className="text-center mb-1 flex-1 flex items-center justify-center">
                      <p className="text-[10px] text-gray-700 line-clamp-2">{currentArticle?.description}</p>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] py-0.5 mt-1"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Circular Image */}
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white flex items-center justify-center">
                  <Img
                    external={currentArticle?.mainImage ? true : false}
                    src={currentArticle?.mainImage || '/images/placeholder-car.jpg'}
                    alt={currentArticle?.title || "Featured Car"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Card>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="flex justify-center mt-2 sm:mt-4 gap-2 sm:gap-3">
          <button
            onClick={prevSlide}
            className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-1 sm:mt-2 gap-1 sm:gap-1.5">
          {cars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors ${
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
