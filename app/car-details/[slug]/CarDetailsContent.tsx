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
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


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
      const rawFuelType = product.details?.car?.fuelType || product.details?.car?.fuel || "Unknown";
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
      const rawMake = product.details?.car?.manufacturerName || product.details?.car?.manufacturer_name || "Unknown";
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
      const rawBodyType = product.details?.car?.bodyType || product.details?.car?.body_type || "Unknown";
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
      const condition = product.details?.car?.currentCondition || product.details?.car?.condition || "Used";
      const miles = product.details?.car?.mileage || product.details?.car?.miles || "N/A";
      const year = product.details?.car?.year || product.details?.car?.yearOfProduction || "Unknown";
      const description = product.details?.car?.description || "";
      const features = product.details?.car?.features || [];
      const pros = product.details?.car?.pros || [];
      const cons = product.details?.car?.cons || [];
      const owner_name = product.details?.car?.name || product.details?.car?.owner_name || "";
      const owner_phone = product.details?.car?.phone || product.details?.car?.owner_phone || "";
      const owner_email = product.details?.car?.email || product.details?.car?.owner_email || "";
      const plate_number = product.details?.car?.plateNumber || product.details?.car?.plate_number || "";
      const color = product.details?.car?.color || "";
      const engine_type = product.details?.car?.engineType || product.details?.car?.engine_type || "";
      const known_problems = product.details?.car?.knownProblems || product.details?.car?.known_problems || "";
      const trade_in = product.details?.car?.tradeIn || product.details?.car?.trade_in || "";
      const asking_price = product.details?.car?.askingPrice || product.details?.car?.asking_price || "";
      const manufacturer_name = product.details?.car?.manufacturerName || product.details?.car?.manufacturer_name || "";
      const commercial_nickname = product.details?.car?.commercialNickname || product.details?.car?.commercial_nickname || "";
      const year_of_production = product.details?.car?.yearOfProduction || product.details?.car?.year_of_production || "";
      const trim_level = product.details?.car?.trimLevel || product.details?.car?.trim_level || "";

      // Build image URLs with fallbacks
      const buildImageUrl = (imagePath: string) => {
        return `http://${hostname}${imagePath}`;
      };

      // Get main image
      const mainImage = (() => {
        if (product.image && Array.isArray(product.image) && product.image.length > 0) {
          return buildImageUrl(product.image[0]?.url || '');
        } else if (product.image && product.image.url) {
          return buildImageUrl(product.image.url);
        } else if (product.image && typeof product.image === 'string') {
          return buildImageUrl(product.image);
        }
        return "/default-car.png";
      })();

      // Get all images from the new structure
      const allImages = (() => {
        const images = [];
        
        // Add main image if it exists
        if (mainImage && mainImage !== "/default-car.png") {
          images.push(mainImage);
        }
        
        // Add additional images from the new structure
        if (product.details?.car?.images?.additional && Array.isArray(product.details.car.images.additional)) {
          product.details.car.images.additional.forEach((img: any) => {
            if (img && typeof img === 'string') {
              images.push(buildImageUrl(img));
            } else if (img && img.url) {
              images.push(buildImageUrl(img.url));
            }
          });
        }
        
        // Fallback to old image structure if no new images found
        if (images.length === 0 && product.image && Array.isArray(product.image)) {
          product.image.forEach((img: any) => {
            if (img && img.url) {
              images.push(buildImageUrl(img.url));
            }
          });
        }
        
        // Additional fallback: check if images are stored as strings directly
        if (images.length === 0 && product.image && Array.isArray(product.image)) {
          product.image.forEach((img: any) => {
            if (img && typeof img === 'string') {
              images.push(buildImageUrl(img));
            }
          });
        }
        
        // Final fallback: check if there's a direct image field
        if (images.length === 0 && product.image && typeof product.image === 'string') {
          images.push(buildImageUrl(product.image));
        }
        
        // Debug logging
        console.log('Image processing debug:', {
          mainImage,
          newStructureImages: product.details?.car?.images?.additional,
          oldStructureImages: product.image,
          finalImages: images,
          productDetails: product.details?.car,
          productImage: product.image
        });
        
        return images;
      })();

      // Get video from the new structure
      const videoData = product.details?.car?.video || null;
      
      // Debug logging for video
      if (videoData) {
        console.log('Video data found:', {
          videoData,
          productDetails: product.details?.car,
          productId: product.id
        });
      }

      const carData = {
        id: product.id,
        mainImage: mainImage,
        allImages: allImages,
        video: videoData,
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
        // New fields from updated structure
        carType: product.details?.car?.carType || "",
        ownerType: product.details?.car?.ownerType || "",
        region: product.details?.car?.region || "",
        priceNegotiable: product.details?.car?.priceNegotiable || false,
        selectedPackage: product.details?.car?.selectedPackage || "",
        termsAccepted: product.details?.car?.termsAccepted || false,
        previousOwners: product.details?.car?.previousOwners || [],
        // Technical specifications
        engineCapacity: product.details?.car?.engineCapacity || "",
        seatingCapacity: product.details?.car?.seatingCapacity || "",
        abs: product.details?.car?.abs || "",
        airbags: product.details?.car?.airbags || "",
        powerWindows: product.details?.car?.powerWindows || "",
        driveType: product.details?.car?.driveType || "",
        totalWeight: product.details?.car?.totalWeight || "",
        height: product.details?.car?.height || "",
        fuelTankCapacity: product.details?.car?.fuelTankCapacity || "",
        co2Emission: product.details?.car?.co2Emission || "",
        greenIndex: product.details?.car?.greenIndex || "",
        enginePower: product.details?.car?.enginePower || "",
        doors: product.details?.car?.doors || "",
        // Additional technical data
        engineCode: product.details?.car?.engineCode || "",
        frameNumber: product.details?.car?.frameNumber || "",
        lastTestDate: product.details?.car?.lastTestDate || "",
        tokefTestDate: product.details?.car?.tokefTestDate || "",
        frontTires: product.details?.car?.frontTires || "",
        rearTires: product.details?.car?.rearTires || "",
        pollutionGroup: product.details?.car?.pollutionGroup || "",
        dateOnRoad: product.details?.car?.dateOnRoad || "",
        owner: product.details?.car?.owner || "",
        carTitle: product.details?.car?.carTitle || "",
        carColorGroupID: product.details?.car?.carColorGroupID || "",
        yad2ColorID: product.details?.car?.yad2ColorID || "",
        yad2CarTitle: product.details?.car?.yad2CarTitle || "",
        // Environmental data
        noxEmission: product.details?.car?.noxEmission || "",
        pmEmission: product.details?.car?.pmEmission || "",
        hcEmission: product.details?.car?.hcEmission || "",
        coEmission: product.details?.car?.coEmission || "",
        // Safety and features
        safetyRating: product.details?.car?.safetyRating || "",
        safetyRatingWithoutSeatbelts: product.details?.car?.safetyRatingWithoutSeatbelts || "",
        fuelTankCapacityWithoutReserve: product.details?.car?.fuelTankCapacityWithoutReserve || "",
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

  // Add keyboard support for image modal and media navigation
  useEffect(() => {
    // Don't add event listeners if car data is not loaded yet
    if (!car) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isImageModalOpen) {
        setIsImageModalOpen(false);
        setCurrentImageIndex(0); // Reset to first image when closing
      }
      
      // Media navigation with arrow keys (only when not in modal)
      if (!isImageModalOpen && ((car.allImages && car.allImages.length > 1) || car.video)) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          if (car.video) {
            setCurrentImageIndex(0);
            setIsImageModalOpen(true);
          } else {
            setCurrentImageIndex(prev => 
              prev === 0 ? (car.allImages?.length || 1) - 1 : prev - 1
            );
            setIsImageModalOpen(true);
          }
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          if (car.video) {
            setCurrentImageIndex(0);
            setIsImageModalOpen(true);
          } else {
            setCurrentImageIndex(prev => 
              prev === (car.allImages?.length || 1) - 1 ? 0 : prev + 1
            );
            setIsImageModalOpen(true);
          }
        }
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen, car?.allImages, car?.video]);
  const add_to_favorites = (slug: number) => {
    if (!car) return;
    
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
    if (car && car.price) {
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
    if (!car) return;
    
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
      } catch (err) {
        console.error("Error fetching car details:", err);
        setCar(null);
        setListings([]);
        setProsAndCons(null);
        setError(err instanceof Error ? err.message : 'Unknown error');
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
    <>
      {isRTL && (
        <style jsx global>{`
          .rtl {
            direction: rtl;
            text-align: right;
          }
          .rtl .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
            --tw-space-x-reverse: 1;
          }
          .rtl .ml-auto {
            margin-left: unset;
            margin-right: auto;
          }
          .rtl .mr-auto {
            margin-right: unset;
            margin-left: auto;
          }
          .rtl .text-left {
            text-align: right;
          }
          .rtl .text-right {
            text-align: left;
          }
        `}</style>
      )}
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
          {/* Car Images and Video */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                {/* Main Image/Video Display */}
                {car.video ? (
                  // Video Display
                  <div className="relative">
                    <video
                      src={(() => {
                        // Try different video source patterns
                        if (car.video?.id) {
                          return `http://${hostname}${car.video.url}`;
                        }
                        console.log('Video data structure:', car.video);
                        return '';
                      })()}
                      controls
                      className="w-full h-[600px] object-cover"
                      poster={car.mainImage}
                                            onError={(e) => {
                        console.error('Video loading error:', e);
                        console.log('Video data:', car.video);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    {/* Video Info Overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Video Available</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image Display
                  car.mainImage && (
                    <div 
                      className="cursor-pointer transition-transform hover:scale-[1.02] relative group"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Img
                        src={car.mainImage}
                        width={1920}
                        height={1080}
                        external={true}
                        alt={car.title}
                        className="w-full h-[600px] object-cover"
                      />
                      {/* Click indicator overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                )}
                
                {/* Navigation Arrows - Only show if there are multiple media items */}
                {(car.allImages && car.allImages.length > 1) || car.video ? (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={() => {
                        if (car.video) {
                          // If currently showing video, switch to first image
                          setCurrentImageIndex(0);
                          setIsImageModalOpen(true);
                        } else {
                          // Navigate to previous image
                          setCurrentImageIndex(prev => 
                            prev === 0 ? (car.allImages?.length || 1) - 1 : prev - 1
                          );
                          setIsImageModalOpen(true);
                        }
                      }}
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm ${isRTL ? 'right-4 left-auto' : ''}`}
                      aria-label="Previous media"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    
                    {/* Right Arrow */}
                    <button
                      onClick={() => {
                        if (car.video) {
                          // If currently showing video, switch to first image
                          setCurrentImageIndex(0);
                          setIsImageModalOpen(true);
                        } else {
                          // Navigate to next image
                          setCurrentImageIndex(prev => 
                            prev === (car.allImages?.length || 1) - 1 ? 0 : prev + 1
                          );
                          setIsImageModalOpen(true);
                        }
                      }}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm ${isRTL ? 'left-4 right-auto' : ''}`}
                      aria-label="Next media"
                    >
                      <ChevronLeft className="h-6 w-6 transform rotate-180" />
                    </button>
                    
                    {/* Media Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg z-10">
                      <div className="flex items-center space-x-2">
                        {car.video ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">Video + {car.allImages?.length || 0} Images</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            <span className="text-sm font-medium">{car.allImages?.length || 0} Images</span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
                
                {/* Favorite Button */}
                <Button 
                  size="icon" 
                  onClick={() => add_to_favorites(car.id)}
                  variant="ghost" 
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-md"
                >
                  <Heart className={`h-6 w-6 ${favorites.includes(car.id) ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
              
              {/* Debug Info */}
              {/* {process.env.NODE_ENV === 'development' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Debug Info (Development)</h4>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>Main Image: {car.mainImage}</p>
                    <p>All Images Count: {car.details.images.additional?.length || 0}</p>
                    <p>All Images: {JSON.stringify(car.details.images.additional, null, 2)}</p>
                    <p>Video Data: {JSON.stringify(car.details.video, null, 2)}</p>
                  </div>
                </div>
              )} */}
              
              {/* Image Thumbnails */}
              {car.allImages && car.allImages.length > 0 ? (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {car.allImages.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                          index === currentImageIndex ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <img
                          src={image}
                          alt={`${car.title} - Image ${index + 1}`}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Click on any image to view full size • {car.allImages.length} {car.allImages.length === 1 ? 'image' : 'images'} available
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 text-center">
                  <p className="text-sm text-gray-500">No additional images available</p>
                </div>
              )}
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
                  {
                  // !car.description &&
                   (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/createDescription', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                info: {
                                  manufacturerName: car.manufacturer_name || car.makeModel,
                                  commercialNickname: car.commercial_nickname || car.trimLevel,
                                  yearOfProduction: car.year_of_production || car.details.year,
                                },
                                form: {car
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
                {(car.color || car.engine_type || car.trim_level || car.known_problems || car.trade_in || car.carType || car.ownerType || car.region || car.priceNegotiable || car.selectedPackage) && (
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
                            <div className="font-medium">{t(car.engine_type)}</div>
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
                      {car.carType && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Car className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('car_type') || 'Car Type'}</div>
                            <div className="font-medium">{car.carType === 'private' ? t('private_car') : t('commercial_car')}</div>
                          </div>
                        </div>
                      )}
                      {car.ownerType && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <User className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('owner_type') || 'Owner Type'}</div>
                            <div className="font-medium">{car.ownerType === 'private' ? t('private_car') : car.ownerType === 'company' ? t('company_car') : t('rental_car')}</div>
                          </div>
                        </div>
                      )}
                      {car.region && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-teal-100 rounded-lg">
                            <MapPin className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('region') || 'Region'}</div>
                            <div className="font-medium">{t(car.region)}</div>
                          </div>
                        </div>
                      )}
                      {car.priceNegotiable !== undefined && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('price_negotiable') || 'Price Negotiable'}</div>
                            <div className="font-medium">{car.priceNegotiable ? t('yes') : t('no')}</div>
                          </div>
                        </div>
                      )}
                      {car.selectedPackage && (
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <div className="text-xs text-gray-500">{t('selected_package') || 'Selected Package'}</div>
                            <div className="font-medium">{car.selectedPackage === 'website_release' ? t('free') : t(car.selectedPackage)}</div>
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
                            <div className="font-medium">{t(car.trade_in)}</div>
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
              {/* Technical Specifications Section */}
              {(car.engineCapacity || car.seatingCapacity || car.abs || car.airbags || car.powerWindows || car.driveType || car.totalWeight || car.height || car.fuelTankCapacity || car.co2Emission || car.greenIndex || car.enginePower || car.doors || car.engineCode || car.frameNumber || car.lastTestDate || car.tokefTestDate || car.frontTires || car.rearTires || car.pollutionGroup || car.dateOnRoad || car.noxEmission || car.pmEmission || car.hcEmission || car.coEmission || car.safetyRating || car.safetyRatingWithoutSeatbelts || car.fuelTankCapacityWithoutReserve) && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('technical_specifications') || 'Technical Specifications'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {car.engineCapacity && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Car className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('engine_capacity') || 'Engine Capacity'}</div>
                          <div className="font-medium">{car.engineCapacity} cc</div>
                        </div>
                      </div>
                    )}
                    {car.seatingCapacity && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('seating_capacity') || 'Seating Capacity'}</div>
                          <div className="font-medium">{car.seatingCapacity} </div>
                        </div>
                      </div>
                    )}
                    {car.abs && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Shield className="h-4 w-4 text-red-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('abs') || 'ABS'}</div>
                          <div className="font-medium">{car.abs}</div>
                        </div>
                      </div>
                    )}
                    {car.airbags && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Shield className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('airbags') || 'Airbags'}</div>
                          <div className="font-medium">{car.airbags}</div>
                        </div>
                      </div>
                    )}
                    {car.powerWindows && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Car className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('power_windows') || 'Power Windows'}</div>
                          <div className="font-medium">{car.powerWindows}</div>
                        </div>
                      </div>
                    )}
                    {car.driveType && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Car className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('drive_type') || 'Drive Type'}</div>
                          <div className="font-medium">{car.driveType}</div>
                        </div>
                      </div>
                    )}
                    {car.totalWeight && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Gauge className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('total_weight') || 'Total Weight'}</div>
                          <div className="font-medium">{car.totalWeight} kg</div>
                        </div>
                      </div>
                    )}
                    {car.enginePower && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Car className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('engine_power') || 'Engine Power'}</div>
                          <div className="font-medium">{car.enginePower}</div>
                        </div>
                      </div>
                    )}
                    {car.doors && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Car className="h-4 w-4 text-teal-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('doors') || 'Doors'}</div>
                          <div className="font-medium">{car.doors}</div>
                        </div>
                      </div>
                    )}
                    {car.co2Emission && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Car className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('co2_emission') || 'CO2 Emission'}</div>
                          <div className="font-medium">{car.co2Emission} g/km</div>
                        </div>
                      </div>
                    )}
                    {car.greenIndex && (
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 rounded-lg`}>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Car className="h-4 w-4 text-green-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="text-xs text-gray-500">{t('green_index') || 'Green Index'}</div>
                          <div className="font-medium">{car.greenIndex}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pros and Cons Section */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pros_and_cons') || 'Pros and Cons'}</h3>
                  <p className="text-gray-600">Compare the advantages and disadvantages of this vehicle</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start relative">
                  {/* Visual Separator */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent transform -translate-x-1/2"></div>
                  
                  {/* Pros Column */}
                  <div className="relative flex flex-col h-full">
                    {/* Pros Header */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6">
                      <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-green-800">{t('pros')}</h4>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{car.pros?.length || 0}</div>
                        <div className="text-sm text-green-600">Advantages</div>
                      </div>
                    </div>
                    
                    {/* Pros List */}
                    <div className="space-y-4">
                      {car.pros && car.pros.length > 0 ? (
                        car.pros.map((pro: string, index: number) => (
                          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                            <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800 font-medium leading-relaxed">{pro}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Check className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500">{t('no_pros_available')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cons Column */}
                  <div className="relative flex flex-col h-full">
                    {/* Cons Header */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 mb-6">
                      <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                        <h4 className="text-xl font-bold text-red-800">{t('cons')}</h4>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{car.cons?.length || 0}</div>
                        <div className="text-sm text-red-600">Disadvantages</div>
                      </div>
                    </div>
                    
                    {/* Cons List */}
                    <div className="space-y-4">
                      {car.cons && car.cons.length > 0 ? (
                        car.cons.map((con: string, index: number) => (
                          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-red-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                            <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                                <X className="h-4 w-4 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800 font-medium leading-relaxed">{con}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <X className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500">{t('no_cons_available')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Summary Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-6 py-4 border border-blue-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{car.pros?.length || 0}</div>
                        <div className="text-sm text-blue-600">Total Pros</div>
                      </div>
                      <div className="w-px h-12 bg-blue-200"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{car.cons?.length || 0}</div>
                        <div className="text-sm text-red-600">Total Cons</div>
                      </div>
                      <div className="w-px h-12 bg-blue-200"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {car.pros && car.cons ? 
                            (car.pros.length > car.cons.length ? '👍' : 
                             car.pros.length < car.cons.length ? '👎' : '🤝') : '🤔'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {car.pros && car.cons ? 
                            (car.pros.length > car.cons.length ? 'Pros Win' : 
                             car.pros.length < car.cons.length ? 'Cons Win' : 'Balanced') : 'Unknown'}
                        </div>
                      </div>
                    </div>
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
                      <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} group p-3 rounded-lg hover:bg-gray-50 transition-colors`}>
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
                      <div className={isRTL ? 'text-right' : 'text-left'}>
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

      {/* Full Screen Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => {
            setIsImageModalOpen(false);
            setCurrentImageIndex(0); // Reset to first image when closing
          }}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
                setCurrentImageIndex(0); // Reset to first image when closing
              }}
              className={`absolute top-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors backdrop-blur-sm ${isRTL ? 'left-4' : 'right-4'}`}
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Navigation Buttons */}
            {car.allImages && car.allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === 0 ? car.allImages.length - 1 : prev - 1);
                  }}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors backdrop-blur-sm ${isRTL ? 'right-4 left-auto' : ''}`}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === car.allImages.length - 1 ? 0 : prev + 1);
                  }}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors backdrop-blur-sm ${isRTL ? 'left-4 right-auto' : ''}`}
                >
                  <ChevronLeft className="h-6 w-6 transform rotate-180" />
                </button>
              </>
            )}
            
            {/* Image */}
            <div className="relative">
              {car.allImages && car.allImages[currentImageIndex] && (
                <Img
                  src={car.allImages[currentImageIndex]}
                  width={1920}
                  height={1080}
                  external={true}
                  alt={car.title}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
            
            {/* Image Info and Navigation Dots */}
            <div className={`absolute bottom-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg ${isRTL ? 'right-4 left-4' : 'left-4 right-4'}`}>
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{car.title}</h3>
              <p className={`text-sm text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                {car.year} • {car.make} • {car.bodyType}
              </p>
              
              {/* Image Counter */}
              {car.allImages && car.allImages.length > 1 && (
                <div className={`flex justify-center mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-gray-300">
                    {currentImageIndex + 1} / {car.allImages.length}
                  </span>
                </div>
              )}
              
              {/* Navigation Dots */}
              {car.allImages && car.allImages.length > 1 && (
                <div className={`flex justify-center mt-2 space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  {car.allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
    </>
  );
};

export default CarDetailsContent; 