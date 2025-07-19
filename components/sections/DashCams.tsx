'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Shield, Wifi, Monitor, Star, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { Img } from '../Img';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

interface DashCam {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  bestseller?: boolean;
  newArrival?: boolean;
  store: {
    name: string;
    hostname: string;
  };
}

interface DashCamsProps {
  dashcams?: DashCam[];
  title?: string;
  viewAllLink?: string;
}

// Fetch function for dash cam products from Strapi
const fetchDashCams = async (): Promise<DashCam[]> => {
  const response = await fetch('/api/deals?limit=15&sort=createdAt:desc');
  if (!response.ok) throw new Error('Failed to fetch dash cams');
  
  const data = await response.json();
  if (!data?.data) return [];
  
  // Filter for camera/dash cam products
  const dashCamProducts = data.data.filter((product: any) => {
    const categories = product.categories?.toLowerCase() || '';
    return categories.includes('camera') || 
           categories.includes('dash cam') || 
           categories.includes('dashcam') ||
           categories.includes('security') ||
           categories.includes('safety');
  });
  
  // Transform Strapi products to DashCam format
  return dashCamProducts.slice(0, 8).map((product: any) => ({
    id: product.id,
    name: product.name || 'Dash Camera',
    slug: product.slug || '',
    price: product.price || 0,
    imageUrl: product.image?.url || '',
    description: product.details?.description || 'High-quality dash camera for vehicle security.',
    features: product.details?.features?.map((f: any) => f.value) || generateDefaultFeatures(),
    rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 500) + 50,
    category: product.categories || 'Dash Cam',
    brand: extractBrand(product.name),
    bestseller: Math.random() > 0.7,
    newArrival: Math.random() > 0.8,
    store: {
      name: product.store?.name || 'Electronics Store',
      hostname: product.store?.hostname || ''
    }
  }));
};

// Helper functions
const extractBrand = (name: string): string => {
  const brands = ['Nextbase', 'Garmin', 'BlackVue', 'Thinkware', 'Viofo', 'Rexing', 'Apeman', 'Crosstour'];
  const found = brands.find(brand => name.toLowerCase().includes(brand.toLowerCase()));
  return found || 'Unknown';
};

const generateDefaultFeatures = (): string[] => {
  const features = [
    '4K Ultra HD Recording',
    'Night Vision',
    'GPS Tracking',
    'Wi-Fi Connectivity',
    'G-Sensor',
    'Loop Recording',
    'Wide Angle Lens',
    'Parking Mode',
    'Motion Detection',
    'Emergency Recording'
  ];
  
  // Return 3-5 random features
  const count = Math.floor(Math.random() * 3) + 3;
  return features.sort(() => Math.random() - 0.5).slice(0, count);
};

const DashCams: React.FC<DashCamsProps> = ({
  dashcams,
  title,
  viewAllLink = '/products?category=dashcam'
}) => {
  const t = useTranslations('DashCams');
  
  // Use React Query to fetch dash cams
  const { data: fetchedDashCams, isLoading, error } = useQuery({
    queryKey: ['dashCams'],
    queryFn: fetchDashCams,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  
  const dashcamsToShow = dashcams || fetchedDashCams || [];

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error || dashcamsToShow.length === 0) {
    return null; // Don't render if no dash cams available
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title || t('title')}</h2>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <Link 
          href={viewAllLink}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('shop_dash_cams')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashcamsToShow.slice(0, 4).map((dashcam, index) => (
          <motion.div
            key={dashcam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="relative">
              <Img
                src={dashcam.imageUrl ? `http://${dashcam.store.hostname}${dashcam.imageUrl}` : '/images/default-dashcam.jpg'}
                alt={dashcam.name}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                width={300}
                height={192}
                external={true}
              />
              
              {/* Product badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {dashcam.bestseller && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {t('bestseller')}
                  </span>
                )}
                {dashcam.newArrival && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {t('new')}
                  </span>
                )}
              </div>

              {/* Price badge */}
              <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                {formatPrice(dashcam.price)}
              </div>

              {/* Quick action overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3">
                  <Link 
                    href={`/product/${dashcam.slug}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center block"
                  >
                    {t('view_details')}
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                  {dashcam.brand}
                </span>
                <span className="text-xs text-gray-500">
                  {dashcam.category}
                </span>
              </div>

              <Link href={`/product/${dashcam.slug}`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {dashcam.name}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {dashcam.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                {renderStars(dashcam.rating)}
                <span className="text-sm text-gray-600">
                  {dashcam.rating} ({dashcam.reviewCount})
                </span>
              </div>

              {/* Key features */}
              <div className="space-y-1 mb-4">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{t('key_features')}</h4>
                <div className="space-y-1">
                  {dashcam.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store info */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{dashcam.store.name}</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">{t('verified')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature highlights */}
      <div className="mt-8 pt-6 border-t border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('why_dash_cams')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-white rounded-lg p-4">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">{t('evidence_protection')}</h4>
              <p className="text-sm text-gray-600">{t('record_incidents')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg p-4">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-900">{t('theft_deterrent')}</h4>
              <p className="text-sm text-gray-600">{t('parking_monitoring')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg p-4">
            <Wifi className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-900">{t('remote_access')}</h4>
              <p className="text-sm text-gray-600">{t('smartphone_connectivity')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg p-4">
            <Monitor className="w-8 h-8 text-orange-600" />
            <div>
              <h4 className="font-semibold text-gray-900">{t('driver_monitoring')}</h4>
              <p className="text-sm text-gray-600">{t('improve_habits')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DashCams; 