"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Calendar, 
  Gauge, 
  Fuel, 
  DollarSign, 
  Shield, 
  MessageSquare, 
  Heart, 
  Share2, 
  ChevronLeft, 
  Check, 
  Clock, 
  MapPin, 
  ArrowLeft,
  X,
  User
} from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Card, CardContent } from "../../../components/ui/card";
import { toast } from "react-hot-toast";
import Link from 'next/link';
import { Img } from '../../../components/Img';
import { useTranslations, useLocale } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import emailjs from '@emailjs/browser';
import { Toaster } from "react-hot-toast";

interface CarDetailsContentProps {
  initialData: any;
  slug: string;
}

const CarDetailsContent: React.FC<CarDetailsContentProps> = ({ initialData, slug }): JSX.Element => {
  const t = useTranslations('CarDetails');
  const locale = useLocale();
  const [car, setCar] = useState<any>(initialData?.car || null);
  const [listings, setListings] = useState<any[]>(initialData?.listings || []);
  const [loading, setLoading] = useState(false);
  const [loadingProsCons, setLoadingProsCons] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [interestRate, setInterestRate] = useState(4.9);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    phone: ''
  });
  const [prosAndCons, setProsAndCons] = useState<{ pros: string[], cons: string[], reliability: any } | null>(initialData?.prosAndCons || null);

  useEffect(() => {
    if (initialData) {
      setCar(initialData.car);
      setListings(initialData.listings);
      setProsAndCons(initialData.prosAndCons);
    }
  }, [initialData]);

  // useEffect(() => {
  //   const fetchProsAndCons = async () => {
  //     if (car && !prosAndCons) {
  //       setLoadingProsCons(true);
  //       try {
  //         const response = await fetch('/api/prosandcons', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Accept-Language': locale
  //           },
  //           body: JSON.stringify({
  //             make: car.make,
  //             model: car.model,
  //             year: car.year,
  //             specs: car.specs
  //           })
  //         });

  //         if (response.ok) {
  //           const data = await response.json();
  //           setProsAndCons(data);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching pros and cons:', error);
  //       } finally {
  //         setLoadingProsCons(false);
  //       }
  //     }
  //   };

  //   fetchProsAndCons();
  // }, [car, locale, prosAndCons]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

  const add_to_favorites = (slug: number) => {
    let updatedFavorites;
    if (favorites.includes(slug)) {
      updatedFavorites = favorites.filter((favslug) => favslug !== slug);
    } else {
      updatedFavorites = [...favorites, slug];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };


  // Calculate monthly payment when rate or term changes
  useEffect(() => {
    if (car) {
      const price = parseFloat(car.price.replace(/[^0-9.-]+/g, ""));
      const monthlyRate = interestRate / 12 / 100;
      const numberOfPayments = loanTerm;
      const payment = (price * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      setMonthlyPayment(Math.round(payment));
    }
  }, [car, interestRate, loanTerm]);


  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);

    try {
      const templateParams = {
        from_name: emailFormData.name,
        message: `${emailFormData.name} has contacted you about ${car.title}. You can reach them at ${emailFormData.phone}`,
        car_title: car.title,
        car_slug: car.slug
      };

      const response = await emailjs.send(
        'service_fiv09zs',
        'template_o7riedx',
        templateParams,
        'XNc8KcHCQwchLLHG5'
      );

      if (response.status === 200) {
        toast.success('Contact request sent successfully!');
        setIsEmailDialogOpen(false);
        setEmailFormData({
          name: '',
          phone: ''
        });
      } else {
        throw new Error('Failed to send contact request');
      }
    } catch (error) {
      toast.error('Failed to send contact request. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleContactSeller = () => {
    setIsEmailDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('error')}</h1>
          <Link href="/car-listing" className="text-primary hover:text-primary-dark">
            {t('back_to_listings')}
        </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 mt-[5%] bg-white">
      <Toaster position="top-right" />
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/car-listing" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('back_to_listings')}
        </Link>
      </div>
      
      {/* Car Header */}
      <motion.div
        initial={{ opacity: 1, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-sm mb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{car.title}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm px-1">
                  {(() => {
                    const diffInMs = new Date().getTime() - new Date(car.createdAt).getTime();
                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                    const diffInMonths = Math.floor(diffInDays / 30);
                    const diffInYears = Math.floor(diffInDays / 365);
                    
                    if (diffInYears > 0) {
                      return t('listed_years_ago', { years: diffInYears });
                    } else if (diffInMonths > 0) {
                      return t('listed_months_ago', { months: diffInMonths });
                    } else if (diffInDays > 0) {
                      return t('listed_days_ago', { days: diffInDays });
                    } else {
                      return t('listed_hours_ago', { hours: diffInHours });
                    }
                  })()}
                </span>
                <span className="mx-1">•</span>
              <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm px-1">{car.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-blue-600 px-1">{car.price}</div>
              <div className="text-sm text-gray-600 px-1">{t('estimated_monthly_payment')}: {monthlyPayment.toLocaleString()}/{t('month')}</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Car Images */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative">
                  {/* <Img
                    external={true}
                    width={1920}
                    height={1080}
                    src={car.mainImage[0]}
                alt={car.title}
                    className="w-full h-[600px] object-cover"
                  /> */}
                  {car.mainImage && (
                    <Img
                      src={car.mainImage}
                      width={1920}
                      height={1080}
                      external={true}
                      alt={car.title}
                      className="w-full h-[600px] object-cover"
                    />
                  )}
                  <Button 
                    size="icon" 
                    onClick={() => add_to_favorites(car.id)}
                    variant="ghost" 
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-md"
                  >
                    <Heart className={`h-6 w-6 ${favorites.includes(car.id) ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

          
          
          {/* Car Tabs */}
          <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-1 bg-gray-50 p-1 rounded-lg">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t('overview')}</TabsTrigger>
                {/* <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t('features')}</TabsTrigger> */}
                {/* <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t('vehicle_history')}</TabsTrigger> */}
            </TabsList>
            
              <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  <div>
                      <div className="text-xs text-gray-500">{t('year')}</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  <div>
                      <div className="text-xs text-gray-500">{t('mileage')}</div>
                      <div className="font-medium">{car.mileage.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                      <div className="text-xs text-gray-500">{t('fuel_type')}</div>
                    <div className="font-medium">{car.fuelType}</div>
                  </div>
                </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                      <div className="text-xs text-gray-500">{t('body_type')}</div>
                    <div className="font-medium">{car.bodyType}</div>
                  </div>
                </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                      <div className="text-xs text-gray-500">{t('price')}</div>
                      <div className="font-medium">{car.price}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                      <div className="text-xs text-gray-500">{t('warranty')}</div>
                      <div className="font-medium">{t('warranty_period', { months: 3 })}</div>
                  </div>
                </div>
              </div>
              
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">{t('description')}</h3>
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Check className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
              </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Check className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
              {/* <TabsContent value="history" className="mt-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Check className="h-6 w-6 text-blue-600" />
                  </div>
                <div>
                    <h3 className="font-medium text-blue-800">{t('clean_title')}</h3>
                    <p className="text-sm text-blue-700">{t('clean_title_description')}</p>
                </div>
              </div>
              
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">{t('service_history')}</h3>
              <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-6 pb-6 relative">
                      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0"></div>
                      <p className="text-sm text-gray-500">{t('june_2023')}</p>
                      <h4 className="font-medium text-lg">{t('regular_maintenance')}</h4>
                      <p className="text-sm text-gray-600">{t('maintenance_details')}</p>
                  </div>
                    <div className="border-l-2 border-blue-500 pl-6 pb-6 relative">
                      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0"></div>
                      <p className="text-sm text-gray-500">{t('january_2023')}</p>
                      <h4 className="font-medium text-lg">{t('winter_checkup')}</h4>
                      <p className="text-sm text-gray-600">{t('winter_checkup_details')}</p>
                  </div>
                    <div className="border-l-2 border-blue-500 pl-6 relative">
                      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0"></div>
                      <p className="text-sm text-gray-500">{t('august_2022')}</p>
                      <h4 className="font-medium text-lg">{t('full_service')}</h4>
                      <p className="text-sm text-gray-600">{t('full_service_details')}</p>
                  </div>
                </div>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
        
        {/* Right Column - Contact Information */}
        <div className="space-y-6">
           

            {/* Contact Seller Section */}
            <div className=" flex justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 h-[240px]">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">{t('contact_seller')}</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">khalil daibes</p>
                      <p className="text-xs sm:text-sm text-gray-500">{t('or_call')} 0509977084</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <button 
                      onClick={handleContactSeller} 
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
                    >
                      {t('contact_seller')}
                    </button>
                    <button className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                      {t('save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">{t('financing_options')}</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t('estimated_monthly_payment')}</div>
                    <div className="text-3xl font-bold text-blue-600">{monthlyPayment.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mt-2">{t('for_months', { months: loanTerm, rate: interestRate })}</div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-medium">{t('interest_rate')}</label>
                        <span className="text-sm text-gray-600">{interestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="12"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-medium">{t('loan_term')}</label>
                        <span className="text-sm text-gray-600">{loanTerm} {t('months')}</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="84"
                        step="12"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {t('check_your_rate')}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                    {t('no_credit_score_impact')}
                </p>
              </div>
            </CardContent>
          </Card>
          
            <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">{t('similar_vehicles')}</h3>
                <div className="space-y-4">
                  {listings.filter(c => c.id !== car.id).slice(0, 3).map((similarCar) => (
                  <Link key={similarCar.id} href={`/car-details/${similarCar.slug}`}>
                      <div className="flex space-x-4 group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-24 h-20 overflow-hidden rounded-lg">
                          {/* <Img
                            external={true}
                            width={96}
                            height={80}
                            src={similarCar.mainImage}
                            alt={similarCar.title}
                            className="w-full h-full object-cover"
                          /> */}
                          {car.mainImage[0] && (
                    <img
                      src={car.mainImage[0]}
                      alt={car.title}
                      className="w-full h-[600px] object-cover"
                    />
                  )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{similarCar.title}</h4>
                          <p className="text-blue-600 text-sm font-semibold mt-1">{similarCar.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
       {/* Pros and Cons Section */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-center">{t('review_highlights')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pros */}
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-100 rounded-full mb-4">
                      <Check className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 text-lg mb-4">{t('pros')}</h4>
                    {loadingProsCons ? (
                      <div className="animate-pulse space-y-3 w-full">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-3 text-gray-600">
                        {prosAndCons?.pros?.map((pro: string, index: number) => (
                          <li key={index} className="flex items-center justify-center">
                            <span className="mr-2">•</span>
                            {pro}
                          </li>
                        )) || (
                          <>
                            <li className="flex items-center justify-center">
                              <span className="mr-2">•</span>
                              {t('excellent_performance')}
                            </li>
                            <li className="flex items-center justify-center">
                              <span className="mr-2">•</span>
                              {t('comfortable_interior')}
                            </li>
                            <li className="flex items-center justify-center">
                              <span className="mr-2">•</span>
                              {t('advanced_tech')}
                            </li>
                          </>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Cons */}
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-red-100 rounded-full mb-4">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 text-lg mb-4">{t('cons')}</h4>
                    {loadingProsCons ? (
                      <div className="animate-pulse space-y-3 w-full">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-3 text-gray-600">
                        {prosAndCons?.cons?.map((con: string, index: number) => (
                          <li key={index} className="flex items-center justify-center">
                            <span className="mr-2">•</span>
                            {con}
                          </li>
                        )) || (
                          <>
                            <li className="flex items-center justify-center">
                              <span className="mr-2">•</span>
                              {t('higher_price')}
                            </li>
                            <li className="flex items-center justify-center">
                              <span className="mr-2">•</span>
                              {t('firm_ride')}
                            </li>
                            <li className="flex items-center justify-center">
                              <span className="mr-2">•</span>
                              {t('limited_cargo')}
                            </li>
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
      {/* Video Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('car_reviews')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('watch_reviews_description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Review Video */}
          <div className="space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
            <iframe 
              width="100%" 
              height="100%" 
                src="https://www.youtube.com/embed/vUR3kvg9PnI" 
                title="Car Review Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          </div>

          {/* Comparison Section */}
          <div className="space-y-6">
            

            {/* Additional Reviews */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe 
              width="100%" 
              height="100%" 
                  src="https://www.youtube.com/embed/V8UCaOHrwzU" 
                  title="Car Review Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe 
              width="100%" 
              height="100%" 
                  src="https://www.youtube.com/embed/PqWmedWLU-Q" 
                  title="Car Review Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>{t('contact_seller')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                {t('your_name')}
              </label>
              <Input
                id="name"
                name="name"
                value={emailFormData.name}
                onChange={handleEmailInputChange}
                required
                placeholder={t('enter_your_name')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                {t('your_phone')}
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={emailFormData.phone}
                onChange={handleEmailInputChange}
                required
                placeholder={t('enter_your_phone')}
              />
            </div>
            <button
              type="submit"
              disabled={sendingEmail}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingEmail ? t('sending') : t('send_contact_request')}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarDetailsContent; 