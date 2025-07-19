'use client';

import React, { useEffect, useState } from 'react';

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  adClient?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = { display: 'block' },
  className = '',
  responsive = true,
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-xxxxxxxxxxxxxxxx'
}) => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Load Google AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize ads
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (error) {
      console.error('Error loading Google AdSense:', error);
    }
  }, [adClient]);

  // Fallback placeholder when ads are not loaded
  if (!adLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={style}>
        <div className="text-gray-400 text-sm">Advertisement</div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default GoogleAdSense; 