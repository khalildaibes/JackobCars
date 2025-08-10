"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Car, Fuel, Heart, MessageSquare, Scale, Gauge, Check } from "lucide-react";
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

const IMAGE_HEIGHT = 220; // px, static height for all images

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
      currency: locale === 'ar' ? 'ILS' : locale === 'he-IL' ? 'ILS' : 'USD',
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

  // Modern style classes
  const cardBase =
    "cd-card group cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 overflow-hidden";
  const imageWrapper =
    "cd-card-image relative flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-200";
  const contentBase =
    "cd-card-content flex flex-col items-center justify-center text-center w-full px-5 py-4";
  const badgeClass =
    "absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow";
  const favoriteBtn =
    "absolute top-3 right-3 p-2 rounded-full transition-colors shadow bg-white/80 hover:bg-white";
  const favoriteActive =
    "bg-red-500 text-white shadow-lg";
  const compareBtn =
    "p-2 rounded-lg transition-colors hover:bg-blue-50 text-blue-600";
  const compareActive =
    "bg-blue-600 text-white";
  const contactBtn =
    "p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-500";
  const priceClass =
    "cd-heading-md font-bold text-gray-900";
  const viewDetailsBtn =
    "w-full mt-4 cd-btn cd-btn-outline border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-semibold rounded-lg py-2";

  if (variant === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className={cardBase + " flex flex-col md:flex-row"}
        onClick={handleViewDetails}
      >
        <div className="md:w-2/5 flex items-center justify-center">
          <div
            className={imageWrapper}
            style={{ height: IMAGE_HEIGHT, minHeight: IMAGE_HEIGHT, maxHeight: IMAGE_HEIGHT }}
          >
            <Img
              src={car.mainImage}
              alt={car.title}
              width={400}
              height={IMAGE_HEIGHT}
              external={true}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            {isNew && (
              <span className={badgeClass}>
                {t('new')}
              </span>
            )}
            <button
              onClick={handleFavoriteToggle}
              className={
                favoriteBtn +
                (isFavorite ? " " + favoriteActive : " text-gray-600")
              }
              aria-label={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className={contentBase + " md:w-3/5"}>
          <div className="flex flex-col items-center justify-center mb-3 w-full">
            <h3 className="cd-heading-md mb-1 line-clamp-1 group-hover:text-red-600 transition-colors font-semibold">
              {car.title}
            </h3>
            <p className="cd-caption mb-2 text-gray-500">
              {car.year} • {car.make} • {car.bodyType}
            </p>
            <div className={priceClass + " mb-1"}>
              {formatPrice(car.price)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 w-full justify-items-center">
            <div className="flex flex-col items-center gap-1">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Fuel className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{car.fuelType}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Car className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{car.transmission}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full mt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCompareToggle}
                className={
                  compareBtn +
                  (inComparison ? " " + compareActive : "")
                }
                title={t('compare')}
                aria-label={t('compare')}
              >
                <Scale className="w-5 h-5" />
              </button>
              <button
                className={contactBtn}
                title={t('contact')}
                aria-label={t('contact')}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={handleViewDetails}
              className="text-red-500 font-semibold text-sm hover:text-red-700 transition-colors flex items-center gap-1"
            >
              {t('view_details')}
              <span aria-hidden>→</span>
            </button>
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
      className={cardBase + " flex flex-col items-center"}
      onClick={handleViewDetails}
    >
      <div className="relative w-full flex items-center justify-center">
        <div
          className={imageWrapper}
          style={{ height: IMAGE_HEIGHT, minHeight: IMAGE_HEIGHT, maxHeight: IMAGE_HEIGHT }}
        >
          <Img
            src={car.mainImage}
            external={true}
            alt={car.title}
            width={400}
            height={IMAGE_HEIGHT}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <span className={badgeClass}>
              {t('new')}
            </span>
          )}
          <button
            onClick={handleFavoriteToggle}
            className={
              favoriteBtn +
              (isFavorite ? " " + favoriteActive : " text-gray-600")
            }
            aria-label={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      <div className={contentBase}>
        <div className="flex flex-col items-center justify-center mb-3 w-full">
          <h3 className="cd-heading-md mb-1 line-clamp-2 group-hover:text-red-600 transition-colors font-semibold">
            {car.title}
          </h3>
          <p className="cd-caption mb-2 text-gray-500">
            {car.year} • {car.make} • {car.bodyType}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm w-full justify-items-center">
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-5 h-5 text-gray-400" />
            <span className="cd-body-sm text-gray-700">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-5 h-5 text-gray-400" />
            <span className="cd-body-sm text-gray-700">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Car className="w-5 h-5 text-gray-400" />
            <span className="cd-body-sm text-gray-700">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Check className="w-5 h-5 text-gray-400" />
            <span className="cd-body-sm text-gray-700">{car.condition}</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-2">
         
          <div className="flex items-center gap-4 justify-center w-full">
            <button
              onClick={handleCompareToggle}
              className={
                compareBtn +
                (inComparison ? " " + compareActive : "") +
                " bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-2 transition-colors duration-200"
              }
              title={t('add_to_compare')}
              aria-label={t('add_to_compare')}
              type="button"
            >
              <div className="flex items-center justify-center">
                <Scale className="w-5 h-5" />
                <span className="ml-1">{t('add_to_compare')}</span>
              </div>
            </button>
            <button
              className={
                contactBtn +
                " bg-green-100 hover:bg-green-200 text-green-700 rounded-lg px-3 py-2 transition-colors duration-200"
              }
              title={t('message_owner')}
              aria-label={t('message_owner')}
              type="button"
            >
              <div className="flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
                <span className="ml-1">{t('message_owner')}</span>
              </div>
            </button>
          </div>
        </div>
        <div className={priceClass}>
            {formatPrice(car.price)}
          </div>
        <button 
          onClick={handleViewDetails}
          className={viewDetailsBtn}
        >
          {t('view_details')}
        </button>
      </div>
    </motion.article>
  );
});

export default CarCard;
