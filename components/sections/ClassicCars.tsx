'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Gauge, Fuel, Cog, Star, ArrowRight, Badge, Award } from 'lucide-react';
import { Img } from '../Img';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

interface ClassicCar {
  id: string;
  name: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  price: number;
  imageUrl: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  isRare?: boolean;
  rating?: number;
  store: {
    name: string;
    hostname: string;
  };
}

interface ClassicCarsProps {
  cars?: ClassicCar[];
  title?: string;
  viewAllLink?: string;
}

// Fetch function for classic cars from Strapi
const fetchClassicCars = async (): Promise<ClassicCar[]> => {
  const response = await fetch('/api/deals?limit=12&sort=createdAt:desc');
  if (!response.ok) throw new Error('Failed to fetch classic cars');
  
  const data = await response.json();
  if (!data?.data) return [];
  
  // Filter for classic cars (older than 25 years or with classic categories)
  const currentYear = new Date().getFullYear();
  const classicCars = data.data.filter((car: any) => {
    const carYear = car.details?.car?.year || 0;
    const isVintage = (currentYear - carYear) >= 25;
    const hasClassicCategory = car.categories?.toLowerCase().includes('classic') || 
                              car.categories?.toLowerCase().includes('vintage') ||
                              car.categories?.toLowerCase().includes('antique');
    return isVintage || hasClassicCategory;
  });
  
  // Transform Strapi products to ClassicCar format
  return classicCars.slice(0, 8).map((car: any) => ({
    id: car.id,
    name: car.name || 'Classic Vehicle',
    slug: car.slug || '',
    year: car.details?.car?.year || 1990,
    make: extractMake(car.name),
    model: extractModel(car.name),
    price: car.price || 0,
    imageUrl: car.image?.url || '',
    mileage: car.details?.car?.miles || 'Unknown',
    transmission: car.details?.car?.transmission || 'Manual',
    fuelType: car.details?.car?.fuel || 'Gasoline',
    condition: car.details?.car?.condition || 'Restored',
    location: car.store?.name || 'Available',
    description: car.details?.car?.description || 'Beautiful classic vehicle in excellent condition.',
    features: car.details?.car?.features?.map((f: any) => f.value) || [],
    isRare: Math.random() > 0.7, // Random rare flag for demo
    rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
    store: {
      name: car.store?.name || 'Classic Cars Dealer',
      hostname: car.store?.hostname || ''
    }
  }));
};

// Helper functions to extract make and model
const extractMake = (name: string): string => {
  const makes = ['Ford', 'Chevrolet', 'Dodge', 'Plymouth', 'Buick', 'Cadillac', 'Chrysler', 'Pontiac', 'Oldsmobile', 'Mercury', 'Porsche', 'Jaguar', 'BMW', 'Mercedes-Benz', 'Ferrari', 'Lamborghini', 'Aston Martin'];
  const found = makes.find(make => name.toLowerCase().includes(make.toLowerCase()));
  return found || 'Classic';
};

const extractModel = (name: string): string => {
  const models = ['Mustang', 'Camaro', 'Corvette', 'Challenger', 'Charger', 'GTO', 'Firebird', 'Trans Am', '911', 'E-Type', 'M3', 'SL', 'Testarossa', 'Countach', 'DB5'];
  const found = models.find(model => name.toLowerCase().includes(model.toLowerCase()));
  return found || 'Classic';
};

const ClassicCars: React.FC<ClassicCarsProps> = ({
  cars,
  title,
  viewAllLink = '/cars?category=classic'
}) => {
  const t = useTranslations('ClassicCars');
  
  // Use React Query to fetch classic cars
  const { data: fetchedCars, isLoading, error } = useQuery({
    queryKey: ['classicCars'],
    queryFn: fetchClassicCars,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const carsToShow = cars || fetchedCars || [];

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'concours': return 'bg-purple-100 text-purple-800';
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'very good': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'project': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error || carsToShow.length === 0) {
    return null; // Don't render if no cars available
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title || t('title')}</h2>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <Link 
          href={viewAllLink}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          {t('browse_classics')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {carsToShow.slice(0, 4).map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
            <Link href={`/car-details/${car.slug}`}>
              <div className="relative h-48">
                <Img
                  src={car.imageUrl ? `http://${car.store.hostname}${car.imageUrl}` : '/images/default-classic-car.jpg'}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  width={1290}
                  height={1290}
                  external={true}
                />
                
                {/* Car badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {car.isRare && (
                    <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {t('rare')}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(car.condition)}`}>
                    {car.condition}
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {formatPrice(car.price)}
                </div>

                {/* Year badge */}
                <div className="absolute bottom-3 left-3 bg-amber-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {car.year}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {car.year} {car.make} {car.model}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {car.description}
                </p>

                {/* Car specs */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      <span>{car.mileage}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cog className="w-3 h-3" />
                      <span>{car.transmission}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3 h-3" />
                      <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{car.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating and store */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{car.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{car.store.name}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Featured classic showcase */}
      {carsToShow.length > 4 && (
        <div className="mt-8 pt-6 border-t border-amber-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('featured_classic')}</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Img
                  src={carsToShow[4].imageUrl ? `http://${carsToShow[4].store.hostname}${carsToShow[4].imageUrl}` : '/images/default-classic-car.jpg'}
                  alt={`${carsToShow[4].year} ${carsToShow[4].make} ${carsToShow[4].model}`}
                  className="object-cover w-full h-64 md:h-full"
                  width={1290}
                  height={1290}
                  external={true}
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">
                    {carsToShow[4].year} {carsToShow[4].make} {carsToShow[4].model}
                  </h4>
                  {carsToShow[4].isRare && (
                    <Badge className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <p className="text-gray-600 mb-4">{carsToShow[4].description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{carsToShow[4].year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="w-4 h-4 text-amber-600" />
                      <span>{carsToShow[4].mileage}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Cog className="w-4 h-4 text-amber-600" />
                      <span>{carsToShow[4].transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Fuel className="w-4 h-4 text-amber-600" />
                      <span>{carsToShow[4].fuelType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">
                    {formatPrice(carsToShow[4].price)}
                  </span>
                  <Link 
                    href={`/car-details/${carsToShow[4].slug}`}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {t('view_details')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ClassicCars; 