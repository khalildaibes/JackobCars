"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import dynamic from 'next/dynamic';
import { Car, Fuel, Heart, MessageSquare, Scale, Calendar, Gauge, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useComparison } from "../app/context/ComparisonContext";
import { toast } from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import PriceDisplay from "./PriceDisplay";

// Lazy load the Img component
const Img = dynamic(() => import("./Img").then(mod => ({ default: mod.Img })), {
  loading: () => <div className="w-full h-48 bg-gray-200 animate-pulse" />,
  ssr: false
}) as React.FC<{
  className?: string;
  src: string;
  alt: string;
  external?: boolean;
  width: number;
  height: number;
}>;

interface ImgProps {
  width: number;
  height: number;
  external?: boolean;
  src: string;
  alt: string;
  className?: string;
}

interface CarCardProps {
  car: {
    id: string | number;
    slug: string | number;
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
    isPro?: boolean;
  };
  variant?: 'grid' | 'list';
  onCompareToggle?: () => void;
  isInComparison?: boolean;
  label?: string;
}

// Memoized button components
const FavoriteButton = memo(({ isFavorite, onClick }: { 
  isFavorite: boolean; 
  onClick: (e: React.MouseEvent) => void;
}) => (
  <Button 
    size="icon" 
    onClick={onClick}
    variant="ghost" 
    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full"
  >
    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
  </Button>
));

const ActionButton = memo(({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "outline",
  className = "text-black"
}: { 
  icon: any; 
  label: string; 
  onClick: (e: React.MouseEvent) => void | Promise<void>;
  variant?: "outline" | "default" | "destructive";
  className?: string;
}) => (
  <Button 
    size="sm" 
    variant={variant}
    className={className}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
));

const CarCard = memo(function CarCard({ car, variant = "grid" }: CarCardProps) {
  const router = useRouter();
  const t = useTranslations("CarListing");
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
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

  const handleFavoriteToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(car.slug) 
        ? prev.filter(favslug => favslug !== car.slug)
        : [...prev, car.slug];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }, [car.slug]);

  const handleContactSeller = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/send-email`, {
        method: 'POST',
        body: JSON.stringify({ slug: car.slug.toString() }),
      });
      if (response.ok) {
        toast.success(t('email_sent'));
      } else {
        toast.error(t('email_failed'));
      }
    } catch (error) {
      toast.error(t('email_failed'));
    }
  }, [car.slug, t]);

  const handleViewDetails = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/car-details/${car.slug}`);
  }, [car.slug, router]);

  const handleCompareToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison(car.slug.toString())) {
      removeFromComparison(car.slug.toString());
      toast.success(t('removed_from_comparison'));
    } else {
      addToComparison(car);
      toast.success(t('added_to_comparison'));
    }
  }, [car, isInComparison, removeFromComparison, addToComparison, t]);

  const renderFeatures = useCallback(() => {
    if (!car.features?.length) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {car.features.slice(0, 3).map((feature, index) => (
          <Badge key={index} variant="outline" className="flex items-center gap-1">
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
    );
  }, [car.features]);

  const grslugContent = (
    <Card className={`rounded-t-lg overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 max-w-[350px] max-h-[500px] min-h-[450px] ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="relative">
        <Img
          width={1920}
          height={1080}
          external={true}
          src={car.mainImage}
          alt={car.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <FavoriteButton isFavorite={favorites.includes(car.slug)} onClick={(e) => handleFavoriteToggle(e)} />
        {car.isPro && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
            Pro
          </Badge>
        )}
        <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} p-3`}>
          <Badge className="bg-gray-700 text-white">{car.year}</Badge>
          <Badge className={`bg-gray-700 ${isRTL ? 'mr-2' : 'ml-2'} text-white`}>{car.mileage}</Badge>
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col pt-4 px-4">
        <h3 className="text-lg font-semibold text-black mb-1">{car.title}</h3>
        <div className="flex items-center text-gray-500 mb-3 text-sm w-full">
          <div className={`flex items-center gap-2 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Car size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span>{car.bodyType}</span>
          </div>
          <span className="mx-2">•</span>
          <div className={`flex items-center gap-2 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Fuel size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span>{car.fuelType}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{car.description}</p>
        <PriceDisplay price={car.price} className="text-green-600 text-xl font-bold w-full flex justify-center items-center mb-4" />
        {car.location && <span className="text-sm text-gray-500 mb-4">{car.location}</span>}
        <div className="mt-auto flex flex-col w-full space-y-3">
          <div className="grid grid-cols-2 gap-2 w-full">
            <ActionButton 
              icon={MessageSquare}
              label={t('contact')}
              onClick={handleContactSeller}
              className="flex items-center justify-center  w-full text-sm"
            />
             <ActionButton
            icon={Scale}
            label={isInComparison(car.id.toString()) ? t('remove_from_comparison') : t('add_to_comparison')}
            onClick={handleCompareToggle}
            variant={isInComparison(car.id.toString()) ? "destructive" : "outline"}
            className="flex items-center justify-center gap-2 w-full text-sm"
          />
          
          </div>
          <ActionButton 
              icon={Car}
              label={t('view_details')}
              onClick={handleViewDetails}
              className="flex items-center justify-center w-full text-sm"
            />
        </div>
      </CardContent>
    </Card>
  );

  const listContent = (
    <Card className={`overflow-hslugden hover:shadow-lg transition-shadow duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
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
          <FavoriteButton isFavorite={favorites.includes(car.slug)} onClick={handleFavoriteToggle} />
        </div>
        <CardContent className="md:w-2/3 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-black mb-1">{car.title}</h3>
              <div className="flex items-center text-gray-500 mb-2 text-sm">
                <Car size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span>{car.bodyType}</span>
                <span className="mx-2">•</span>
                <Calendar size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span>{car.year}</span>
                <span className="mx-2">•</span>
                <Gauge size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span>{car.mileage}</span>
                <span className="mx-2">•</span>
                <Fuel size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span>{car.fuelType}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-500 mb-4">{car.description}</p>
          {renderFeatures()}
          <div className="flex items-center justify-between mt-4 w-full">
            {car.location && <span className="text-sm text-gray-500">{car.location}</span>}
            <div className={`flex flex-col items-end `}>
              <PriceDisplay price={car.price} className="text-green-600 text-xl font-bold" />
              <div className={`flex ${isRTL ? 'space-x-reverse' : 'space-x-3'}`}>
                <ActionButton 
                  icon={MessageSquare}
                  label={t('contact')}
                  onClick={handleContactSeller}
                />
                <ActionButton 
                  icon={Car}
                  label={t('view_details')}
                  onClick={handleViewDetails}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <ActionButton
              icon={Scale}
              label={isInComparison(car.id.toString()) ? t('remove_from_comparison') : t('add_to_comparison')}
              onClick={handleCompareToggle}
              variant={isInComparison(car.id.toString()) ? "destructive" : "outline"}
              className="flex items-center "
            />
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
      {grslugContent}
    </motion.div>
  );
});

export default CarCard;
