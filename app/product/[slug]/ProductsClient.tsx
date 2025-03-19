"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Img } from "../../../components/Img";
import { Heading } from "../../../components/Heading";
import { Text } from "../../../components/Text";
import { useParams } from "next/navigation";
import DetailsSection from "../../../app/detailsvone/DetailsSection";
import DetailsVOneItem from "../../../components/DetailsVOneItem";
import DetailsSection1 from "../../../app/detailsvone/DetailsSection1";
import LocationDetailsSection from "../../../app/detailsvone/LocationDetailsSection";
import FinancingCalculatorSection from "../../../app/detailsvone/FinancingCalculatorSection";
import RelatedListingsSection from "../../../app/detailsvone/RelatedListingsSection";
import { fetchStrapiData } from "../../../app/lib/strapiClient";

const featureList = [
  { feature: "Android Auto" },
  { feature: "Apple CarPlay" },
  { feature: "Bluetooth" },
  { feature: "HomeLink" },
];

export default function ProductDetailsPage({ product }: { product: { product: string } }) {
  const { slug } = useParams(); // Get dynamic slug from URL
  const [categoryDetails, setcategoryDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchcategoryDetails = async () => {
    try {
   const response = await fetch("/api/deals?populate=*&Locale=he-IL");
      if (!response.ok) throw new Error(`Failed to fetch car details: ${response.statusText}`);

      const data = await response.json();
      if (!data?.data?.length) throw new Error("No car details found");

      console.log("Fetched Car Details:", data.data);

      // Extract the first car's details
      const products = data.data[0];

      const product = response.data[0];

      setcategoryDetails({
        id: product.id,
        name: product.name || "Unknown Car",
        price: product.details?.car?.price ? `$${product.details.car.price.toLocaleString()}` : "N/A",
        description: product.details?.car?.description || "No description available",
        year: product.details?.car?.year || "Unknown Year",
        miles: product.details?.car?.miles || "N/A",
        mileage: product.details?.car?.mileage || "N/A",
        body_type: product.details?.car?.body_type || "N/A",
        fuel: product.details?.car?.fuel || "Unknown",
        transmission: product.details?.car?.transmission || "Unknown",
        mainImage: product.image?.length ? `http://68.183.215.202${product.image[0].url}` : "/default-car.png",
        additionalImages: product.details?.car?.images?.additional || [],
        badges: product.details?.car?.badges || [],
        breadcrumb: product.details?.car?.breadcrumb || [],
        video: product.details?.car?.video || null,
        actions: product.details?.car?.actions || {},
        dimensions_capacity: product.details?.car?.dimensions_capacity || [],
        pros: product.details?.car?.pros || [],
        cons: product.details?.car?.cons || [],
        features: product.details?.car?.features || [],
        engineTransmissionDetails: product.details?.car?.engine_transmission_details || [],
        detailsArray: product.details?.car?.detailsArray || [],
      });

    } catch (error) {
      console.error("Error fetching car details:", error);
      setcategoryDetails(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (slug) {
      fetchcategoryDetails();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 pt-[5%]">
      {/* Details Section */}
      
      <div className="px-4 sm:px-2">
        {/* Car Overview Section */}
        <section className="container mx-auto mt-10 px-4 items-start justify-start">
          <Heading
            size="text8xl"
            as="h3"
            className="text-[26px] font-medium text-gray-800 sm:text-[22px] text-start mb-6"
          >
            Car Overview
          </Heading>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img src="img_icon_6.svg" width={18} height={18} alt="Body Icon" className="h-4 w-4" />
                    <Text as="p" className="text-sm font-normal text-gray-700">Body</Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">{categoryDetails?.name || "N/A"}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img src="img_icon_black_900.svg" width={18} height={18} alt="Mileage Icon" className="h-4 w-4" />
                    <Text as="p" className="text-sm font-normal text-gray-700">Mileage</Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">{categoryDetails?.mileage || "N/A"}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img src="img_icon_black_900_18x18.svg" width={18} height={18} alt="Fuel Icon" className="h-4 w-4" />
                    <Text as="p" className="text-sm font-normal text-gray-700">Fuel Type</Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">{categoryDetails?.fuel || "N/A"}</Text>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-6">
              <Heading size="text5xl" as="p" className="text-sm font-medium text-gray-800">
                Comfort & Convenience
              </Heading>
              <div className="flex flex-col gap-4">
                {/* <Suspense fallback={<div>Loading features...</div>}>
                  {featureList.map((feature, index) => (
                    <DetailsVOneItem key={index} feature={feature.feature} className="text-sm font-medium text-gray-800" />
                  ))}
                </Suspense> */}
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  );
}
