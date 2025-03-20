"use client"; // This marks the component as a Client Component make this page work when doing car-details?id=1
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
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
  ArrowLeft 
} from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Card, CardContent } from "../../../components/ui/card";
import { toast } from "../../../components/ui/use-toast";
import Link from 'next/link';

const CarDetails: React.FC = () => {
  const params = useParams();
  const id = params.id; // Get the id from the URL parameters

  const MOCK_CARS = [
    {
      id: 1,
      title: "2022 Toyota Camry XSE",
      price: 32999,
      mileage: 12500,
      year: 2022,
      make: "Toyota",
      model: "Camry",
      trim: "XSE",
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Pearl White",
      description: "Excellent condition with low mileage. Features include panoramic sunroof, leather seats, and advanced safety package.",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
      location: "Miami, FL",
      bodyType: "Sedan",
      features: ["Leather Seats", "Navigation", "Bluetooth", "Backup Camera", "Sunroof"]
    },
    {
      id: 1,
      title: "2022 Toyota Camry XSE",
      price: 32999,
      mileage: 12500,
      year: 2022,
      make: "Toyota",
      model: "Camry",
      trim: "XSE",
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Pearl White",
      description: "Excellent condition with low mileage. Features include panoramic sunroof, leather seats, and advanced safety package.",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
      location: "Miami, FL",
      bodyType: "Sedan",
      features: ["Leather Seats", "Navigation", "Bluetooth", "Backup Camera", "Sunroof"]
    },
    {
      id: 2,
      title: "2020 Honda Accord Sport",
      price: 27500,
      mileage: 28900,
      year: 2020,
      make: "Honda",
      model: "Accord",
      trim: "Sport",
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Modern Steel Metallic",
      description: "One owner, clean history. Comes with all maintenance records and extended warranty.",
      image: "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800&auto=format&fit=crop",
      location: "Atlanta, GA",
      bodyType: "Sedan",
      features: ["Apple CarPlay", "Android Auto", "Lane Keep Assist", "Adaptive Cruise Control"]
    },
    {
      id: 3,
      title: "2021 Tesla Model 3 Long Range",
      price: 48990,
      mileage: 18700,
      year: 2021,
      make: "Tesla",
      model: "Model 3",
      trim: "Long Range",
      fuelType: "Electric",
      transmission: "Automatic",
      color: "Midnight Silver Metallic",
      description: "Dual motor all-wheel drive with 353 mile range. Premium interior with glass roof.",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
      location: "San Francisco, CA",
      bodyType: "Sedan",
      features: ["Autopilot", "Premium Interior", "Heated Seats", "Glass Roof"]
    },
    {
      id: 4,
      title: "2019 BMW X5 xDrive40i",
      price: 45500,
      mileage: 37800,
      year: 2019,
      make: "BMW",
      model: "X5",
      trim: "xDrive40i",
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Alpine White",
      description: "Luxury SUV with M Sport package and premium sound system. Well maintained.",
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop",
      location: "Chicago, IL",
      bodyType: "SUV",
      features: ["Heated Steering Wheel", "Premium Sound System", "360 Camera", "Head-up Display"]
    },
    {
      id: 5,
      title: "2023 Ford Mustang GT",
      price: 52500,
      mileage: 5600,
      year: 2023,
      make: "Ford",
      model: "Mustang",
      trim: "GT",
      fuelType: "Gasoline",
      transmission: "Manual",
      color: "Race Red",
      description: "5.0L V8 with 460hp. Performance package and digital dash. Like new condition.",
      image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop",
      location: "Dallas, TX",
      bodyType: "Coupe",
      features: ["Performance Package", "Brembo Brakes", "Digital Dash", "Launch Control"]
    },
    {
      id: 6,
      title: "2020 Audi Q7 Premium Plus",
      price: 47990,
      mileage: 32100,
      year: 2020,
      make: "Audi",
      model: "Q7",
      trim: "Premium Plus",
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Glacier White Metallic",
      description: "Luxury 7-passenger SUV with Bang & Olufsen sound system and Quattro AWD.",
      image: "https://images.unsplash.com/photo-1607853554439-0069ec0f29b6?w=800&auto=format&fit=crop",
      location: "Denver, CO",
      bodyType: "SUV",
      features: ["Bang & Olufsen Audio", "Virtual Cockpit", "Panoramic Sunroof", "Heated/Ventilated Seats"]
    }
  ];
  
  console.log("1")
  const [activeImage, setActiveImage] = useState(0);
  
  // Find the car by ID from our mock data
  // In a real app, this would be a fetch to the backend
  const car = MOCK_CARS.find(car => car.id.toString() === id);
  
  // If no car is found, show a not found message
  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Car Not Found</h1>
        <p className="mb-8">The car you're looking for doesn't exist or has been removed.</p>
        <Link href="/car-listing">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }
  
  // Function to handle contact seller button
  const handleContactSeller = () => {
    toast({
      title: "Message Sent",
      description: "The seller has been notified of your interest.",
    });
  };
  
  // Function to handle save to favorites
  const handleSaveToFavorites = () => {
    toast({
      title: "Saved to Favorites",
      description: "This car has been added to your favorites.",
    });
  };
  
  // Additional car details (would come from API in real app)
  const additionalImages = [
    car.image,
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop", // Interior
    "https://images.unsplash.com/photo-1583527976767-a57cdcbcd34b?w=800&auto=format&fit=crop", // Engine
    "https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800&auto=format&fit=crop", // Trunk
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&auto=format&fit=crop"  // Side view
  ];
  
  const carSpecs = [
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Year", value: car.year },
    { label: "Body Type", value: car.bodyType },
    { label: "Mileage", value: `${car.mileage.toLocaleString()}` },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Transmission", value: car.transmission },
    { label: "Color", value: car.color },
    { label: "VIN", value: "1HGBH41JXMN109186" }, // Mock VIN
    { label: "Stock #", value: `STK${car.id}7892` } // Mock stock number
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-[5%]">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/car-listing" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Listings
        </Link>
      </div>
      
      {/* Car Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{car.title}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">Listed 3 days ago</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{car.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold text-blue-600">${car.price.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Est. $485/mo</div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Car Images */}
          <Card className="overflow-hidden">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={additionalImages[activeImage]}
                alt={car.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 grid grid-cols-5 gap-2">
              {additionalImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`h-16 md:h-20 overflow-hidden rounded cursor-pointer border-2 ${activeImage === idx ? 'border-blue-600' : 'border-transparent'}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </Card>
          
          {/* Car Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="history">Vehicle History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Mileage</div>
                    <div className="font-medium">{car.mileage.toLocaleString()} mi</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Fuel Type</div>
                    <div className="font-medium">{car.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Body Type</div>
                    <div className="font-medium">{car.bodyType}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="font-medium">${car.price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Warranty</div>
                    <div className="font-medium">3 Months</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{car.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {carSpecs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between pr-4">
                      <span className="text-gray-600">{spec.label}:</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <Check className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Clean Title</h3>
                  <p className="text-sm text-green-700">This vehicle has a clean title history with no reported accidents.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service History</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-4 pb-6 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px]"></div>
                    <p className="text-sm text-gray-500">June 2023</p>
                    <h4 className="font-medium">Regular Maintenance</h4>
                    <p className="text-sm text-gray-600">Oil change, filters replaced, tire rotation</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-4 pb-6 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px]"></div>
                    <p className="text-sm text-gray-500">January 2023</p>
                    <h4 className="font-medium">Winter Check-up</h4>
                    <p className="text-sm text-gray-600">Battery test, brake inspection, fluid top-up</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-4 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px]"></div>
                    <p className="text-sm text-gray-500">August 2022</p>
                    <h4 className="font-medium">Full Service</h4>
                    <p className="text-sm text-gray-600">Comprehensive inspection, all fluids changed</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Seller</h3>
              <div className="space-y-4">
                <Button onClick={handleContactSeller} className="w-full" size="lg">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Seller
                </Button>
                <div className="text-center text-gray-600">or call</div>
                <Button variant="outline" className="w-full" size="lg">
                  (555) 123-4567
                </Button>
                <Separator />
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleSaveToFavorites}>
                    <Heart className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Financing Options</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Estimated Payment</div>
                  <div className="text-2xl font-bold">$485/mo</div>
                  <div className="text-xs text-gray-500">for 60 months @ 4.9% APR</div>
                </div>
                <Button className="w-full">
                  Check Your Rate
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  This won't affect your credit score
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Similar Vehicles</h3>
              <div className="space-y-3">
                {MOCK_CARS.filter(c => c.id !== car.id).slice(0, 3).map((similarCar) => (
                  <Link key={similarCar.id} href={`/car-details/${similarCar.id}`}>
                    <div className="flex space-x-3 group">
                      <div className="w-20 h-16 overflow-hidden rounded">
                        <img src={similarCar.image} alt={similarCar.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{similarCar.title}</h4>
                        <p className="text-blue-600 text-sm font-semibold">${similarCar.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Video Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Watch Car Review Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-video rounded-lg overflow-hidden shadow-md">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="YouTube video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-md">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="YouTube video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-md">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="YouTube video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
