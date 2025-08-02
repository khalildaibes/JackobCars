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

  const handleAdClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`w-[12%] min-w-[160px] bg-white/10 mt-[4%] backdrop-blur-sm p-3.2 hidden lg:flex lg:flex-col sidebar-ads-container ads-fixed-container ${className}`} data-sidebar-position={position}>
      <div className="sidebar-ads-sticky">
       
        <div className="space-y-6 mt-4">
          {ads.map((ad) => (
            <div 
              key={ad.id} 
              className="bg-white/5 rounded-lg overflow-hidden mb-4 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:shadow-lg"
              onClick={() => handleAdClick(ad.url)}
            >
              <div className="aspect-video relative">
                <Img
                  src={`${ad.image}`}
                  alt={ad.alt}
                  width={205}
                  height={115}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-3 ads-arabic-text">
                <h3 className="text-gray-800 font-medium mb-2">{ad.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                <button className={`w-full bg-${ad.categoryColor}-600 text-white py-2 rounded-lg hover:bg-${ad.categoryColor}-700 transition-colors arabic-ad-button`}>
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