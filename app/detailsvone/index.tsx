"use client";

import React, { Suspense } from "react";

import DetailsVOne1 from "../../components/DetailsVOne1";
import DetailsVOneItem from "../../components/DetailsVOneItem";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import UserProfile6 from "../../components/UserProfile6";
import DetailsSection from "./DetailsSection";
import DetailsSection1 from "./DetailsSection1";
import FinancingCalculatorSection from "./FinancingCalculatorSection";
import LocationDetailsSection from "./LocationDetailsSection";
import RelatedListingsSection from "./RelatedListingsSection";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";


const featureList = [
  { androidAuto: " Android Auto" },
  { androidAuto: " Apple CarPlay" },
  { androidAuto: " Bluetooth" },
  { androidAuto: " HomeLink" },
];

export default function DetailsvOnePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="px-4 sm:px-2">
        {/* Main Details Section */}
        <DetailsSection />

        {/* Car Overview Section */}
        <section className="container mx-auto mt-10 px-4">
          <Heading
            size="text8xl"
            as="h3"
            className="text-[26px] font-medium text-gray-800 sm:text-[22px] text-center mb-6"
          >
            Car Overview
          </Heading>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img
                      src="img_icon_6.svg"
                      width={18}
                      height={18}
                      alt="Body Icon"
                      className="h-4 w-4"
                    />
                    <Text as="p" className="text-sm font-normal text-gray-700">
                      Body
                    </Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">
                    Sedan
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img
                      src="img_icon_black_900.svg"
                      width={18}
                      height={18}
                      alt="Mileage Icon"
                      className="h-4 w-4"
                    />
                    <Text as="p" className="text-sm font-normal text-gray-700">
                      Mileage
                    </Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">
                    20,000
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img
                      src="img_icon_black_900_18x18.svg"
                      width={18}
                      height={18}
                      alt="Fuel Icon"
                      className="h-4 w-4"
                    />
                    <Text as="p" className="text-sm font-normal text-gray-700">
                      Fuel Type
                    </Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">
                    Petrol
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img
                      src="img_calendar_black_900_1.svg"
                      width={18}
                      height={18}
                      alt="Year Icon"
                      className="h-4 w-4"
                    />
                    <Text as="p" className="text-sm font-normal text-gray-700">
                      Year
                    </Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">
                    2023
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img
                      src="img_icon_18x18.svg"
                      width={18}
                      height={18}
                      alt="Transmission Icon"
                      className="h-4 w-4"
                    />
                    <Text as="p" className="text-sm font-normal text-gray-700">
                      Transmission
                    </Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">
                    Automatic
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Img
                      src="img_settings_black_900_18x18.svg"
                      width={18}
                      height={18}
                      alt="Drive Type Icon"
                      className="h-4 w-4"
                    />
                    <Text as="p" className="text-sm font-normal text-gray-700">
                      Drive Type
                    </Text>
                  </div>
                  <Text as="p" className="text-sm font-medium text-gray-800">
                    All-Wheel Drive (AWD/4WD)
                  </Text>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-6">
              <Heading
                size="text5xl"
                as="p"
                className="text-sm font-medium text-gray-800"
              >
                Comfort & Convenience
              </Heading>
              <div className="flex flex-col gap-4">
                <Suspense fallback={<div>Loading features...</div>}>
                  {featureList.map((feature, index) => (
                    <DetailsVOneItem
                      key={index}
                      {...feature}
                      className="text-sm font-medium text-gray-800"
                    />
                  ))}
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gray-300" />

        {/* Details Section */}
        <DetailsSection1 />

        {/* Location Details Section */}
        <LocationDetailsSection />

        {/* Financing Calculator Section */}
        <FinancingCalculatorSection />

        {/* Related Listings Section */}
        <div className="max-w-screen flex-row">

        <RelatedListingsSection />

        </div>

      </div>
    </div>
  );
}
