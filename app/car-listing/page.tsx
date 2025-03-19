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
import { Check, Heart, MessageSquare, Plus, Car,Calendar, Gauge, Fuel } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Img } from '../../components/Img';

// const MOCK_CARS = [
//   {
//     id: 1,
//     title: "2022 Toyota Camry XSE",
//     price: 32999,
//     mileage: 12500,
//     year: 2022,
//     make: "Toyota",
//     model: "Camry",
//     trim: "XSE",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     color: "Pearl White",
//     description: "Excellent condition with low mileage. Features include panoramic sunroof, leather seats, and advanced safety package.",
//     image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
//     location: "Miami, FL",
//     bodyType: "Sedan",
//     features: ["Leather Seats", "Navigation", "Bluetooth", "Backup Camera", "Sunroof"]
//   },
//   {
//     id: 2,
//     title: "2020 Honda Accord Sport",
//     price: 27500,
//     mileage: 28900,
//     year: 2020,
//     make: "Honda",
//     model: "Accord",
//     trim: "Sport",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     color: "Modern Steel Metallic",
//     description: "One owner, clean history. Comes with all maintenance records and extended warranty.",
//     image: "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800&auto=format&fit=crop",
//     location: "Atlanta, GA",
//     bodyType: "Sedan",
//     features: ["Apple CarPlay", "Android Auto", "Lane Keep Assist", "Adaptive Cruise Control"]
//   },
//   {
//     id: 3,
//     title: "2021 Tesla Model 3 Long Range",
//     price: 48990,
//     mileage: 18700,
//     year: 2021,
//     make: "Tesla",
//     model: "Model 3",
//     trim: "Long Range",
//     fuelType: "Electric",
//     transmission: "Automatic",
//     color: "Midnight Silver Metallic",
//     description: "Dual motor all-wheel drive with 353 mile range. Premium interior with glass roof.",
//     image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
//     location: "San Francisco, CA",
//     bodyType: "Sedan",
//     features: ["Autopilot", "Premium Interior", "Heated Seats", "Glass Roof"]
//   },
//   {
//     id: 4,
//     title: "2019 BMW X5 xDrive40i",
//     price: 45500,
//     mileage: 37800,
//     year: 2019,
//     make: "BMW",
//     model: "X5",
//     trim: "xDrive40i",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     color: "Alpine White",
//     description: "Luxury SUV with M Sport package and premium sound system. Well maintained.",
//     image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop",
//     location: "Chicago, IL",
//     bodyType: "SUV",
//     features: ["Heated Steering Wheel", "Premium Sound System", "360 Camera", "Head-up Display"]
//   },
//   {
//     id: 5,
//     title: "2023 Ford Mustang GT",
//     price: 52500,
//     mileage: 5600,
//     year: 2023,
//     make: "Ford",
//     model: "Mustang",
//     trim: "GT",
//     fuelType: "Gasoline",
//     transmission: "Manual",
//     color: "Race Red",
//     description: "5.0L V8 with 460hp. Performance package and digital dash. Like new condition.",
//     image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop",
//     location: "Dallas, TX",
//     bodyType: "Coupe",
//     features: ["Performance Package", "Brembo Brakes", "Digital Dash", "Launch Control"]
//   },
//   {
//     id: 6,
//     title: "2020 Audi Q7 Premium Plus",
//     price: 47990,
//     mileage: 32100,
//     year: 2020,
//     make: "Audi",
//     model: "Q7",
//     trim: "Premium Plus",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     color: "Glacier White Metallic",
//     description: "Luxury 7-passenger SUV with Bang & Olufsen sound system and Quattro AWD.",
//     image: "https://images.unsplash.com/photo-1607853554439-0069ec0f29b6?w=800&auto=format&fit=crop",
//     location: "Denver, CO",
//     bodyType: "SUV",
//     features: ["Bang & Olufsen Audio", "Virtual Cockpit", "Panoramic Sunroof", "Heated/Ventilated Seats"]
//   }
// ];

