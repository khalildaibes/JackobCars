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
  User,
  Sparkles,
  Phone,
  Mail
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
import { useRouter, useSearchParams } from 'next/navigation';

interface CarDetailsContentProps {
  slug: string;
  hostname: string;
}

const CarDetailsContent: React.FC<CarDetailsContentProps> = ({ slug, hostname }): JSX.Element => {
  const t = useTranslations('CarDetails');
  const locale = useLocale();
  const [car, setCar] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
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
  const [prosAndCons, setProsAndCons] = useState<{ pros: string[], cons: string[], reliability: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);


  async function getCarDetails(slug: string) {
    // Get the host from headers for SSR absolute URL
    console.log('CarDetailsContent - hostname prop:', hostname);
    console.log('CarDetailsContent - slug prop:', slug);
    const dealsUrl = `/api/deals?store_hostname=${hostname}&slug=${slug}`;
    console.log('CarDetailsContent - API URL:', dealsUrl);
    const response = await fetch(dealsUrl);
    if (!response.ok) throw new Error(`Failed to fetch car details: ${response.statusText}`);
  
    const data = await response.json();
    if (!data || !data.data) throw new Error("Invalid API response structure");
    console.log('Raw API Response:', data);
    
    // Format listings
    const formattedListings = data.data.map((product: any) => {
      console.log('Processing product:', product);
      
      // Get the fuel type from the new structure
      const rawFuelType = product.details?.car?.fuel_type || product.details?.car?.fuel || "Unknown";
      let normalizedFuelType = rawFuelType;
      
      // Normalize fuel type values to English
      if (rawFuelType.toLowerCase().includes("plug-in") || 
          rawFuelType.toLowerCase().includes("plug in") || 
          rawFuelType === "היברידי נטען" ||
          rawFuelType === "هجين قابل للشحن") {
        normalizedFuelType = "Plug-in Hybrid";
      } else if (rawFuelType.toLowerCase().includes("hybrid") || 
                rawFuelType === "היברידי" ||
                rawFuelType === "هجين") {
        normalizedFuelType = "Hybrid";
      } else if (rawFuelType.toLowerCase().includes("electric") || 
                rawFuelType === "חשמלי" ||
                rawFuelType === "كهربائي") {
        normalizedFuelType = "Electric";
      } else if (rawFuelType.toLowerCase().includes("diesel") || 
                rawFuelType === "דיזל" ||
                rawFuelType === "ديزل") {
        normalizedFuelType = "Diesel";
      } else if (rawFuelType.toLowerCase().includes("gasoline") || 
                rawFuelType.toLowerCase().includes("petrol") || 
                rawFuelType === "בנזין" ||
                rawFuelType === "بنزين") {
        normalizedFuelType = "Gasoline";
      }
  
      // Get manufacturer name from the new structure
      const rawMake = product.details?.car?.manufacturer_name || "Unknown";
      let normalizedMake = rawMake;
      
      // Check if rawMake is a number (array index) and convert it to the actual manufacturer name
      if (!isNaN(rawMake) && rawMake !== "Unknown") {
        // Convert array index to manufacturer name
        const manufacturerIndex = parseInt(rawMake);
        if (manufacturerIndex === 0) normalizedMake = "40";
        else if (manufacturerIndex === 1) normalizedMake = "אאודי";
        else if (manufacturerIndex === 2) normalizedMake = "BMW";
        else if (manufacturerIndex === 3) normalizedMake = "Mercedes";
        else if (manufacturerIndex === 4) normalizedMake = "Toyota";
        else if (manufacturerIndex === 5) normalizedMake = "Honda";
        else if (manufacturerIndex === 6) normalizedMake = "Ford";
        else if (manufacturerIndex === 7) normalizedMake = "Chevrolet";
        else if (manufacturerIndex === 8) normalizedMake = "Tesla";
        else if (manufacturerIndex === 9) normalizedMake = "Lexus";
        else if (manufacturerIndex === 10) normalizedMake = "Subaru";
        else normalizedMake = "Unknown";
      }
      
      // Normalize make values to English (keep original if it's already a word)
      if (typeof normalizedMake === 'string' && !isNaN(Number(normalizedMake))) {
        // If it's still a number, try to convert based on the actual text
        if (normalizedMake === "40") {
          normalizedMake = "40"; // Keep as is for now
        } else {
          normalizedMake = "Unknown";
        }
      } else if (normalizedMake.toLowerCase().includes("toyota") || normalizedMake === "טויוטה" || normalizedMake === "تويوتا") {
        normalizedMake = "Toyota";
      } else if (normalizedMake.toLowerCase().includes("honda") || normalizedMake === "הונדה" || normalizedMake === "هوندا") {
        normalizedMake = "Honda";
      } else if (normalizedMake.toLowerCase().includes("ford") || normalizedMake === "פורד" || normalizedMake === "فورد") {
        normalizedMake = "Ford";
      } else if (normalizedMake.toLowerCase().includes("chevrolet") || normalizedMake === "שברולט" || normalizedMake === "شيفروليه") {
        normalizedMake = "Chevrolet";
      } else if (normalizedMake.toLowerCase().includes("bmw") || normalizedMake === "ב.מ.וו" || normalizedMake === "بي ام دبليو") {
        normalizedMake = "BMW";
      } else if (normalizedMake.toLowerCase().includes("mercedes") || normalizedMake === "מרצדס" || normalizedMake === "مرسيدس") {
        normalizedMake = "Mercedes-Benz";
      } else if (normalizedMake.toLowerCase().includes("audi") || normalizedMake === "אאודי" || normalizedMake === "أودي") {
        normalizedMake = "Audi";
      } else if (normalizedMake.toLowerCase().includes("tesla") || normalizedMake === "טסלה" || normalizedMake === "تيسلا") {
        normalizedMake = "Tesla";
      } else if (normalizedMake.toLowerCase().includes("lexus") || normalizedMake === "לקסוס" || normalizedMake === "لكزس") {
        normalizedMake = "Lexus";
      } else if (normalizedMake.toLowerCase().includes("subaru") || normalizedMake === "סובארו" || normalizedMake === "سوبارو") {
        normalizedMake = "Subaru";
      }
  
      // Get body type from the new structure
      const rawBodyType = product.details?.car?.body_type || "Unknown";
      let normalizedBodyType = rawBodyType;
      if (rawBodyType.toLowerCase().includes("sedan") || rawBodyType === "סדאן" || rawBodyType === "سيدان") {
        normalizedBodyType = "Sedan";
      } else if (rawBodyType.toLowerCase().includes("suv") || rawBodyType === "רכב שטח" || rawBodyType === "سيارة رياضية متعددة الاستخدامات") {
        normalizedBodyType = "SUV";
      } else if (rawBodyType.toLowerCase().includes("truck") || rawBodyType === "משאית" || rawBodyType === "شاحنة") {
        normalizedBodyType = "Truck";
      } else if (rawBodyType.toLowerCase().includes("coupe") || rawBodyType === "קופה" || rawBodyType === "كوبيه") {
        normalizedBodyType = "Coupe";
      } else if (rawBodyType.toLowerCase().includes("convertible") || rawBodyType === "קבריולה" || rawBodyType === "كابريوليه") {
        normalizedBodyType = "Convertible";
      } else if (rawBodyType.toLowerCase().includes("hatchback") || rawBodyType === "הצ'בק" || rawBodyType === "هاتشباك") {
        normalizedBodyType = "Hatchback";
      } else if (rawBodyType.toLowerCase().includes("wagon") || rawBodyType === "סטיישן" || rawBodyType === "ستيشن") {
        normalizedBodyType = "Wagon";
      } else if (rawBodyType.toLowerCase().includes("van") || rawBodyType === "ואן" || rawBodyType === "فان") {
        normalizedBodyType = "Van";
      }

      // Get additional fields from new structure
      const transmission = product.details?.car?.transmission || "Unknown";
      const condition = product.details?.car?.condition || "Used";
      const miles = product.details?.car?.miles || "N/A";
      const year = product.details?.car?.year || "Unknown";
      const description = product.details?.car?.description || "";
      const features = product.details?.car?.features || [];
      const pros = product.details?.car?.pros || [];
      const cons = product.details?.car?.cons || [];
      const owner_name = product.details?.car?.owner_name || "";
      const owner_phone = product.details?.car?.owner_phone || "";
      const owner_email = product.details?.car?.owner_email || "";
      const plate_number = product.details?.car?.plate_number || "";
      const color = product.details?.car?.color || "";
      const engine_type = product.details?.car?.engine_type || "";
      const known_problems = product.details?.car?.known_problems || "";
      const trade_in = product.details?.car?.trade_in || "";
      const asking_price = product.details?.car?.asking_price || "";
      const manufacturer_name = product.details?.car?.manufacturer_name || "";
      const commercial_nickname = product.details?.car?.commercial_nickname || "";
      const year_of_production = product.details?.car?.year_of_production || "";
      const trim_level = product.details?.car?.trim_level || "";

      // Build image URL with fallbacks
      const mainImage = (() => {
        if (product.image && Array.isArray(product.image) && product.image.length > 0) {
          return `http://${product.store?.hostname || hostname}${product.image[0]?.url || ''}`;
        } else if (product.image && product.image.url) {
          return `http://${product.store?.hostname || hostname}${product.image.url}`;
        } else if (product.image && typeof product.image === 'string') {
          return `http://${product.store?.hostname || hostname}${product.image}`;
        }
        return "/default-car.png";
      })();

      const carData = {
        id: product.id,
        mainImage: mainImage,
        alt: product.name || "Car Image",
        title: product.name,
        name: product.name,
        miles: miles,
        fuel: normalizedFuelType,
        condition: condition,
        transmission: transmission,
        details: product.details?.car || {},
        price: `${product.price?.toLocaleString() || '0'}`,
        mileage: miles,
        year: year,
        pros: pros,
        cons: cons,
        fuelType: normalizedFuelType,
        make: normalizedMake,
        slug: product.slug,
        createdAt: product.createdAt,
        bodyType: normalizedBodyType,
        description: description,
        features: features.map((feature: any) => {
          if (typeof feature === 'string') return feature;
          if (feature && typeof feature === 'object') {
            return feature.value || feature.label || 'Unknown Feature';
          }
          return 'Unknown Feature';
        }) || [],
        category: product.categories ? product.categories.split(",").map((c: string) => c.toLowerCase().trim()) : [],
        // Additional fields from new structure
        owner_name: owner_name,
        owner_phone: owner_phone,
        owner_email: owner_email,
        plate_number: plate_number,
        color: color,
        engine_type: engine_type,
        known_problems: known_problems,
        trade_in: trade_in,
        asking_price: asking_price,
        manufacturer_name: manufacturer_name,
        commercial_nickname: commercial_nickname,
        year_of_production: year_of_production,
        trim_level: trim_level,
        // Store info
        store: product.store || {},
        hostname: product.store?.hostname || hostname,
        location: product.store?.address || "Unknown Location"
      };

      // Set car data for the main car
      if (product.slug.toString() === slug) {
        setCar(carData);
      }

      return carData;
    });
    
    console.log('formattedListings', formattedListings);
    
    // Find the car with matching slug
    const carData = formattedListings.find((car: any) => car.slug.toString() === slug);
    if (!carData) {
      throw new Error("Car not found");
    }
  
    return {
      car: carData,
      listings: formattedListings,
      prosAndCons: []
    };
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

// In your component
const router = useRouter();
const searchParams = useSearchParams();

useEffect(() => {
  if (searchParams.has('hostname')) {
    // Create new URLSearchParams without hostname
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('hostname');
    
    // Get the current pathname
    const pathname = window.location.pathname;
    
    // Replace the URL without the hostname parameter
    const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }
}, [searchParams, router]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // You may want to get the baseUrl from window.location.host or a default value
        const localeValue = locale || 'ar';
        const data = await getCarDetails(slug);
        setCar(data.car);
        setListings(data.listings);
        setProsAndCons(null);
        setDebugInfo(data);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setCar(null);
        setListings([]);
        setProsAndCons(null);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setDebugInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, locale]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? t('error') : t('car_not_found')}
          </h1>
          {error && (
            <p className="text-red-600 mb-4 max-w-md mx-auto">
              {error}
            </p>
          )}
          <Link href="/car-listing" className="text-primary hover:text-primary-dark">
            {t('back_to_listings')}
          </Link>
        </div>
      </div>
    );
  }
  
  // Determine if RTL should be applied
  const isRTL = locale === 'ar';
  
  return (
    <div className={`min-h-screen bg-gray-50 mt-[5%] bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Toaster position={isRTL ? "top-left" : "top-right"} />
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/car-listing" className={`text-blue-600 hover:underline flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isRTL ? (
            <>
              <ChevronLeft className="h-4 w-4 ml-1 transform rotate-180" />
              {t('back_to_listings')}
            </>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back_to_listings')}
            </>
          )}
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
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{car.title}</h1>
            <div className={`flex items-center text-gray-600 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
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
              <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span className="text-sm px-1">{car.location}</span>
              </div>
            </div>
            <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'}`}>
              <div className="text-3xl font-bold text-blue-600 px-1">{car.price}</div>
              <div className="text-sm text-gray-600 px-1">{t('estimated_monthly_payment')}: {monthlyPayment.toLocaleString()}/{t('month')}</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Left Column - Images and Details */}
        <div className={`${isRTL ? 'lg:col-start-2 lg:col-span-2' : 'lg:col-span-2'} space-y-8`}>
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
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 bg-gray-50 rounded-xl`}>
                    <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-xs text-gray-500">{t('year')}</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 bg-gray-50 rounded-xl`}>
                  <Gauge className="h-5 w-5 text-blue-600" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-xs text-gray-500">{t('mileage')}</div>
                      <div className="font-medium">{car.mileage.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 bg-gray-50 rounded-xl`}>
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-xs text-gray-500">{t('fuel_type')}</div>
                    <div className="font-medium">{car.fuelType}</div>
                  </div>
                </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 bg-gray-50 rounded-xl`}>
                  <Car className="h-5 w-5 text-blue-600" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-xs text-gray-500">{t('body_type')}</div>
                    <div className="font-medium">{car.bodyType}</div>
                  </div>
                </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 bg-gray-50 rounded-xl`}>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-xs text-gray-500">{t('price')}</div>
                      <div className="font-medium">{car.price}</div>
                  </div>
                </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 bg-gray-50 rounded-xl`}>
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-xs text-gray-500">{t('warranty')}</div>
                      <div className="font-medium">{t('warranty_period', { months: 3 })}</div>
                  </div>
                </div>
              </div>
              
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">{t('description')}</h3>
                  <p className="text-gray-700 leading-relaxed">{car.description || t('no_description_available')}</p>
                  {!car.description && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/createDescription', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                make: car.manufacturer_name || car.make,
                                model: car.commercial_nickname || car.name,
                                year: car.year_of_production || car.year,
                                specs: {
                                  mileage: car.mileage || car.miles,
                                  color: car.color,
                                  engineType: car.engine_type,
                                  transmission: car.transmission,
                                  condition: car.condition
                                }
                              })
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              // Update the car state with the new description
                              setCar(prev => ({ ...prev, description: data.description }));
                            } else {
                              alert(t('failed_to_generate_description'));
                            }
                          } catch (error) {
                            console.error('Error generating description:', error);
                            alert(t('error_generating_description'));
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🤖 {t('generate_ai_description')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Car Details */}
                {(car.color || car.engine_type || car.trim_level || car.known_problems || car.trade_in) && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">{t('additional_details')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {car.color && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: car.color }}></div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('color')}</div>
                            <div className="font-medium">{car.color}</div>
                          </div>
                        </div>
                      )}
                      {car.engine_type && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('engine_type')}</div>
                            <div className="font-medium">{car.engine_type}</div>
                          </div>
                        </div>
                      )}
                      {car.trim_level && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Sparkles className="h-4 w-4 text-green-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('trim_level')}</div>
                            <div className="font-medium">{car.trim_level}</div>
                          </div>
                        </div>
                      )}
                      {car.trade_in && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('trade_in')}</div>
                            <div className="font-medium">{car.trade_in}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    {car.known_problems && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">{t('known_problems')}</h4>
                        <p className="text-yellow-700 text-sm">{car.known_problems}</p>
                      </div>
                    )}
                  </div>
                )}
              {/* Pros and Cons Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">{t('pros_and_cons') || 'Pros and Cons'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pros */}
                  <div className={`space-y-3 ${isRTL ? 'md:col-start-2' : ''}`}>
                    <h4 className={`font-medium text-green-700 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Check className={`h-5 w-5 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('pros')}
                    </h4>
                    {car.pros && car.pros.length > 0 ? (
                      <ul className="space-y-2">
                        {car.pros.map((pro: string, index: number) => (
                          <li key={index} className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-green-500 ${isRTL ? 'ml-2' : 'mr-2'} mt-1`}>•</span>
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">{t('no_pros_available')}</p>
                    )}
                  </div>

                  {/* Cons */}
                  <div className={`space-y-3 ${isRTL ? 'md:col-start-1' : ''}`}>
                    <h4 className={`font-medium text-red-700 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <X className={`h-5 w-5 text-red-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('cons')}
                    </h4>
                    {car.cons && car.cons.length > 0 ? (
                      <ul className="space-y-2">
                        {car.cons.map((con: string, index: number) => (
                          <li key={index} className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-red-500 ${isRTL ? 'ml-2' : 'mr-2'} mt-1`}>•</span>
                            <span className="text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">{t('no_cons_available')}</p>
                    )}
                  </div>
                </div>
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
        <div className={`${isRTL ? 'lg:col-start-1' : ''} space-y-6`}>
           

            {/* Contact Seller Section */}
            <div className="flex justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg w-full max-w-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">{t('contact_seller')}</h3>
                
                {/* Initial Contact Button */}
                {!showContactInfo ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                    <p className="text-gray-600">{t('click_to_contact')}</p>
                    <button 
                      onClick={() => setShowContactInfo(true)}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {t('show_contact_info')}
                    </button>
                  </div>
                ) : (
                  /* Contact Information Display */
                  <div className="space-y-4">
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="font-medium text-gray-900">{car.owner_name || 'Contact Seller'}</p>
                        <p className="text-sm text-gray-500">{t('seller')}</p>
                      </div>
                    </div>
                    
                    {car.owner_phone && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="font-medium text-gray-900">{car.owner_phone}</p>
                          <p className="text-sm text-gray-500">{t('phone')}</p>
                        </div>
                        <a 
                          href={`tel:${car.owner_phone}`}
                          className={`${isRTL ? 'mr-auto' : 'ml-auto'} px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm`}
                        >
                          {t('call')}
                        </a>
                      </div>
                    )}
                    
                    {car.owner_email && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="font-medium text-gray-900">{car.owner_email}</p>
                          <p className="text-sm text-gray-500">{t('email')}</p>
                        </div>
                        <a 
                          href={`mailto:${car.owner_email}`}
                          className={`${isRTL ? 'mr-auto' : 'ml-auto'} px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm`}
                        >
                          {t('email')}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setShowContactInfo(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {t('hide')}
                      </button>
                      <button 
                        onClick={handleContactSeller} 
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t('message')}
                      </button>
                    </div>
                  </div>
                )}
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
                  <Link key={similarCar.id} href={`/car-details/${similarCar.slug}?hostname=${similarCar.hostname}`}>
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
                          {similarCar.mainImage && (
                            <img
                              src={similarCar.mainImage}
                              alt={similarCar.title}
                              className="w-full h-full object-cover"
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

      {/* 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('car_reviews')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('watch_reviews_description')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          <div className="space-y-6">
            

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
      */}
    </div>
  );
};

export default CarDetailsContent; 