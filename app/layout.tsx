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
  title: "MaxSpeedLimit",
  description: "Discover best cars!",
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

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
