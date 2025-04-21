"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar, Car, Fuel, Settings } from "lucide-react";
import { getCookie } from '../utils/cookieUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Img } from './Img';
import Link from 'next/link';

interface CarArticle {
  id: string;
  name: string;
  description: string;
  price: number;
  image: { url: string };
  category: string;
  details: {
    car: {
      fuel: string;
      make: string;
      body_type: string;
      miles: string;
      condition: string;
      transmission: string;
      year: number;
      description: string;
      features: Array<{ value: string }>;
    };
  };
}

const HeroSection = () => {
  const t = useTranslations("Hero");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [articles, setArticles] = useState<CarArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticlesFromCookie = async () => {
      try {
        const cachedData = getCookie('dealsData');
        console.log('Raw cookie data:', cachedData);
        
        if (!cachedData) {
          console.log('No cached data found');
          // If no cached data, fetch it directly
          const response = await fetch('/api/deals?store_hostname=64.227.112.249');
          if (!response.ok) {
            throw new Error(`Failed to fetch deals: ${response.statusText}`);
          }
          const data = await response.json();
          if (!data?.data) {
            throw new Error("Invalid API response structure");
          }
          // Filter featured cars
          const featuredCars = data.data.filter((car: CarArticle) => 
            car.category?.includes('featured')
          );
          setArticles(featuredCars);
          console.log('Fetched fresh data:', featuredCars);
        } else {
          // Filter featured cars from cached data
          const featuredCars = Array.isArray(cachedData) 
            ? cachedData.filter(car => car.category?.includes('featured'))
            : [];
          setArticles(featuredCars);
          console.log('Using cached data:', featuredCars);
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticlesFromCookie();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  if (isLoading) {
    return <div className="min-h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!articles.length) {
    return <div className="min-h-[600px] flex items-center justify-center text-gray-500">
      No featured cars available at the moment
    </div>;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative min-h-[600px] w-full">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentArticle?.image?.url ? `http://64.227.112.249${currentArticle.image.url}` : '/images/hero-bg.jpg'})`,
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
      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('discover_perfect_car')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
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
                  <div className="w-full md:w-[200px] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="mb-4">
                      <Car className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-center">{currentArticle?.details?.car?.make || 'Featured Car'}</h3>
                    <p className="text-sm text-gray-500 text-center">{currentArticle?.details?.car?.year}</p>
                  </div>

                  {/* Middle Section with Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{currentArticle?.name}</h2>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{currentArticle?.details?.car?.condition}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">${currentArticle?.price?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{currentArticle?.details?.car?.year}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span>{currentArticle?.details?.car?.fuel || 'Not specified'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>{currentArticle?.details?.car?.transmission || 'Not specified'}</span>
                      </div>
                      {currentArticle?.details?.car?.miles && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            <span>{currentArticle.details.car.miles} miles</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Section with Description and Button */}
                  <div className="w-full md:w-[250px] p-6 flex flex-col items-center justify-center bg-gray-50">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 line-clamp-3">{currentArticle?.description || currentArticle?.details?.car?.description}</p>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Circular Image */}
                <div className="absolute top-6 right-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Img
                    external={true}
                    src={currentArticle?.image?.url ? `http://64.227.112.249${currentArticle.image.url}` : '/images/placeholder-car.jpg'}
                    alt={currentArticle?.name || "Featured Car"}
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
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('info_line_1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('info_line_2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
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
