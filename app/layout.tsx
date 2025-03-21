import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
// import { Suspense } from "react";
import "../app/styles/index.css";
import "../app/styles/tailwind.css";
import "../app/styles/font.css";
import {NextIntlClientProvider} from 'next-intl';
// import {notFound} from 'next/navigation';
import { ComparisonProvider } from './context/ComparisonContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "AtSpeedLimit",
  description: "Discover best cars!",
};
import {getLocale, getMessages} from 'next-intl/server';
import TranslateChildren from "../components/TransltedChildren";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ComparisonProvider>
            <Navbar />

            <TranslateChildren targetLang={'fr'}>{children}</TranslateChildren>

            <Analytics />
            <Footer />
            <Toaster />
          </ComparisonProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
