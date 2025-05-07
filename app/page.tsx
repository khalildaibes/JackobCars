"use client"; // This marks the component as a Client Component

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueries, QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { getCachedData, setCachedData } from "../utils/cacheUtils";

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
  categories: string | string[] | Array<{ name: string }>;
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
  categories?: Array<{ name: string }>;
}

interface Part {
  title: string;
  id: string;
  slug: string;
  name: string;
  details: {
    description: string;
    features: Array<{ value: string }>;
  };
  price: number;
  categories: Array<{ name: string }>;
  stores: Array<{
    hostname: string; id: string; name: string 
  }>;
  images: Array<{ url: string }>;
}

interface ServiceImage {
  url: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  image: {
    url: string;
  };
  details: {
    description: string;
    features: Array<{ value: string }>;
  };
  price: number;
  categories: Array<{ name: string }>;
  stores: Array<{ id: string; name: string, hostname: string }>;
}

interface Story {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface CarDetails {
  miles?: string;
  fuel?: string;
  condition?: string;
  transmission?: string;
  year?: number;
  make?: string;
  body_type?: string;
  description?: string;
  features?: Array<{ value: string }>;
}

interface PartCardProps {
  part: {
    id: string;
    images: Array<{ url: string }>;
    title: string;
    slug: string;
    price: string;
    description: string;
    features: string[];
    categories: Array<{ name: string }>;
    store: { hostname: string };
  };
}

interface TransformedPart {
  features: any;
  description: string;
  id: string;
  title: string;
  slug: string;
  price: number;
  details: {
    description: string;
    features: Array<{ value: string }>;
  };
  categories: Array<{ name: string }>;
  stores: Array<{
    hostname: string; id: string; name: string 
  }>;
  images: Array<{ url: string }>;
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
  // const cachedData = getCookie('dealsData');
  // if (cachedData) {
  //   return cachedData;
  // }

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
const fetchHomePageData = async (): Promise<HomePageData> => {
  const response = await fetch('/api/homepage?store_hostname=64.227.112.249');
  if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
  const data = await response.json();
  return data;
};

const fetchParts = async (): Promise<Part[]> => {
  const cacheKey = 'parts:all';
  
  // Try to get cached data first
  const cachedData = await getCachedData<Part[]>(cacheKey);
  if (cachedData && Array.isArray(cachedData)) {
    return cachedData;
  }

  const response = await fetch('/api/parts?store_hostname=64.227.112.249');
  if (!response.ok) throw new Error(`Failed to fetch parts: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data || !Array.isArray(data.data)) throw new Error("Invalid API response structure");
  
  // Cache the result for 1 hour
  await setCachedData<Part[]>(cacheKey, data.data, 60 * 60);
  
  return data.data;
};

const fetchServices = async (): Promise<Service[]> => {
  const cacheKey = 'services:all';
  
  // Try to get cached data first
  const cachedData = await getCachedData<Service[]>(cacheKey);
  if (cachedData && Array.isArray(cachedData)) {
    return cachedData;
  }

  const response = await fetch('/api/services?store_hostname=64.227.112.249');
  if (!response.ok) throw new Error(`Failed to fetch services: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data || !Array.isArray(data.data)) throw new Error("Invalid API response structure");
  
  // Cache the result for 1 hour
  await setCachedData<Service[]>(cacheKey, data.data, 60 * 60);
  
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1
    },
  },
})

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
  const [error, setError] = useState<string | null>(null);

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

  // Destructure the results with proper typing
  const [
    { data: carsData, isLoading: isLoadingCars, error: carsError },
    { data: dealsData, isLoading: isLoadingDeals, error: dealsError },
    { data: articlesData, isLoading: isLoadingArticles, error: articlesError },
    { data: partsData, isLoading: isLoadingParts, error: partsError },
    { data: servicesData, isLoading: isLoadingServices, error: servicesError },
    { data: storiesData, isLoading: isLoadingStories, error: storiesError }
  ] = queryResults;

  // Check for any errors
  useEffect(() => {
    const errors = [carsError, dealsError, articlesError, partsError, servicesError, storiesError];
    const firstError = errors.find(error => error);
    if (firstError) {
      setError(firstError.message);
    }
  }, [carsError, dealsError, articlesError, partsError, servicesError, storiesError]);

  // Check if any query is still loading
  const isLoading = queryResults.some(result => result.isLoading);
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  // Transform deals data with memoization and proper type checking
  const listings = useMemo(() => {
    if (isLoadingDeals || !dealsData) return [];
    
    const deals = dealsData as Deal[];
    return deals.map((product: Deal): Listing => {
      let categories: string[] = [];
      
      if (!product.categories) {
        categories = [];
      } else if (typeof product.categories === 'string') {
        categories = product.categories.split(",").map(c => c.toLowerCase().trim());
      } else if (Array.isArray(product.categories)) {
        categories = product.categories.map(cat => {
          if (typeof cat === 'string') {
            return cat.toLowerCase().trim();
          }
          return cat.name.toLowerCase().trim();
        });
      }

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
        price: `${product.price.toLocaleString()}`,
        mileage: product.details?.car.miles || "N/A",
        year: product.details?.car.year || 2025,
        fuelType: normalizeFuelType(product.details?.car.fuel || "Unknown"),
        make: normalizeMake(product.details?.car.make || "Unknown"),
        bodyType: normalizeBodyType(product.details?.car.body_type || "Unknown"),
        description: product.details?.car.description || "Unknown",
        features: product.details?.car.features?.map((feature) => feature.value) || [],
        category: categories,
        categories: categories.map(cat => ({ name: cat }))
      };
    });
  }, [dealsData, isLoadingDeals]);

  // Transform articles data with proper type checking
  const transformedArticles = useMemo(() => {
    if (!articlesData) return [];
    
    const data = articlesData as { featuredData: { data: Article[] } };
    if (!data?.featuredData?.data) return [];
    
    return data.featuredData.data.map((article: Article) => ({
      id: article.id,
      title: article.title || '',
      excerpt: article.excerpt || '',
      imageUrl: article.cover ? article.cover.url : '',
      category: article.categories?.map((category) => category.name).join(', ') || '',
      date: new Date(article.publishedAt).toLocaleDateString() || '',
      author: article.author?.data?.attributes?.name || t('unknown_author'),
      description: article.description || '',
      cover: article.cover || null,
      categories: article.categories || [],
      publishedAt: article.publishedAt || '',
      locale: article.locale || 'en',
      slug: article.slug || '',
      blocks: article.blocks || []
    }));
  }, [articlesData, t]);

  // Transform parts data with proper type checking
  const transformedParts = useMemo(() => {
    if (!partsData) return [];
    
    const parts = partsData as Part[];
    return parts.map((part: Part): TransformedPart => ({
      id: part.id,
      title: part.title,
      slug: part.slug,
      price: part.price,
      details: part.details,
      categories: part.categories,
      stores: part.stores,
      images: part.images,
      features: undefined,
      description: ""
    }));
  }, [partsData]);

  // Transform services data with proper type checking
  const transformedServices = useMemo(() => {
    if (!servicesData) return [];
    
    const services = servicesData as Service[];
    return services.map((service: Service) => {
      const imageUrl = service.image?.url || null;

      return {
        id: parseInt(service.id),
        mainImage: imageUrl 
          ? `http://${service.stores[0].hostname}${imageUrl}`
          : "/default-service.png",
        alt: service.title || "Service Image",
        title: service.title,
        slug: service.slug, 
        description: service.details?.description || "",
        price: service.price,
        features: service.details ? service.details.features.map((feature) => feature.value) || [] : [],
        categories: service.categories || [],
        stores: service.stores || [],
        hostname: service.stores?.[0]?.hostname || "",
        image: service.image || { url: "/default-service.png" }
      };
    });
  }, [servicesData]);

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

  // Filter listings based on selected category
  const filteredListings = useMemo(() => {
    if (!selectedCategory) return listings;
    return listings.filter(listing => {
      return listing;
    });
  }, [listings, selectedCategory, t]);

  // Filter parts based on featured category
  const filteredParts = useMemo(() => {
    return transformedParts.filter((part: TransformedPart) => {
      return part.categories?.some(cat => 
        cat.name.toLowerCase().includes('featured')
      ) ?? false;
    });
  }, [transformedParts]);

  // Filter listings for EV section
  const evListings = useMemo(() => {
    return filteredListings.filter(listing => 
      listing.category.some(cat => cat.toLowerCase().includes('featured')) && 
      listing.category.some(cat => cat.toLowerCase().includes('electric_vehicles'))
    );
  }, [filteredListings]);

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

  // Add error display
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full z-70 overflow-x-hidden">
      {/* Left Dashboard - Hide on mobile */}
      {showads && (
        <div className="w-[15%] bg-white/10 mt-[5%] backdrop-blur-sm border-r border-gray-200/20 p-4 hidden lg:block ${!isAdmin ? 'invisible' : ''}">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold text-white mb-4">{t('quick_links')}</h2>
            <nav className="space-y-2">
              <Link href="/car-listings" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Car className="w-4 h-4" />
                <span>{t('all_cars')}</span>
              </Link>
              <Link href="/services" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
                <span>{t('services')}</span>
              </Link>
              <Link href="/parts" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Wrench className="w-4 h-4" />
                <span>{t('parts')}</span>
              </Link>
              <Link href="/car-listings" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Tag className="w-4 h-4" />
                <span>{t('special_deals')}</span>
              </Link>
            </nav>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">{t('recent_watched_cars')}</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
                  {t('electric_cars')}
                </button>
                <button className="w-full text-left px-3 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
                  {t('luxury_suvs')}
                </button>
                <button className="w-full text-left px-3 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
                  {t('family_sedans')}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">{t('quick_stats')}</h2>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-white/60">{t('total_listings')}</p>
                  <p className="text-xl font-bold text-white">{listings.length}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-white/60">{t('featured_cars')}</p>
                  <p className="text-xl font-bold text-white">{listings.filter(l => l.category.some(cat => cat.toLowerCase().includes('featured'))).length}</p>
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
          className="flex flex-col w-full overflow-hidden mt-[5%] px-2 sm:px-4 md:px-6 rounded-xl"
        >
          {/* 1. Hero Banner Section */}
          <HeroSection listings={listings} />
          {/* <StoriesCarousel stories={stories} /> */} 

          {/* Main Content Container */}
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl overflow-x-hidden">
            {/* Magazine-style Grid Layout */}
            <div className="grid grid-cols-12 gap-6 mb-8">
              {/* Featured Article - Spans full width */}
              {/* <div className="col-span-12 mb-8">
                <motion.section 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-gradient-to-b from-white to-gray-50 py-8 rounded-2xl overflow-hidden"
                >
                  <div className="px-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('featured_story')}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="relative h-[400px] rounded-xl overflow-hidden">
                        <Img
                          src={visibleArticles[0]?.imageUrl ? `http://64.227.112.249${visibleArticles[0].imageUrl}` : '/default-article.jpg'}
                          alt={visibleArticles[0]?.title || 'Featured Article'}
                          className="object-cover w-full h-full"
                          width={800}
                          height={600}
                          external={true}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit mb-4">
                          {visibleArticles[0]?.category}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{visibleArticles[0]?.title}</h3>
                        <p className="text-gray-600 mb-6">{visibleArticles[0]?.excerpt}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">{visibleArticles[0]?.date}</span>
                          <span className="text-sm font-medium">{visibleArticles[0]?.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              </div> */}

              {/* Latest News Grid - 3 columns */}
              <div className="col-span-12">
                <motion.section 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-white py-8 rounded-2xl"
                >
                  <div className="px-6 mb-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">{t('latest_news')}</h2>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={prevSlide}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
                    {visibleArticles.slice(1).map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="relative h-48">
                          <Img
                            src={`http://64.227.112.249${article.imageUrl}`}
                            alt={article.title}
                            className="object-cover w-full h-full"
                            width={400}
                            height={300}
                            external={true}
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              {article.category}
                            </span>
                            <span className="text-xs text-gray-500">{article.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{article.author}</span>
                            <Link 
                              href={`/news/${article.slug}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </div>
            </div>

            {/* Store Promotion Section */}
            <div className="mb-12">
              <StorePromotion />
            </div>

            {/* Special Offers Section */}
            {/* <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-white mb-12 rounded-2xl p-8"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('special_offers')}</h3>
                <p className="text-gray-600 text-lg">{t('partner_offers')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full">إعلان</span>
                    <span className="text-blue-600 font-semibold">عرض محدود</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">عرض الصيف للصيانة</h4>
                  <p className="text-gray-600 mb-6 text-lg">باقة صيانة كاملة تشمل تغيير الزيت، تبديل الإطارات، وفحص شامل للسيارة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-600">٧٤٩ شيكل</span>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      اعرف المزيد
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-full">جديد</span>
                    <span className="text-green-600 font-semibold">مميز</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">باقة شحن السيارات الكهربائية</h4>
                  <p className="text-gray-600 mb-6 text-lg">تركيب محطة شحن منزلية مع ضمان لمدة سنتين ودعم فني على مدار الساعة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">٣,٣٧٥ شيكل</span>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      احصل على العرض
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded-full">فاخر</span>
                    <span className="text-purple-600 font-semibold">حصري</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">تأجير سيارات فاخرة</h4>
                  <p className="text-gray-600 mb-6 text-lg">تجربة قيادة السيارات الفاخرة لعطلة نهاية الأسبوع مع تغطية تأمينية كاملة وخدمة كونسيرج</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-purple-600">١,٨٧٥ شيكل/يوم</span>
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            </motion.section> */}

            {/* Categories and Featured Cars Section */}
            <div className="grid grid-cols-12 gap-8 mb-12">
              <div className="col-span-12">
                <CategoryButtons onCategorySelect={handleCategorySelect} />
              </div>
              <div className="col-span-12">
                <RecentlyAddedSection 
                  listings={listings.filter((listing) => listing.category.includes(t("most_searched_cars")))} 
                  title={t(selectedCategory)}
                  viewAllLink="/cars"
                />
              </div>
            </div>

            {/* EV Cars Section with improved layout */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('electric_vehicles')}</h3>
                  <p className="text-gray-600 text-lg">{t('discover_future_mobility')}</p>
                </div>
                <div className="hidden sm:flex gap-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {t('view_all')}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    {t('compare')}
                  </button>
                </div>
              </div>
              <div className="w-full overflow-x-hidden items-center justify-center">
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
                    className="items-center justify-center"
                    items={filteredListings.filter(listing => 
                      listing.category.includes('featured') && 
                      listing.category.includes('electric_vehicles')
                      )
                      
                      .slice(0, 4).map((car) => (
                      <div key={car.id} className="px-0.5 w-full">
                        <CarCard key={car.id} car={car} variant="list" />
                      </div>
                    ))}
                    ref={sliderRef}
                  />
                ) : (
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
                    className="items-center justify-center"
                    items={filteredListings.filter(listing => 
                      listing.category.includes('featured') && 
                      listing.category.includes('electric_vehicles')
                      )
                      
                      .slice(0, 4).map((car) => (
                      <div key={car.id} className="px-0.5 w-full">
                        <CarCard key={car.id} car={car} variant="grid" />
                      </div>
                    ))}
                    ref={sliderRef}
                  />
                )}
              </div>
            </motion.section>

            {/* Parts and Services Sections with improved spacing */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">{t('parts_and_accessories')}</h3>
                  <p className="text-gray-300 mt-1">{t('premium_parts')}</p>
                </div>
                <div className="hidden sm:block">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      {t('shop_now')}
                    </button>
                    <button className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      {t('browse_categories')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredParts.slice(0, 4).map((part) => (
                  <div key={part.id} className="transform hover:scale-105 transition-transform duration-300">
                    <PartCard 
                      key={part.id} 
                      part={{
                        id: part.id,
                        images: part.images,
                        title: part.title,
                        slug: part.slug,
                        price: part.price.toString(),
                        description: part?.description || "",
                        features: part?.features?.map(f => f.value) || [],
                        categories: part.categories || [],
                        store: { hostname: part.stores[0]?.hostname || "" }
                      }} 
                    />
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('automotive_services')}</h3>
                  <p className="text-gray-600 text-lg">{t('expert_care')}</p>
                </div>
                <div className="hidden sm:block">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {t('book_service')}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      {t('view_packages')}
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
                        slug={service.slug}
                        id={service.id.toString()}
                        title={service.title}
                        description={service.description}
                        price={service.price}
                        image={service.image}
                        stores={service.stores}
                        hostname={service.stores[0]?.hostname}
                      />
                    </div>
                  ))
                }
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
          </div>
        </motion.main>
      </div>

      {/* Right Ads Section - Hide on mobile */}
      {showcontrols && (
        <div className="w-[15%] bg-white/10 mt-[5%] backdrop-blur-sm border-l border-gray-200/20 p-4 hidden lg:block">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold text-white mb-4">{t('featured_ads')}</h2>
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
                  <h3 className="text-white font-medium">{t('car_insurance_offer')}</h3>
                  <p className="text-sm text-white/60 mt-1">{t('limited_time_offer')}</p>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {t('learn_more')}
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
                  <h3 className="text-white font-medium">{t('low_interest_loans')}</h3>
                  <p className="text-sm text-white/60 mt-1">{t('starting_apr')}</p>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {t('apply_now')}
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
                  <h3 className="text-white font-medium">{t('premium_service')}</h3>
                  <p className="text-sm text-white/60 mt-1">{t('free_inspection')}</p>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {t('book_now')}
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
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}