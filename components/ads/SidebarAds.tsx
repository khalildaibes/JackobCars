import React from 'react';
import { Img } from '../Img';
import { useTranslations } from 'next-intl';
import { AdItem } from './ContentAds';

interface SidebarAdsProps {
  ads: AdItem[];
  title: string;
  position?: 'left' | 'right';
  className?: string;
}

export const SidebarAds: React.FC<SidebarAdsProps> = ({ 
  ads, 
  title, 
  position = 'left',
  className = '' 
}) => {
  const t = useTranslations('HomePage');

  return (
    <div className={`w-[15%] bg-white/10 mt-[5%] backdrop-blur-sm ${position === 'left' ? 'border-r' : 'border-l'} border-gray-200/20 p-4 hidden lg:block sidebar-ads-container ads-fixed-container ${className}`}>
      <div className="sidebar-ads-sticky">
        <h2 className="text-l text-blue-800 font-bold mb-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-2">
          {title}
        </h2>
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white/5 rounded-lg overflow-hidden ad-card">
              <div className="aspect-video relative">
                <Img
                  src={`${ad.image}`}
                  alt={ad.alt}
                  width={256}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-3 ads-arabic-text">
                <h3 className="text-gray-800 font-medium">{ad.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
                <button className={`mt-2 w-full bg-${ad.categoryColor}-600 text-white py-2 rounded-lg hover:bg-${ad.categoryColor}-700 transition-colors arabic-ad-button`}>
                  {ad.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarAds; 