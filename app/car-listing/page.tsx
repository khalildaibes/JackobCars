"use client"; // This marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Check, Heart, MessageSquare, Plus, Car,Calendar, Gauge, Fuel, Sparkles, Scale, Settings, ChevronDown, X, TrendingUp, Clock, Eye, Star, Target, Zap } from "lucide-react";
import { Badge } from "../../components/ui/badge";

import { Img } from '../../components/Img';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useComparison } from '../../context/ComparisonContext';
import { useUserActivity } from '../../context/UserActivityContext';
import Link from 'next/link';

import CarCard from '../../components/CarCard';

// First, add this helper function at the top of your file
const extractPrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    return parseInt(price.replace(/[$,]/g, '')) || 0;
  }
  return 0;
};

// Define the car listing type
interface CarListing {
  id: number;
  slug: string;
  mainImage: string;
  alt: string;
  title: string;
  store: any;
  hostname: string;
  miles: string;
  name: string;
  fuel: string;
  condition: string;
  transmission: string;
  details: string;
  price: string;
  mileage: string;
  year: number | string;
  fuelType: string;
  make: string;
  bodyType: string;
  description: string;
  features: string[];
  category: string[];
  pros: string[];
  cons: string[];
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  plate_number: string;
  color: string;
  engine_type: string;
  known_problems: string;
  trade_in: string;
  asking_price: string;
  manufacturer_name: string;
  commercial_nickname: string;
  year_of_production: string;
  trim_level: string;
  
  // New advanced filter fields
  engine_capacity: string;
  engine_power: string;
  drive_type: string;
  region: string;
  car_type: string;
  mileage_value: string;
  trade_in_value: string;
  
  // Recommendation algorithm score
  score?: number;
}

