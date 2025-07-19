# Ads System Setup Guide

This guide explains how to set up and configure the comprehensive ads system for your car dealer website.

## Overview

The ads system supports multiple ad types:
- **Google AdSense** - Automated Google ads with revenue sharing
- **Banner Ads** - Static/direct advertisement banners
- **Native Ads** - Custom content that blends with your site design

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google AdSense Configuration
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx

# Ad Slots for different positions
NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=0987654321
NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT=1122334455
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER=5544332211
NEXT_PUBLIC_ADSENSE_SLOT_MOBILE_BANNER=6677889900

# Ad Configuration
NEXT_PUBLIC_ENABLE_GOOGLE_ADS=true
NEXT_PUBLIC_ENABLE_BANNER_ADS=true
```

### 2. Google AdSense Setup

1. **Apply for Google AdSense**:
   - Visit [Google AdSense](https://www.google.com/adsense/)
   - Create an account and submit your website for review
   - Wait for approval (can take 1-14 days)

2. **Get your Publisher ID**:
   - After approval, find your publisher ID (ca-pub-xxxxxxxxxxxxxxxx)
   - Add it to your `.env.local` file

3. **Create Ad Units**:
   - In AdSense dashboard, create ad units for different positions
   - Copy the ad unit IDs and add them to your environment variables

### 3. Add Banner Ad Images

Create an `/public/images/ads/` directory and add your banner ad images:

```
public/
  images/
    ads/
      car-insurance-banner.jpg
      car-loans-banner.jpg
      car-service-sidebar.jpg
      car-parts-sidebar.jpg
      electric-cars.jpg
      mobile-app.jpg
      newsletter-banner.jpg
```

## Usage

### Basic Implementation

The ads are already integrated into your homepage. To add ads to other pages:

```tsx
import { ResponsiveAd } from '../components/ads';

function MyPage() {
  return (
    <div>
      {/* Your content */}
      
      {/* Add an ad */}
      <ResponsiveAd 
        position="in-content"
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT}
        enableGoogleAds={true}
        enableBannerAds={true}
      />
      
      {/* More content */}
    </div>
  );
}
```

### Available Ad Positions

- `top-banner` - Full width banner at top of page
- `bottom-banner` - Full width banner at bottom of page
- `sidebar` - Vertical ads for sidebar placement
- `in-content` - Square/rectangle ads within content
- `mobile-banner` - Mobile-optimized banner (hidden on desktop)

### Custom Ad Configuration

You can create custom ad configurations:

```tsx
import { AdContainer, AdConfig } from '../components/ads';

const customAdConfig: AdConfig[] = [
  {
    id: 'custom-google-ad',
    type: 'adsense',
    priority: 10,
    enabled: true,
    adSlot: '1234567890',
    adFormat: 'rectangle'
  },
  {
    id: 'custom-banner',
    type: 'banner',
    priority: 5,
    enabled: true,
    imageUrl: '/images/my-ad.jpg',
    link: 'https://example.com',
    alt: 'Custom Advertisement'
  }
];

function CustomAdComponent() {
  return (
    <AdContainer 
      adConfigs={customAdConfig}
      className="my-4"
      minHeight="250px"
    />
  );
}
```

## Configuration

### Ad Settings (config/ads.ts)

The main configuration file allows you to:

- Enable/disable different ad types
- Configure Google AdSense settings
- Set up fallback banner ads
- Define ad placement rules
- Set mobile ad limits

### Key Configuration Options

```typescript
export const adsConfig = {
  // Enable/disable ad types
  googleAdsEnabled: true,
  bannerAdsEnabled: true,
  
  // Ad placement rules
  placement: {
    maxAdsPerPage: 6,
    mobileAdLimit: 3,
    disabledPages: ['/admin', '/dashboard']
  }
};
```

## Best Practices

### 1. Ad Placement
- **Don't overwhelm users**: Maximum 6 ads per page
- **Maintain content quality**: Ads should not dominate the page
- **Mobile optimization**: Fewer ads on mobile devices
- **Strategic positioning**: Place ads where they're visible but not intrusive

### 2. Performance
- **Lazy loading**: Ads below the fold are lazy-loaded
- **Fallback content**: Banner ads serve as fallbacks for AdSense
- **Error handling**: Graceful degradation when ads fail to load

### 3. Revenue Optimization
- **Test ad positions**: Monitor which positions perform best
- **Use multiple ad sizes**: Different sizes for different devices
- **Monitor performance**: Track click-through rates and revenue

## Troubleshooting

### Google AdSense Issues

**Ads not showing**:
1. Check if your site is approved by AdSense
2. Verify your publisher ID is correct
3. Ensure ad unit IDs are valid
4. Check browser console for errors

**Ad policy violations**:
- Ensure your content complies with AdSense policies
- Don't click your own ads
- Maintain good content quality

### Banner Ad Issues

**Images not loading**:
1. Check image paths are correct
2. Ensure images exist in `/public/images/ads/`
3. Verify image formats are supported (jpg, png, webp)

### Performance Issues

**Slow loading**:
1. Optimize ad images (compress and resize)
2. Use lazy loading for below-the-fold ads
3. Minimize the number of ads per page

## Analytics and Monitoring

### Google AdSense Reports
- Monitor revenue and performance in AdSense dashboard
- Track RPM (Revenue per Mille) and CTR (Click-through Rate)
- Analyze which ad positions perform best

### Custom Analytics
You can add custom tracking:

```tsx
// Track ad impressions
const handleAdImpression = (adId: string) => {
  // Your analytics code
  gtag('event', 'ad_impression', {
    ad_id: adId,
    ad_position: position
  });
};
```

## Legal Considerations

1. **Privacy Policy**: Update your privacy policy to mention ads and cookies
2. **GDPR Compliance**: Implement cookie consent for EU users
3. **AdSense Policies**: Follow Google AdSense content policies
4. **User Experience**: Ensure ads don't negatively impact user experience

## Support

For issues with the ads system:
1. Check this documentation
2. Review browser console for errors
3. Test with different ad configurations
4. Contact Google AdSense support for policy-related issues

## Advanced Features

### A/B Testing
You can implement A/B testing for ad positions:

```tsx
const isVariantA = Math.random() < 0.5;
const adPosition = isVariantA ? 'top-banner' : 'in-content';
```

### Dynamic Ad Loading
Load ads based on user behavior or content:

```tsx
const shouldShowPremiumAds = user.isPremium;
const adConfigs = shouldShowPremiumAds ? premiumAdConfig : standardAdConfig;
```

### Custom Ad Networks
Extend the system to support other ad networks:

```tsx
// Add support for other networks like Media.net, etc.
const customNetworkAd: AdConfig = {
  id: 'custom-network',
  type: 'native',
  priority: 8,
  enabled: true,
  content: <CustomNetworkAdComponent />
};
``` 