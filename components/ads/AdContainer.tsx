'use client';

import React, { useState, useEffect } from 'react';
import GoogleAdSense from './GoogleAdSense';
import AdBanner from '../AdBanner';

export type AdType = 'adsense' | 'banner' | 'native';

export interface AdConfig {
  id: string;
  type: AdType;
  priority: number;
  enabled: boolean;
  // Google AdSense config
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adClient?: string;
  // Banner ad config
  imageUrl?: string;
  link?: string;
  alt?: string;
  // Native ad config
  content?: React.ReactNode;
}

interface AdContainerProps {
  adConfigs: AdConfig[];
  fallbackAd?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  minHeight?: string;
}

const AdContainer: React.FC<AdContainerProps> = ({
  adConfigs,
  fallbackAd,
  className = '',
  style,
  lazy = true,
  minHeight = '200px'
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [adElement, setAdElement] = useState<React.ReactNode>(null);

  // Sort ads by priority (higher number = higher priority)
  const sortedAds = adConfigs
    .filter(ad => ad.enabled)
    .sort((a, b) => b.priority - a.priority);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`ad-container-${adConfigs[0]?.id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [lazy, adConfigs]);

  useEffect(() => {
    if (!isVisible || sortedAds.length === 0) return;

    const renderAd = (adConfig: AdConfig): React.ReactNode => {
      switch (adConfig.type) {
        case 'adsense':
          return (
            <GoogleAdSense
              key={adConfig.id}
              adSlot={adConfig.adSlot!}
              adFormat={adConfig.adFormat}
              adClient={adConfig.adClient}
              className="w-full"
              style={{ minHeight }}
            />
          );
        
        case 'banner':
          return (
            <AdBanner
              key={adConfig.id}
              imageUrl={adConfig.imageUrl!}
              link={adConfig.link!}
              alt={adConfig.alt!}
              className="w-full"
            />
          );
        
        case 'native':
          return adConfig.content;
        
        default:
          return null;
      }
    };

    // Try to render the highest priority ad first
    if (sortedAds[currentAdIndex]) {
      const ad = renderAd(sortedAds[currentAdIndex]);
      setAdElement(ad);
    } else {
      setAdElement(fallbackAd);
    }
  }, [isVisible, currentAdIndex, sortedAds, fallbackAd, minHeight]);

  // Fallback placeholder when ad is not visible yet (lazy loading)
  if (!isVisible) {
    return (
      <div
        id={`ad-container-${adConfigs[0]?.id}`}
        className={`bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center ${className}`}
        style={{ minHeight, ...style }}
      >
        <div className="text-gray-400 text-sm">Loading Ad...</div>
      </div>
    );
  }

  return (
    <div
      id={`ad-container-${adConfigs[0]?.id}`}
      className={`relative ${className}`}
      style={style}
    >
      {adElement || (
        <div
          className="bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
          style={{ minHeight }}
        >
          <div className="text-gray-400 text-sm">Advertisement Space</div>
        </div>
      )}
    </div>
  );
};

export default AdContainer; 