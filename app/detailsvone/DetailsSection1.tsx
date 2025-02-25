"use client";

import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import DetailsVOneList from "../../components/DetailsVOneList";
import React from "react";

export default function DetailsSection1() {
  return (
    <div className="mt-12 px-4 sm:px-6 md:px-8 lg:px-12 ">
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
              length="Widthaaaa"
              p4950mm="2100mm"
              height="Width (including mirrors)"
              p1550mm="2140mm"
              wheelbase="Gross Vehicle Weight (kg)"
              p2580mm="1550"
              heightIncluding="Max. Loading Weight (kg)"
              p1850mm="1200"
              luggageCapacity="Max. Roof Load (kg)"
              p480="400"
              luggagecapacity1="No. of Seats"
              p850="5"
              className="w-full md:w-1/2"
            />
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
            {/* Left Column */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <div className="flex justify-between items-center">
                <Text as="p" className="text-sm font-normal text-gray-700">
                  Fuel Tank Capacity (Litres)
                </Text>
                <Text as="p" className="text-sm font-medium text-gray-800">
                  80
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text as="p" className="text-sm font-normal text-gray-700">
                  Max. Towing Weight - Braked (kg)
                </Text>
                <Text as="p" className="text-sm font-medium text-gray-800">
                  1000
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text as="p" className="text-sm font-normal text-gray-700">
                  Max. Towing Weight - Unbraked (kg)
                </Text>
                <Text as="p" className="text-sm font-medium text-gray-800">
                  1100
                </Text>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <div className="flex justify-between items-center">
                <Text as="p" className="text-sm font-normal text-gray-700">
                  Minimum Kerbweight (kg)
                </Text>
                <Text as="p" className="text-sm font-medium text-gray-800">
                  350
                </Text>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Text
                  as="p"
                  className="text-sm font-normal text-gray-700 leading-snug text-center md:text-left"
                >
                  Turning Circle - Kerb to Kerb (m)
                </Text>
                <Text as="p" className="text-sm font-medium text-gray-800">
                  6500
                </Text>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-300 my-8" />
      </div>
    </div>
  );
}
