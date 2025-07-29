export const seoConfig = {
  // Basic Site Information
  siteName: "MaxSpeedLimit - ضمن السرعه القانونيه",
  shortName: "MaxSpeedLimit",
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://maxspeedlimit.com",
  
  // Business Information
  business: {
    name: "MaxSpeedLimit",
    arabicName: "ضمن السرعه القانونيه",
    description: "Premium car dealer offering vehicles, auto parts, services, and financing solutions",
    industry: "Automotive",
    type: "Car Dealer",
    founded: "2024", // Update with actual founding year
    email: "info@maxspeedlimit.com",
    phone: "+1-xxx-xxx-xxxx", // Update with actual phone
    address: {
      street: "Your Street Address", // Update with actual address
      city: "Your City",
      region: "Your Region",
      country: "Your Country",
      postalCode: "Your Postal Code"
    }
  },
  
  // Social Media
  social: {
    facebook: "https://facebook.com/maxspeedlimit",
    twitter: "https://twitter.com/maxspeedlimit",
    instagram: "https://instagram.com/maxspeedlimit",
    linkedin: "https://linkedin.com/company/maxspeedlimit",
    youtube: "https://youtube.com/maxspeedlimit"
  },
  
  // SEO Settings
  seo: {
    defaultTitle: "MaxSpeedLimit - ضمن السرعه القانونيه | Premium Car Dealer",
    titleTemplate: "%s | MaxSpeedLimit",
    defaultDescription: "MaxSpeedLimit (ضمن السرعه القانونيه) - Your trusted car dealer offering premium vehicles, auto parts, services, and financing solutions. Discover the best cars with competitive pricing and exceptional customer service.",
    keywords: [
      "MaxSpeedLimit",
      "ضمن السرعه القانونيه",
      "car dealer",
      "used cars",
      "new cars",
      "auto parts",
      "car financing",
      "vehicle sales",
      "automotive services",
      "car marketplace",
      "car search",
      "vehicle listings"
    ],
    openGraph: {
      type: "website",
      images: [
        {
          url: "/logo-transparent.png",
          width: 1200,
          height: 630,
          alt: "MaxSpeedLimit - ضمن السرعه القانونيه Logo"
        }
      ]
    }
  },
  
  // Languages supported
  languages: {
    default: "en",
    supported: ["en", "ar", "he"]
  },
  
  // Analytics and Verification
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || "", // Add your GA4 ID
    googleSearchConsole: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    bingVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || ""
  }
};

// Helper function to generate structured data
export function generateBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": seoConfig.business.name,
    "alternateName": [seoConfig.business.name, seoConfig.business.arabicName],
    "description": seoConfig.business.description,
    "url": seoConfig.siteUrl,
    "logo": `${seoConfig.siteUrl}/logo-transparent.png`,
    "image": `${seoConfig.siteUrl}/logo-transparent.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.business.address.street,
      "addressLocality": seoConfig.business.address.city,
      "addressRegion": seoConfig.business.address.region,
      "addressCountry": seoConfig.business.address.country,
      "postalCode": seoConfig.business.address.postalCode
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": seoConfig.business.phone,
      "email": seoConfig.business.email,
      "contactType": "customer service",
      "areaServed": "Global",
      "availableLanguage": ["English", "Arabic", "Hebrew"]
    },
    "sameAs": [
      seoConfig.social.facebook,
      seoConfig.social.twitter,
      seoConfig.social.instagram,
      seoConfig.social.linkedin,
      seoConfig.social.youtube
    ],
    "offers": {
      "@type": "AggregateOffer",
      "description": "Premium vehicles and automotive services",
      "priceCurrency": "USD"
    },
    "serviceType": [
      "Car Sales",
      "Auto Parts",
      "Vehicle Financing",
      "Automotive Services",
      "Car Search",
      "Vehicle Listings"
    ]
  };
}

// Helper function to generate page-specific metadata
export function generatePageMetadata(page: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  images?: Array<{url: string; alt: string; width?: number; height?: number}>;
}) {
  const title = page.title 
    ? `${page.title} | ${seoConfig.business.name}`
    : seoConfig.seo.defaultTitle;
    
  const description = page.description || seoConfig.seo.defaultDescription;
  const keywords = page.keywords 
    ? [...seoConfig.seo.keywords, ...page.keywords].join(", ")
    : seoConfig.seo.keywords.join(", ");
    
  const url = page.path ? `${seoConfig.siteUrl}${page.path}` : seoConfig.siteUrl;
  const images = page.images || seoConfig.seo.openGraph.images;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      images: images.map(img => ({
        url: img.url.startsWith('http') ? img.url : `${seoConfig.siteUrl}${img.url}`,
        width: img.width || 1200,
        height: img.height || 630,
        alt: img.alt
      })),
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(img => 
        img.url.startsWith('http') ? img.url : `${seoConfig.siteUrl}${img.url}`
      )
    }
  };
} 