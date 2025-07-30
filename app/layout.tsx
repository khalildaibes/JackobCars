import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "../app/styles/index.css";
import "../app/styles/tailwind.css";
import "../app/styles/font.css";
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'react-hot-toast';
import { getLocale, getMessages } from 'next-intl/server';
import TranslateChildren from "../components/TransltedChildren";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Providers from "./providers";
import { useEffect } from 'react';
import { initializeStoreConfigs } from './utils/storeConfig';
import ChatPopup from '../components/ChatPopup';
import { ComparisonProvider } from "../context/ComparisonContext";
import AccessibilityControls from "../components/AccessibilityControls";
import GlobalChatPopup from "../components/GlobalChatPopup";
import { UserActivityProvider } from "../context/UserActivityContext";

// Initialize store configurations
initializeStoreConfigs().catch(console.error);

export const metadata: Metadata = {
  title: {
    default: "MaxSpeedLimit - ضمن السرعه القانونيه | Premium Car Dealer",
    template: "%s | MaxSpeedLimit"
  },
  description: "MaxSpeedLimit (ضمن السرعه القانونيه) - Your trusted car dealer offering premium vehicles, auto parts, services, and financing solutions. Discover the best cars with competitive pricing and exceptional customer service.",
  keywords: "MaxSpeedLimit, ضمن السرعه القانونيه, car dealer, used cars, new cars, auto parts, car financing, vehicle sales, automotive services, car marketplace, car search, vehicle listings",
  authors: [{ name: "MaxSpeedLimit Team" }],
  creator: "MaxSpeedLimit",
  publisher: "MaxSpeedLimit",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com'),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ar-SA": "/ar",
      "he-IL": "/he"
    }
  },
  openGraph: {
    type: "website",
    siteName: "MaxSpeedLimit - ضمن السرعه القانونيه",
    title: "MaxSpeedLimit - Premium Car Dealer | ضمن السرعه القانونيه",
    description: "Discover premium vehicles, auto parts, and automotive services at MaxSpeedLimit. Your trusted car dealer with competitive pricing and exceptional customer service.",
    url: "/",
    images: [
      {
        url: "/logo-transparent.png",
        width: 1200,
        height: 630,
        alt: "MaxSpeedLimit - ضمن السرعه القانونيه Logo"
      }
    ],
    locale: "en_US",
    alternateLocale: ["ar_SA", "he_IL"]
  },
  twitter: {
    card: "summary_large_image",
    site: "@MaxSpeedLimit",
    creator: "@MaxSpeedLimit",
    title: "MaxSpeedLimit - Premium Car Dealer | ضمن السرعه القانونيه",
    description: "Discover premium vehicles, auto parts, and automotive services at MaxSpeedLimit.",
    images: ["/logo-transparent.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    // yandex: "your-yandex-verification-code", // Add if needed
    // bing: "your-bing-verification-code", // Add if needed
  },
  category: "automotive",
  classification: "Car Dealer, Automotive Services, Vehicle Sales",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "theme-color": "#050B20",
    "msapplication-TileColor": "#050B20",
    "application-name": "MaxSpeedLimit"
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Structured Data for Google Search
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "MaxSpeedLimit - ضمن السرعه القانونيه",
    "alternateName": ["MaxSpeedLimit", "ضمن السرعه القانونيه"],
    "description": "Premium car dealer offering vehicles, auto parts, services, and financing solutions",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://maxspeedlimit.com",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://maxspeedlimit.com"}/logo-transparent.png`,
    "image": `${process.env.NEXT_PUBLIC_BASE_URL || "https://maxspeedlimit.com"}/logo-transparent.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Your City", // Update with actual address
      "addressRegion": "Your Region",
      "addressCountry": "Your Country"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-xxx-xxx-xxxx", // Update with actual phone
      "contactType": "customer service",
      "areaServed": "Global",
      "availableLanguage": ["English", "Arabic", "Hebrew"]
    },
    "sameAs": [
      "https://facebook.com/maxspeedlimit", // Update with actual social media links
      "https://twitter.com/maxspeedlimit",
      "https://instagram.com/maxspeedlimit"
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

  return (
    <html lang={locale}>
      <head>
        {/* Favicon and App Icons - MaxSpeedLimit Logo */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-transparent-small.png" sizes="180x180" />
        <link rel="mask-icon" href="/logo.svg" color="#050B20" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="Your-Region" />
        <meta name="geo.placename" content="Your-City" />
        <meta name="theme-color" content="#050B20" />
        <meta name="msapplication-TileColor" content="#050B20" />
        <meta name="msapplication-TileImage" content="/logo-transparent-small.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className="bg-[#050B20] min-h-screen text-black mobile-content">
        <Providers>
          <NextIntlClientProvider messages={messages}>
          <UserActivityProvider>

            <ComparisonProvider>
              <Navbar />
              <main className="page-content">
                <TranslateChildren targetLang={'ar'} >{children}
                <Analytics />
    
                </TranslateChildren>
              </main>
              <Footer />
              <Toaster />
              <div
                className="
                  fixed z-50
                  left-4
                  bottom-20
                  flex flex-col items-start
                "
              >
                <GlobalChatPopup />
                <AccessibilityControls />
              </div>
            </ComparisonProvider>
            </UserActivityProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
