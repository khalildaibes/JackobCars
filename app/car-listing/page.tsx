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

import CarCard from '../../components/CarCard';

// First, add this helper function at the top of your file
const extractPrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseInt(price.replace(/[$,]/g, '')) || 0;
};

const YEARS = Array.from({ length: 30 }, (_, i) => 2024 - i);

const CarListings: React.FC = () => {
  const { selectedCars } = useComparison();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

    };

    const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`/api/deals?store_hostname=64.227.112.249`);
          if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
      
          const data = await response.json();
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
            };
          });
          

          setListings(formattedListings);

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
      
      return true;
    } catch (error) {
      console.error('Error filtering car:', car, error);
      return false;
    }
  });
  
  const handleViewDetails = (slug: number) => {
    router.push(`/car-details/${slug}`);
  };



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
                    <Button onClick={() => {
                      setSearchTerm('');
                      setYearFilter('Any');
                      setMakeFilter('Any');
                      setBodyTypeFilter('Any');
                      setFuelTypeFilter('Any');
                      setPriceRange([minMaxPrices.min, minMaxPrices.max]);
                    }} className="bg-red-600 hover:bg-red-700">
                      {t('clear_filters') || 'Clear Filters'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {filteredCars.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard 
                      key={car.slug || car.id} 
                      car={car}
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
