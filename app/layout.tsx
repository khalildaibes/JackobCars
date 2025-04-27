import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "../app/styles/index.css";
import "../app/styles/tailwind.css";
import "../app/styles/font.css";
import { NextIntlClientProvider } from 'next-intl';
import { ComparisonProvider } from './context/ComparisonContext';
import { Toaster } from 'react-hot-toast';
import { getLocale, getMessages } from 'next-intl/server';
import TranslateChildren from "../components/TransltedChildren";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Providers from "./providers";
import { useEffect } from 'react';
import { initializeStoreConfigs } from './utils/storeConfig';
import ChatPopup from '../components/ChatPopup';

// Initialize store configurations
initializeStoreConfigs().catch(console.error);

export const metadata: Metadata = {
  title: "AtSpeedLimit",
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
      <body className="bg-[#050B20] min-h-screen text-black ">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ComparisonProvider>
              <Navbar />
              <TranslateChildren targetLang={'ar'} >{children}</TranslateChildren>
              <Analytics />
              <Footer />
              <Toaster />
              <ChatPopup />
            </ComparisonProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
