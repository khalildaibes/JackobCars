"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Car, Fuel, Heart, MessageSquare, Scale, Gauge, Check, Calendar, User, Phone, Mail, Star, AlertTriangle } from "lucide-react";
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
    name: string;
    price: string | number;
    // New structure
    image?: {
      id: number;
      url: string;
      formats?: {
        thumbnail?: {
          url: string;
        };
      };
    };
    details?: {
      car: {
        name: string;
        year: number;
        miles: string;
        fuel_type: string;
        transmission: string;
        condition: string;
        body_type: string;
        engine_type: string;
        color: string;
        owner_name: string;
        owner_phone: string;
        owner_email: string;
        asking_price: string;
        trade_in: string;
        known_problems: string;
        manufacturer_name: string;
        commercial_nickname: string;
        year_of_production: string;
        trim_level: string;
        plate_number: string;
        description: string;
        features: Array<{
          label: string;
          value: string;
        }>;
        pros: string[];
        cons: string[];
        fuel: string;
        images: {
          main: number;
          additional: number[];
        };
      };
    };
    // Old structure compatibility
    title?: string;
    mainImage?: string;
    year?: number;
    mileage?: string;
    miles?: string; // Add miles field for compatibility
    fuelType?: string;
    make?: string;
    bodyType?: string;
    condition?: string;
    transmission?: string;
    description?: string;
    // Additional fields for compatibility
    asking_price?: string | number;
    owner_name?: string;
    owner_phone?: string;
    owner_email?: string;
    manufacturer_name?: string;
    commercial_nickname?: string;
    fuel_type?: string;
    pros?: string[];
    cons?: string[];
    features?: string[]; // Add features field for compatibility
    category?: string[]; // Add category field for compatibility
    store?: {
      hostname: string;
    };
    hostname?: string;
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
  const [showSellerInfo, setShowSellerInfo] = useState(false);

  // Safety check for data structure - more flexible to handle both old and new formats
  if (!car) {
    return (
      <div className="cd-card bg-gray-100 rounded-2xl p-6 text-center">
        <p className="text-gray-500">{t('loading') || 'Loading...'}</p>
      </div>
    );
  }

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
    const hostname = car.store?.hostname || car.hostname;
    router.push(`/car-details/${car.slug}?hostname=${hostname}`);
  }, [car.slug, car.store?.hostname, car.hostname, router]);

  const handleCallAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSellerInfo(!showSellerInfo);
  };

  // Helper functions - defined before they're used
  const getMainImage = () => {
    // Try new structure first
    if (car.image?.url) return car.image.url;
    if (car.image?.formats?.thumbnail?.url) return car.image.formats.thumbnail.url;
    
    // Try old structure
    if (car.mainImage) return car.mainImage;
    
    return '/placeholder-car.jpg'; // fallback image
  };

  const getFeatureValue = (label: string) => {
    const feature = car.details?.car?.features?.find(f => f.label === label);
    return feature?.value || '';
  };

  // Safe getter for car data with fallbacks - handles both old and new data structures
  const getCarData = (field: string, fallback: any = '') => {
    // Try old structure: car[field]
    if (car[field] !== undefined && car[field] !== '') {
      return car[field];
    }

    // Try new structure first: car.details.car[field]
    if (car.details?.car?.[field] !== undefined) {
      return car.details.car[field];
    }
    

    
    // Try mapping old field names to new ones
    const fieldMapping: { [key: string]: string } = {
      'title': 'name',
      'mainImage': 'image',
      'mileage': 'miles',
      'fuelType': 'fuel_type',
      'make': 'manufacturer_name',
      'bodyType': 'body_type'
    };
    
    const mappedField = fieldMapping[field];
    if (mappedField && car.details?.car?.[mappedField] !== undefined) {
      return car.details.car[mappedField];
    }
    
    return fallback;
  };

  const handleCompareToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison(car.slug.toString())) {
      removeFromComparison(car.slug.toString());
      toast.success(t('removed_from_comparison'));
    } else {
      addToComparison({
        id: car.slug.toString(),
        title: getCarData('name', car.name),
        price: getCarData('asking_price', car.price?.toString()),
        year: getCarData('year'),
        mileage: getCarData('miles'),
        fuelType: getCarData('fuel_type') || getCarData('fuel'),
        transmission: getCarData('transmission'),
        image: car.image?.url || car.image?.formats?.thumbnail?.url || ''
      });
      toast.success(t('added_to_comparison'));
    }
  }, [car, isInComparison, addToComparison, removeFromComparison, t]);

  const formatPrice = (price: string | number) => {
    if (!price || price === '0' || price === 0) return t('price_on_request') || 'Price on request';
    
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    if (isNaN(numPrice)) return t('price_on_request') || 'Price on request';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'ar' ? 'ILS' : locale === 'he-IL' ? 'ILS' : 'USD',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const formatMileage = (mileage: string) => {
    if (!mileage) return t('mileage_unknown') || 'Unknown';
    const numMileage = parseFloat(mileage.replace(/[^\d.-]/g, ''));
    if (isNaN(numMileage)) return mileage;
    return new Intl.NumberFormat(locale).format(numMileage) + ' km';
  };

  const isNew = (car.details?.car?.condition?.toLowerCase() === 'new' || car.details?.car?.condition?.toLowerCase() === 'excellent') ||
                (car.condition?.toLowerCase() === 'new' || car.condition?.toLowerCase() === 'excellent');
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
              src={getMainImage()}
              alt={getCarData('name', car.name)}
              width={400}
              height={IMAGE_HEIGHT}
              external={true}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            {isNew && (
              <span className={badgeClass}>
                {t('excellent') || 'Excellent'}
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
              {getCarData('name', car.name)}
            </h3>
            <p className="cd-caption mb-2 text-gray-500">
            {getCarData('year')} • {getCarData('manufacturer_name') || getFeatureValue('الشركة المصنعة والموديل')} • {getFeatureValue('makeModel') || getCarData('commercial_nickname')}
            </p>
            <div className={priceClass + " mb-1"}>
              {formatPrice(getCarData('asking_price', car.price))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 w-full justify-items-center">
            <div className="flex flex-col items-center gap-1">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{formatMileage(getCarData('miles'))}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Fuel className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{getCarData('fuel_type') || getCarData('fuel') || getFeatureValue('نوع الوقود')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Car className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{getCarData('transmission') || getFeatureValue('ناقل الحركة')}</span>
            </div>
          </div>
{/*           
          {getCarData('owner_name') && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{getCarData('owner_name')}</span>
              {getCarData('owner_phone') && (
                <>
                  <Phone className="w-4 h-4" />
                  <span>{getCarData('owner_phone')}</span>
                </>
              )}
            </div>
          )} */}

          {/* Pros and Cons */}
          {(getCarData('pros')?.length > 0 || getCarData('cons')?.length > 0) && (
            <div className="flex gap-4 mb-3 text-xs">
              {getCarData('pros')?.length > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <Star className="w-3 h-3" />
                  <span>{getCarData('pros').length} {t('pros') || 'Pros'}</span>
                </div>
              )}
              {getCarData('cons')?.length > 0 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getCarData('cons').length} {t('cons') || 'Cons'}</span>
                </div>
              )}
            </div>
          )}

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
              onClick={handleCallAction}
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
              src={getMainImage()}
              external={true}
              alt={getCarData('name', car.name)}
              width={400}
              height={IMAGE_HEIGHT}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            {isNew && (
              <span className={badgeClass}>
                {t('excellent') || 'Excellent'}
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
              {getCarData('name', car.name)}
            </h3>
            <p className="cd-caption mb-2 text-gray-500">
              {getCarData('year')} • {getCarData('manufacturer_name') || getFeatureValue('الشركة المصنعة والموديل')} • {getFeatureValue('makeModel') || getCarData('commercial_nickname')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm w-full justify-items-center">
            <div className="flex flex-col items-center gap-1">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{formatMileage(getCarData('miles'))}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Fuel className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{getCarData('fuel_type') || getCarData('fuel') || getFeatureValue('نوع الوقود')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Car className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{getCarData('transmission') || getFeatureValue('ناقل الحركة')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Check className="w-5 h-5 text-gray-400" />
              <span className="cd-body-sm text-gray-700">{getCarData('condition') || getFeatureValue('الحالة الحالية')}</span>
            </div>
          </div>
{/* 
          {getCarData('owner_name') && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 justify-center">
              <User className="w-4 h-4" />
              <span>{getCarData('owner_name')}</span>
              {getCarData('owner_phone') && (
                <>
                  <Phone className="w-4 h-4" />
                  <span>{getCarData('owner_phone')}</span>
                </>
              )}
            </div>
          )} */}

          {/* Seller Info - Only shown when contact button is clicked */}
          {showSellerInfo && getCarData('owner_name') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <User className="w-4 h-4" />
                <span className="font-medium">{getCarData('owner_name')}</span>
                {getCarData('owner_phone') && (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>{getCarData('owner_phone')}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Pros and Cons */}
          {(getCarData('pros')?.length > 0 || getCarData('cons')?.length > 0) && (
            <div className="flex gap-4 mb-3 text-xs justify-center">
              {getCarData('pros')?.length > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <Star className="w-3 h-3" />
                  <span>{getCarData('pros').length} {t('pros') || 'Pros'}</span>
                </div>
              )}
              {getCarData('cons')?.length > 0 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getCarData('cons').length} {t('cons') || 'Cons'}</span>
                </div>
              )}
            </div>
          )}

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
            {formatPrice(getCarData('asking_price', car.price))}
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
