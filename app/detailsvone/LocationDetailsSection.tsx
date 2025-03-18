"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { GoogleMap } from "../../components/GoogleMap";
import { Heading } from "../../components/Heading";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";

export default function LocationDetailsSection({ carDetails }: { carDetails: any }) {
  const [location, setLocation] = useState({
    address: "Location Unavailable",
    lat: 40.7128,
    lng: -74.0060,
  });

  useEffect(() => {
    if (carDetails?.location) {
      setLocation({
        address: carDetails.location.address || "Unknown Location",
        lat: carDetails.location.lat || 40.7128,
        lng: carDetails.location.lng || -74.0060,
      });
    }
  }, [carDetails]);

  return (
    <div className="mt-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto flex flex-col items-center gap-6">
        {/* Section Title & Address */}
        <div className="w-full text-center md:text-left">
          <Heading size="text8xl" as="p" className="text-2xl font-bold text-gray-800">
            Location
          </Heading>
          <Text as="p" className="mt-2 text-sm font-normal text-gray-600">
            {location.address}
          </Text>
          <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
            <Text as="p" className="text-sm font-normal text-indigo-400">
              Get Direction
            </Text>
            <Img src="img_arrow_left_indigo_a400_1.svg" width={14} height={14} alt="Arrow Left" className="h-4" />
          </div>
        </div>

        {/* Map Container */}
        <div className="relative mt-6 w-full md:w-2/3 h-64 sm:h-80 md:h-[450px] rounded-xl bg-gray-300_02 overflow-hidden">
          <GoogleMap showMarker={true}  className="h-full w-full rounded-xl" />
          
          {/* Overlays on top of the map */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Top Overlay: Two square buttons */}
            <div className="flex justify-center md:justify-start gap-2">
              <Button size="md" className="w-8 h-8 rounded-md">
                <Img src="defaultNoData.png" width={30} height={30} alt="Icon" />
              </Button>
              <Button size="md" className="w-8 h-8 rounded-md">
                <Img src="defaultNoData.png" width={30} height={30} alt="Icon" />
              </Button>
            </div>

            {/* Center Overlay: A circular button */}
            <Button size="5xl" shape="circle" className="self-center rounded-full shadow-lg bg-white p-2">
              <Img src="img_linkedin.svg" width={12} height={16} alt="LinkedIn" />
            </Button>

            {/* Bottom Overlay: Attribution */}
            <div className="flex items-center justify-center bg-white bg-opacity-70 px-2 py-1 rounded-md self-end md:self-center">
              <Heading as="p" className="text-[10px] font-medium text-light_blue-800">Leaflet</Heading>
              <Text size="texts" as="p" className="mx-1 text-[11px] font-medium text-blue_gray-900">| ©</Text>
              <Heading as="p" className="text-[10px] font-medium text-light_blue-800">OpenStreetMap</Heading>
              <Heading as="p" className="ml-1 text-[10px] font-medium text-blue_gray-900">contributors</Heading>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