const CarListings: React.FC = () => {
  const { selectedCars } = useComparison();
  const t = useTranslations('CarListing');
  const router = useRouter();
  
  // Initialize state for translation arrays
  const [MAKES, setMAKES] = useState<Array<{ value: string; label: string }>>([]);
  const [BODY_TYPES, setBODY_TYPES] = useState<Array<{ value: string; label: string }>>([]);
  const [FUEL_TYPES, setFUEL_TYPES] = useState<Array<{ value: string; label: string }>>([]);
  const [YEARS, setYEARS] = useState<number[]>([]);
  
  // Add new state for advanced filters
  const [ENGINE_CAPACITIES, setENGINE_CAPACITIES] = useState<Array<{ value: string; label: string }>>([]);
  const [ENGINE_POWERS, setENGINE_POWERS] = useState<Array<{ value: string; label: string }>>([]);
  const [DRIVE_TYPES, setDRIVE_TYPES] = useState<Array<{ value: string; label: string }>>([]);
  const [REGIONS, setREGIONS] = useState<Array<{ value: string; label: string }>>([]);
  const [CAR_TYPES, setCAR_TYPES] = useState<Array<{ value: string; label: string }>>([]);
  const [MILEAGE_RANGES, setMILEAGE_RANGES] = useState<Array<{ value: string; label: string }>>([]);
  const [TRADE_IN_OPTIONS, setTRADE_IN_OPTIONS] = useState<Array<{ value: string; label: string }>>([]);
  
  // Add new state for min and max price
  const [minMaxPrices, setMinMaxPrices] = useState<{ min: number; max: number }>({ min: 5000, max: 100000 });
  
  // Replace your existing price range state with:
  const [priceRange, setPriceRange] = useState<number[]>([5000, 100000]);
  const [yearFilter, setYearFilter] = useState<string>("Any");
  const [makeFilter, setMakeFilter] = useState<string>("Any");
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>("Any");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("Any");
  
  // Add new filter states
  const [engineCapacityFilter, setEngineCapacityFilter] = useState<string>("Any");
  const [enginePowerFilter, setEnginePowerFilter] = useState<string>("Any");
  const [driveTypeFilter, setDriveTypeFilter] = useState<string>("Any");
  const [regionFilter, setRegionFilter] = useState<string>("Any");
  const [carTypeFilter, setCarTypeFilter] = useState<string>("Any");
  const [mileageFilter, setMileageFilter] = useState<string>("Any");
  const [tradeInFilter, setTradeInFilter] = useState<string>("Any");
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewType, setViewType] = useState<string>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [listings, setListings] = useState<CarListing[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recommendation algorithm state
  const [recommendedCars, setRecommendedCars] = useState<CarListing[]>([]);
  const [userPreferences, setUserPreferences] = useState<{
    preferredMakes: string[];
    preferredBodyTypes: string[];
    preferredFuelTypes: string[];
    preferredPriceRange: { min: number; max: number };
    preferredYears: number[];
    preferredFeatures: string[];
  }>({
    preferredMakes: [],
    preferredBodyTypes: [],
    preferredFuelTypes: [],
    preferredPriceRange: { min: 0, max: 0 },
    preferredYears: [],
    preferredFeatures: []
  });

  // Get user activity context
  const { logActivity, recentActivities } = useUserActivity();

  // Function to clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setYearFilter('Any');
    setMakeFilter('Any');
    setBodyTypeFilter('Any');
    setFuelTypeFilter('Any');
    setEngineCapacityFilter('Any');
    setEnginePowerFilter('Any');
    setDriveTypeFilter('Any');
    setRegionFilter('Any');
    setCarTypeFilter('Any');
    setMileageFilter('Any');
    setTradeInFilter('Any');
    setPriceRange([minMaxPrices.min, minMaxPrices.max]);
  };

  // Function to check if any filters are active
  const hasActiveFilters = () => {
    return searchTerm !== '' || 
           yearFilter !== 'Any' || 
           makeFilter !== 'Any' || 
           bodyTypeFilter !== 'Any' || 
           fuelTypeFilter !== 'Any' ||
           engineCapacityFilter !== 'Any' ||
           enginePowerFilter !== 'Any' ||
           driveTypeFilter !== 'Any' ||
           regionFilter !== 'Any' ||
           carTypeFilter !== 'Any' ||
           mileageFilter !== 'Any' ||
           tradeInFilter !== 'Any' ||
           priceRange[0] !== minMaxPrices.min || 
           priceRange[1] !== minMaxPrices.max;
  };
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    }, []);
  
    const add_to_favorites = (id: number) => {
      let updatedFavorites;
      if (favorites.includes(id)) {
        updatedFavorites = favorites.filter((favId) => favId !== id);
      } else {
        updatedFavorites = [...favorites, id];
      }
  
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      // Log user activity for recommendation algorithm
      const car = listings.find(c => c.id === id);
      if (car) {
        logActivity('car_favorite_toggle', {
          id: car.id,
          action: favorites.includes(id) ? 'removed' : 'added',
          make: car.make,
          bodyType: car.bodyType,
          fuelType: car.fuelType,
          year: car.year,
          price: car.price
        });
      }
    };

    const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Call the Next.js API route instead of Strapi directly
          const response = await fetch(`/api/deals?store_hostname=64.227.112.249`);
          if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
      
          const data = await response.json();
          console.log(data);
          if (!data || !data.data) throw new Error("Invalid API response structure");
      

          
          // Transform the fetched data into the required listings format
          const formattedListings = data.data.map((product: any) => {
            
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

            // Get body type from the new structure - use commercialName
            const rawBodyType = product.details?.car?.commercialName || product.details?.car?.body_type || "Unknown";
            let normalizedBodyType = rawBodyType;
            
            // Normalize body type values to English
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

            // Get transmission from the new structure
            const transmission = product.details?.car?.transmission || "Unknown";
            
            // Get condition from the new structure
            const condition = product.details?.car?.condition || "Used";
            
            // Get miles from the new structure
            const miles = product.details?.car?.miles || "N/A";
            
            // Get year from the new structure
            const year = product.details?.car?.year || "Unknown";
            
            // Get description from the new structure
            const description = product.details?.car?.description || "";
            
            // Get features from the new structure
            const features = product.details?.car?.features || [];
            
            // Get pros and cons from the new structure
            const pros = product.details?.car?.pros || [];
            const cons = product.details?.car?.cons || [];

            // Get new advanced filter fields
            const engineCapacity = product.details?.car?.engine_capacity || product.details?.car?.engineCapacity || "";
            const enginePower = product.details?.car?.engine_power || product.details?.car?.enginePower || "";
            const driveType = product.details?.car?.drive_type || product.details?.car?.driveType || "";
            const region = product.details?.car?.region || "";
            const carType = product.details?.car?.car_type || product.details?.car?.carType || "";
            const mileage = product.details?.car?.miles || "";
            const tradeIn = product.details?.car?.trade_in || product.details?.car?.tradeIn || "";

            return {
              id: product.id,
              slug: product.slug,
              mainImage: (() => {
                if (product.image && Array.isArray(product.image) && product.image.length > 0) {
                  return `http://${product.store?.hostname || '64.227.112.249'}${product.image[0]?.url || ''}`;
                } else if (product.image && product.image.url) {
                  return `http://${product.store?.hostname || '64.227.112.249'}${product.image.url}`;
                } else if (product.image && typeof product.image === 'string') {
                  return `http://${product.store?.hostname || '64.227.112.249'}${product.image}`;
                }
                return "/default-car.png";
              })(),
              alt: product.name || "Car Image",
              title: product.name,
              store: product.store || {},
              hostname: product.store?.hostname || '64.227.112.249',
              miles: miles,
              name: product.name,
              fuel: normalizedFuelType,
              condition: condition,
              transmission: transmission,
              details: transmission,
              price: `$${product.price?.toLocaleString() || '0'}`,
              mileage: miles,
              year: year,
              fuelType: normalizedFuelType,
              make: normalizedMake,
              bodyType: normalizedBodyType,
              description: description,
              features: features.map((feature: any) => feature.value || feature) || [],
              category: product.categories ? product.categories.split(",").map((c: string) => c.toLowerCase().trim()) : [],
              pros: pros,
              cons: cons,
              // Additional fields from new structure
              owner_name: product.details?.car?.owner_name || "",
              owner_phone: product.details?.car?.owner_phone || "",
              owner_email: product.details?.car?.owner_email || "",
              plate_number: product.details?.car?.plate_number || "",
              color: product.details?.car?.color || "",
              engine_type: product.details?.car?.engine_type || "",
              known_problems: product.details?.car?.known_problems || "",
              trade_in: product.details?.car?.trade_in || "",
              asking_price: product.details?.car?.asking_price || "",
              manufacturer_name: product.details?.car?.manufacturer_name || "",
              commercial_nickname: product.details?.car?.commercial_nickname || "",
              year_of_production: product.details?.car?.year_of_production || "",
              trim_level: product.details?.car?.trim_level || "",
              
              // New advanced filter fields
              engine_capacity: engineCapacity,
              engine_power: enginePower,
              drive_type: driveType,
              region: region,
              car_type: carType,
              mileage_value: mileage,
              trade_in_value: tradeIn,
            };
          });
          

          setListings(formattedListings);

          // Extract unique values for filters from the actual data
          const uniqueMakes = [...new Set(formattedListings.map(car => car.make).filter((make): make is string => typeof make === 'string' && make !== "Unknown" && make.trim() !== ""))];
          const uniqueBodyTypes = [...new Set(formattedListings.map(car => car.bodyType).filter((type): type is string => typeof type === 'string' && type !== "Unknown" && type.trim() !== ""))];
          const uniqueFuelTypes = [...new Set(formattedListings.map(car => car.fuelType).filter((type): type is string => typeof type === 'string' && type !== "Unknown" && type.trim() !== ""))];
          const validYears = formattedListings.map(car => car.year).filter((year): year is number => typeof year === 'number' && year > 1900);
          const uniqueYears = [...new Set(validYears)].sort((a: number, b: number) => b - a);

          // Extract unique values for advanced filters
          const uniqueEngineCapacities = [...new Set(formattedListings.map(car => car.engine_capacity).filter((cap): cap is string => typeof cap === 'string' && cap.trim() !== ""))];
          const uniqueEnginePowers = [...new Set(formattedListings.map(car => car.engine_power).filter((power): power is string => typeof power === 'string' && power.trim() !== ""))];
          const uniqueDriveTypes = [...new Set(formattedListings.map(car => car.drive_type).filter((type): type is string => typeof type === 'string' && type.trim() !== ""))];
          const uniqueRegions = [...new Set(formattedListings.map(car => car.region).filter((region): region is string => typeof region === 'string' && region.trim() !== ""))];
          const uniqueCarTypes = [...new Set(formattedListings.map(car => car.car_type).filter((type): type is string => typeof type === 'string' && type.trim() !== ""))];
          const uniqueMileages = [...new Set(formattedListings.map(car => car.mileage_value).filter((mileage): mileage is string => typeof mileage === 'string' && mileage.trim() !== ""))];
          const uniqueTradeIns = [...new Set(formattedListings.map(car => car.trade_in_value).filter((trade): trade is string => typeof trade === 'string' && trade.trim() !== ""))];

          // Set filter options with "Any" option first
          setMAKES([
            { value: "Any", label: 'Any Manufacturer' },
            ...uniqueMakes.map(make => ({ value: String(make), label: String(make) }))
          ]);

          setBODY_TYPES([
            { value: "Any", label: String(t('body_types.any') || 'Any Body Type') },
            ...uniqueBodyTypes.map(type => ({ value: String(type), label: String(type) }))
          ]);

          setFUEL_TYPES([
            { value: "Any", label: String(t('fuel_types.any') || 'Any Fuel Type') },
            ...uniqueFuelTypes.map(type => ({ value: String(type), label: String(type) }))
          ]);

          setYEARS(uniqueYears as unknown as number[]);

          // Set advanced filter options
          setENGINE_CAPACITIES([
            { value: "Any", label: 'Any Engine Capacity' },
            ...uniqueEngineCapacities.map(cap => ({ value: String(cap), label: String(cap) }))
          ]);

          setENGINE_POWERS([
            { value: "Any", label: 'Any Engine Power' },
            ...uniqueEnginePowers.map(power => ({ value: String(power), label: String(power) }))
          ]);

          setDRIVE_TYPES([
            { value: "Any", label: 'Any Drive Type' },
            ...uniqueDriveTypes.map(type => ({ value: String(type), label: String(type) }))
          ]);

          setREGIONS([
            { value: "Any", label: 'Any Region' },
            ...uniqueRegions.map(region => ({ value: String(region), label: String(region) }))
          ]);

          setCAR_TYPES([
            { value: "Any", label: 'Any Car Type' },
            ...uniqueCarTypes.map(type => ({ value: String(type), label: String(type) }))
          ]);

          setMILEAGE_RANGES([
            { value: "Any", label: 'Any Mileage' },
            ...uniqueMileages.map(mileage => ({ value: String(mileage), label: String(mileage) }))
          ]);

          setTRADE_IN_OPTIONS([
            { value: "Any", label: 'Any Trade-in Option' },
            ...uniqueTradeIns.map(trade => ({ value: String(trade), label: String(trade) }))
          ]);

          // Calculate min and max prices from the listings
          const prices = formattedListings.map(car => extractPrice(car.price || '0'));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          setMinMaxPrices({ min: minPrice, max: maxPrice });
          setPriceRange([minPrice, maxPrice]);
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching products:", error);
          setError(error instanceof Error ? error.message : 'Failed to fetch products');
          setListings([]);
          setLoading(false);
        }
      };
    
      // Fetch data on component mount
      useEffect(() => {
        fetchProducts();
      }, []);

      // Update recommendations when listings change
      useEffect(() => {
        if (listings.length > 0) {
          updateRecommendations();
        }
      }, [listings, recentActivities, favorites]);

      // Log user activity when filters change
      useEffect(() => {
        if (listings.length > 0) {
          const hasFilters = hasActiveFilters();
          if (hasFilters) {
            logActivity('search_performed', {
              searchTerm,
              yearFilter,
              makeFilter,
              bodyTypeFilter,
              fuelTypeFilter,
              priceRange,
              engineCapacityFilter,
              enginePowerFilter,
              driveTypeFilter,
              regionFilter,
              carTypeFilter,
              mileageFilter,
              tradeInFilter
            });
          }
        }
      }, [searchTerm, yearFilter, makeFilter, bodyTypeFilter, fuelTypeFilter, priceRange, 
          engineCapacityFilter, enginePowerFilter, driveTypeFilter, regionFilter, 
          carTypeFilter, mileageFilter, tradeInFilter, listings]);

  const filteredCars = listings.filter(car => {
    try {
      // Filter by search term
      if (searchTerm && !car.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !car.make?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by price range - convert price string to number for comparison
      const carPrice = extractPrice(car.price || '0');
      if (carPrice < priceRange[0] || carPrice > priceRange[1]) {
        return false;
      }
      
      // Filter by year
      if (yearFilter !== "Any" && car.year !== parseInt(yearFilter)) {
        return false;
      }
      
      // Filter by make
      if (makeFilter !== "Any") {
        const selectedMake = MAKES.find(make => make.value === makeFilter);
        if (!selectedMake || car.make !== selectedMake.value) {
          return false;
        }
      }
      
      // Filter by body type
      if (bodyTypeFilter !== "Any") {
        const selectedBodyType = BODY_TYPES.find(type => type.value === bodyTypeFilter);
        if (!selectedBodyType || car.bodyType !== selectedBodyType.value) {
          return false;
        }
      }
      
      // Filter by fuel type
      if (fuelTypeFilter !== "Any") {
        const selectedFuelType = FUEL_TYPES.find(type => type.value === fuelTypeFilter);
        if (!selectedFuelType || car.fuelType !== selectedFuelType.value) {
          return false;
        }
      }
      
      // Filter by engine capacity
      if (engineCapacityFilter !== "Any") {
        const selectedEngineCapacity = ENGINE_CAPACITIES.find(cap => cap.value === engineCapacityFilter);
        if (!selectedEngineCapacity || car.engine_capacity !== selectedEngineCapacity.value) {
          return false;
        }
      }
      
      // Filter by engine power
      if (enginePowerFilter !== "Any") {
        const selectedEnginePower = ENGINE_POWERS.find(power => power.value === enginePowerFilter);
        if (!selectedEnginePower || car.engine_power !== selectedEnginePower.value) {
          return false;
        }
      }
      
      // Filter by drive type
      if (driveTypeFilter !== "Any") {
        const selectedDriveType = DRIVE_TYPES.find(type => type.value === driveTypeFilter);
        if (!selectedDriveType || car.drive_type !== selectedDriveType.value) {
          return false;
        }
      }
      
      // Filter by region
      if (regionFilter !== "Any") {
        const selectedRegion = REGIONS.find(region => region.value === regionFilter);
        if (!selectedRegion || car.region !== selectedRegion.value) {
          return false;
        }
      }
      
      // Filter by car type
      if (carTypeFilter !== "Any") {
        const selectedCarType = CAR_TYPES.find(type => type.value === carTypeFilter);
        if (!selectedCarType || car.car_type !== selectedCarType.value) {
          return false;
        }
      }
      
      // Filter by mileage
      if (mileageFilter !== "Any") {
        const selectedMileage = MILEAGE_RANGES.find(mileage => mileage.value === mileageFilter);
        if (!selectedMileage || car.mileage_value !== selectedMileage.value) {
          return false;
        }
      }
      
      // Filter by trade-in
      if (tradeInFilter !== "Any") {
        const selectedTradeIn = TRADE_IN_OPTIONS.find(trade => trade.value === tradeInFilter);
        if (!selectedTradeIn || car.trade_in_value !== selectedTradeIn.value) {
          return false;
        }
      }
       
       return true;
    } catch (error) {
      console.error('Error filtering car:', car, error);
      return false;
    }
  });
  
  const handleViewDetails = (slug: string) => {
    // Log user activity for recommendation algorithm
    const car = listings.find(c => c.slug === slug);
    if (car) {
      logActivity('car_details_view', {
        id: car.id,
        make: car.make,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        year: car.year,
        price: car.price,
        features: car.features
      });
    }
    router.push(`/car-details/${slug}`);
  };

  // Recommendation Algorithm Functions
  const analyzeUserPreferences = () => {
    const preferences = {
      preferredMakes: [] as string[],
      preferredBodyTypes: [] as string[],
      preferredFuelTypes: [] as string[],
      preferredPriceRange: { min: 0, max: 0 },
      preferredYears: [] as number[],
      preferredFeatures: [] as string[]
    };

    // Analyze recent activities to understand user preferences
    const carViews = recentActivities.filter(activity => 
      activity.type === 'car_view' || 
      activity.type === 'car_details_view' ||
      activity.type === 'search_performed'
    );

    if (carViews.length > 0) {
      // Extract makes, body types, fuel types, and years from viewed cars
      const makes = new Map<string, number>();
      const bodyTypes = new Map<string, number>();
      const fuelTypes = new Map<string, number>();
      const years = new Map<number, number>();
      const features = new Map<string, number>();
      const prices: number[] = [];

      carViews.forEach(activity => {
        if (activity.payload?.make) {
          makes.set(activity.payload.make, (makes.get(activity.payload.make) || 0) + 1);
        }
        if (activity.payload?.bodyType) {
          bodyTypes.set(activity.payload.bodyType, (bodyTypes.get(activity.payload.bodyType) || 0) + 1);
        }
        if (activity.payload?.fuelType) {
          fuelTypes.set(activity.payload.fuelType, (fuelTypes.get(activity.payload.fuelType) || 0) + 1);
        }
        if (activity.payload?.year) {
          years.set(activity.payload.year, (years.get(activity.payload.year) || 0) + 1);
        }
        if (activity.payload?.features && Array.isArray(activity.payload.features)) {
          activity.payload.features.forEach((feature: string) => {
            features.set(feature, (features.get(feature) || 0) + 1);
          });
        }
        if (activity.payload?.price) {
          const price = extractPrice(activity.payload.price);
          if (price > 0) prices.push(price);
        }
      });

      // Get top preferences (most viewed)
      preferences.preferredMakes = Array.from(makes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([make]) => make);

      preferences.preferredBodyTypes = Array.from(bodyTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type]) => type);

      preferences.preferredFuelTypes = Array.from(fuelTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([fuel]) => fuel);

      preferences.preferredYears = Array.from(years.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([year]) => year);

      preferences.preferredFeatures = Array.from(features.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([feature]) => feature);

      // Calculate preferred price range
      if (prices.length > 0) {
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        preferences.preferredPriceRange = {
          min: Math.max(5000, avgPrice * 0.7),
          max: avgPrice * 1.3
        };
      }
    }

    // Fallback to current filter values if no activity history
    if (preferences.preferredMakes.length === 0 && makeFilter !== 'Any') {
      preferences.preferredMakes = [makeFilter];
    }
    if (preferences.preferredBodyTypes.length === 0 && bodyTypeFilter !== 'Any') {
      preferences.preferredBodyTypes = [bodyTypeFilter];
    }
    if (preferences.preferredFuelTypes.length === 0 && fuelTypeFilter !== 'Any') {
      preferences.preferredFuelTypes = [fuelTypeFilter];
    }
    if (preferences.preferredYears.length === 0 && yearFilter !== 'Any') {
      preferences.preferredYears = [parseInt(yearFilter)];
    }
    if (preferences.preferredPriceRange.min === 0) {
      preferences.preferredPriceRange = { min: priceRange[0], max: priceRange[1] };
    }

    setUserPreferences(preferences);
    return preferences;
  };

  const generateRecommendations = (preferences: any) => {
    if (!listings.length) return [];

    const scoredCars = listings.map(car => {
      let score = 0;
      const carPrice = extractPrice(car.price || '0');

      // Score based on make preference
      if (preferences.preferredMakes.includes(car.make)) {
        score += 10;
      }

      // Score based on body type preference
      if (preferences.preferredBodyTypes.includes(car.bodyType)) {
        score += 8;
      }

      // Score based on fuel type preference
      if (preferences.preferredFuelTypes.includes(car.fuelType)) {
        score += 8;
      }

      // Score based on year preference
      if (preferences.preferredYears.includes(car.year as number)) {
        score += 6;
      }

      // Score based on price range preference
      if (carPrice >= preferences.preferredPriceRange.min && carPrice <= preferences.preferredPriceRange.max) {
        score += 5;
      } else if (carPrice >= preferences.preferredPriceRange.min * 0.8 && carPrice <= preferences.preferredPriceRange.max * 1.2) {
        score += 2;
      }

      // Score based on feature preferences
      if (car.features && Array.isArray(car.features)) {
        const matchingFeatures = car.features.filter(feature => 
          preferences.preferredFeatures.includes(feature)
        );
        score += matchingFeatures.length * 2;
      }

      // Bonus for cars in user's current search criteria
      if (searchTerm && car.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        score += 3;
      }
      if (yearFilter !== 'Any' && car.year === parseInt(yearFilter)) {
        score += 2;
      }
      if (makeFilter !== 'Any' && car.make === makeFilter) {
        score += 2;
      }
      if (bodyTypeFilter !== 'Any' && car.bodyType === bodyTypeFilter) {
        score += 2;
      }
      if (fuelTypeFilter !== 'Any' && car.fuelType === fuelTypeFilter) {
        score += 2;
      }

      // Bonus for recently viewed cars
      const recentlyViewed = recentActivities.some(activity => 
        activity.type === 'car_view' && activity.payload?.id === car.id
      );
      if (recentlyViewed) {
        score += 5;
      }

      // Bonus for favorite cars
      if (favorites.includes(car.id)) {
        score += 3;
      }

      return { ...car, score };
    });

    // Sort by score and return top recommendations
    return scoredCars
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  };

  const updateRecommendations = () => {
    const preferences = analyzeUserPreferences();
    const recommendations = generateRecommendations(preferences);
    setRecommendedCars(recommendations);
  };

  // Don't render until filter arrays are populated to prevent hydration issues
  if (MAKES.length === 0 || BODY_TYPES.length === 0 || FUEL_TYPES.length === 0 || 
      ENGINE_CAPACITIES.length === 0 || ENGINE_POWERS.length === 0 || DRIVE_TYPES.length === 0 ||
      REGIONS.length === 0 || CAR_TYPES.length === 0 || MILEAGE_RANGES.length === 0 || TRADE_IN_OPTIONS.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-[15%] md:mt-[5%] bg-white rounded-lg">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-[15%] md:mt-[5%] bg-white rounded-lg">
      <div className="space-y-6">
        {/* <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('find_perfect_car')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('browse_collection')}
          </p>
          <Button 
            onClick={() => router.push('/car-recomendations')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {t('make_ai_recommendation')}
          </Button>
        </motion.div> */}
        
        {/* Search and Filter Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <Card className="bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('search_placeholder')}
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-3 text-gray-400">
                  <Car size={20} />
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Filter Toggle Button - Mobile Only */}
          <div className="md:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full flex items-center justify-between bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Filters</span>
                <span className="text-xs text-gray-500">
                  ({yearFilter !== 'Any' ? 1 : 0} + {makeFilter !== 'Any' ? 1 : 0} + {bodyTypeFilter !== 'Any' ? 1 : 0} + {fuelTypeFilter !== 'Any' ? 1 : 0} + {engineCapacityFilter !== 'Any' ? 1 : 0} + {enginePowerFilter !== 'Any' ? 1 : 0} + {driveTypeFilter !== 'Any' ? 1 : 0} + {regionFilter !== 'Any' ? 1 : 0} + {carTypeFilter !== 'Any' ? 1 : 0} + {mileageFilter !== 'Any' ? 1 : 0} + {tradeInFilter !== 'Any' ? 1 : 0} active)
                </span>
              </div>
              <div className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </div>

          {/* Filter Options - Collapsible on Mobile */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Filter Header with Clear Button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    {hasActiveFilters() && (
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Filter Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year-filter">{t('year')}</Label>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger id="year-filter">
                          <SelectValue placeholder={t('any_year')} />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          <SelectItem value="Any">{t('any_year')}</SelectItem>
                          {YEARS.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="make-filter">Manufacturer</Label>
                      <Select value={makeFilter} onValueChange={setMakeFilter}>
                        <SelectTrigger id="make-filter">
                          <SelectValue placeholder="Any Manufacturer" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {MAKES.map(make => (
                            <SelectItem key={make.value} value={make.value}>{make.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="body-type-filter">{t('body_type')}</Label>
                      <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
                        <SelectTrigger id="body-type-filter">
                          <SelectValue placeholder={t('any_body_type')} />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {BODY_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fuel-type-filter">{t('fuel_type')}</Label>
                      <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                        <SelectTrigger id="fuel-type-filter">
                          <SelectValue placeholder={t('any_fuel_type')} />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {FUEL_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('price_range')}: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}</Label>
                      <Slider
                        defaultValue={[5000, minMaxPrices.max]}
                        min={5000}
                        max={minMaxPrices.max}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-4"
                      />
                    </div>
                  </div>
                  
                  {/* Advanced Filters Toggle - Mobile */}
                  <div className="border-t pt-4">
                    <Button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    >
                      <span className="font-medium">Advanced Filters</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  
                  {/* Advanced Filters Section - Mobile */}
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="engine-capacity-filter-mobile">Engine Capacity</Label>
                          <Select value={engineCapacityFilter} onValueChange={setEngineCapacityFilter}>
                            <SelectTrigger id="engine-capacity-filter-mobile">
                              <SelectValue placeholder="Any Engine Capacity" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {ENGINE_CAPACITIES.map(cap => (
                                <SelectItem key={cap.value} value={cap.value}>{cap.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="engine-power-filter-mobile">Engine Power</Label>
                          <Select value={enginePowerFilter} onValueChange={setEnginePowerFilter}>
                            <SelectTrigger id="engine-power-filter-mobile">
                              <SelectValue placeholder="Any Engine Power" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {ENGINE_POWERS.map(power => (
                                <SelectItem key={power.value} value={power.value}>{power.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="drive-type-filter-mobile">Drive Type</Label>
                          <Select value={driveTypeFilter} onValueChange={setDriveTypeFilter}>
                            <SelectTrigger id="drive-type-filter-mobile">
                              <SelectValue placeholder="Any Drive Type" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {DRIVE_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="region-filter-mobile">Region</Label>
                          <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger id="region-filter-mobile">
                              <SelectValue placeholder="Any Region" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {REGIONS.map(region => (
                                <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="car-type-filter-mobile">Car Type</Label>
                          <Select value={carTypeFilter} onValueChange={setCarTypeFilter}>
                            <SelectTrigger id="car-type-filter-mobile">
                              <SelectValue placeholder="Any Car Type" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {CAR_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mileage-filter-mobile">Mileage</Label>
                          <Select value={mileageFilter} onValueChange={setMileageFilter}>
                            <SelectTrigger id="mileage-filter-mobile">
                              <SelectValue placeholder="Any Mileage" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {MILEAGE_RANGES.map(mileage => (
                                <SelectItem key={mileage.value} value={mileage.value}>{mileage.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="trade-in-filter-mobile">Trade-in</Label>
                          <Select value={tradeInFilter} onValueChange={setTradeInFilter}>
                            <SelectTrigger id="trade-in-filter-mobile">
                              <SelectValue placeholder="Any Trade-in Option" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {TRADE_IN_OPTIONS.map(trade => (
                                <SelectItem key={trade.value} value={trade.value}>{trade.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Desktop Filters - Always Visible */}
          <div className="hidden md:block">
            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Filter Header with Clear Button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    {hasActiveFilters() && (
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Filter Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year-filter-desktop">{t('year')}</Label>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger id="year-filter-desktop">
                          <SelectValue placeholder={t('any_year')} />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          <SelectItem value="Any">{t('any_year')}</SelectItem>
                          {YEARS.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="make-filter-desktop">Manufacturer</Label>
                      <Select value={makeFilter} onValueChange={setMakeFilter}>
                        <SelectTrigger id="make-filter-desktop">
                          <SelectValue placeholder="Any Manufacturer" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {MAKES.map(make => (
                            <SelectItem key={make.value} value={make.value}>{make.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="body-type-filter-desktop">{t('body_type')}</Label>
                      <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
                        <SelectTrigger id="body-type-filter-desktop">
                          <SelectValue placeholder={t('any_body_type')} />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {BODY_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fuel-type-filter-desktop">{t('fuel_type')}</Label>
                      <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                        <SelectTrigger id="fuel-type-filter-desktop">
                          <SelectValue placeholder={t('any_fuel_type')} />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {FUEL_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('price_range')}: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}</Label>
                      <Slider
                        defaultValue={[5000, minMaxPrices.max]}
                        min={5000}
                        max={minMaxPrices.max}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-4"
                      />
                    </div>
                  </div>
                  
                  {/* Advanced Filters Toggle */}
                  <div className="border-t pt-4">
                    <Button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    >
                      <span className="font-medium">Advanced Filters</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  
                  {/* Advanced Filters Section */}
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="engine-capacity-filter">Engine Capacity</Label>
                          <Select value={engineCapacityFilter} onValueChange={setEngineCapacityFilter}>
                            <SelectTrigger id="engine-capacity-filter">
                              <SelectValue placeholder="Any Engine Capacity" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {ENGINE_CAPACITIES.map(cap => (
                                <SelectItem key={cap.value} value={cap.value}>{cap.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="engine-power-filter">Engine Power</Label>
                          <Select value={enginePowerFilter} onValueChange={setEnginePowerFilter}>
                            <SelectTrigger id="engine-power-filter">
                              <SelectValue placeholder="Any Engine Power" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {ENGINE_POWERS.map(power => (
                                <SelectItem key={power.value} value={power.value}>{power.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="drive-type-filter">Drive Type</Label>
                          <Select value={driveTypeFilter} onValueChange={setDriveTypeFilter}>
                            <SelectTrigger id="drive-type-filter">
                              <SelectValue placeholder="Any Drive Type" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {DRIVE_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="region-filter">Region</Label>
                          <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger id="region-filter">
                              <SelectValue placeholder="Any Region" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {REGIONS.map(region => (
                                <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="car-type-filter">Car Type</Label>
                          <Select value={carTypeFilter} onValueChange={setCarTypeFilter}>
                            <SelectTrigger id="car-type-filter">
                              <SelectValue placeholder="Any Car Type" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {CAR_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mileage-filter">Mileage</Label>
                          <Select value={mileageFilter} onValueChange={setMileageFilter}>
                            <SelectTrigger id="mileage-filter">
                              <SelectValue placeholder="Any Mileage" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {MILEAGE_RANGES.map(mileage => (
                                <SelectItem key={mileage.value} value={mileage.value}>{mileage.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="trade-in-filter">Trade-in</Label>
                          <Select value={tradeInFilter} onValueChange={setTradeInFilter}>
                            <SelectTrigger id="trade-in-filter">
                              <SelectValue placeholder="Any Trade-in Option" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              {TRADE_IN_OPTIONS.map(trade => (
                                <SelectItem key={trade.value} value={trade.value}>{trade.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recommendation Section */}
        <div className="space-y-4">
          <Card className="bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
                <Button
                  onClick={() => router.push('/car-recomendations')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('view_all_recommendations')}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Recent Activity</p>
                    <h4 className="text-lg font-bold text-gray-900">
                      {t('recent_searches')}
                    </h4>
                  </div>
                  <Clock className="h-6 w-6 text-gray-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Interests</p>
                    <h4 className="text-lg font-bold text-gray-900">
                      {t('your_interests')}
                    </h4>
                  </div>
                  <Eye className="h-6 w-6 text-gray-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Favorites</p>
                    <h4 className="text-lg font-bold text-gray-900">
                      {t('your_favorites')}
                    </h4>
                  </div>
                  <Heart className="h-6 w-6 text-gray-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Target Price</p>
                    <h4 className="text-lg font-bold text-gray-900">
                      {t('your_target_price')}
                    </h4>
                  </div>
                  <Target className="h-6 w-6 text-gray-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Budget</p>
                    <h4 className="text-lg font-bold text-gray-900">
                      {t('your_budget')}
                    </h4>
                  </div>
                  <Zap className="h-6 w-6 text-gray-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Preferred Features</p>
                    <h4 className="text-lg font-bold text-gray-900">
                      {t('your_preferred_features')}
                    </h4>
                  </div>
                  <Star className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Recommendations Display */}
        {recommendedCars.length > 0 && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      🎯 Personalized for You
                    </h3>
                    <p className="text-gray-600">
                      Based on your search history and preferences
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                    AI-Powered
                  </Badge>
                </div>

                {/* User Preferences Summary */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Your Preferences Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {userPreferences.preferredMakes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">Makes: {userPreferences.preferredMakes.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {userPreferences.preferredBodyTypes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Body: {userPreferences.preferredBodyTypes.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {userPreferences.preferredFuelTypes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-orange-600" />
                        <span className="text-gray-700">Fuel: {userPreferences.preferredFuelTypes.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {userPreferences.preferredPriceRange.min > 0 && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-700">Price: ${userPreferences.preferredPriceRange.min.toLocaleString()} - ${userPreferences.preferredPriceRange.max.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Cars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedCars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 border-blue-200 hover:border-blue-300">
                        <CardContent className="p-4">
                          {/* Recommendation Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-blue-600 text-white text-xs">
                              {index === 0 ? '🥇 Top Match' : 
                               index === 1 ? '🥈 Great Match' : 
                               index === 2 ? '🥉 Good Match' : 'Match'}
                            </Badge>
                          </div>

                          {/* Car Image */}
                          <div className="relative mb-3">
                            <img
                              src={car.mainImage || "/default-car.png"}
                              alt={car.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                                Score: {car.score || 0}
                              </Badge>
                            </div>
                          </div>

                          {/* Car Details */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                              {car.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-600">
                                {car.price}
                              </span>
                              <span className="text-sm text-gray-500">
                                {car.year}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span>{car.make}</span>
                              <span>•</span>
                              <span>{car.bodyType}</span>
                              <span>•</span>
                              <span>{car.fuelType}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleViewDetails(car.slug)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => add_to_favorites(car.id)}
                              className={favorites.includes(car.id) ? 'text-red-600 border-red-600' : ''}
                            >
                              <Heart className={`h-4 w-4 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Recommendation Insights */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Why These Recommendations?</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• Based on {recentActivities.filter(a => a.type.includes('view')).length} recent car views</p>
                    <p>• Matches your preferred {userPreferences.preferredMakes.length > 0 ? `makes (${userPreferences.preferredMakes.join(', ')})` : 'criteria'}</p>
                    <p>• Aligns with your budget range and feature preferences</p>
                    <p>• Considers your search history and favorite cars</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('loading') || 'Loading cars...'}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-700 font-semibold mb-2">{t('error_loading') || 'Error Loading Cars'}</p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button onClick={fetchProducts} className="bg-red-600 hover:bg-red-700">
                  {t('retry') || 'Retry'}
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  {filteredCars.length} {filteredCars.length === 1 ? t('car_found') || 'car found' : t('cars_found') || 'cars found'}
                </div>
                <div className="flex items-center space-x-2">
                  <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="grid" className="data-[state=active]:bg-white">
                        <div className="flex items-center space-x-1">
                          <Plus className="h-4 w-4 rotate-45" />
                          <span className="sr-only md:not-sr-only md:inline-block">{t('grid')}</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* No Results */}
              {filteredCars.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-gray-700 font-semibold mb-2">{t('no_cars_found') || 'No Cars Found'}</p>
                    <p className="text-gray-600 text-sm mb-4">{t('try_adjusting_filters') || 'Try adjusting your filters or search terms'}</p>
                    <Button onClick={clearAllFilters} className="bg-red-600 hover:bg-red-700">
                      {t('clear_filters') || 'Clear Filters'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {filteredCars.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {filteredCars.map((car) => (
                    <CarCard 
                      key={car.slug || car.id} 
                      car={car as any}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
      {selectedCars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 flex items-center gap-4 ">
              <div className="text-sm text-gray-600">
                {selectedCars.length} {t('cars_selected')}
              </div>
              <Button
                asChild
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/comparison">
                  <Scale className="w-4 h-4 mr-2" />
                  {t('compare_cars')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CarListings;
