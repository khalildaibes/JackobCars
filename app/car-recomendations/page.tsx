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
import { CheckCircle, Car, DollarSign, Fuel, Settings, Users, Heart, Shield, Zap, Truck, Briefcase, ArrowRight, Medal, Clock, Send } from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface Question {
  id: string;
  question: string;
  type: 'radio' | 'slider' | 'multi';
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
}

interface RecommendedCar {
  make: string;
  model: string;
  year: number;
  description: string;
  image: string;
  price: number;
  matchPercentage: number;
  pros: string[];
  cons: string[];
  bodyType: string;
}

const questions: Question[] = [
  {
    id: 'budget',
    question: 'What is your budget?',
    type: 'slider',
    min: 10000,
    max: 100000,
    step: 5000,
    minLabel: '$10,000',
    maxLabel: '$100,000+'
  },
  {
    id: 'primaryUse',
    question: 'What will be the primary use of your car?',
    type: 'radio',
    options: [
      { value: 'commuting', label: 'Daily Commuting', icon: <Clock size={24} /> },
      { value: 'family', label: 'Family Transport', icon: <Users size={24} /> },
      { value: 'performance', label: 'Performance/Sport', icon: <Zap size={24} /> },
      { value: 'offroad', label: 'Off-Road Adventure', icon: <Truck size={24} /> },
      { value: 'luxury', label: 'Luxury & Comfort', icon: <Heart size={24} /> }
    ]
  },
  {
    id: 'bodyType',
    question: 'What body type do you prefer?',
    type: 'radio',
    options: [
      { value: 'sedan', label: 'Sedan' },
      { value: 'suv', label: 'SUV/Crossover' },
      { value: 'truck', label: 'Truck' },
      { value: 'coupe', label: 'Coupe' },
      { value: 'convertible', label: 'Convertible' },
      { value: 'hatchback', label: 'Hatchback' },
      { value: 'wagon', label: 'Wagon' },
      { value: 'van', label: 'Minivan' },
    ]
  },
  {
    id: 'fuelType',
    question: 'What fuel type do you prefer?',
    type: 'radio',
    options: [
      { value: 'gasoline', label: 'Gasoline', icon: <Fuel size={24} /> },
      { value: 'diesel', label: 'Diesel', icon: <Fuel size={24} /> },
      { value: 'hybrid', label: 'Hybrid', icon: <Zap size={24} /> },
      { value: 'electric', label: 'Electric', icon: <Zap size={24} /> },
      { value: 'any', label: 'No Preference', icon: <CheckCircle size={24} /> },
    ]
  },
  {
    id: 'passengers',
    question: 'How many passengers do you regularly transport?',
    type: 'radio',
    options: [
      { value: '1-2', label: '1-2 People' },
      { value: '3-4', label: '3-4 People' },
      { value: '5-6', label: '5-6 People' },
      { value: '7+', label: '7+ People' },
    ]
  },
  {
    id: 'driving',
    question: 'What type of driving do you typically do?',
    type: 'radio',
    options: [
      { value: 'city', label: 'City/Urban' },
      { value: 'highway', label: 'Highway/Commuting' },
      { value: 'mixed', label: 'Mixed City & Highway' },
      { value: 'rural', label: 'Rural/Country Roads' },
      { value: 'offroad', label: 'Off-Road Terrain' },
    ]
  },
  {
    id: 'cargoSpace',
    question: 'How important is cargo space to you?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'fuelEfficiency',
    question: 'How important is fuel efficiency to you?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'luxury',
    question: 'How important are luxury features to you?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'performance',
    question: 'How important is performance/acceleration to you?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'safety',
    question: 'How important are advanced safety features?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'tech',
    question: 'How important is in-car technology to you?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'reliability',
    question: 'How important is long-term reliability to you?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Important',
    maxLabel: 'Very Important'
  },
  {
    id: 'brand',
    question: 'Do you have any brand preferences?',
    type: 'multi',
    options: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'honda', label: 'Honda' },
      { value: 'ford', label: 'Ford' },
      { value: 'chevrolet', label: 'Chevrolet' },
      { value: 'bmw', label: 'BMW' },
      { value: 'mercedes', label: 'Mercedes-Benz' },
      { value: 'audi', label: 'Audi' },
      { value: 'tesla', label: 'Tesla' },
      { value: 'lexus', label: 'Lexus' },
      { value: 'subaru', label: 'Subaru' },
      { value: 'no_preference', label: 'No Preference' },
    ]
  },
  {
    id: 'maintenance',
    question: 'How concerned are you about maintenance costs?',
    type: 'slider',
    min: 1,
    max: 5,
    step: 1,
    minLabel: 'Not Concerned',
    maxLabel: 'Very Concerned'
  }
];