const YEARS = Array.from({ length: 30 }, (_, i) => 2024 - i);
const MAKES = ["Any", "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Tesla", "Lexus", "Subaru"];
const BODY_TYPES = ["Any", "Sedan", "SUV", "Truck", "Coupe", "Convertible", "Hatchback", "Wagon", "Van"];
const FUEL_TYPES = ["Any", "Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];

const CarListings: React.FC = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [yearFilter, setYearFilter] = useState<string>("Any");
  const [makeFilter, setMakeFilter] = useState<string>("Any");
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>("Any");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("Any");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewType, setViewType] = useState<string>("grid");
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

          const response = await fetch("/api/deals");
          if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
      
          const data = await response.json();
          if (!data || !data.data) throw new Error("Invalid API response structure");
      
    
      
          console.log("Fetched Products:",  data);
          
          // Transform the fetched data into the required listings format
          const formattedListings = data.data.map((product: any) => ({
            id: product.id,
            mainImage: product.image ? `http://68.183.215.202${product.image[0]?.url}` : "/default-car.png",
            alt: product.name || "Car Image",
            title: product.name,
            miles: product.details?.car.miles || "N/A",
            fuel: product.details?.car.fuel || "Unknown",
            condition: product.details?.car.condition || "Used", // Default to "Used"
            transmission: product.details?.car.transmission || "Unknown",
            details: product.details?.car.transmission || "Unknown",
            price: `$${product.price.toLocaleString()}`,

            mileage:  product.details?.car.miles || "N/A",
            year: product.details.car.year,
            fuelType: product.details.car.fuel,

            description: product.details.car.description,
            bodyType: product.details.car.body_type,
            features: product.details.car.features.map((feature: any) => feature.value) || [],
            category: product.categories ? product.categories.split(",").map((c: string) => c.toLowerCase().trim()) : [], // Convert categories string to an array
          }));
          

          setListings(formattedListings);
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
        !car.make.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !car.model.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (car.price < priceRange[0] || car.price > priceRange[1]) {
      return false;
    }
    
    // Filter by year
    if (yearFilter !== "Any" && car.year !== parseInt(yearFilter)) {
      return false;
    }
    
    // Filter by make
    if (makeFilter !== "Any" && car.make !== makeFilter) {
      return false;
    }
    
    // Filter by body type
    if (bodyTypeFilter !== "Any" && car.bodyType !== bodyTypeFilter) {
      return false;
    }
    
    // Filter by fuel type
    if (fuelTypeFilter !== "Any" && car.fuelType !== fuelTypeFilter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Car</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our extensive collection of quality vehicles and find the one that's right for you.
          </p>
        </motion.div>
        
        {/* Search and Filter Section */}
        <Card className="bg-white shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by make, model, or keywords..."
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
                  <Label htmlFor="year-filter">Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger id="year-filter">
                      <SelectValue placeholder="Any Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any Year</SelectItem>
                      {YEARS.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="make-filter">Make</Label>
                  <Select value={makeFilter} onValueChange={setMakeFilter}>
                    <SelectTrigger id="make-filter">
                      <SelectValue placeholder="Any Make" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAKES.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="body-type-filter">Body Type</Label>
                  <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
                    <SelectTrigger id="body-type-filter">
                      <SelectValue placeholder="Any Body Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuel-type-filter">Fuel Type</Label>
                  <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                    <SelectTrigger id="fuel-type-filter">
                      <SelectValue placeholder="Any Fuel Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</Label>
                  <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
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
          <div className="flex items-center justify-between">
           
            <div className="flex items-center space-x-2">
              <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-white">
                    <div className="flex items-center space-x-1">
                      <Plus className="h-4 w-4 rotate-45" />
                      <span className="sr-only md:not-sr-only md:inline-block">Grid</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-white">
                    <div className="flex items-center space-x-1">
                      <Plus className="h-4 w-4 rotate-90" />
                      <span className="sr-only md:not-sr-only md:inline-block">List</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

          
          <div className="space-y-6">
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <Img
                        width={100}
                        height={100}
                        external={true}
                          src={car.mainImage}
                          alt={car.title}
                          className="w-full h-48 object-fit"
                        />
                        <Button 
                          size="icon" 
                          onClick={() => add_to_favorites(car.id)}
                          variant="ghost" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full"
                        >
                        <Heart className={`h-5 w-5 ${favorites.includes(car.id) ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <Badge className="bg-blue-500  text-white">{car.year}</Badge>
                          <Badge className="bg-blue-800 ml-2 text-white">{car.mileage.toLocaleString()}</Badge>
                        </div>
                      </div>
                      <CardContent className="flex-grow flex flex-col pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.title}</h3>
                        <p className="text-2xl font-bold text-blue-600 mb-2">{car.price.toLocaleString()}</p>
                        <div className="flex items-center text-gray-600 mb-3 text-sm">
                          <Car size={16} className="mr-1" />
                          <span>{car.bodyType}</span>
                          <span className="mx-2">•</span>
                          <Fuel size={16} className="mr-1" />
                          <span>{car.fuelType}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{car.description}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-sm text-gray-700">{car.location}</span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className=" bg-blue-500  text-white">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button  size="sm" className='bg-blue-500  text-white'>View Details</Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/3">
                          <Img
                            external={true}
                            width={100}
                            height={100}
                            src={car.mainImage}
                            alt={car.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                        <CardContent className="md:w-2/3 p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{car.title}</h3>
                              <div className="flex items-center text-gray-600 mb-2 text-sm">
                                <Car size={16} className="mr-1" />
                                <span>{car.bodyType}</span>
                                <span className="mx-2">•</span>
                                <Calendar size={16} className="mr-1" />
                                <span>{car.year}</span>
                                <span className="mx-2">•</span>
                                <Gauge size={16} className="mr-1" />
                                <span>{car.mileage.toLocaleString()}</span>
                                <span className="mx-2">•</span>
                                <Fuel size={16} className="mr-1" />
                                <span>{car.fuelType}</span>
                              </div>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()}</p>
                          </div>
                          <p className="text-gray-600 mb-4">{car.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            
                            {car.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                {feature}
                              </Badge>
                            ))}
                            {car.features.length > 3 && (
                              <Badge variant="outline">
                                +{car.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4 w-full">
                            <span className="text-sm text-gray-500">{car.location}</span>
                            <div className="flex space-x-3">
                              <Button  size="sm" variant="outline" className='bg-blue-500  text-white'>
                                <MessageSquare className="h-4 w-4 mr-2 " />
                                Contact Seller
                              </Button>
                              <Button  size="sm" className='bg-blue-500  text-white'>View Details</Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </div>
          </Tabs>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CarListings;
