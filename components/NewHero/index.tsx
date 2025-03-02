"use client";


import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams,  } from "next/navigation";
import MobileFilters from "../SearchCar";

const HeroSection: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    setSelectedFuel(searchParams.get("fuel") || "");
    setSelectedYear(searchParams.get("year") || "");
  }, [searchParams]);

  const handleFilterChange = useCallback(
    (title: string, value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set(title, value);
      } else {
        params.delete(title);
      }
      router.push(`/carsearch?${params.toString()}`);
    },
    [router]
  );

  return (
    <div
      className="relative w-full h-[849.94px] bg-cover bg-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 flex flex-col items-center md:items-start"
      style={{
        backgroundImage:
          "url(https://s3-alpha-sig.figma.com/img/f333/523b/ec121d452f167e1f8b71256e4e01b459?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=od-2SYXOmdRZcTLJCp8f9y9~X5LhGFGY0ZxkNn5JM83ZZqwL9~qoYZggvDOhvN5cc7nT6DgyA1IKO07yjzic0run2sUi7D4s1ysO9zHhvMiKvX1yDO2xBy3RUtlgWpAQNX1yu3YSL6rebHpZ~VC82QrhjuNUQuESPAwHawLaBDg7scQ26Wx~NUA4BgvsmLh-S3S6UJ1UqZFtCPjqIiPtKQk7e9mYnI6IH9MtbGlFfqfiyusGPi~QIZIJesx4y9Q13qG9Apjpc1x3sjJhA8L3KaWfv4o-nlw6QVpMBcrBOByTQYP2mauagHP-kW4pxbWOyQhVjvYsO8WJ4QLy1WUgLA__)",
      }}
    >
      {/* Left Content - Text */}
      <div className="text-center md:text-left mt-20 md:mt-40 max-w-lg">
        <h1 className="text-white text-[30px] sm:text-[50px] md:text-[70px] font-bold leading-[40px] sm:leading-[70px]">
          Fast, Simple and Easy
        </h1>
        <p className="text-white text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[29.6px]">
          Shop Online. Pickup Today. It’s Fast, Simple and Easy. Learn More.
        </p>
      </div>

      {/* Filters - Positioned based on screen size */}
      <div className="w-full mt-10 md:mt-16 flex flex-col md:flex-row items-center md:items-start">
        {/* Mobile: Centered | Desktop: Left-aligned */}
        <div className="w-full  md:w-2/3">
          <MobileFilters
            selectedFuel={selectedFuel}
            selectedYear={selectedYear}
            setSelectedFuel={setSelectedFuel}
            setSelectedYear={setSelectedYear}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Search Bar
        <div className="w-full max-w-lg md:w-2/3 mt-6 md:mt-0 md:ml-10 bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
          <div className="flex justify-center md:justify-start gap-4 text-gray-800 text-[14px] sm:text-[16px] font-medium">
            <span className="border-b-2 border-gray-800">All</span>
            <span>New</span>
            <span>Used</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center border-b md:border-r md:border-b-0 pr-4 w-full md:w-auto">
              <span className="text-gray-800">Any Makes</span>
            </div>
            <div className="flex items-center border-b md:border-r md:border-b-0 px-4 w-full md:w-auto">
              <span className="text-gray-800">Any Models</span>
            </div>
            <span className="text-gray-800 text-center md:text-left">
              Price: All Prices
            </span>
            <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div> */}
      </div>

      {/* Bottom Content - Category Buttons */}
      <div className="absolute bottom-0 w-full flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8">
        {[
          { name: "SUV", icon: "/icons/suv.svg" },
          { name: "Sedan", icon: "/icons/sedan.svg" },
          { name: "Hatchback", icon: "/icons/hatchback.svg" },
          { name: "Coupe", icon: "/icons/coupe.svg" },
        ].map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-4 sm:px-[41px] py-[16px] rounded-t-lg inline-flex bg-blue-500 hover:bg-blue-600 transition"
          >
            <Image
              src={category.icon}
              width={26}
              height={35}
              alt={category.name}
            />
            <span className="ml-2 text-white text-[14px] sm:text-[15px] font-medium">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
