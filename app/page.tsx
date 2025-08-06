"use client"; // This marks the component as a Client Component

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Img } from "../components/Img";
import Link from "next/link";
import StorePromotion from "../components/StorePromotion";

import ContentAds from "../components/ads/ContentAds";
import SidebarAds from "../components/ads/SidebarAds";
import { 
  mobileAds, 
  mainContentAds, 
  betweenNewsAds, 
  leftSidebarAds, 
  rightSidebarAds 
} from "../data/ads-data";
import { 
  LatestCarReviews, 
  FeaturesFromJackob, 
  VideoSlider, 
  ClassicCars, 
  DashCams, 
  Accessories 
} from "../components/sections";
import { useFirstVisit } from "../hooks/use-first-visit";
import "./styles/homepage.css";
import "./styles/ads.css";
import CarGroupSignup from "../components/CarGroupSignup";
import { setCookie } from "../utils/cookieUtils";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider, useQueries } from "@tanstack/react-query";
import { getCachedData, setCachedData } from "../utils/cacheUtils";
import { motion } from "framer-motion";
import { UserActivityProvider } from "../context/UserActivityContext";
import FirstVisitPopup from "../components/FirstVisitPopup";

// Typs
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
  store: any;
  hostname: string;
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

// Add this interface before the HomeContent component
interface TransformedArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  description: string;
  cover: { url: string } | null;
  categories: Array<{ name: string }>;
  publishedAt: string;
  locale: string;
  slug: string;
  blocks: any[];
}

// API fetch functions
const fetchArticles = async () => {
  // Add debugging for production
  console.log("Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    HAS_TOKEN: !!process.env.NEXT_PUBLIC_STRAPI_TOKEN,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
  });

  try {
    console.log("Fetching articles...");
    const [featuredResponse, newsResponse, storyResponse] = await Promise.all([
      fetch('/api/articles?sort=createdAt:desc&pagination=100'),
      fetch('/api/articles?sort=createdAt:desc&pagination=100'),
      fetch('/api/articles?sort=createdAt:desc&pagination=100')
    ]);

    // Check if responses are ok
    if (!featuredResponse.ok) {
      console.error("Featured response error:", featuredResponse.status, featuredResponse.statusText);
      throw new Error(`Featured API failed: ${featuredResponse.status}`);
    }
    if (!newsResponse.ok) {
      console.error("News response error:", newsResponse.status, newsResponse.statusText);
      throw new Error(`News API failed: ${newsResponse.status}`);
    }
    if (!storyResponse.ok) {
      console.error("Story response error:", storyResponse.status, storyResponse.statusText);
      throw new Error(`Story API failed: ${storyResponse.status}`);
    }

    const [featuredData, newsData, storyData] = await Promise.all([
      featuredResponse.json(),
      newsResponse.json(),
      storyResponse.json()
    ]);

    console.log("API Responses:", {
      featured: featuredData?.data?.length || 0,
      news: newsData?.data?.length || 0,
      story: storyData?.data?.length || 0
    });

    if (!featuredData.data || !newsData.data || !storyData.data) {
      throw new Error('Invalid data format received from API');
    }

    const data = { featuredData, newsData, storyData };
    setCookie('articlesData', data);
    return data;
  } catch (error) {
    console.error("Fetch articles error:", error);
    // Return empty data structure to prevent crashes
    return {
      featuredData: { data: [] },
      newsData: { data: [] },
      storyData: { data: [] }
    };
  }
};

