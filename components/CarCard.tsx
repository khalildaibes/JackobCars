"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Car, Fuel, Heart, MessageSquare, Scale, Calendar, Gauge, Check, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import { useComparison } from "../context/ComparisonContext";

// Lazy load the Img component
const Img = dynamic(() => import("./Img").then(mod => ({ default: mod.Img })), {
  loading: () => <div className="cd-card-image cd-skeleton" />,
  ssr: false
}) as React.FC<{
  className?: string;
  src: string;
  alt: string;
  external?: boolean;
  width: number;
  height: number;
}>;

interface CarCardProps {
  car: {
    id: string | number;
    slug: string | number;
    mainImage: string;
    title: string;
    year: number;
    mileage: string;
    fuelType: string;
    make: string;
    price: string;
    condition: string;
    transmission: string;
    bodyType: string;
    hostname: string;
    description?: string;
    features?: string[];
    category?: string[];
  };
  variant?: "grid" | "list";
}

const CarCard = memo(function CarCard({ car, variant = "grid" }: CarCardProps) {
  const router = useRouter();
  const t = useTranslations("CarListing");
  const locale = useLocale();
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
    toast.success(
      favorites.includes(car.slug) 
        ? t('removed_from_favorites') 
        : t('added_to_favorites')
    );
  }, [car.slug, favorites, t]);

  const handleViewDetails = useCallback(() => {
    router.push(`/car-details/${car.slug}?hostname=${car.hostname}`);
  }, [car.slug, car.hostname, router]);

  const handleCompareToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison(car.slug.toString())) {
      removeFromComparison(car.slug.toString());
      toast.success(t('removed_from_comparison'));
    } else {
      addToComparison({
        id: car.slug.toString(),
        title: car.title,
        price: car.price,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        image: car.mainImage
      });
      toast.success(t('added_to_comparison'));
    }
  }, [car, isInComparison, addToComparison, removeFromComparison, t]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'ar' ? 'SAR' : locale === 'he-IL' ? 'ILS' : 'USD',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const formatMileage = (mileage: string) => {
    const numMileage = parseFloat(mileage.replace(/[^\d.-]/g, ''));
    if (isNaN(numMileage)) return mileage;
    return new Intl.NumberFormat(locale).format(numMileage) + ' km';
  };

  const isNew = car.condition?.toLowerCase() === 'new';
  const isFavorite = favorites.includes(car.slug);
  const inComparison = isInComparison(car.slug.toString());

  if (variant === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="cd-card group cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="md:flex">
          <div className="md:w-2/5 relative">
            <div className="cd-card-image relative overflow-hidden">
              <Img
                src={car.mainImage}
                alt={car.title}
                width={400}
                height={250}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isNew && (
                <span className="absolute top-3 left-3 cd-tag">
                  {t('new')}
                </span>
              )}
              <button
                onClick={handleFavoriteToggle}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="md:w-3/5 cd-card-content">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="cd-heading-xs mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">
                  {car.title}
                </h3>
                <p className="cd-caption mb-2">
                  {car.year} • {car.make} • {car.bodyType}
                </p>
              </div>
              <div className="text-right">
                <div className="cd-heading-sm text-red-600 mb-1">
                  {formatPrice(car.price)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-400" />
                <span className="cd-body-sm">{formatMileage(car.mileage)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-gray-400" />
                <span className="cd-body-sm">{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="cd-body-sm">{car.transmission}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCompareToggle}
                  className={`cd-btn-secondary p-2 rounded-lg transition-colors ${
                    inComparison ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                  title={t('compare')}
                >
                  <Scale className="w-4 h-4" />
                </button>
                <button
                  className="cd-btn-secondary p-2 rounded-lg"
                  title={t('contact')}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleViewDetails}
                className="text-red-600 font-medium text-sm hover:text-red-700 transition-colors"
              >
                {t('view_details')} →
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Grid variant (default)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="cd-card group cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative">
        <div className="cd-card-image relative overflow-hidden">
          <Img
            src={car.mainImage}
            alt={car.title}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <span className="absolute top-3 left-3 cd-tag">
              {t('new')}
            </span>
          )}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="cd-card-content">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="cd-heading-xs mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
              {car.title}
            </h3>
            <p className="cd-caption mb-2">
              {car.year} • {car.make} • {car.bodyType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="cd-body-sm">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="cd-body-sm">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-400" />
            <span className="cd-body-sm">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-gray-400" />
            <span className="cd-body-sm">{car.condition}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="cd-heading-sm text-red-600">
            {formatPrice(car.price)}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompareToggle}
              className={`p-2 rounded-lg transition-colors ${
                inComparison 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-50 text-gray-400'
              }`}
              title={t('compare')}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-400"
              title={t('contact')}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={handleViewDetails}
          className="w-full mt-4 cd-btn cd-btn-outline"
        >
          {t('view_details')}
        </button>
      </div>
    </motion.article>
  );
});

export default CarCard;
