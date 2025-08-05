import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "../app/styles/index.css";
import "../app/styles/tailwind.css";
import "../app/styles/font.css";
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from '../components/ui/toaster';
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
  description: "MaxSpeedLimit (ضمن السرعه القانونيه) - Premium car dealer offering high-quality vehicles, auto parts, services, and financing solutions. Discover the best cars with competitive pricing and exceptional customer service.",
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
    description: "Premium car dealer offering high-quality vehicles, auto parts, services, and financing solutions. Discover the best cars with competitive pricing and exceptional customer service.",
    url: "/",
    images: [
      {
        url: "/api/og-image",
        width: 1200,
        height: 630,
        alt: "MaxSpeedLimit - ضمن السرعه القانونيه | Premium Car Dealer",
        type: "image/png"
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MaxSpeedLimit - ضمن السرعه القانونيه | Premium Car Dealer",
        type: "image/png"
      },
      {
        url: "/logo-transparent.png",
        width: 800,
        height: 600,
        alt: "MaxSpeedLimit Logo",
        type: "image/png"
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
    description: "Premium car dealer offering high-quality vehicles, auto parts, services, and financing solutions.",
    images: ["/api/og-image"],
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
    "application-name": "MaxSpeedLimit",
    // WhatsApp specific metadata
    "og:image:secure_url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com'}/api/og-image`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "MaxSpeedLimit - ضمن السرعه القانونيه | Premium Car Dealer",
    "og:url": process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com',
    "og:site_name": "MaxSpeedLimit - ضمن السرعه القانونيه"
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
              <ShadcnToaster />
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
