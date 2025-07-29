import { generatePageMetadata } from "../seo-config";
import { seoMetadata } from "../seo-metadata";
import CarsearchSection from "./index";

// Generate optimized metadata for this page
export const metadata = generatePageMetadata({
  title: seoMetadata.carSearch.title,
  description: seoMetadata.carSearch.description,
  keywords: seoMetadata.carSearch.keywords.split(", "),
  path: "/carsearch",
  images: [
    {
      url: "/images/car-search-banner.jpg", // Add if you have a specific image
      alt: "MaxSpeedLimit Car Search - Find Your Perfect Vehicle",
      width: 1200,
      height: 630
    }
  ]
});

export default function ContactUsPage() {
  return (
    <div className="bg-white-A700 flex flex-col font-dmsans items-center justify-start mx-auto w-full">
      <CarsearchSection />
    </div>
  );
  }