// Mock recommendations based on user answers
const getRecommendations = (answers: Record<string, any>): RecommendedCar[] => {
  // This would normally be a complex algorithm matching user preferences to car database
  // For this demo, we'll return static recommendations with some logic based on a few key answers
  
  const recommendations: RecommendedCar[] = [];
  
  // Example logic to determine recommendations
  const budget = answers.budget || 40000;
  const fuelType = answers.fuelType || 'any';
  const bodyType = answers.bodyType || 'sedan';
  const primaryUse = answers.primaryUse || 'commuting';
  const passengers = answers.passengers || '3-4';
  
  // Different car recommendations based on combination of preferences
  if (bodyType === 'sedan' && primaryUse === 'commuting' && budget < 35000) {
    recommendations.push({
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      description: 'A reliable and efficient sedan perfect for daily commuting with good fuel economy and comfortable interior.',
      image: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800&auto=format&fit=crop',
      price: 32000,
      matchPercentage: 94,
      pros: ['Excellent fuel economy', 'Roomy interior', 'Great safety features', 'Reliable'],
      cons: ['Not the most exciting to drive', 'Basic standard features in base trim'],
      bodyType: 'Sedan'
    });
  }
  
  if ((bodyType === 'sedan' || bodyType === 'hatchback') && fuelType === 'electric') {
    recommendations.push({
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      description: 'A popular electric vehicle with long range, cutting-edge technology, and impressive performance.',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop',
      price: 47000,
      matchPercentage: fuelType === 'electric' ? 97 : 82,
      pros: ['Zero emissions', 'Low operating costs', 'High-tech features', 'Quick acceleration'],
      cons: ['Higher initial cost', 'Range anxiety on long trips', 'Charging infrastructure dependent'],
      bodyType: 'Sedan'
    });
  }
  
  if (bodyType === 'suv' && passengers === '5-6') {
    recommendations.push({
      make: 'Toyota',
      model: 'Highlander',
      year: 2023,
      description: 'A versatile midsize SUV with three rows of seating, ample cargo space, and a reputation for reliability.',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
      price: 42000,
      matchPercentage: 91,
      pros: ['Seating for up to 8', 'Hybrid option available', 'Strong safety ratings', 'Comfortable ride'],
      cons: ['Third row is tight for adults', 'Not as fuel efficient as smaller SUVs'],
      bodyType: 'SUV'
    });
  }
  
  if (primaryUse === 'performance') {
    recommendations.push({
      make: 'Ford',
      model: 'Mustang GT',
      year: 2023,
      description: 'An iconic American muscle car with powerful V8 engine, athletic handling, and classic styling.',
      image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop',
      price: 56000,
      matchPercentage: 88,
      pros: ['Exhilarating V8 power', 'Head-turning style', 'Fun to drive', 'Modern tech features'],
      cons: ['Poor fuel economy', 'Limited practicality', 'Firm ride quality'],
      bodyType: 'Coupe'
    });
  }
  
  if (bodyType === 'truck' || primaryUse === 'offroad') {
    recommendations.push({
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      description: 'America\'s best-selling truck with powerful engine options, impressive towing capacity, and rugged capability.',
      image: 'https://images.unsplash.com/photo-1599256630245-6faf1a1ac0d6?w=800&auto=format&fit=crop',
      price: 52000,
      matchPercentage: bodyType === 'truck' ? 95 : 84,
      pros: ['Excellent towing capacity', 'Spacious cabin', 'Multiple engine options', 'Off-road capability'],
      cons: ['Large size can be difficult to park', 'Expensive higher trims', 'Fuel economy not great with V8'],
      bodyType: 'Truck'
    });
  }
  
  if (primaryUse === 'luxury') {
    recommendations.push({
      make: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2023,
      description: 'A sophisticated luxury sedan with elegant styling, premium materials, and advanced technology features.',
      image: 'https://images.unsplash.com/photo-1617814076668-4af3ff8c4a04?w=800&auto=format&fit=crop',
      price: 68000,
      matchPercentage: 93,
      pros: ['Exquisite interior quality', 'Cutting-edge technology', 'Refined ride quality', 'Prestigious brand'],
      cons: ['Expensive to buy and maintain', 'Less sporty than some rivals', 'Complex tech can be overwhelming'],
      bodyType: 'Sedan'
    });
  }
  
  // Add more fallback recommendations to ensure we always have at least 3
  recommendations.push({
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    description: 'A popular compact SUV known for its reliability, practicality, and available hybrid powertrain.',
    image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format&fit=crop',
    price: 34000,
    matchPercentage: 86,
    pros: ['Excellent reliability', 'Good fuel economy', 'Available hybrid option', 'Spacious for its class'],
    cons: ['Interior materials could be better', 'Not as fun to drive as some competitors'],
    bodyType: 'SUV'
  });
  
  recommendations.push({
    make: 'Mazda',
    model: 'CX-5',
    year: 2023,
    description: 'A stylish compact SUV that offers premium features, engaging driving dynamics, and upscale design.',
    image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d094?w=800&auto=format&fit=crop',
    price: 33000,
    matchPercentage: 82,
    pros: ['Upscale interior', 'Engaging driving experience', 'Attractive styling', 'Good safety features'],
    cons: ['Less cargo space than rivals', 'Not the most fuel-efficient in class'],
    bodyType: 'SUV'
  });
  
  // Sort by match percentage
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

const CarRecommender: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [recommendations, setRecommendations] = useState<RecommendedCar[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Generate recommendations based on answers
      const results = getRecommendations(answers);
      setRecommendations(results);
      setShowResults(true);
    }
  };
  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
    setShowResults(false);
    setSelectedCarIndex(0);
  };
  
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
          >
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-start space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${question.id}-${option.value}`}
                  className="mt-1"
                />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="flex items-center cursor-pointer p-3 border rounded-md hover:bg-blue-50 transition-colors w-full"
                >
                  {option.icon && <div className="mr-3 text-blue-600">{option.icon}</div>}
                  <span>{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'slider':
        return (
          <div className="space-y-6 mt-6">
            <Slider
              value={[answers[question.id] || question.min || 1]}
              min={question.min}
              max={question.max}
              step={question.step}
              onValueChange={(value) => handleAnswerChange(question.id, value[0])}
              className="py-6"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
            {answers[question.id] && (
              <p className="text-center font-medium">
                {question.id === 'budget' ? `$${answers[question.id].toLocaleString()}` : `Selected: ${answers[question.id]}`}
              </p>
            )}
          </div>
        );
        
      case 'multi':
        return (
          <div className="flex flex-wrap gap-2 mt-6">
            {question.options?.map((option) => (
              <Badge
                key={option.value}
                variant={answers[question.id]?.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer px-3 py-2 text-sm"
                onClick={() => {
                  const currentSelections = Array.isArray(answers[question.id]) ? [...answers[question.id]] : [];
                  const newSelections = currentSelections.includes(option.value)
                    ? currentSelections.filter(v => v !== option.value)
                    : [...currentSelections, option.value];
                  handleAnswerChange(question.id, newSelections);
                }}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const progressPercentage = Math.round((currentQuestion / questions.length) * 100);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Car</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Answer a few questions and we'll recommend cars that match your needs and preferences.
        </p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <Badge variant="outline">{Math.round(progressPercentage)}% Complete</Badge>
                </div>
                <Progress value={progressPercentage} className="h-2 mb-4" />
                <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderQuestion(questions[currentQuestion])}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={answers[questions[currentQuestion].id] === undefined}
                  className="group"
                >
                  {currentQuestion === questions.length - 1 ? (
                    <>
                      Get Recommendations
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <Card className="max-w-5xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Your Top Car Matches</CardTitle>
                    <CardDescription>
                      Based on your answers, we've found these cars that best match your preferences.
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleRestart}>
                    Start Over
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0" onValueChange={(value) => setSelectedCarIndex(parseInt(value))}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    {recommendations.slice(0, 3).map((car, index) => (
                      <TabsTrigger key={index} value={index.toString()} className="relative">
                        <span className="flex items-center">
                          {index === 0 && (
                            <Medal className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          {car.make} {car.model}
                        </span>
                        <Badge className="absolute -top-2 -right-2 bg-blue-600">
                          {car.matchPercentage}%
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {recommendations.slice(0, 3).map((car, index) => (
                    <TabsContent key={index} value={index.toString()} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={car.image} 
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold">{car.year} {car.make} {car.model}</h3>
                            <div className="flex items-center mt-2">
                              <Badge className="mr-2 bg-blue-600">{car.bodyType}</Badge>
                              <Badge variant="outline" className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                ${car.price.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-700">{car.description}</p>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-600">{car.matchPercentage}% Match</Badge>
                            <span className="text-sm text-gray-500">Based on your preferences</span>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Pros:</h4>
                            <ul className="grid grid-cols-1 gap-2">
                              {car.pros.map((pro, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Cons:</h4>
                            <ul className="grid grid-cols-1 gap-2">
                              {car.cons.map((con, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 font-medium">-</span>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-6 space-x-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          View Similar Cars
                        </Button>
                        <Button variant="outline">
                          Find Dealerships
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">Video Reviews</CardTitle>
                <CardDescription>
                  Watch expert video reviews of your recommended cars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="icon" className="bg-red-600 hover:bg-red-700 rounded-full h-12 w-12">
                          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </Button>
                      </div>
                      <img 
                        src={recommendations[selectedCarIndex]?.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop"} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {recommendations[selectedCarIndex]?.year || 2023} {recommendations[selectedCarIndex]?.make || "Toyota"} {recommendations[selectedCarIndex]?.model || "Highlander"} Review
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">YouTube</span>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Watch Video
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full h-12 w-12 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z" />
                          </svg>
                        </div>
                      </div>
                      <img 
                        src="https://images.unsplash.com/photo-1495563893439-5091742398e7?w=800&auto=format&fit=crop" 
                        alt="Instagram video" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Quick Tour: Interior Features
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Instagram</span>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Watch Reel
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full h-12 w-12 bg-blue-600 flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                          </svg>
                        </div>
                      </div>
                      <img 
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop" 
                        alt="Facebook video" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Owner's Experience: 1 Year Later
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Facebook</span>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Watch Video
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarRecommender;
