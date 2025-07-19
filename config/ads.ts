import { AdConfig } from '../components/ads';

// Ad Configuration
export const adsConfig = {
  // Enable/disable ad types
  googleAdsEnabled: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ADS === 'true',
  bannerAdsEnabled: process.env.NEXT_PUBLIC_ENABLE_BANNER_ADS === 'true',
  
  // Google AdSense Settings
  googleAdSense: {
    client: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-xxxxxxxxxxxxxxxx',
    slots: {
      topBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER || '1234567890',
      sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '0987654321',
      inContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT || '1122334455',
      bottomBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER || '5544332211',
      mobileBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE_BANNER || '6677889900',
    }
  },

  // Fallback Banner Ads
  bannerAds: {
    topBanner: [
      {
        id: 'top-banner-1',
        imageUrl: '/images/ads/car-insurance-banner.jpg',
        link: '/insurance',
        alt: 'Car Insurance - Get Quote Today',
        priority: 8
      },
      {
        id: 'top-banner-2',
        imageUrl: '/images/ads/car-loans-banner.jpg',
        link: '/loans',
        alt: 'Car Loans - Low Interest Rates',
        priority: 7
      }
    ],
    sidebar: [
      {
        id: 'sidebar-1',
        imageUrl: '/images/ads/car-service-sidebar.jpg',
        link: '/services',
        alt: 'Premium Car Service',
        priority: 8
      },
      {
        id: 'sidebar-2',
        imageUrl: '/images/ads/car-parts-sidebar.jpg',
        link: '/parts',
        alt: 'Genuine Car Parts',
        priority: 7
      },
      {
        id: 'sidebar-3',
        imageUrl: '/images/ads/car-wash-sidebar.jpg',
        link: '/car-wash',
        alt: 'Professional Car Wash',
        priority: 6
      }
    ],
    inContent: [
      {
        id: 'content-1',
        imageUrl: '/images/ads/electric-cars.jpg',
        link: '/electric-cars',
        alt: 'Electric Cars - Future of Mobility',
        priority: 8
      },
      {
        id: 'content-2',
        imageUrl: '/images/ads/car-comparison.jpg',
        link: '/compare',
        alt: 'Compare Cars - Find Your Perfect Match',
        priority: 7
      }
    ],
    bottomBanner: [
      {
        id: 'bottom-banner-1',
        imageUrl: '/images/ads/newsletter-banner.jpg',
        link: '/newsletter',
        alt: 'Subscribe to Our Newsletter',
        priority: 8
      }
    ],
    mobileBanner: [
      {
        id: 'mobile-1',
        imageUrl: '/images/ads/mobile-app.jpg',
        link: '/app-download',
        alt: 'Download Our Mobile App',
        priority: 8
      }
    ]
  },

  // Ad Placement Rules
  placement: {
    // Minimum distance between ads (in viewport heights)
    minDistanceBetweenAds: 1.5,
    
    // Maximum ads per page
    maxAdsPerPage: 6,
    
    // Disable ads on certain pages
    disabledPages: ['/admin', '/dashboard'],
    
    // Show fewer ads on mobile
    mobileAdLimit: 3
  }
};

// Helper function to get ad config for a specific position
export const getAdConfigByPosition = (position: string): AdConfig[] => {
  const configs: AdConfig[] = [];
  
  // Add Google AdSense config if enabled
  if (adsConfig.googleAdsEnabled) {
    const slot = adsConfig.googleAdSense.slots[position as keyof typeof adsConfig.googleAdSense.slots];
    if (slot) {
      configs.push({
        id: `adsense-${position}`,
        type: 'adsense',
        priority: 10,
        enabled: true,
        adSlot: slot,
        adClient: adsConfig.googleAdSense.client,
        adFormat: getAdFormatByPosition(position)
      });
    }
  }
  
  // Add banner ads if enabled
  if (adsConfig.bannerAdsEnabled) {
    const bannerAds = adsConfig.bannerAds[position as keyof typeof adsConfig.bannerAds] || [];
    bannerAds.forEach(ad => {
      configs.push({
        id: ad.id,
        type: 'banner',
        priority: ad.priority,
        enabled: true,
        imageUrl: ad.imageUrl,
        link: ad.link,
        alt: ad.alt
      });
    });
  }
  
  return configs;
};

// Helper function to get appropriate ad format based on position
const getAdFormatByPosition = (position: string): 'auto' | 'rectangle' | 'vertical' | 'horizontal' => {
  switch (position) {
    case 'topBanner':
    case 'bottomBanner':
      return 'horizontal';
    case 'sidebar':
      return 'vertical';
    case 'inContent':
      return 'rectangle';
    default:
      return 'auto';
  }
};

// Helper function to check if ads should be shown on current page
export const shouldShowAds = (pathname: string): boolean => {
  return !adsConfig.placement.disabledPages.some(page => pathname.startsWith(page));
};

// Helper function to get mobile ad limit
export const getMobileAdLimit = (): number => {
  return adsConfig.placement.mobileAdLimit;
};

export default adsConfig; 