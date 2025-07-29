"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, DollarSign, Fuel, Calendar } from 'lucide-react';
import { manufacturers } from '../../constants';
import { generatePageMetadata } from "../seo-config";
import { seoMetadata } from "../seo-metadata";
import FeaturedSection from "./index";

// Generate optimized metadata for this page
export const metadata = generatePageMetadata({
  title: seoMetadata.featured.title,
  description: seoMetadata.featured.description,
  keywords: seoMetadata.featured.keywords.split(", "),
  path: "/featured",
  images: [
    {
      url: "/images/featured-cars-banner.jpg", // Add if you have a specific image
      alt: "MaxSpeedLimit Featured Vehicles - Premium Cars Collection",
      width: 1200,
      height: 630
    }
  ]
});

export default function FeaturedPage() {
  return (
    <div className="bg-white-A700 flex flex-col font-dmsans items-center justify-start mx-auto w-full">
      <FeaturedSection />
    </div>
  );
} 