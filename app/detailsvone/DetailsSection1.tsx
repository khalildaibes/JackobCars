"use client";

import { useState, useEffect } from "react";
import { Heading } from "@/components/Heading";
import DetailsVOneList from "../../components/DetailsVOneList";
import React from "react";
import EngineTransmissionDetails from "./transmissionandengien";
import ProsConsComparison from "./ProsConsComparison";

// Define types for Detail Items
interface DetailItem {
  label: string;
  value: string | number;
}

interface CarDetailsProps {
  dimensions_capacity?: DetailItem[];
  engineTransmissionDetails?: DetailItem[];
  pros?: string[];
  cons?: string[];
}

export default function DetailsSection1({ carDetails }: { carDetails: CarDetailsProps }) {
  const [dimensions, setDimensions] = useState<DetailItem[]>([]);
  const [engineDetails, setEngineDetails] = useState<DetailItem[]>([]);
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  useEffect(() => {
    if (carDetails) {
      console.log("Received Car Details:", carDetails);

      setDimensions(carDetails.dimensions_capacity || []);
      setEngineDetails(carDetails.engineTransmissionDetails || []);
      setPros(carDetails.pros || []);
      setCons(carDetails.cons || []);
    }
  }, [carDetails]);

  return (
    <div className="mt-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto flex flex-col items-center gap-12">
        {/* Dimensions & Capacity Section */}
        <section className="w-full">
          <Heading size="text8xl" as="p" className="text-2xl font-medium text-gray-800 text-center sm:text-left">
            Dimensions & Capacity
          </Heading>
          <div className="mt-6 flex flex-col md:flex-row gap-6 w-full">
            <DetailsVOneList details={dimensions} className="w-full md:w-1/2 text-start items-start justify-start" />
          </div>
        </section>

        <div className="w-full h-px bg-gray-300 my-8" />

        {/* Pros Cons Comparison Section */}
        <section className="w-full">
          <Heading size="text8xl" as="p" className="text-2xl font-medium text-gray-800 text-center sm:text-left">
            Pros & Cons Comparison
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
          <Heading size="text8xl" as="p" className="text-2xl font-medium text-gray-800 text-center sm:text-left">
            Engine and Transmission
          </Heading>
          <div className="mt-6 flex flex-col md:flex-row gap-6 w-full">
            <EngineTransmissionDetails details={engineDetails} className="mb-8" />
          </div>
        </section>

        <div className="w-full h-px bg-gray-300 my-8" />
      </div>
    </div>
  );
}
