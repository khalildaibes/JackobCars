import { generatePageMetadata } from "../seo-config";
import { seoMetadata } from "../seo-metadata";
import FeaturedClient from "./FeaturedClient";

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
  return <FeaturedClient />;
} 