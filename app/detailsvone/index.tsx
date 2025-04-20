"use client";

import React, { useState, useEffect, Suspense } from "react";
import DetailsVOneItem from "../../components/DetailsVOneItem";
import DetailsSection1 from "./DetailsSection1";
import FinancingCalculatorSection from "./FinancingCalculatorSection";
import LocationDetailsSection from "./LocationDetailsSection";
import { Img } from "../../components/Img";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import RelatedListingsSection from "./RelatedListingsSection";
import DetailsSection from "./DetailsSection";

const featureList = [
  { androidAuto: " Android Auto" },
  { androidAuto: " Apple CarPlay" },
  { androidAuto: " Bluetooth" },
  { androidAuto: " HomeLink" },
];

export default function DetailsvOnePage() {
  const [carDetails, setCarDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch("/api/deals?populate=*");
      if (!response.ok) throw new Error(`Failed to fetch car details: ${response.statusText}`);
  
      const data = await response.json();
      if (!data || !data.data || data.data.length === 0) throw new Error("No car details found");
  
      console.log("Fetched Car Details:", data.data);
  
      // Get the first car from the response and structure it properly
      const product = data.data[0];

      setCarDetails({
        id: product.id,
        name: product.name || "Unknown Car",
        price: `$${product.details.car?.price.toLocaleString() || "N/A"}`,
        description: product.details.car?.description || "No description available",
        year: product.details.car?.year || "Unknown Year",
        miles: product.details.car?.miles || "N/A",
        mileage: product.details.car?.mileage || "N/A",
        body_type: product.details.car?.body_type || "N/A",
        fuel: product.details.car?.fuel || "Unknown",
        transmission: product.details.car?.transmission || "Unknown",
        mainImage: product.image
          ? `http://64.227.112.249${product.image[0].url}`
          : "/default-car.png",
        additionalImages: product.details.car?.images?.additional
        // ? product.details.car.images.additional.map((img: string) => `http://64.227.112.249/${img}`)
        ? product.details.car.images.additional.map((img: string) => `${img}`)
        : [],
        badges: product.details.car?.badges || [],
        breadcrumb: product.details.car?.breadcrumb || [],
        video: product.details.car?.video || null,
        actions: product.details.car?.actions || {},
        dimensions_capacity:  product.details.car?.dimensions_capacity ||[],
        // ✅ Added Pros & Cons
        pros: product.details.car?.pros|| [],
        cons: product.details.car?.cons|| [],
        features:product.details.car?.features|| [],
        // ✅ Added Engine & Transmission Details
        engineTransmissionDetails: product.details.car?.engine_transmission_details|| [],
  
        // ✅ Added Dimensions & Capacity
        detailsArray:  product.details.car?.detailsArray || [],
      });
      console.error("fetching car details:",{
        id: product.id,
        name: product.name || "Unknown Car",
        price: `$${product.details.car?.price.toLocaleString() || "N/A"}`,
        description: product.details.car?.description || "No description available",
        year: product.details.car?.year || "Unknown Year",
        miles: product.details.car?.miles || "N/A",
        mileage: product.details.car?.mileage || "N/A",
        body_type: product.details.car?.body_type || "N/A",
        fuel: product.details.car?.fuel || "Unknown",
        transmission: product.details.car?.transmission || "Unknown",
        mainImage: product.image
          ? `http://64.227.112.249${product.image[0].url}`
          : "/default-car.png",
        additionalImages: product.details.car?.images?.additional
        // ? product.details.car.images.additional.map((img: string) => `http://64.227.112.249/${img}`)
        ? product.details.car.images.additional.map((img: string) => `${img}`)
        : [],
        badges: product.details.car?.badges || [],
        breadcrumb: product.details.car?.breadcrumb || [],
        video: product.details.car?.video || null,
        actions: product.details.car?.actions || {},
        dimensions_capacity:  product.details.car?.dimensions_capacity ||[],
        // ✅ Added Pros & Cons
        pros: product.details.car?.pros|| [],
        cons: product.details.car?.cons|| [],
        features:product.details.car?.features|| [],
        // ✅ Added Engine & Transmission Details
        engineTransmissionDetails: product.details.car?.engine_transmission_details|| [],
  
        // ✅ Added Dimensions & Capacity
        detailsArray:  product.details.car?.detailsArray || [],
      });

    } catch (error) {
      console.error("Error fetching car details:", error);
      setCarDetails(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCarDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-[5%]">
      {/* Header */}
              {/* Details Section */}
              <DetailsSection />
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
                  <Text as="p" className="text-sm font-medium text-gray-800">{carDetails?.body_type || "N/A"}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img src="img_icon_black_900.svg" width={18} height={18} alt="Mileage Icon" className="h-4 w-4" />
                    <Text as="p" className="text-sm font-normal text-gray-700">Mileage</Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">{carDetails?.mileage || "N/A"}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img src="img_icon_black_900_18x18.svg" width={18} height={18} alt="Fuel Icon" className="h-4 w-4" />
                    <Text as="p" className="text-sm font-normal text-gray-700">Fuel Type</Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">{carDetails?.fuel || "N/A"}</Text>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-6">
              <Heading size="text5xl" as="p" className="text-sm font-medium text-gray-800">
                Comfort & Convenience
              </Heading>
              <div className="flex flex-col gap-4">
                <Suspense fallback={<div>Loading features...</div>}>
                  {featureList.map((feature, index) => (
                    <DetailsVOneItem key={index} {...feature} className="text-sm font-medium text-gray-800" />
                  ))}
                </Suspense>
              </div>
            </div>
          </div>
        </section>
                  
        <div className="w-[80%] h-px bg-gray-300 my-8 mx-auto" />
          {/* Main Details Section */}
            {loading ? (
                    <p className="text-center">Loading car details...</p>
                  ) : carDetails ? (
                    <DetailsSection1 carDetails={carDetails} />
                  ) : (
                    <p className="text-center text-red-500">Car details not available.</p>
                  )}


        {/* Location Details Section */}
        <LocationDetailsSection carDetails={carDetails} />
        <div className="w-[80%] h-px bg-gray-300 my-8 mx-auto" />

        {/* Financing Calculator Section */}
        <FinancingCalculatorSection />
        <div className="w-[80%] h-px bg-gray-300 my-8 mx-auto" />

        {/* Related Listings Section */}
        <RelatedListingsSection />
      </div>
    </div>
  );
}
