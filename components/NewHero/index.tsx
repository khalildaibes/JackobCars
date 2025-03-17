"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import MobileFilters from "../SearchCar";
import { useTranslations } from "next-intl";

const HeroSection: React.FC = () => {
  const t = useTranslations("HomePage");
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
      className="relative w-full h-[849.94px] bg-cover bg-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 flex flex-col items-center md:items-start bg-[url(/images/img_background_820x1860.png)]"
    
    >
      {/* Left Content - Text */}
      <div className="text-center md:text-left mt-20 md:mt-40 max-w-lg">
        <h1 className="text-white text-[30px] sm:text-[50px] md:text-[70px] font-bold leading-[40px] sm:leading-[70px]">
          {t("hero_title")}
        </h1>
        <p className="text-white text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[29.6px]">
          {t("hero_subtitle")}
        </p>
      </div>

      {/* Filters - Positioned based on screen size */}
      <div className="w-full mt-10 md:mt-16 flex flex-col md:flex-row items-center md:items-start">
        <div className="w-full  md:w-2/3">
          <MobileFilters
            selectedFuel={selectedFuel}
            selectedYear={selectedYear}
            setSelectedFuel={setSelectedFuel}
            setSelectedYear={setSelectedYear}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Bottom Content - Category Buttons */}
      <div className="absolute bottom-0 w-full flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8">
        {[
          { name: t("category_suv"), icon: "/icons/suv.svg" },
          { name: t("category_sedan"), icon: "/icons/sedan.svg" },
          { name: t("category_hatchback"), icon: "/icons/hatchback.svg" },
          { name: t("category_coupe"), icon: "/icons/coupe.svg" },
        ].map((category, index) => (
          <div
            key={index}
            className=" flex items-center justify-center px-4 sm:px-[41px] py-[16px] rounded-t-lg inline-flex bg-blue-600 hover:bg-blue-600 transition"
          >
            <Image
              src={category.icon}
              width={26}
              height={35}
              alt={category.name}
              className="invert"
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
