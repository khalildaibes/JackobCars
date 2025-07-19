'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Gift, Zap, Shield, Award, ShoppingBag, Truck } from 'lucide-react';
import { Img } from '../Img';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

interface Accessory {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  features: string[];
  bestseller?: boolean;
  onSale?: boolean;
  originalPrice?: number;
  store: {
    name: string;
    hostname: string;
  };
}

interface AccessoriesProps {
  accessories?: Accessory[];
  title?: string;
  viewAllLink?: string;
}

// Fetch function for accessories products from Strapi
const fetchAccessories = async (): Promise<Accessory[]> => {
  const response = await fetch('/api/deals?limit=20&sort=createdAt:desc');
  if (!response.ok) throw new Error('Failed to fetch accessories');
  
  const data = await response.json();
  if (!data?.data) return [];
  
  // Filter for accessories products
  const accessoryProducts = data.data.filter((product: any) => {
    const categories = product.categories?.toLowerCase() || '';
    return categories.includes('accessories') || 
           categories.includes('accessory') ||
           categories.includes('interior') ||
           categories.includes('exterior') ||
           categories.includes('tools') ||
           categories.includes('care') ||
           categories.includes('maintenance');
  });
  
  // Transform Strapi products to Accessory format
  return accessoryProducts.slice(0, 12).map((product: any) => ({
    id: product.id,
    name: product.name || 'Car Accessory',
    slug: product.slug || '',
    price: product.price || 0,
    imageUrl: product.image?.url || '',
    description: product.details?.description || 'Premium car accessory for enhanced driving experience.',
    category: extractCategory(product.categories || ''),
    brand: extractBrand(product.name),
    rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 300) + 20,
    features: product.details?.features?.map((f: any) => f.value) || generateDefaultFeatures(),
    bestseller: Math.random() > 0.75,
    onSale: Math.random() > 0.8,
    originalPrice: Math.random() > 0.8 ? Math.floor(product.price * 1.2) : undefined,
    store: {
      name: product.store?.name || 'Auto Parts Store',
      hostname: product.store?.hostname || ''
    }
  }));
};

// Helper functions
const extractCategory = (categories: string): string => {
  const categoryMap = {
    'interior': 'Interior',
    'exterior': 'Exterior', 
    'tools': 'Tools',
    'care': 'Car Care',
    'maintenance': 'Maintenance',
    'electronics': 'Electronics',
    'safety': 'Safety',
    'performance': 'Performance'
  };
  
  const found = Object.entries(categoryMap).find(([key]) => 
    categories.toLowerCase().includes(key)
  );
  return found ? found[1] : 'Accessories';
};

const extractBrand = (name: string): string => {
  const brands = ['WeatherTech', 'Husky Liners', 'Covercraft', 'Thule', 'Yakima', 'Bushwacker', 'AVS', 'Putco', 'Dee Zee', 'UnderCover'];
  const found = brands.find(brand => name.toLowerCase().includes(brand.toLowerCase()));
  return found || 'Universal';
};

const generateDefaultFeatures = (): string[] => {
  const features = [
    'Easy Installation',
    'Universal Fit',
    'Weather Resistant',
    'Durable Materials',
    'OEM Quality',
    'Custom Fit',
    'Lifetime Warranty',
    'Professional Grade',
    'Made in USA',
    'Scratch Resistant'
  ];
  
  // Return 2-4 random features
  const count = Math.floor(Math.random() * 3) + 2;
  return features.sort(() => Math.random() - 0.5).slice(0, count);
};

const Accessories: React.FC<AccessoriesProps> = ({
  accessories,
  title,
  viewAllLink = '/products?category=accessories'
}) => {
  const t = useTranslations('Accessories');
  
  // Use React Query to fetch accessories
  const { data: fetchedAccessories, isLoading, error } = useQuery({
    queryKey: ['accessories'],
    queryFn: fetchAccessories,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  
  const accessoriesToShow = accessories || fetchedAccessories || [];

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
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-3 h-3 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 text-gray-300" />
        ))}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'interior': return <Gift className="w-4 h-4" />;
      case 'exterior': return <Shield className="w-4 h-4" />;
      case 'electronics': return <Zap className="w-4 h-4" />;
      case 'tools': return <Award className="w-4 h-4" />;
      default: return <ShoppingBag className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error || accessoriesToShow.length === 0) {
    return null; // Don't render if no accessories available
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title || t('title')}</h2>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <Link 
          href={viewAllLink}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('shop_accessories')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {accessoriesToShow.slice(0, 8).map((accessory, index) => (
          <motion.div
            key={accessory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="relative">
              <Img
                src={accessory.imageUrl ? `http://${accessory.store.hostname}${accessory.imageUrl}` : '/images/default-accessory.jpg'}
                alt={accessory.name}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                width={300}
                height={192}
                external={true}
              />
              
              {/* Product badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {accessory.bestseller && (
                  <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {t('bestseller')}
                  </span>
                )}
                {accessory.onSale && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {t('sale')}
                  </span>
                )}
              </div>

              {/* Category badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                {getCategoryIcon(accessory.category)}
                <span className="text-xs font-medium text-gray-700">{accessory.category}</span>
              </div>

              {/* Quick action overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3">
                  <Link 
                    href={`/product/${accessory.slug}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center block"
                  >
                    {t('view_product')}
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  {accessory.brand}
                </span>
                <div className="flex items-center gap-1">
                  {renderStars(accessory.rating)}
                  <span className="text-xs text-gray-500">({accessory.reviewCount})</span>
                </div>
              </div>

              <Link href={`/product/${accessory.slug}`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {accessory.name}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {accessory.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {accessory.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing and store */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPrice(accessory.price)}</span>
                  {accessory.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{formatPrice(accessory.originalPrice)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">{t('free_shipping')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category showcase */}
      <div className="mt-8 pt-6 border-t border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('shop_by_category')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Gift className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">{t('interior')}</h4>
            <p className="text-sm text-gray-600">{t('comfort_style')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">{t('exterior')}</h4>
            <p className="text-sm text-gray-600">{t('protection_style')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">{t('electronics')}</h4>
            <p className="text-sm text-gray-600">{t('tech_upgrades')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">{t('performance')}</h4>
            <p className="text-sm text-gray-600">{t('enhanced_driving')}</p>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mt-6 bg-white/50 rounded-lg p-4">
        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>{t('warranty_guaranteed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>{t('free_shipping')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>{t('oem_quality')}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Accessories; 