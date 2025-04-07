"use client"; // This marks the component as a Client Component

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Slider } from "../../components/ui/slider";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { CheckCircle, Car, DollarSign, Fuel, Settings, Users, Heart, Shield, Zap, Truck, Briefcase, ArrowRight, Medal, Clock, Send, ChevronRight, ChevronLeft, Sparkles, Star, ThumbsUp, ThumbsDown, Play, PlayCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  type: 'range' | 'choice';
  options?: {
    [key: string]: string;
  };
  min?: string;
  max?: string;
}

interface RecommendedCar {
  id: string;
  name: string;
  match: number;
  image: string;
  price: string;
  pros: string[];
  cons: string[];
  videoUrl?: string;
  reelUrl?: string;
  interiorUrl?: string;
  ownerReviewUrl?: string;
}

const CarRecommender: React.FC = () => {
  const t = useTranslations('CarRecommendations');
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedCar[]>([]);

const questions: Question[] = [
  {
    id: 'budget',
      question: t('questions.budget.question'),
      type: 'range',
      min: t('questions.budget.min'),
      max: t('questions.budget.max')
  },
  {
    id: 'primaryUse',
      question: t('questions.primaryUse.question'),
      type: 'choice',
      options: {
        commuting: t('questions.primaryUse.options.commuting'),
        family: t('questions.primaryUse.options.family'),
        performance: t('questions.primaryUse.options.performance'),
        offroad: t('questions.primaryUse.options.offroad'),
        luxury: t('questions.primaryUse.options.luxury')
      }
  },
  {
    id: 'bodyType',
      question: t('questions.bodyType.question'),
      type: 'choice',
      options: {
        sedan: t('questions.bodyType.options.sedan'),
        suv: t('questions.bodyType.options.suv'),
        truck: t('questions.bodyType.options.truck'),
        coupe: t('questions.bodyType.options.coupe'),
        convertible: t('questions.bodyType.options.convertible'),
        hatchback: t('questions.bodyType.options.hatchback'),
        wagon: t('questions.bodyType.options.wagon'),
        van: t('questions.bodyType.options.van')
      }
  },
  {
    id: 'fuelType',
      question: t('questions.fuelType.question'),
      type: 'choice',
      options: {
        gasoline: t('questions.fuelType.options.gasoline'),
        diesel: t('questions.fuelType.options.diesel'),
        hybrid: t('questions.fuelType.options.hybrid'),
        electric: t('questions.fuelType.options.electric'),
        any: t('questions.fuelType.options.any')
      }
  },
  {
    id: 'passengers',
      question: t('questions.passengers.question'),
      type: 'choice',
      options: {
        '1-2': t('questions.passengers.options.1-2'),
        '3-4': t('questions.passengers.options.3-4'),
        '5-6': t('questions.passengers.options.5-6'),
        '7+': t('questions.passengers.options.7+')
      }
  },
  {
    id: 'driving',
      question: t('questions.driving.question'),
      type: 'choice',
      options: {
        city: t('questions.driving.options.city'),
        highway: t('questions.driving.options.highway'),
        mixed: t('questions.driving.options.mixed'),
        rural: t('questions.driving.options.rural'),
        offroad: t('questions.driving.options.offroad')
      }
  },
  {
    id: 'cargoSpace',
      question: t('questions.cargoSpace.question'),
      type: 'range',
      min: t('questions.cargoSpace.min'),
      max: t('questions.cargoSpace.max')
  },
  {
    id: 'fuelEfficiency',
      question: t('questions.fuelEfficiency.question'),
      type: 'range',
      min: t('questions.fuelEfficiency.min'),
      max: t('questions.fuelEfficiency.max')
  },
  {
    id: 'luxury',
      question: t('questions.luxury.question'),
      type: 'range',
      min: t('questions.luxury.min'),
      max: t('questions.luxury.max')
  },
  {
    id: 'performance',
      question: t('questions.performance.question'),
      type: 'range',
      min: t('questions.performance.min'),
      max: t('questions.performance.max')
  },
  {
    id: 'safety',
      question: t('questions.safety.question'),
      type: 'range',
      min: t('questions.safety.min'),
      max: t('questions.safety.max')
  },
  {
    id: 'tech',
      question: t('questions.tech.question'),
      type: 'range',
      min: t('questions.tech.min'),
      max: t('questions.tech.max')
  },
  {
    id: 'reliability',
      question: t('questions.reliability.question'),
      type: 'range',
      min: t('questions.reliability.min'),
      max: t('questions.reliability.max')
  },
  {
    id: 'brand',
      question: t('questions.brand.question'),
      type: 'choice',
      options: {
        toyota: t('questions.brand.options.toyota'),
        honda: t('questions.brand.options.honda'),
        ford: t('questions.brand.options.ford'),
        chevrolet: t('questions.brand.options.chevrolet'),
        bmw: t('questions.brand.options.bmw'),
        mercedes: t('questions.brand.options.mercedes'),
        audi: t('questions.brand.options.audi'),
        tesla: t('questions.brand.options.tesla'),
        lexus: t('questions.brand.options.lexus'),
        subaru: t('questions.brand.options.subaru'),
        no_preference: t('questions.brand.options.no_preference')
      }
  },
  {
    id: 'maintenance',
      question: t('questions.maintenance.question'),
      type: 'range',
      min: t('questions.maintenance.min'),
      max: t('questions.maintenance.max')
    }
  ];

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Generate recommendations based on answers
      generateRecommendations();
      setShowRecommendations(true);
    }
  };
  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const generateRecommendations = () => {
    // This is a mock implementation - in a real app, this would call an API
    const mockRecommendations: RecommendedCar[] = [
      {
        id: '1',
        name: 'Toyota Camry',
        match: 95,
        image: '/images/cars/camry.jpg',
        price: '$25,000',
        pros: ['Reliable', 'Fuel efficient', 'Comfortable'],
        cons: ['Boring design', 'Limited cargo space'],
        videoUrl: 'https://example.com/camry-review',
        reelUrl: 'https://example.com/camry-reel',
        interiorUrl: 'https://example.com/camry-interior',
        ownerReviewUrl: 'https://example.com/camry-owner'
      },
      // Add more mock recommendations...
    ];
    setRecommendations(mockRecommendations);
  };

  const handleStartOver = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowRecommendations(false);
    setRecommendations([]);
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;

        return (
    <div className=" rounded-lg py-12 px-[10%] mt-[5%]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 bg-white rounded-lg p-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        {!showRecommendations ? (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {t('question_progress', { current: currentQuestion + 1, total: questions.length })}
                </span>
                <span className="text-sm text-gray-500">{t('complete', { percentage: Math.round(progress) })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {questions[currentQuestion].question}
                </h2>

                {questions[currentQuestion].type === 'range' ? (
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={answers[questions[currentQuestion].id] || 50}
                      onChange={(e) => handleAnswer(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{questions[currentQuestion].min}</span>
                      <span>{questions[currentQuestion].max}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(questions[currentQuestion].options || {}).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          answers[questions[currentQuestion].id] === value
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        {label}
                      </button>
            ))}
          </div>
                )}
      </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              <button
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentQuestion === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                {t('back')}
              </button>
              <button
                  onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentQuestion === questions.length - 1 ? t('get_recommendations') : t('next')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">{t('top_matches')}</h2>
              <button
                onClick={handleStartOver}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t('start_over')}
              </button>
                  </div>

            <p className="text-gray-600">{t('matches_description')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                          <img 
                            src={car.image} 
                      alt={car.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {t('match_percentage', { percentage: car.match })}
                            </div>
                          </div>
                          
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
                    <p className="text-gray-600 mb-4">{car.price}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('pros')}</h4>
                        <ul className="space-y-2">
                          {car.pros.map((pro, index) => (
                            <li key={index} className="flex items-center text-green-600">
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('cons')}</h4>
                        <ul className="space-y-2">
                          {car.cons.map((con, index) => (
                            <li key={index} className="flex items-center text-red-600">
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              {con}
                                </li>
                              ))}
                            </ul>
                        </div>
                      </div>
                      
                    <div className="mt-6 space-y-4">
                      <button
                        onClick={() => router.push(`/car-details/${car.id}`)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {t('view_similar')}
                      </button>

                      <button
                        onClick={() => router.push(`/car-details/${car.id}?tab=dealers`)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        {t('find_dealerships')}
                      </button>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-4">{t('video_reviews')}</h4>
                      <p className="text-sm text-gray-600 mb-4">{t('video_reviews_description')}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {car.videoUrl && (
                          <a
                            href={car.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {t('watch_video')}
                          </a>
                        )}
                        {car.reelUrl && (
                          <a
                            href={car.reelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {t('watch_reel')}
                          </a>
                        )}
                        {car.interiorUrl && (
                          <a
                            href={car.interiorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {t('interior_features')}
                          </a>
                        )}
                        {car.ownerReviewUrl && (
                          <a
                            href={car.ownerReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            {t('owners_experience')}
                          </a>
                        )}
                      </div>
                    </div>
                      </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRecommender;
