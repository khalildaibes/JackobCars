"use client"; // This marks the component as a Client Component

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueries } from "@tanstack/react-query";
import CarCard from "../components/CarCard";
import ShowMore from "../components/ShowMore";
import Hero from "../components/Hero";
import { fetchCars } from "../utils";
import { CarProps } from "../types";
import MobileFilters from "../components/SearchCar";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import CustomerTestimonialsSection from "../components/homeeight/CustomerTestimonialsSection";
import LatestBlogPostsSection from "../components/homeeight/LatestBlogPostsSection";
import RecentlyAddedSection from "../components/homeeight/RecentlyAddedSection";
import {  useTranslations } from "next-intl";
import ResponsiveNewsLayout from "../components/Responsivenews";
import SearchBar from "../components/SearchBar";
import { Img } from "../components/Img";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Car, Settings, Wrench, Tag, CheckCircle, Shield, Database } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import PartCard from "../components/PartCard";
import { setCookie, getCookie } from "../utils/cookieUtils";
import StoriesCarousel from "../components/StoriesCarousel";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { Slider } from "../components/Slider";
import CategoryButtons from "../components/CategoryButtons";
import HeroSection from "../components/HeroSection";
import StorePromotion from "../components/StorePromotion";

// Types
interface Deal {
  store: any;
  slug: string;
  id: string;
  image: { url: string };
  name: string;
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
  price: number;
  categories: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  cover: { url: string };
  categories: Array<{ name: string }>;
  publishedAt: string;
  author: {
    data: {
      attributes: {
        name: string;
        email: string;
      };
    };
  };
  description: string;
  locale: string;
  slug: string;
  blocks: any[];
}

interface HomePageData {
  banner: any;
  featured: any;
  textcards: any;
  locale: string;
  localizations: any;
}

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

interface Part {
  id: string;
  slug: string;
  name: string;
  images: Array<{ url: string }>;
  details: {
    description: string;
    features: Array<{ value: string }>;
  };
  price: number;
  categories: Array<{ name: string }>;
  stores: Array<{ id: string; name: string }>;
  mainImage?: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  image: { url: string };
  details: {
    description: string;
    features: Array<{ value: string }>;
  };
  price: number;
  categories: Array<{ name: string }>;
  stores: Array<{ id: string; name: string }>;
}

interface Story {
  id: string;
  title: string;
  description: string;
  url: string;
}

// API fetch functions
const fetchArticles = async () => {
  const cachedData = getCookie('articlesData');
  if (cachedData) {
    return cachedData;
  }

  const [featuredResponse, newsResponse, storyResponse] = await Promise.all([
    fetch('/api/articles?limit=8'),
    fetch('/api/articles?limit=8'),
    fetch('/api/articles?limit=8')
  ]);

  const [featuredData, newsData, storyData] = await Promise.all([
    featuredResponse.json(),
    newsResponse.json(),
    storyResponse.json()
  ]);

  if (!featuredData.data || !newsData.data || !storyData.data) {
    throw new Error('Invalid data format received from API');
  }

  const data = { featuredData, newsData, storyData };
  setCookie('articlesData', data);
  return data;
};

