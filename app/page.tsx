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
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import PartCard from "../components/PartCard";
import { setCookie, getCookie } from "../utils/cookieUtils";
import StoriesCarousel from "../components/StoriesCarousel";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { Slider } from "../components/Slider";

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
const HeroSection = dynamic(() => import("../components/NewHero"));
const LookingForCar = dynamic(() => import("../components/comp"));
const FeaturedListingsSection = dynamic(() => import("../components/homeeight/FeaturedListingsSection"));
const SalesAndReviewsSection = dynamic(() => import("../components/homeeight/SalesAndReviewsSection"));

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("HomePage");
  const [activeIndex, setActiveIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-600">Loading deals and content...</p>
      </div>
    );
  }
  
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col w-full overflow-hidden mt-[5%]"
    >
      {/* 1. Hero Banner Section */}
      {/* <StoriesCarousel stories={stories} /> */}

      {/* Main Content Container */}
      <div className="container mx-auto px-2 sm:px-3 lg:px-4 max-w-7xl">
        {/* 4. Latest News Section - Industry Updates */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-gradient-to-b from-white to-gray-50 py-1 mb-1 rounded-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
              delay: 0.4
            }}
            className="flex items-center justify-between mb-1 px-2"
          >
            <h2 className="text-xl font-bold text-white bg-[#050B20] p-2 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
          <div className="relative px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl min-h-[250px] max-h-[250px] w-full">
                      <div className="overflow-hidden h-[140px]">
                        <Img
                          src={`http://64.227.112.249${article.imageUrl}`}
                          alt={article.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          width={1290}
                          height={2040}
                          external={true}
                        />
                      </div>
                      <div className="p-3  h-[160px]">
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
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">{article.excerpt}</p>
                        <div className="flex items-center mb-1 px-2">
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
        
        {/* 3. Most Searched Section - Popular Cars */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white py-1 mb-1 rounded-2xl"
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
            title={t("most_searched_cars")}
            viewAllLink="/cars"
          />
         
        </motion.section>

        {/* Popular Categories Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white py-1 mb-1 rounded-2xl"
        >
          <div className="px-2">
            <h2 className="text-2xl font-bold text-[#050A30] mb-1">{t('popular_categories')}</h2>
            
            {/* Categories Scroll */}
            <div className="relative mb-2">
              <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                <button className="px-2 py-1 bg-black text-white rounded-full whitespace-nowrap">{t('electric')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('suv')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('sedan')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('pickup_truck')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('luxury')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('crossover')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('hybrid')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('diesel')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('coupe')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('hatchback')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('wagon')}</button>
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap">{t('convertible')}</button>
              </div>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            </div>

            {/* EV Cars Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-1">{t('electric_vehicles')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                
              {
              window.innerWidth <= 768 ?
              <Slider
              autoPlay
              autoPlayInterval={2000}
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
                <div key={car.id} className="px-0.5">
                <CarCard key={car.id} car={car} variant="list" />
            </div>
              ))}
              ref={sliderRef}
            /> :
            listings.filter(listing => listing.category.includes('featured') && listing.category.includes('electric_vehicles')).slice(0, 4).map((car) => (
              <div key={car.id} className="px-0.5">
              <CarCard key={car.id} car={car} variant="grid" />
          </div>
            ))
          }
              
                {/* EV Guide Card */}
                <div className="bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow">
                  <Image
                    src="/ev-guide.png"
                    alt={t('ev_guide')}
                    width={250}
                    height={120}
                    className="w-full h-auto mb-1"
                  />
                  <h3 className="font-semibold mb-0.5">{t('ev_guide_title')}</h3>
                  <Link href="/ev-guide" className="text-blue-600 hover:underline">
                    {t('watch_ev101')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Luxury Cars Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-1">{t('luxury_cars')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {window.innerWidth <= 768 ? (
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
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
                    items={listings.filter(listing => listing.category.includes('featured') && listing.category.includes(t('luxury_cars')))
                      .slice(0, 4).map((car) => (
                      <div key={car.id} className="px-0.5">
                        <CarCard key={car.id} car={car} variant="list" />
                      </div>
                    ))}
                    ref={sliderRef}
                  />
                ) : (
                  listings.filter(listing => listing.category.includes('featured') && listing.category.includes(t('luxury_cars')))
                    .slice(0, 4).map((car) => (
                      <div key={car.id} className="px-0.5">
                        <CarCard key={car.id} car={car} variant="grid" />
                      </div>
                    ))
                )}
              </div>
            </div>
            
            {/* Parts Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-1">{t('parts_and_accessories')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {window.innerWidth <= 768 ? (
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
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
                    items={transformedParts
                      .filter(part => part.categories?.map(cat => cat.name.includes('featured')))
                      .slice(0, 4)
                      .map((part) => (
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
                      ))}
                    ref={sliderRef}
                  />
                ) : (
                  transformedParts
                    .filter(part => part.categories?.map(cat => cat.name.includes('featured')))
                    .slice(0, 4)
                    .map((part) => (
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
                    ))
                )}
              </div>
            </div>

            {/* Services Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-1">{t('automotive_services')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {window.innerWidth <= 768 ? (
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
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
                    items={transformedServices
                      .filter(service => service.categories?.map(cat => cat.name.includes('featured')))
                      .slice(0, 4)
                      .map((service) => (
                        <ServiceCard 
                          key={service.id} 
                          service={{
                            ...service
                          }}
                        />
                    ))}
                    ref={sliderRef}
                  />
                ) : (
                  transformedServices
                    .filter(service => service.categories?.map(cat => cat.name.includes('featured')))
                    .slice(0, 4)
                    .map((service) => (
                      <ServiceCard 
                        key={service.id} 
                        service={{
                          ...service
                        }}
                      />
                    ))
                )}
              </div>
            </div>

            {/* Bottom Links */}
            <div className="flex gap-6 mt-6">
              <Link href="/electric-vehicles" className="text-blue-600 font-semibold hover:underline">
                {t('see_more_evs')}
              </Link>
              <Link href="/cars" className="text-blue-600 font-semibold hover:underline">
                {t('shop_all_cars')}
              </Link>
            </div>
          </div>
        </motion.section> 

        {/* 5. Sales & Special Offers Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white py-1 mb-1 rounded-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
              delay: 0.8
            }}
            className="flex items-center mb-4 px-4"
          >
            <h2 className="text-xl font-bold text-white bg-[#050B20] p-2 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8H8v7h8V8z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v16" />
              </svg>
              {t('special_offers_sales')}
            </h2>
          </motion.div>
          <SalesAndReviewsSection />
        </motion.section>

        {/* 6. Recently Added Section - New Inventory */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-gradient-to-b from-gray-50 to-white py-1 mb-1 rounded-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
              delay: 1.0
            }}
            className="flex items-center mb-4 px-4"
          >
            <h2 className="text-xl font-bold text-white bg-[#050B20] p-2 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('new_arrivals')}
            </h2>
          </motion.div>
          <RecentlyAddedSection listings={listings} />
        </motion.section>

        {/* 7. Call to Action Section - Looking for a Car */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white py-1 mb-1 rounded-2xl"
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
        </motion.section>
      </div>
    </motion.main>
  );
}

export default function HomePage() {
  return (
      <HomeContent />
  );
}