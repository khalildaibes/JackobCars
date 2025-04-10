"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import MobileFilters from "../SearchCar";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.2
      }}
      className="relative w-full h-[550px] overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-[url(/images/img_background_820x1860.png)]"
        style={{
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Animated Gradient Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50 animate-gradient-x"
        />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center md:items-start px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
        {/* Left Content - Text with Animation */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: 0.4
          }}
          className="text-center md:text-right mt-20 md:mt-40 max-w-lg"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
              delay: 0.5
            }}
            className="text-white text-[30px] sm:text-[50px] md:text-[70px] font-bold leading-[40px] sm:leading-[70px] drop-shadow-lg"
          >
            {t("hero_title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
              delay: 0.6
            }}
            className="text-white/90 text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[29.6px] drop-shadow-md"
          >
            {t("hero_subtitle")}
          </motion.p>
        </motion.div>

        {/* Filters with Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: 0.7
          }}
          className="w-full md:mt-10 md:mt-16 flex flex-col md:flex-row items-center md:items-start"
        >
          <div className="w-full md:w-2/3 backdrop-blur-sm bg-white/10 rounded-xl p-4 shadow-xl">
            <MobileFilters
              selectedFuel={selectedFuel}
              selectedYear={selectedYear}
              setSelectedFuel={setSelectedFuel}
              setSelectedYear={setSelectedYear}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </motion.div>

        {/* Bottom Content - Category Buttons with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: 0.8
          }}
          className="absolute bottom-0 w-full flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8 p-4 hidden md:flex"
        >
          {[
            { name: t("category_suv"), icon: "/icons/suv.svg" },
            { name: t("category_sedan"), icon: "/icons/sedan.svg" },
            { name: t("category_hatchback"), icon: "/icons/hatchback.svg" },
            { name: t("category_coupe"), icon: "/icons/coupe.svg" },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99],
                delay: 0.9 + (index * 0.1)
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center px-4 sm:px-[41px] py-[16px] rounded-xl bg-blue-600/90 hover:bg-blue-700 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
