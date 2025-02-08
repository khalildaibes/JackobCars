import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Footer, Navbar } from "@/components";

export const metadata: Metadata = {
  title: "JackobCar's",
  description: "Discover best cars!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
      <Navbar />

        {children}

        <Analytics />

        <Footer />
      </body>
    </html>
  );
}
