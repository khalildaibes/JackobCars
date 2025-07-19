'use client';

import React from 'react';
import AdContainer, { AdConfig } from './AdContainer';

export type AdPosition = 'top-banner' | 'sidebar' | 'in-content' | 'bottom-banner' | 'mobile-banner';

interface ResponsiveAdProps {
  position: AdPosition;
  className?: string;
  enableGoogleAds?: boolean;
  enableBannerAds?: boolean;
  adSlot?: string;
  adClient?: string;
}

const ResponsiveAd: React.FC<ResponsiveAdProps> = ({
  position,
  className = '',
  enableGoogleAds = true,
  enableBannerAds = true,
  adSlot,
  adClient
}) => {
  // Generate ad configurations based on position
  const generateAdConfigs = (): AdConfig[] => {
    const configs: AdConfig[] = [];

    if (enableGoogleAds && adSlot) {
      let adFormat: 'auto' | 'rectangle' | 'vertical' | 'horizontal' = 'auto';
      
      switch (position) {
        case 'top-banner':
        case 'bottom-banner':
          adFormat = 'horizontal';
          break;
        case 'sidebar':
          adFormat = 'vertical';
          break;
        case 'in-content':
          adFormat = 'rectangle';
          break;
        case 'mobile-banner':
          adFormat = 'auto';
          break;
      }

      configs.push({
        id: `adsense-${position}`,
        type: 'adsense',
        priority: 10,
        enabled: true,
        adSlot,
        adFormat,
        adClient
      });
    }

    if (enableBannerAds) {
      // Fallback banner ads based on position
      const bannerAds = getBannerAdsByPosition(position);
      configs.push(...bannerAds);
    }

    return configs;
  };

  const getBannerAdsByPosition = (pos: AdPosition): AdConfig[] => {
    const bannerConfigs: AdConfig[] = [];
    
    switch (pos) {
      case 'top-banner':
        bannerConfigs.push({
          id: 'banner-top-1',
          type: 'banner',
          priority: 5,
          enabled: true,
          imageUrl: '/images/ads/top-banner-1.jpg',
          link: '/services',
          alt: 'Car Services Banner'
        });
        break;
        
      case 'sidebar':
        bannerConfigs.push(
          {
            id: 'banner-sidebar-1',
            type: 'banner',
            priority: 5,
            enabled: true,
            imageUrl: '/images/ads/sidebar-1.jpg',
            link: '/insurance',
            alt: 'Car Insurance Ad'
          },
          {
            id: 'banner-sidebar-2',
            type: 'banner',
            priority: 4,
            enabled: true,
            imageUrl: '/images/ads/sidebar-2.jpg',
            link: '/loans',
            alt: 'Car Loans Ad'
          }
        );
        break;
        
      case 'in-content':
        bannerConfigs.push({
          id: 'banner-content-1',
          type: 'banner',
          priority: 5,
          enabled: true,
          imageUrl: '/images/ads/content-1.jpg',
          link: '/parts',
          alt: 'Car Parts Ad'
        });
        break;
        
      case 'mobile-banner':
        bannerConfigs.push({
          id: 'banner-mobile-1',
          type: 'banner',
          priority: 5,
          enabled: true,
          imageUrl: '/images/ads/mobile-1.jpg',
          link: '/app',
          alt: 'Mobile App Ad'
        });
        break;
        
      case 'bottom-banner':
        bannerConfigs.push({
          id: 'banner-bottom-1',
          type: 'banner',
          priority: 5,
          enabled: true,
          imageUrl: '/images/ads/bottom-banner-1.jpg',
          link: '/newsletter',
          alt: 'Newsletter Signup'
        });
        break;
    }
    
    return bannerConfigs;
  };

  const getPositionStyles = (): { className: string; minHeight: string } => {
    switch (position) {
      case 'top-banner':
        return {
          className: 'w-full max-w-6xl mx-auto mb-6',
          minHeight: '120px'
        };
      case 'bottom-banner':
        return {
          className: 'w-full max-w-6xl mx-auto mt-6',
          minHeight: '120px'
        };
      case 'sidebar':
        return {
          className: 'w-full max-w-xs sticky top-4',
          minHeight: '250px'
        };
      case 'in-content':
        return {
          className: 'w-full max-w-md mx-auto my-6',
          minHeight: '200px'
        };
      case 'mobile-banner':
        return {
          className: 'w-full block md:hidden mb-4',
          minHeight: '100px'
        };
      default:
        return {
          className: 'w-full',
          minHeight: '200px'
        };
    }
  };

  const styles = getPositionStyles();
  const adConfigs = generateAdConfigs();

  const fallbackAd = (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Advertise Here</h3>
      <p className="text-blue-700 text-sm mb-4">Reach thousands of car enthusiasts</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Contact Us
      </button>
    </div>
  );

  return (
    <AdContainer
      adConfigs={adConfigs}
      fallbackAd={fallbackAd}
      className={`${styles.className} ${className}`}
      minHeight={styles.minHeight}
      lazy={position !== 'top-banner'} // Don't lazy load top banner
    />
  );
};

export default ResponsiveAd; 