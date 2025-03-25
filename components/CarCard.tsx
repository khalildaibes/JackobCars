"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Img } from "./Img";
import { Car, Fuel, Heart, MessageSquare, Scale, Calendar, Gauge, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useComparison } from "../app/context/ComparisonContext";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

interface CarCardProps {
  car: {
    id: string | number;
    mainImage: string;
    title: string;
    year: number;
    mileage: string;
    price: string;
    bodyType: string;
    fuelType: string;
    description: string;
    location?: string;
    features?: string[];
  };
  variant?: "grid" | "list";
}

export default function CarCard({ car, variant = "grid" }: CarCardProps) {
  const router = useRouter();
  const t = useTranslations("CarListing");
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const [favorites, setFavorites] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updatedFavorites;
    if (favorites.includes(car.id)) {
      updatedFavorites = favorites.filter((favId) => favId !== car.id);
    } else {
      updatedFavorites = [...favorites, car.id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleContactSeller = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/send-email`, {
        method: 'POST',
        body: JSON.stringify({ id: car.id.toString() }),
      });
      if (response.ok) {
        toast.success(t('email_sent'));
      } else {
        toast.error(t('email_failed'));
      }
    } catch (error) {
      toast.error(t('email_failed'));
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/car-details/${car.id}`);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison(car.id.toString())) {
      removeFromComparison(car.id.toString());
      toast.success(t('removed_from_comparison'));
    } else {
      addToComparison(car);
      toast.success(t('added_to_comparison'));
    }
  };

  const gridContent = (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Img
          width={1920}
          height={1080}
          external={true}
          src={car.mainImage}
          alt={car.title}
          className="w-full h-48 object-fit"
        />
        <Button 
          size="icon" 
          onClick={handleFavoriteToggle}
          variant="ghost" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full"
        >
          <Heart className={`h-5 w-5 ${favorites.includes(car.id) ? 'fill-current text-red-500' : ''}`} />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <Badge className="bg-blue-500 text-white">{car.year}</Badge>
          <Badge className="bg-blue-800 ml-2 text-white">{car.mileage}</Badge>
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.title}</h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">{car.price}</p>
        <div className="flex items-center text-gray-600 mb-3 text-sm">
          <Car size={16} className="mr-1" />
          <span>{car.bodyType}</span>
          <span className="mx-2">•</span>
          <Fuel size={16} className="mr-1" />
          <span>{car.fuelType}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{car.description}</p>
        <div className="mt-auto flex justify-between items-center">
          {car.location && <span className="text-sm text-gray-700">{car.location}</span>}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-blue-500 text-white"
              onClick={handleContactSeller}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {t('contact')}
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-500 text-white"
              onClick={handleViewDetails}
            >
              {t('view_details')}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant={isInComparison(car.id.toString()) ? "destructive" : "outline"}
            size="sm"
            onClick={handleCompareToggle}
            className="flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            {isInComparison(car.id.toString()) ? t('remove_from_comparison') : t('add_to_comparison')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const listContent = (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3">
          <Img
            external={true}
            width={1920}
            height={1080}
            src={car.mainImage}
            alt={car.title}
            className="w-full h-48 md:h-full object-cover"
          />
          <Button 
            size="icon" 
            onClick={handleFavoriteToggle}
            variant="ghost" 
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full"
          >
            <Heart className={`h-5 w-5 ${favorites.includes(car.id) ? 'fill-current text-red-500' : ''}`} />
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
                <span>{car.mileage}</span>
                <span className="mx-2">•</span>
                <Fuel size={16} className="mr-1" />
                <span>{car.fuelType}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{car.price}</p>
          </div>
          <p className="text-gray-600 mb-4">{car.description}</p>
          {car.features && (
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
          )}
          <div className="flex items-center justify-between mt-4 w-full">
            {car.location && <span className="text-sm text-gray-500">{car.location}</span>}
            <div className="flex space-x-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-blue-500 text-white"
                onClick={handleContactSeller}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('contact')}
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-500 text-white"
                onClick={handleViewDetails}
              >
                {t('view_details')}
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Button
              variant={isInComparison(car.id.toString()) ? "destructive" : "outline"}
              size="sm"
              onClick={handleCompareToggle}
              className="flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              {isInComparison(car.id.toString()) ? t('remove_from_comparison') : t('add_to_comparison')}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {listContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {gridContent}
    </motion.div>
  );
}
