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
import { Check, Heart, MessageSquare, Plus, Car,Calendar, Gauge, Fuel, Sparkles, Scale } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { fetchStrapiData } from '../lib/strapiClient';
import { Img } from '../../components/Img';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useComparison } from '../../context/ComparisonContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import CarCard from '../../components/CarCard';

// First, add this helper function at the top of your file
const extractPrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseInt(price.replace(/[$,]/g, '')) || 0;
};

const YEARS = Array.from({ length: 30 }, (_, i) => 2024 - i);

const CarListings: React.FC = () => {
  const { addToComparison, removeFromComparison, isInComparison, selectedCars } = useComparison();
  const t = useTranslations('CarListing');
  const router = useRouter();
  
  // Move the arrays inside the component where useTranslations is available
  const MAKES = [
    { value: "Any", label: t('makes.any') },
    { value: "Toyota", label: t('makes.toyota') },
    { value: "Honda", label: t('makes.honda') },
    { value: "Ford", label: t('makes.ford') },
    { value: "Chevrolet", label: t('makes.chevrolet') },
    { value: "BMW", label: t('makes.bmw') },
    { value: "Mercedes-Benz", label: t('makes.mercedes') },
    { value: "Audi", label: t('makes.audi') },
    { value: "Tesla", label: t('makes.tesla') },
    { value: "Lexus", label: t('makes.lexus') },
    { value: "Subaru", label: t('makes.subaru') }
  ];

  const BODY_TYPES = [
    { value: "Any", label: t('body_types.any') },
    { value: "Sedan", label: t('body_types.sedan') },
    { value: "SUV", label: t('body_types.suv') },
    { value: "Truck", label: t('body_types.truck') },
    { value: "Coupe", label: t('body_types.coupe') },
    { value: "Convertible", label: t('body_types.convertible') },
    { value: "Hatchback", label: t('body_types.hatchback') },
    { value: "Wagon", label: t('body_types.wagon') },
    { value: "Van", label: t('body_types.van') }
  ];

  const FUEL_TYPES = [
    { value: "Any", label: t('fuel_types.any') },
    { value: "Gasoline", label: t('fuel_types.gasoline') },
    { value: "Diesel", label: t('fuel_types.diesel') },
    { value: "Electric", label: t('fuel_types.electric') },
    { value: "Hybrid", label: t('fuel_types.hybrid') },
    { value: "Plug-in Hybrid", label: t('fuel_types.plug_in_hybrid') }
  ];

  // Add new state for min and max price
  const [minMaxPrices, setMinMaxPrices] = useState<{ min: number; max: number }>({ min: 5000, max: 100000 });
  
  // Replace your existing price range state with:
  const [priceRange, setPriceRange] = useState<number[]>([5000, 100000]);
  const [yearFilter, setYearFilter] = useState<string>("Any");
  const [makeFilter, setMakeFilter] = useState<string>("Any");
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>("Any");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("Any");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewType, setViewType] = useState<string>("list");
    const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
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
      console.log("added to favorites id ", id ,favorites)
    };

    const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/deals?store_hostname=64.227.112.249`);
          if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
      
          const data = await response.json();
          if (!data || !data.data) throw new Error("Invalid API response structure");
      
          console.log("Fetched Products:", data.data);
          
          // Transform the fetched data into the required listings format
          const formattedListings = data.data.map((product: any) => {
            // Get the fuel type and normalize it
            const rawFuelType = product.details?.car.fuel || "Unknown";
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

            // Normalize make values to English
            const rawMake = product.details?.car.make || "Unknown";
            let normalizedMake = rawMake;
            
            // Normalize make values to English
            if (rawMake.toLowerCase().includes("toyota") || rawMake === "טויוטה" || rawMake === "تويوتا") {
              normalizedMake = "Toyota";
            } else if (rawMake.toLowerCase().includes("honda") || rawMake === "הונדה" || rawMake === "هوندا") {
              normalizedMake = "Honda";
            } else if (rawMake.toLowerCase().includes("ford") || rawMake === "פורד" || rawMake === "فورد") {
              normalizedMake = "Ford";
            } else if (rawMake.toLowerCase().includes("chevrolet") || rawMake === "שברולט" || rawMake === "شيفروليه") {
              normalizedMake = "Chevrolet";
            } else if (rawMake.toLowerCase().includes("bmw") || rawMake === "ב.מ.וו" || rawMake === "بي ام دبليو") {
              normalizedMake = "BMW";
            } else if (rawMake.toLowerCase().includes("mercedes") || rawMake === "מרצדס" || rawMake === "مرسيدس") {
              normalizedMake = "Mercedes-Benz";
            } else if (rawMake.toLowerCase().includes("audi") || rawMake === "אאודי" || rawMake === "أودي") {
              normalizedMake = "Audi";
            } else if (rawMake.toLowerCase().includes("tesla") || rawMake === "טסלה" || rawMake === "تيسلا") {
              normalizedMake = "Tesla";
            } else if (rawMake.toLowerCase().includes("lexus") || rawMake === "לקסוס" || rawMake === "لكزس") {
              normalizedMake = "Lexus";
            } else if (rawMake.toLowerCase().includes("subaru") || rawMake === "סובארו" || rawMake === "سوبارو") {
              normalizedMake = "Subaru";
            }

            // Normalize body type values to English
            const rawBodyType = product.details?.car.body_type || "Unknown";
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

            return {
              id: product.id,
              slug: product.slug,
              mainImage: product.image ? `http://${product.store.hostname}${product.image?.url}` : "/default-car.png",
              alt: product.name || "Car Image",
              title: product.name,
              miles: product.details?.car.miles || "N/A",
              fuel: normalizedFuelType,
              condition: product.details?.car.condition || "Used",
              transmission: product.details?.car.transmission || "Unknown",
              details: product.details?.car.transmission || "Unknown",
              price: `$${product.price.toLocaleString()}`,
              mileage: product.details?.car.miles || "N/A",
              year: product.details.car.year,
              fuelType: normalizedFuelType,
              make: normalizedMake,
              bodyType: normalizedBodyType,
              description: product.details.car.description,
              features: product.details.car.features.map((feature: any) => feature.value) || [],
              category: product.categories ? product.categories.split(",").map((c: string) => c.toLowerCase().trim()) : [],
            };
          });
          
          console.log("Formatted Listings:", formattedListings);
          setListings(formattedListings);

          // Calculate min and max prices from the listings
          const prices = formattedListings.map(car => extractPrice(car.price));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          setMinMaxPrices({ min: minPrice, max: maxPrice });
          setPriceRange([minPrice, maxPrice]);
        } catch (error) {
          console.error("Error fetching products:", error);
          setListings([]);
        }
      };
    
      // Fetch data on component mount
      useEffect(() => {
        fetchProducts();
      }, []);

  const filteredCars = listings.filter(car => {
    // Filter by search term
    if (searchTerm && !car.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !car.make.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by price range - convert price string to number for comparison
    const carPrice = extractPrice(car.price);
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
    
    return true;
  });
  
  const handleViewDetails = (slug: number) => {
    router.push(`/car-details/${slug}`);
  };

  const handleCompareToggle = (car: any) => {
    if (isInComparison(car.id)) {
      removeFromComparison(car.id);
      toast.success(t('removed_from_comparison'));
    } else {
      if (selectedCars.length >= 3) {
        toast.error(t('max_comparison_limit'));
        return;
      }
      addToComparison(car);
      toast.success(t('added_to_comparison'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-[15%] md:mt-[5%] bg-white rounded-lg">
      <div className="space-y-6">
        <motion.div 
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
        </motion.div>
        
        {/* Search and Filter Section */}
        <Card className="bg-white shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Search Bar */}
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
                  <Label htmlFor="make-filter">{t('make')}</Label>
                  <Select value={makeFilter} onValueChange={setMakeFilter}>
                    <SelectTrigger id="make-filter">
                      <SelectValue placeholder={t('any_make')} />
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
            </div>
          </CardContent>
        </Card>
        
        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
           
            <div className="flex items-center space-x-2">
              <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-white">
                    <div className="flex items-center space-x-1">
                      <Plus className="h-4 w-4 rotate-45" />
                      <span className="sr-only md:not-sr-only md:inline-block">{t('grid')}</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-white">
                    <div className="flex items-center space-x-1">
                      <Plus className="h-4 w-4 rotate-90" />
                      <span className="sr-only md:not-sr-only md:inline-block">{t('list')}</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

          
          <div className="space-y-6">
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard 
                    key={car.slug} 
                    car={car}
                    onCompareToggle={() => handleCompareToggle(car)}
                    isInComparison={isInComparison(car.slug)}
                    label={isInComparison(car.slug) ? t('remove_from_comparison') : t('add_to_comparison')}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {filteredCars.map((car) => (
                  <CarCard key={car.slug} car={car} variant="list" />
                ))}
              </div>
            </TabsContent>
          </div>
          </Tabs>
            </div>
          </div>
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
