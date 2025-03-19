"use client"; // This marks the component as a Client Component
import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
import { Link } from '@radix-ui/react-navigation-menu';

const CarDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Get the id from the URL parameters

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
    // ... other car objects ...
  ];

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
        <Link href="/car-listings">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  // ... rest of the component code ...
};

export default CarDetails;