// Comment out other fetch functions for now
/*
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
*/

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
  const locale = useLocale(); // Get locale on client side
  const [activeIndex, setActiveIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('electric');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showads, setShowads] = useState(true);
  const [showcontrols, setShowcontrols] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsIndex2, setNewsIndex2] = useState(Math.floor(Math.random() * 5));
  const [cachedListings, setCachedListings] = useState<Listing[]>([]);
  const [isLoadingCache, setIsLoadingCache] = useState(true);
  const [cachedArticles, setCachedArticles] = useState<TransformedArticle[]>([]);
  const [isLoadingArticlesCache, setIsLoadingArticlesCache] = useState(true);
  
  // First visit popup state
  const { isFirstVisit, isLoading: isFirstVisitLoading, markAsVisited } = useFirstVisit();
  const [showPopup, setShowPopup] = useState(false);

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
        queryKey: ['articles'],
        queryFn: fetchArticles
      },
    ]
  });

  // Destructure the results with proper typing
  const [
    { data: articlesData, isLoading: isLoadingArticles, error: articlesError },
  ] = queryResults;

  // Check for any errors
  useEffect(() => {
    const errors = [articlesError];
    const firstError = errors.find(error => error);
    if (firstError) {
      setError(firstError.message);
    }
  }, [articlesError]);

  // Check if any query is still loading
  const isLoading = queryResults.some(result => result.isLoading);

  // Add this useEffect for cache handling
  useEffect(() => {
    const loadCachedData = async () => {
      const CACHE_KEY = 'deals_listings';
      try {
        const cached = await getCachedData<Listing[]>(CACHE_KEY);
        if (cached) {
          setCachedListings(cached);
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      } finally {
        setIsLoadingCache(false);
      }
    };

    loadCachedData();
  }, []);

  // Add this useEffect for articles cache handling
  useEffect(() => {
    const loadCachedArticles = async () => {
      const CACHE_KEY = `articles_data_${locale}`;
      try {
        const cached = await getCachedData<TransformedArticle[]>(CACHE_KEY);
        if (cached) {
          setCachedArticles(cached);
        }
      } catch (error) {
        console.error('Error loading cached articles:', error);
      } finally {
        setIsLoadingArticlesCache(false);
      }
    };

    loadCachedArticles();
  }, [locale]);

  // Show popup on first visit
  useEffect(() => {
    if (!isFirstVisitLoading && isFirstVisit) {
      // Add a small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, isFirstVisitLoading]);

  // Replace the listings useMemo with this updated version
  const listings = useMemo(() => {
    if (!isLoadingCache && cachedListings.length > 0) {
      return cachedListings;
    }
    
    // Since we're only loading articles now, return empty array for listings
    return [];
  }, [cachedListings, isLoadingCache]);

  // Update the transformedArticles useMemo
  const transformedArticles = useMemo(() => {
    if (!isLoadingArticlesCache && cachedArticles.length > 0) {
      return cachedArticles;
    }

    if (!articlesData) return [];
    
    const data = articlesData as { featuredData: { data: Article[] } };
    if (!data?.featuredData?.data) return [];
    
    const transformed: TransformedArticle[] = data.featuredData.data.map((article: Article) => ({
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

    // Cache the transformed articles for 2 hours
    setCachedData('articles_data', transformed, 2 * 60 * 60); // 2 hours in seconds
    
    return transformed;
  }, [articlesData, t, cachedArticles, isLoadingArticlesCache]);

  // Transform parts data with proper type checking - return empty for now
  const transformedParts = useMemo(() => {
    // Since we're only loading articles now, return empty array for parts
    return [];
  }, []);

  // Transform services data with proper type checking - return empty for now
  const transformedServices = useMemo(() => {
    // Since we're only loading articles now, return empty array for services
    return [];
  }, []);

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

  const visibleArticles = useMemo(() => {
    return transformedArticles
      .filter((article: TransformedArticle) => article.category.includes('featured'))
      .slice(currentSlide * itemsPerPage, (currentSlide + 1) * itemsPerPage);
  }, [transformedArticles, currentSlide, itemsPerPage]);

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
  /*
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
  */

  // Auto-advance stories
  useEffect(() => {
    if (transformedArticles?.length > 0) {
      const timer = setInterval(() => {
        setNewsIndex((prev) => (prev + 1) % transformedArticles.length);
      }, 5000); // Change story every 5 seconds

      return () => clearInterval(timer);
    }
  }, [transformedArticles?.length]);

  // Auto-advance stories
  useEffect(() => {
    if (transformedArticles?.length > 0) {
      const timer = setInterval(() => {
        setNewsIndex2((prev) => (prev + 1) % transformedArticles.length);
      }, 5000); // Change story every 5 seconds

      return () => clearInterval(timer);
    }
  }, [transformedArticles?.length]);

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
            className="mt-4 px-4 py-2 bg-white text-white rounded-lg hover:bg-white"
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
  





  // Sort all articles by latest first (newest publishedAt), then filter by category
  const featuredNews = (transformedArticles || [])
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(item => item.categories?.some(tag => tag.name === "featured"))
    .slice(0, 6);

  const latestNews = (transformedArticles || [])
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(item => item.categories?.some(tag => tag.name === "latest news"))
    .slice(0, 6);
    
  const localNews = (transformedArticles || [])
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(item => item.categories?.some(tag => tag.name === "local news"))
    .slice(0, 4);
    
  const worldNews = (transformedArticles || [])
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(item => item.categories?.some(tag => tag.name === "world news"))
    .slice(0, 4);
    
  const featuredStories = (transformedArticles || [])
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(item => item.categories?.some(tag => tag.name === "featured stories"))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 mt-[8%] lg:mt-[4%]">
      {/* Main Layout Container */}
      <div className="flex w-full">
        {/* Left Ads Sidebar - Hide on mobile */}
        <SidebarAds 
          ads={leftSidebarAds} 
          title="اعلانات ممولة" 
          position="left" 
        />

        {/* Main Content */}
        <div className="flex-1 lg:max-w-[56%] lg:mx-auto cd-container w-full">
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="cd-section"
          >
          

          <div className="w-full h-[100px] flex items-center justify-center text-black text-center">
            <h1 className="text-2xl font-bold border-4 bg-white border-red-500 rounded-xl px-6 py-2 inline-block">ضمن السرعه القانونية</h1>
          </div>
          
                     {/* Mobile Banner Ad - Compact Article Card */}
           <ContentAds 
             layout="mobile-banner" 
             ads={mobileAds} 
             className="mt-[12%]" 
           />
          {/* Featured Stories Section */}
          <div className="flex flex-col w-full px-4 mb-8 lg:hidden">
          <h2 className="text-l text-blue-800 font-bold mb-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-2">{t('featured_stories')}</h2>
              <div className="space-y-4">
                {transformedArticles.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl overflow-hidden cursor-pointer group relative"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="relative h-[180px] w-full">
                      {item.cover?.url && (
                        <Img
                          src={`http://64.227.112.249${item.cover.url}`}
                          alt={item.title}
                          external={true}
                          width={1290}
                          height={1290}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-[10px] text-white mb-1 font-bold uppercase tracking-wider bg-white/5 rounded-full px-2 py-0.5 inline-block">{t('expert_review')}</div>
                          <h3 className="font-bold text-base text-white mb-1 line-clamp-2">{item.title}</h3>
                          <div className="text-xs text-gray-300">
                            By {item.author || t('unknown_author')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            
          {/* 1. Hero Banner Section */}
          <div className="relative z-10 flex flex-col lg:flex-row gap-1.6 px-1.6 lg:px-3.2 items-stretch min-h-0 justify-center items-center mb-6.4 w-full md:w-[64%] mx-auto">
            <div className="w-full lg:w-full flex flex-col gap-1.6">
             
              {/* Hero Section
              <div className="w-full bg-gradient-to-br h-full from-blue-100 via-blue-300 from-white rounded-lg shadow-lg p-1 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <HeroSection listings={listings} />
                </div>
              </div> */}
            </div>

            <div className="w-full lg:w-[24%] flex flex-col gap-1.6">
              {/* <div className="w-full bg-gradient-to-br from-blue-100 via-blue-300 from-white rounded-lg shadow-lg p-1 h-[320px] min-h-[320px] max-h-[320px] hidden lg:block">
                 {transformedArticles
                    .filter(article => article.category.includes('featured'))
                    .slice(0, 5)
                    .map((article) => (
                      <div key={article.id} className="flex gap-1 items-center bg-white/10 backdrop-blur-sm rounded-md p-0.5 hover:bg-white/20 transition-all">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden">
                          <Img
                            src={`http://64.227.112.249${article.imageUrl}`}
                            alt={article.title}
                            width={1290}
                            external={true}
                            height={1290}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-xs line-clamp-1">{article.title}</h4>
                          <p className="text-blue-200 text-[10px] line-clamp-1">{article.excerpt}</p>
                          <div className="flex items-center gap-1 text-[10px] text-white/60">
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
              </div> */}

              {/* <div className="w-full bg-gradient-to-br from-blue-100 via-blue-300 from-white rounded-lg shadow-lg p-1 h-[320px] min-h-[320px] max-h-[320px] flex flex-col">
                <h3 className="text-xs font-bold text-white mb-1 line-clamp-1">{t('special_offers')}</h3>
                <div className="space-y-1 flex-1 overflow-y-auto">
                  <div className="flex gap-1 items-center bg-white/10 backdrop-blur-sm rounded-md p-0.5 hover:bg-white/20 transition-all">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                      <Img
                        src="/images/ad1.jpg"
                        alt="Car Insurance Ad"
                        width={1290}
                        external={true}
                        height={1290}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-xs line-clamp-1">{t('car_insurance_offer')}</h4>
                      <p className="text-blue-200 text-[10px] line-clamp-1">{t('limited_time_offer')}</p>
                      <button className="mt-0.5 px-2 py-0.5 bg-white text-blue-600 rounded-full text-[10px] hover:bg-blue-50 transition-colors">
                        {t('learn_more')}
                      </button>
                    </div>
                  </div>


                  <div className="flex gap-1 items-center bg-white/10 backdrop-blur-sm rounded-md p-0.5 hover:bg-white/20 transition-all">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                      <Img
                        src="/images/ad3.jpg"
                        alt="Car Service Ad"
                        width={1290}
                        external={true}
                        height={1290}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-xs line-clamp-1">{t('premium_service')}</h4>
                      <p className="text-blue-200 text-[10px] line-clamp-1">{t('free_inspection')}</p>
                      <button className="mt-0.5 px-2 py-0.5 bg-white text-blue-600 rounded-full text-[10px] hover:bg-blue-50 transition-colors">
                        {t('book_now')}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1 items-center bg-white/10 backdrop-blur-sm rounded-md p-0.5 hover:bg-white/20 transition-all">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                      <Img
                        src="/images/ad4.jpg"
                        alt="Car Parts Ad"
                        width={1290}
                        external={true}
                        height={1290}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-xs line-clamp-1">{t('genuine_parts')}</h4>
                      <p className="text-blue-200 text-[10px] line-clamp-1">{t('quality_guaranteed')}</p>
                      <button className="mt-0.5 px-2 py-0.5 bg-white text-blue-600 rounded-full text-[10px] hover:bg-blue-50 transition-colors">
                        {t('shop_now')}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1 items-center bg-white/10 backdrop-blur-sm rounded-md p-0.5 hover:bg-white/20 transition-all">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                      <Img
                        src="/images/ad5.jpg"
                        alt="Car Wash Ad"
                        width={1290}
                        external={true}
                        height={1290}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-xs line-clamp-1">{t('premium_wash')}</h4>
                      <p className="text-blue-200 text-[10px] line-clamp-1">{t('special_offer')}</p>
                      <button className="mt-0.5 px-2 py-0.5 bg-white text-blue-600 rounded-full text-[10px] hover:bg-blue-50 transition-colors">
                        {t('book_service')}
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          

          {/* Main Content Container */}
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl overflow-x-hidden">
            
            {/* Magazine-style Grid Layout */}
            <div className="grid grid-cols-1 gap-6 mb-8">

              {/* Featured Article - Spans full width */}
              <div className="col-span-12 mb-8 hidden ">
                <motion.section 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-gradient-to-b from-white to-gray-50 py-2 rounded-2xl overflow-hidden"
                >
                  <div className="px-6">
                    <h2 className="text-l text-blue-800 font-bold bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-2">{t('featured_story')}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="relative h-[400px] rounded-xl overflow-hidden">
                        <Img
                          src={visibleArticles[0]?.imageUrl ? `http://64.227.112.249${visibleArticles[0].imageUrl}` : '/default-article.jpg'}
                          alt={visibleArticles[0]?.title || 'Featured Article'}
                          className="object-cover w-full h-full"
                          width={1290}
                          height={1290}
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
              </div>

              {/* TikTok/Instagram Style Videos Section */}
              <div className="col-span-12 mb-8">
                <motion.section 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 rounded-3xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold  ">
                            🎬 Car Reviews
                          </h2>
                          <p className="text-gray-600 text-sm">Latest automotive content</p>
                        </div>
                      </div>
                      <Link 
                        href="/videos" 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  {/* Horizontal Scrolling Video Cards */}
                  <div className="px-6">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <style jsx>{`
                        .scrollbar-hide::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      {articlesData?.featuredData?.data.length}
                      {transformedArticles
                        .filter(article => article.categories?.some(cat => 
                          cat.name.toLowerCase().includes('video') || 
                          cat.name.toLowerCase().includes('review') || 
                          cat.name.toLowerCase().includes('watch') ||
                          cat.name.toLowerCase().includes('review video')
                        ))
                        .slice(0, 4)
                        .map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 w-64 group cursor-pointer"
                          >
                            <Link href={`/news/${video.slug}`}>
                              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                                {/* Vertical Video Thumbnail - TikTok Style */}
                                <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                                  <Img
                                    src={`http://64.227.112.249${video.imageUrl}`}
                                    alt={video.title}
                                    className="object-cover w-full h-full"
                                    width={256}
                                    height={320}
                                    external={true}
                                  />
                                  
                                  {/* Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                  
                                  {/* Play Button - Instagram Style */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Duration Badge - TikTok Style */}
                                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20">
                                    {Math.floor(Math.random() * 10) + 2}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                                  </div>

                                  {/* Creator Profile - Instagram Style */}
                                  <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {video.author.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                      @{video.author.toLowerCase().replace(/\s+/g, '')}
                                    </span>
                                  </div>

                                  {/* Bottom Content Overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="space-y-2">
                                      {/* Category Tag */}
                                      <div className="flex flex-wrap gap-1">
                                        <span className="text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                                          #CarReview
                                        </span>
                                        <span className="text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full">
                                          #Automotive
                                        </span>
                                      </div>
                                      
                                      {/* Title */}
                                      <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">
                                        {video.title}
                                      </h3>
                                    </div>
                                  </div>
                                </div>

                                {/* Social Media Style Engagement Bar */}
                                <div className="bg-white p-3">
                                  <div className="flex items-center justify-between">
                                    {/* Left Side - Engagement */}
                                    <div className="flex items-center gap-4">
                                      {/* Like Button */}
                                      <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        <span className="text-xs text-gray-600 font-medium">{Math.floor(Math.random() * 2000) + 500}</span>
                                      </div>
                                      
                                      {/* Views */}
                                      <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                        <span className="text-xs text-gray-600 font-medium">{Math.floor(Math.random() * 50000) + 10000}</span>
                                      </div>

                                      {/* Comments */}
                                      <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                        </svg>
                                        <span className="text-xs text-gray-600 font-medium">{Math.floor(Math.random() * 100) + 10}</span>
                                      </div>
                                    </div>

                                    {/* Right Side - Share */}
                                    <div className="flex items-center gap-2">
                                      <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                        </svg>
                                      </button>
                                      <span className="text-xs text-gray-500">{video.date}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                    <CarGroupSignup/>
                  {/* Show message if no videos available */}
                  {transformedArticles.filter(article => 
                    article.categories?.some(cat => 
                      cat.name.toLowerCase().includes('video') || 
                      cat.name.toLowerCase().includes('watch') ||
                      cat.name.toLowerCase().includes('review video')
                    )
                  ).length === 0 && (
                    <div className="px-6">
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Videos Available</h3>
                        <p className="text-gray-500">Check back soon for the latest car review videos and automotive content.</p>
                      </div>
                    </div>
                  )}
                </motion.section>
              </div>

              {/* Latest News Grid - 3 columns */}
              <div className="col-span-12">
                <motion.section 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-white py-2 rounded-2xl hidden lg:block"
                >
                  <div className="px-6 mb-8 ">
                    <div className="flex items-center justify-between">
                    <h2 className="text-l text-blue-800 font-bold mb-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-2">{t('latest_news')}</h2>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={prevSlide}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextSlide}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 ">
                    {transformedArticles.slice(0, 3).map((article: TransformedArticle, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                         <Link 
                              href={`/news/${article.slug}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                        <div className="relative h-48">
                          <Img
                            src={`http://64.227.112.249${article.imageUrl}`}
                            alt={article.title}
                            className="object-cover w-full h-full"
                            width={1290}
                            height={1290}
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
                           
                              Read More →
                          </div>
                        </div>
                        </Link>

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

            {/* Celebrity Endorsement Section */}
            {/* <CelebrityEndorsement /> */}

            {/* In-Content Ad as Article Card */}
            <ContentAds 
              layout="grid-3" 
              ads={mainContentAds} 
            />

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
                    <span className="bg-white text-white text-sm px-4 py-1.5 rounded-full">إعلان</span>
                    <span className="text-blue-600 font-semibold">عرض محدود</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">عرض الصيف للصيانة</h4>
                  <p className="text-gray-600 mb-6 text-lg">باقة صيانة كاملة تشمل تغيير الزيت، تبديل الإطارات، وفحص شامل للسيارة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-600">٧٤٩ شيكل</span>
                    <button className="px-6 py-3 bg-white text-white rounded-lg hover:bg-white transition-colors">
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
            {/* 
            <div className="grid grid-cols-12 gap-8 mb-12">
              <div className="col-span-12">
                <CategoryButtons onCategorySelect={handleCategorySelect} />
              </div>
              <div className="col-span-12">
                <RecentlyAddedSection 
                  listings={listings.filter((listing) => listing.category.includes(selectedCategory))} 
                  title={t(selectedCategory)}
                  viewAllLink="/cars"
                />
              </div>
            </div>
            */}

            {/* EV Cars Section with improved layout */}
            {/* 
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
                  <button className="px-6 py-3 bg-white text-white rounded-lg hover:bg-white transition-colors">
                    {t('view_all')}
                  </button>
                  <button className="px-6 py-3 border border-gray-320 rounded-lg hover:bg-gray-50 transition-colors">
                    {t('compare')}
                  </button>
                </div>
              </div>
              <div className="w-full overflow-x-hidden items-center justify-center">
                {window.innerWidth <= 768 ? (
                  <Slider
                    autoPlay
                    autoPlayInterval={3200}
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
                    autoPlayInterval={3200}
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
            */}

            {/* Parts and Services Sections with improved spacing */}
            {/* 
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">{t('parts_and_accessories')}</h3>
                  <p className="text-gray-320 mt-1 colro-w  ">{t('premium_parts')}</p>
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
                  <div key={part.id} className="transform hover:scale-105 transition-transform duration-320">
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
                    <button className="px-4 py-2 bg-white text-white rounded-lg hover:bg-white transition-colors">
                      {t('book_service')}
                    </button>
                    <button className="px-4 py-2 border border-gray-320 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <div key={service.id} className="transform hover:scale-105 transition-transform duration-320">
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
            */}
          {/* Latest News and Featured Stories - Different layouts for mobile and desktop */}
          <div className="flex flex-col gap-8">
            {/* Local News Section */}
            <div className="flex flex-col">
              <h2 className="text-l text-blue-800 font-bold mb-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-2">{t('local_news')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localNews.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="md:rounded-xl md:shadow-sm overflow-hidden cursor-pointer bg-white rounded-xl"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="md:flex bg-white rounded-xl">
                      <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative">
                        {item.cover?.url && (
                          <Img
                            src={`http://64.227.112.249${item.cover.url}`}
                            alt={item.title}
                            external={true}
                            width={1290}
                            height={1290}
                            className="object-cover w-full h-full md:h-48"
                          />
                        )}
                      </div>
                      <div className="mt-3 md:mt-0 md:w-2/3 md:p-4">
                        <div className="text-sm text-gray-600 mb-1">{t('expert_review')}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 px-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 px-2">{item.description}</p>
                        <div className="text-sm text-gray-600 px-2">
                          <span>{t('by')} {item.author || t('unknown_author')}</span>
                          <span className="mx-2">•</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* In-Content Ad Between News Sections */}
            <ContentAds 
              layout="grid-2" 
              ads={betweenNewsAds} 
            />

            {/* World News Section */}
            <div className="flex flex-col">
              <h2 className="text-l text-white font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-800 rounded-xl p-2">{t('world_news')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {worldNews.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="md:rounded-xl md:shadow-sm overflow-hidden cursor-pointer bg-white rounded-xl"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="md:flex bg-white rounded-xl">
                      <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative">
                        {item.cover?.url && (
                          <Img
                            src={`http://64.227.112.249${item.cover.url}`}
                            alt={item.title}
                            external={true}
                            width={1290}
                            height={1290}
                            className="object-cover w-full h-full md:h-48"
                          />
                        )}
                      </div>
                      <div className="mt-3 md:mt-0 md:w-2/3 md:p-4">
                        <div className="text-sm text-gray-600 mb-1">{t('expert_review')}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 px-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 px-2">{item.description}</p>
                        <div className="text-sm text-gray-600 px-2">
                          <span>{t('by')} {item.author || t('unknown_author')}</span>
                          <span className="mx-2">•</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <CarGroupSignup/>


          {/* Latest Car Reviews Section */}
          <LatestCarReviews />

          {/* Features from Jackob Section */}
          <FeaturesFromJackob />

          {/* Video Slider Section */}
          <VideoSlider />

          {/* Classic Cars Section */}
          <ClassicCars />

          {/* Dash Cams Section */}
          <DashCams />

          {/* Car Accessories Section */}
          <Accessories />


          
            {/* Search Car by Plate Number Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-gradient-to-b from-white to-gray-50 py-6 mb-3 rounded-2xl overflow-hidden mt-12"
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
                <h2 className="text-l text-blue-800 font-bold mb-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-2">
                {t('plate_search_description')}
                </h2>
               
                
                <div className="w-full max-w-xl">
                  <FindCarByPlate />
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('instant_results')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>{t('secure_search')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01M12 15h.01M12 18h.01M12 8h.01M12 5h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    <span>{t('comprehensive_data')}</span>
                  </div>
                </div>
              </motion.div>
            </motion.section>

          </div>

          {/* Bottom Banner Ad */}
          {/* <ResponsiveAd 
            position="bottom-banner"
            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER}
            enableGoogleAds={process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ADS === 'true'}
            enableBannerAds={process.env.NEXT_PUBLIC_ENABLE_BANNER_ADS === 'true'}
          /> */}
          
        </motion.main>
        </div>

        {/* Right Ads Section - Hide on mobile */}
        <SidebarAds 
          ads={rightSidebarAds} 
          title="اعلانات ممولة" 
          position="right" 
        />
      </div>
      
      {/* First Visit Popup */}
      <FirstVisitPopup 
        isVisible={showPopup}
        onClose={() => {
          setShowPopup(false);
          markAsVisited();
        }} 
      />
    </div>
  );
}


export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserActivityProvider>
        <HomeContent />
      </UserActivityProvider>
    </QueryClientProvider>
  );
}