"use client";

import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import DetailsVOneList from "../../components/DetailsVOneList";
import { Button } from "@/components/Button";
import React, { useState } from "react";
import EngineTransmissionDetails from "./transmissionandengien";
import ProsConsComparison from "./ProsConsComparison";

export default function DetailsSection1() {
  interface DetailItem {
    label: React.ReactNode;
    value: React.ReactNode;
  }
  const pros = [
    "Excellent fuel economy due to advanced engine technology",
    "Smooth, comfortable ride with outstanding suspension",
    "Spacious and luxurious interior with premium materials",
    "High safety ratings with advanced driver assistance systems",
    "Low maintenance costs compared to competitors",
  ];

  const cons = [
    "High initial purchase price",
    "Limited engine options for customization",
    "Small trunk space for a car of this size",
    "Occasional transmission noise at high speeds",
    "Less sporty handling compared to rivals",
  ];

  const engineTransmissionDetails = [
    { label: "Engine Type", value: "Turbocharged 2.0L I4" },
    { label: "Horsepower", value: "250 HP" },
    { label: "Torque", value: "260 lb-ft" },
    { label: "Transmission", value: "6-Speed Manual" },
    { label: "Drivetrain", value: "Front-Wheel Drive" },
    { label: "Fuel Economy", value: "25 MPG City / 35 MPG Highway" },
    { label: "Emissions", value: "Euro 6" },
    // add more details if needed
  ];

  const detailsArray = [
    { label: "Width", value: "2100mm" },
    { label: "Width (including mirrors)", value: "2140mm" },
    { label: "Gross Vehicle Weight (kg)", value: "1550" },
    { label: "Max. Loading Weight (kg)", value: "1200" },
    { label: "Max. Roof Load (kg)", value: "400" },
    { label: "No. of Seats", value: "5" },
  ];
  // State to toggle expansion of right column.
  return (
    <div className="mt-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto flex flex-col items-center gap-12">
        {/* Dimensions & Capacity Section */}
        <section className="w-full">
          <Heading
            size="text8xl"
            as="p"
            className="text-2xl font-medium text-gray-800 text-center sm:text-left"
          >
            Dimensions & Capacity
          </Heading>
          <div className="mt-6 flex flex-col md:flex-row gap-6 w-full">
          <DetailsVOneList
            details={detailsArray}
            className="w-full md:w-1/2 text-start items-start justify-start"
          />
          </div>
        </section>
       
        <div className="w-full h-px bg-gray-300 my-8" />
        {/* Pros Cons Comparison Section */}
        <section className="w-full">
            <Heading
              size="text8xl"
              as="p"
              className="text-2xl font-medium text-gray-800 text-center sm:text-left"
            >
              Pros Cons Comparison
            </Heading>
            <div className="mt-6 flex flex-col md:flex-row gap-6 w-full">
            <div className="container mx-auto px-4 py-8">
              <ProsConsComparison pros={pros} cons={cons} />
            </div>
            </div>
        </section>

        <div className="w-full h-px bg-gray-300 my-8" />
        {/* Engine and Transmission Section */}
        <section className="w-full">
            <Heading
              size="text8xl"
              as="p"
              className="text-2xl font-medium text-gray-800 text-center sm:text-left"
            >
              Engine and Transmission
            </Heading>
            <div className="mt-6 flex flex-col md:flex-row gap-6 w-full">
                  <EngineTransmissionDetails 
                    details={engineTransmissionDetails}
                    className="mb-8"
                  /> 
            </div>
        </section>

        <div className="w-full h-px bg-gray-300 my-8" />
      </div>
    </div>
  );
}
