import React from 'react';
import { motion } from 'framer-motion';
import { Img } from '../Img';
import { useTranslations } from 'next-intl';

export interface AdItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  buttonText: string;
  buttonColor: string;
  alt: string;
}

interface ContentAdsProps {
  layout?: 'grid-3' | 'grid-2' | 'mobile-banner' | 'hero-banner';
  ads: AdItem[];
  className?: string;
}

export const ContentAds: React.FC<ContentAdsProps> = ({ 
  layout = 'grid-3', 
  ads, 
  className = '' 
}) => {
  const t = useTranslations('HomePage');

  if (layout === 'mobile-banner') {
    return (
      <div className={`mb-6 px-4 lg:hidden ${className}`}>
        {ads.slice(0, 1).map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-${ad.categoryColor}-500 relative`}
          >
            <div className={`absolute top-2 right-2 bg-${ad.categoryColor}-500 text-white text-xs px-2 py-1 rounded-full`}>
              {"اعلان ممول"}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                                  <Img
                  src={`${ad.image}`}
                  alt={ad.alt}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  external={false}
                />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {ad.title}
                  </h4>
                  <p className="text-gray-600 text-xs mb-2">
                    {ad.description}
                  </p>
                  <button className={`text-${ad.categoryColor}-600 text-xs font-semibold`}>
                    {ad.buttonText} →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (layout === 'hero-banner') {
    const ad = ads[0];
    if (!ad) return null;

    return (
      <div className={`mb-6 px-4 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden relative"
        >
          <div className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {"اعلان ممول"}
          </div>
          <div className="flex flex-col md:flex-row items-center p-6">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <Img
                src={`${ad.image}`}
                alt={ad.alt}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-32 md:h-24"
                external={false}
              />
            </div>
            <div className="md:w-2/3 md:pl-6 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                {ad.title}
              </h3>
              <p className="text-blue-100 mb-4">
                {ad.description}
              </p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                {ad.buttonText} →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (layout === 'grid-2') {
    return (
      <div className={`my-8 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.slice(0, 2).map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative"
            >
              <div className={`absolute top-2 left-2 bg-${ad.categoryColor}-600 text-white text-xs px-2 py-1 rounded-full z-10`}>
                {"اعلان ممول"}
              </div>
              <div className="md:flex bg-white rounded-xl">
                <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative">
                  <Img
                    src={`${ad.image}`}
                    alt={ad.alt}
                    external={false}
                    width={512}
                    height={512}
                    className="object-cover w-full h-full md:h-48"
                  />
                </div>
                <div className="mt-3 md:mt-0 md:w-2/3 md:p-4">
                  <div className={`text-sm text-${ad.categoryColor}-600 mb-1 font-semibold`}>
                    {"اعلان ممول"}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 px-2">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 px-2">
                    {ad.description}
                  </p>
                  <div className="text-sm text-gray-600 px-2">
                    <button className={`text-${ad.categoryColor}-600 hover:text-${ad.categoryColor}-700 font-medium`}>
                      {ad.buttonText} →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default: grid-3 layout
  return (
    <div className={`mb-12 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.slice(0, 3).map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative"
          >
            <div className={`absolute top-2 left-2 bg-${ad.categoryColor}-600 text-white text-xs px-2 py-1 rounded-full z-10`}>
              {"اعلان ممول"}
            </div>
            <div className="relative h-48">
              <Img
                src={`${ad.image}`}
                alt={ad.alt}
                className="object-cover w-full h-full"
                width={400}
                height={320}
                external={false}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium text-${ad.categoryColor}-600 bg-${ad.categoryColor}-50 px-2 py-1 rounded-full`}>
                  {ad.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {ad.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {ad.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {"اعلان ممول"}
                </span>
                <button className={`text-${ad.categoryColor}-600 hover:text-${ad.categoryColor}-700 text-sm font-medium`}>
                  {ad.buttonText} →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContentAds; 