const fetchDeals = async (): Promise<Deal[]> => {
  const cachedData = getCookie('dealsData');
  if (cachedData) {
    return cachedData;
  }

  console.log("Fetching deals...");
  const response = await fetch('/api/deals?store_hostname=64.227.112.249');
  if (!response.ok) {
    console.error("Failed to fetch deals:", response.statusText);
    throw new Error(`Failed to fetch deals: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Deals API Response:", data);
  if (!data?.data) {
    console.error("Invalid API response structure:", data);
    throw new Error("Invalid API response structure");
  }
  setCookie('dealsData', data.data);
  return data.data;
};

const fetchParts = async (): Promise<Part[]> => {
  const cachedData = getCookie('partsData');
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch('/api/parts?store_hostname=64.227.112.249');
  if (!response.ok) throw new Error(`Failed to fetch parts: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data) throw new Error("Invalid API response structure");
  setCookie('partsData', data.data);
  return data.data;
};

const fetchServices = async (): Promise<Service[]> => {
  const cachedData = getCookie('servicesData');
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch('/api/services?store_hostname=64.227.112.249');
  if (!response.ok) throw new Error(`Failed to fetch services: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data) throw new Error("Invalid API response structure");
  setCookie('servicesData', data.data);
  return data.data;
};

const fetchStories = async (): Promise<Story[]> => {
  const cachedData = getCookie('storiesData');
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch('/api/stories?store_hostname=64.227.112.249');
  if (!response.ok) throw new Error(`Failed to fetch stories: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data) throw new Error("Invalid API response structure");
  setCookie('storiesData', data.data);
  return data.data;
};

// Normalization functions
const normalizeFuelType = (rawFuelType: string): string => {
  const fuelTypes = {
    'plug-in': 'Plug-in Hybrid',
    'plug in': 'Plug-in Hybrid',
    'היברידי נטען': 'Plug-in Hybrid',
    'هجين قابل للشحن': 'Plug-in Hybrid',
    'hybrid': 'Hybrid',
    'היברידי': 'Hybrid',
    'هجين': 'Hybrid',
    'electric': 'Electric',
    'חשמלי': 'Electric',
    'كهربائي': 'Electric',
    'diesel': 'Diesel',
    'דיזל': 'Diesel',
    'ديزل': 'Diesel',
    'gasoline': 'Gasoline',
    'petrol': 'Gasoline',
    'בנזין': 'Gasoline',
    'بنزين': 'Gasoline'
  };

  const normalized = Object.entries(fuelTypes).find(([key]) => 
    rawFuelType.toLowerCase().includes(key)
  );
  return normalized ? normalized[1] : rawFuelType;
};

const normalizeMake = (rawMake: string): string => {
  const makes = {
    'toyota': 'Toyota',
    'טויוטה': 'Toyota',
    'تويوتا': 'Toyota',
    'honda': 'Honda',
    'הונדה': 'Honda',
    'هوندا': 'Honda',
    'ford': 'Ford',
    'פורד': 'Ford',
    'فورد': 'Ford',
    'chevrolet': 'Chevrolet',
    'שברולט': 'Chevrolet',
    'شيفروليه': 'Chevrolet',
    'bmw': 'BMW',
    'ב.מ.וו': 'BMW',
    'بي ام دبليو': 'BMW',
    'mercedes': 'Mercedes-Benz',
    'מרצדס': 'Mercedes-Benz',
    'مرسيدس': 'Mercedes-Benz',
    'audi': 'Audi',
    'אאודי': 'Audi',
    'أودي': 'Audi',
    'tesla': 'Tesla',
    'טסלה': 'Tesla',
    'تيسلا': 'Tesla',
    'lexus': 'Lexus',
    'לקסוס': 'Lexus',
    'لكزس': 'Lexus',
    'subaru': 'Subaru',
    'סובארו': 'Subaru',
    'سوبارو': 'Subaru'
  };

  const normalized = Object.entries(makes).find(([key]) => 
    rawMake.toLowerCase().includes(key)
  );
  return normalized ? normalized[1] : rawMake;
};

const normalizeBodyType = (rawBodyType: string): string => {
  const bodyTypes = {
    'sedan': 'Sedan',
    'סדאן': 'Sedan',
    'سيدان': 'Sedan',
    'suv': 'SUV',
    'רכב שטח': 'SUV',
    'سيارة رياضية متعددة الاستخدامات': 'SUV',
    'truck': 'Truck',
    'משאית': 'Truck',
    'شاحنة': 'Truck',
    'coupe': 'Coupe',
    'קופה': 'Coupe',
    'كوبيه': 'Coupe',
    'convertible': 'Convertible',
    'קבריולה': 'Convertible',
    'كابريوليه': 'Convertible',
    'hatchback': 'Hatchback',
    'הצ\'בק': 'Hatchback',
    'هاتشباك': 'Hatchback',
    'wagon': 'Wagon',
    'סטיישן': 'Wagon',
    'ستيشن': 'Wagon',
    'van': 'Van',
    'ואן': 'Van',
    'فان': 'Van'
  };

  const normalized = Object.entries(bodyTypes).find(([key]) => 
    rawBodyType.toLowerCase().includes(key)
  );
  return normalized ? normalized[1] : rawBodyType;
};

// Dynamically import components
const   FindCarByPlate = dynamic(() => import("./plate_search/FindCarByPlate"), { ssr: false });
// const HeroSection = dynamic(() => import("../components/NewHero"));
const LookingForCar = dynamic(() => import("../components/comp"));
const FeaturedListingsSection = dynamic(() => import("../components/homeeight/FeaturedListingsSection"));
// const SalesAndReviewsSection = dynamic(() => import("../components/homeeight/SalesAndReviewsSection"));

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("HomePage");
  const [activeIndex, setActiveIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('electric');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showads, setShowads] = useState(false);
  const [showcontrols, setShowcontrols] = useState(false);

  // Get search params with memoization
  const { selectedFuel, selectedYear, selectedManufacturer, selectedLimit, selectedModel } = useMemo(() => ({
    selectedFuel: searchParams.get("fuel") || "",
    selectedYear: searchParams.get("year") || "",
    selectedManufacturer: searchParams.get("manufacturer"),
    selectedLimit: searchParams.get("limit"),
    selectedModel: searchParams.get("model")
  }), [searchParams]);

  // Use useQueries to handle all queries together
  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['cars', selectedManufacturer, selectedModel, selectedYear, selectedFuel, selectedLimit],
        queryFn: () => fetchCars({
          manufacturer: selectedManufacturer || "",
          year: selectedYear ? parseInt(selectedYear, 10) : 0,
          fuel: selectedFuel || "",
          limit: selectedLimit ? parseInt(selectedLimit, 10) : 12,
          model: selectedModel || "",
        }),
        enabled: !!selectedManufacturer || !!selectedModel
      },
      {
        queryKey: ['deals'],
        queryFn: fetchDeals
      },
      {
        queryKey: ['articles'],
        queryFn: fetchArticles
      },
      // {
      //   queryKey: ['homepage'],
      //   queryFn: fetchHomePageData
      // },
      {
        queryKey: ['parts'],
        queryFn: fetchParts
      },

      {
        queryKey: ['services'],
        queryFn: fetchServices
      },
      {
        queryKey: ['stories'],
        queryFn: fetchStories
      },
    ]
  });

  // Destructure the results
  const [
    { data: carsData, isLoading: isLoadingCars },
    { data: dealsData, isLoading: isLoadingDeals },
    { data: articlesData, isLoading: isLoadingArticles },
    // { data: homepageData, isLoading: isLoadingHomepage },
    { data: partsData, isLoading: isLoadingParts },
    { data: servicesData, isLoading: isLoadingServices },
    { data: storiesData, isLoading: isLoadingStories }
  ] = queryResults;

  // Check if any query is still loading
  const isLoading = queryResults.some(result => result.isLoading);
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  // Transform deals data with memoization
  const listings = useMemo(() => {
    console.log("Transforming deals data...");
    if (isLoadingDeals) {
      console.log("Deals data is loading...");
      return [];
    }
    
    if (!dealsData) {
      console.log("No deals data available");
      return [];
    }
    
    console.log("Raw deals data:", dealsData);
    return dealsData.map((product: Deal): Listing => {
      console.log("Processing product:", product);
      return {
        id: parseInt(product.id),
        mainImage: product.image ? `http://${product.store.hostname}${product.image?.url}` : "/default-car.png",
        alt: product.name || "Car Image",
        title: product.name,
        slug: product.slug,
        miles: product.details?.car.miles || "N/A",
        fuel: normalizeFuelType(product.details?.car.fuel || "Unknown"),
        condition: product.details?.car.condition || "Used",
        transmission: product.details?.car.transmission || "Unknown",
        details: product.details?.car.transmission || "Unknown",
        price: `$${product.price.toLocaleString()}`,
        mileage: product.details?.car.miles || "N/A",
        year: product.details?.car.year || 2025,
        fuelType: normalizeFuelType(product.details?.car.fuel || "Unknown"),
        make: normalizeMake(product.details?.car.make || "Unknown"),
        bodyType: normalizeBodyType(product.details?.car.body_type || "Unknown"),
        description: product.details?.car.description || "Unknown",
        features: product.details?.car.features?.map((feature) => feature.value) || [],
        category: product.categories ? product.categories.split(",").map((c) => c.toLowerCase().trim()) : [],
      };
    });
  }, [dealsData, isLoadingDeals]);

  // Transform articles data with memoization
  const transformedArticles = useMemo(() => {
    if (!articlesData?.featuredData?.data) return [];
    
    return articlesData.featuredData.data.map((article: Article) => ({
      id: article.id,
      title: article.title || '',
      excerpt: article.excerpt || '',
      imageUrl: article.cover ? article.cover.url : '',
      category: article.categories?.map((category) => category.name).join(', ') || '',
      date: new Date(article.publishedAt).toLocaleDateString() || '',
      author: article.author?.data?.attributes?.name || 'Unknown Author',
      description: article.description || '',
      cover: article.cover || null,
      categories: article.categories || [],
      publishedAt: article.publishedAt || '',
      locale: article.locale || 'en',
      slug: article.slug || '',
      blocks: article.blocks || []
    }));
  }, [articlesData]);

  // News slider state and functions
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 1 : 4;
  const totalSlides = Math.ceil(transformedArticles.filter(article => article.category.includes('featured')).length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleArticles = transformedArticles
    .filter(article => article.category.includes('featured'))
    .slice(currentSlide * itemsPerPage, (currentSlide + 1) * itemsPerPage);

  // Memoized filter change handler
  const handleFilterChange = useCallback((title: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(title, value);
    } else {
      params.delete(title);
    }
    router.push(`/carsearch?${params.toString()}`);
  }, [router]);

  // Memoized data for LookingForCar component
  const lookingForCarData = useMemo(() => [
    {
      text: t("looking_for_car_text"),
      title: t("looking_for_car_title"),
      backgroundColor: "#050A30",
      textColor: "#E9F2FF",
      buttonColor: "#003060",
      buttonTextColor: "#FFFFFF",
      icon: "/icons/car-icon.svg"
    },
    {
      text: t("sell_your_car_text"),
      title: t("sell_your_car_title"),
      backgroundColor: "#000C66",
      textColor: "#FFFFFF",
      buttonColor: "#FFFFFF",
      buttonTextColor: "#050B20",
      icon: "/icons/car-icon.svg"
    }
  ], [t]);

  // Update the transformedParts transformation
  const transformedParts = useMemo(() => {
    if (!partsData) return [];
    
    return partsData.map((part: Part) => ({
      ...part,
      mainImage: part.images && part.images.length > 0 
        ? `http://64.227.112.249${part.images[0].url}` 
        : "/default-part.png",
    }));
  }, [partsData]);

  const transformedServices = useMemo(() => {
    if (!servicesData) return [];
    
    return servicesData.map((service: Service) => ({
      id: parseInt(service.id),
      mainImage: service.image ? `http://64.227.112.249${service.image?.url}` : "/default-service.png",
      alt: service.title || "Service Image",
      title: service.title,
      slug: service.slug,
      description: service.details.description,
      price: `${service.price.toLocaleString()}`,
      features: service.details.features.map((feature) => feature.value) || [],
      categories: service.categories  || [],
    }));
  }, [servicesData]);
  
  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories?store_hostname=64.227.112.249');
        const data = await response.json();
        setStories(data.data);
        console.log("Stories:", data.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  // Auto-advance stories
  useEffect(() => {
    if (stories.length > 0) {
      const timer = setInterval(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
      }, 5000); // Change story every 5 seconds

      return () => clearInterval(timer);
    }
  }, [stories?.length]);

  // Add handler for category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Update URL with selected category
    const params = new URLSearchParams(window.location.search);
    params.set('category', category);
    router.push(`?${params.toString()}`);
  };

  // Filter listings based on selected category
  const filteredListings = useMemo(() => {
    return listings.filter(listing => 
      listing.category.includes(selectedCategory) || 
      listing.category.includes(t(selectedCategory))
    );
  }, [listings, selectedCategory, t]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-600">Loading deals and content...</p>
      </div>
    );
  }
  
  return (
    <div className="flex w-full z-70 overflow-x-hidden">
      {/* Left Dashboard - Hide on mobile */}
      {showads && (
        <div className="w-[15%] bg-white/10 mt-[5%] backdrop-blur-sm border-r border-gray-200/20 p-4 hidden lg:block ${!isAdmin ? 'invisible' : ''}">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
            <nav className="space-y-2">
              <Link href="/car-listings" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Car className="w-4 h-4" />
                <span>All Cars</span>
              </Link>
              <Link href="/services" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
                <span>Services</span>
              </Link>
              <Link href="/parts" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Wrench className="w-4 h-4" />
                <span>Parts</span>
              </Link>
              <Link href="/car-listings" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Tag className="w-4 h-4" />
                <span>Special Deals</span>
              </Link>
            </nav>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Watched Cars</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
                  Electric Cars
                </button>
                <button className="w-full text-left px-3 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
                  Luxury SUVs
                </button>
                <button className="w-full text-left px-3 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
                  Family Sedans
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-white/60">Total Listings</p>
                  <p className="text-xl font-bold text-white">{listings.length}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-white/60">Featured Cars</p>
                  <p className="text-xl font-bold text-white">{listings.filter(l => l.category.includes('featured')).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:mt-[0%] mt-[15%]">
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col w-full overflow-hidden mt-[5%] px-2 sm:px-4 md:px-6"
        >
          {/* 1. Hero Banner Section */}
          <HeroSection listings={listings} />
          {/* <StoriesCarousel stories={stories} /> */} 

          {/* Main Content Container */}
          <div className="container mx-auto w-full px-2 sm:px-3 lg:px-4 max-w-7xl overflow-x-hidden">
            {/* 4. Latest News Section - Industry Updates */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-b from-white to-gray-50 py-1 mb-3 rounded-2xl overflow-hidden"
            >
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                  delay: 0.4
                }}
                className="flex items-center justify-between mb-3 px-2"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white bg-[#050B20] p-2 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8H8v7h8V8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v16" />
                  </svg>
                  {t('other_news')}
                </h2>
                {totalSlides > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-1 sm:p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-1 sm:p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
              <div className="relative px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  {visibleArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.6, -0.05, 0.01, 0.99],
                        delay: 0.6 + (index * 0.1)
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className="w-full"
                    >
                      <Link href={`/news/${article.slug}`} className="group block">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl min-h-[200px] sm:min-h-[250px] max-h-[250px] w-full">
                          <div className="overflow-hidden h-[120px] sm:h-[140px]">
                            <Img
                              src={`http://64.227.112.249${article.imageUrl}`}
                              alt={article.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              width={1290}
                              height={2040}
                              external={true}
                            />
                          </div>
                          <div className="p-2 sm:p-3 h-[160px]">
                            <div className="flex items-center mb-0.5">
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded-full">
                                {article.category}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{article.date}</span>
                            </div>
                            <h2 className="text-sm font-bold mb-0.5 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </h2>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">{article.excerpt}</p>
                            <div className="flex items-center mb-3 px-2">
                              <span className="font-medium">{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
            {/* add here a section to promo5t one store */}
            <StorePromotion />
            <CategoryButtons onCategorySelect={handleCategorySelect} />

            {/* 3. Most Searched Section - Popular Cars */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full mb-3 rounded-2xl"
            >
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                  delay: 0.6
                }}
                className="flex items-center mb-4 px-4"
              >

              </motion.div>
              
              <RecentlyAddedSection 
                listings={listings.filter((listing) => listing.category.includes(t("most_searched_cars")))} 
                title={t(selectedCategory)}
                viewAllLink="/cars"
              />
              
            </motion.section>
            {/* Ads Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-white mb-3 rounded-2xl p-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                  delay: 0.6
                }}
                className="mb-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">{t('عروض مميزة')}</h3>
                <p className="text-gray-600 mt-1">عروض خاصة من شركائنا</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ad Card 1 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">إعلان</span>
                    <span className="text-blue-600 font-semibold">عرض محدود</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">عرض الصيف للصيانة</h4>
                  <p className="text-gray-600 mb-4">باقة صيانة كاملة تشمل تغيير الزيت، تبديل الإطارات، وفحص شامل للسيارة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">٧٤٩ شيكل</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      اعرف المزيد
                    </button>
                  </div>
                </div>

                {/* Ad Card 2 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">جديد</span>
                    <span className="text-green-600 font-semibold">مميز</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">باقة شحن السيارات الكهربائية</h4>
                  <p className="text-gray-600 mb-4">تركيب محطة شحن منزلية مع ضمان لمدة سنتين ودعم فني على مدار الساعة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">٣,٣٧٥ شيكل</span>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      احصل على العرض
                    </button>
                  </div>
                </div>

                {/* Ad Card 3 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">فاخر</span>
                    <span className="text-purple-600 font-semibold">حصري</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">تأجير سيارات فاخرة</h4>
                  <p className="text-gray-600 mb-4">تجربة قيادة السيارات الفاخرة لعطلة نهاية الأسبوع مع تغطية تأمينية كاملة وخدمة كونسيرج</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">١,٨٧٥ شيكل/يوم</span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
            {/* Popular Categories Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full py-1 mb-3 rounded-2xl overflow-hidden"
            >

                {/* EV Cars Section - Tesla-inspired */}
                <div className="mt-4 sm:mt-8 w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{t('electric_vehicles')}</h3>
                      <p className="text-gray-600 mt-1">Discover the future of mobility</p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View All
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Compare
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full overflow-x-hidden">
                    {window.innerWidth <= 768 ? (
                      <Slider
                        autoPlay
                        autoPlayInterval={3000}
                        responsive={{ 
                          "0": { items: 1 }, 
                          "551": { items: 1 }, 
                          "1051": { items: 2 }, 
                          "1441": { items: 4 } 
                        }}
                        disableDotsControls
                        activeIndex={sliderState}
                        onSlideChanged={(e: EventObject) => {
                          setSliderState(e?.item);
                        }}
                        paddingLeft={10}
                        paddingRight={10}
                        items={listings.filter(listing => listing.category.includes('featured') && listing.category.includes('electric_vehicles'))
                          .slice(0, 4).map((car) => (
                          <div key={car.id} className="px-0.5 w-full">
                            <CarCard key={car.id} car={car} variant="list" />
                          </div>
                        ))}
                        ref={sliderRef}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listings.filter(listing => listing.category.includes('featured') && listing.category.includes('electric_vehicles'))
                          .slice(0, 4).map((car) => (
                            <div key={car.id} className="transform hover:scale-105 transition-transform duration-300">
                              <CarCard key={car.id} car={car} variant="grid" />
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Parts Section - Performance-focused */}
                <div className="mt-4 sm:mt-8 w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{t('parts_and_accessories')}</h3>
                      <p className="text-gray-300 mt-1">Premium performance parts for your vehicle</p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Shop Now
                        </button>
                        <button className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors">
                          Browse Categories
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {transformedParts
                      .filter(part => part.categories?.some(cat => cat.name.includes('featured')))
                      .slice(0, 4)
                      .map((part) => (
                        <div key={part.id} className="transform hover:scale-105 transition-transform duration-300">
                          <PartCard 
                            key={part.id} 
                            part={{
                              id: parseInt(part.id),
                              mainImage: part.mainImage,
                              title: part.name,
                              slug: part.slug,
                              price: part.price.toString(),
                              description: part.details.description,
                              features: part.details.features?.map(f => f.value),
                              category: part.categories?.map(cat => cat.name) || []
                            }} 
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Services Section - Professional */}
                <div className="mt-4 sm:mt-8 w-full bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{t('automotive_services')}</h3>
                      <p className="text-gray-600 mt-1">Expert care for your vehicle</p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Book Service
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          View Packages
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {transformedServices
                      .filter(service => service.categories?.some(cat => cat.name.includes('featured')))
                      .slice(0, 4)
                      .map((service) => (
                        <div key={service.id} className="transform hover:scale-105 transition-transform duration-300">
                          <ServiceCard 
                            key={service.id} 
                            service={{
                              ...service
                            }}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
            </motion.section>

            {/* Search Car by Plate Number Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-b from-white to-gray-50 py-6 mb-3 rounded-2xl overflow-hidden"
            >
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                  delay: 0.4
                }}
                className="flex flex-col items-center px-4 text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {t('search_by_plate')}
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl">
                  {t('plate_search_description')}
                </p>
                
                <div className="w-full max-w-xl">
                  <FindCarByPlate />
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{t('instant_results')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>{t('secure_search')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-500" />
                    <span>{t('comprehensive_data')}</span>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* 7. Call to Action Section - Looking for a Car
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-white py-1 mb-3 rounded-2xl"
            >
              <div className="px-4">
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {lookingForCarData.map(({ title, text, buttonColor, backgroundColor, icon, buttonTextColor, textColor }, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.6, -0.05, 0.01, 0.99],
                        delay: 1.2 + (index * 0.1)
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <LookingForCar
                        text={text}
                        title={title}
                        backgroundColor={backgroundColor}
                        textColor={textColor}
                        buttonColor={buttonColor}
                        buttonTextColor={buttonTextColor}
                        icon={icon}
                        variant={index === 0 ? 'buy' : 'sell'}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section> */}
          </div>
        </motion.main>
      </div>

      {/* Right Ads Section - Hide on mobile */}
      {showcontrols && (
        <div className="w-[15%] bg-white/10 mt-[5%] backdrop-blur-sm border-l border-gray-200/20 p-4 hidden lg:block">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold text-white mb-4">Featured Ads</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Img
                    src="/images/ad1.jpg"
                    alt="Car Insurance Ad"
                    width={256}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium">Get 20% Off Car Insurance</h3>
                  <p className="text-sm text-white/60 mt-1">Limited time offer for new customers</p>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Img
                    src="/images/ad2.jpg"
                    alt="Car Loan Ad"
                    width={256}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium">Low Interest Car Loans</h3>
                  <p className="text-sm text-white/60 mt-1">Starting from 2.9% APR</p>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Img
                    src="/images/ad3.jpg"
                    alt="Car Service Ad"
                    width={256}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium">Premium Car Service</h3>
                  <p className="text-sm text-white/60 mt-1">Free inspection with every service</p>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function HomePage() {
  return (
      <HomeContent />
  );
}