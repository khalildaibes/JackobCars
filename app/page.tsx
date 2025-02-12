"use client"; // This marks the component as a Client Component

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import ShowMore from "@/components/ShowMore";
import Hero from "@/components/Hero";
import { fetchCars } from "@/utils";
import { CarProps } from "@/types";
import { SearchBar } from "@/components";
import MobileFilters from "@/components/SearchCar";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";

const FindCarByPlate = dynamic(() => import("./findcarbyplate/FindCarByPlate"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get("fuel") || "");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
  const selectedManufacturer = searchParams.get("manufacturer");
  const selectedLimit = searchParams.get("limit");
  const selectedModel = searchParams.get("model");

  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function getCars() {
      setIsLoading(true);
      try {
        let allCars = [];
        if (selectedManufacturer || selectedModel) {
          allCars = await fetchCars({
            manufacturer: selectedManufacturer || "",
            year: selectedYear ? parseInt(selectedYear, 10) : 2022,
            fuel: selectedFuel || "",
            limit: selectedLimit ? parseInt(selectedLimit, 10) : 12,
            model: selectedModel || "",
          });
        }
        setFilteredCars(allCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setFilteredCars([]);
      }
      setIsLoading(false);
    }

    getCars();
  }, [selectedFuel, selectedYear, selectedManufacturer, selectedLimit, selectedModel]);

  const handleFilterChange = (title: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(title, value);
    } else {
      params.delete(title);
    }
    router.push(`/carsearch?${params.toString()}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="p-4 pt-32 items-center justify-center">
        {/* Filters for larger screens */}
        <div className="flex min-h-full items-center justify-center p-4  pt-0 text-center">
          <div className="hidden sm:block h-[250px]">
            
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center text-xl">Loading cars...</div>
        ) : !filteredCars.length ? (
          selectedManufacturer || selectedModel ? (
            <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            </div>
          ) : null
        ) : (
          <section>
            <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            <ShowMore
              pageNumber={parseInt(selectedLimit || "12", 10) / 12}
              isNext={parseInt(selectedLimit || "12", 10) > filteredCars.length}
            />
          </section>
        )}

        {/* 3D Toggle Button Section */}
        <div className="flex justify-center max-w-[640px] md:max-w-none">
          <motion.div
            className="relative w-full flex justify-center items-center sm:hidden"
            transition={{ duration: 0.5 }}
          >
            {activeIndex === 0 && (
              <motion.div
                className="h-full flex items-center justify-center rounded-lg shadow-lg text-xl font-bold transition-transform plate_background"
                transition={{ duration: 0.8 }}
              >
                <Hero />
              </motion.div>
            )}
            {activeIndex === 1 && (
              <motion.div
                className="w-full flex items-center justify-center rounded-lg shadow-lg text-xl font-bold transition-transform"
                transition={{ duration: 0.8 }}
              >
                <div className="mt-16 pt-16">
                  <h1 className="text-center text-3xl font-extrabold">Find your car by plate number</h1>
                  <p className="text-center">Explore the car specs</p>
                  <FindCarByPlate />
                </div>
              </motion.div>
            )}
            {activeIndex === 2 && (
              <div className="mt-16">
                <h1 className="text-4xl font-extrabold text-center sm:hidden">Car Catalogue</h1>
                <p className="text-center py-2">Explore the cars you might like</p>
                <MobileFilters
                  selectedFuel={selectedFuel}
                  selectedYear={selectedYear}
                  setSelectedFuel={setSelectedFuel}
                  setSelectedYear={setSelectedYear}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Manual Toggle Buttons */}
        <div className="flex justify-center mt-5 gap-4 md:hidden">
          <button
            onClick={() => {
              setActiveIndex(0);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="ml-10 px-3 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            Featured Cars
          </button>
          <button
            onClick={() => {
              setActiveIndex(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="ml-2 mr-2 px-3 py-3 rounded-xl bg-blue-700 text-white font-semibold shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg active:scale-95"
          >
            Plate Info
          </button>
          <button
            onClick={() => {
              setActiveIndex(2);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mr-10 px-3 py-3 rounded-xl bg-blue-900 text-white font-semibold shadow-md transition-all duration-300 hover:bg-purple-700 hover:shadow-lg active:scale-95"
          >
            Recommended for you
          </button>
        </div>

        {/* Desktop Layout for Frames */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          <motion.div
            className="flex items-center justify-center rounded-lg shadow-lg text-xl font-bold transition-transform"
            transition={{ duration: 0.8 }}
          >
            <Hero />
          </motion.div>
          <motion.div
            className="w-full flex items-center justify-center rounded-lg shadow-lg text-xl font-bold transition-transform"
            transition={{ duration: 0.8 }}
          >
            <div className="mt-16 pt-16">
              <h1 className="text-center text-3xl font-extrabold ">Find your car by plate number</h1>
              <p className="text-center ">Explore the car specs</p>
              <FindCarByPlate />
            </div>
          </motion.div>
          <div className="mt-16">
            <h1 className="text-4xl font-extrabold text-center">Car Catalogue</h1>
            <p className="text-center py-2">Explore the cars you might like</p>
            <MobileFilters
              selectedFuel={selectedFuel}
              selectedYear={selectedYear}
              setSelectedFuel={setSelectedFuel}
              setSelectedYear={setSelectedYear}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>

        
{/* Blogs Section */}
<div className="titleParent w-full max-w-screen-lg mx-auto overflow-x-hidden px-4">
{/* Blogs Section */}
<div className="titleParent w-full max-w-screen-xl mx-auto overflow-x-hidden px-6">
  {/* Section Title */}
  <div className="title w-full text-center">
    <div className="titleChild" />
    <div className="featuredWrapper">
      <div className="featured text-2xl font-bold">Blogs</div>
    </div>
  </div>
  
  {/* Blog Container */}
  <div className="blogParent flex flex-wrap justify-center gap-6">
    {/* Blog 1 */}
    <div className="blog ">
      <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
        <Image
          className="frameChild w-full h-auto object-cover"
          width={500}
          height={350}
          alt="Porsche Cayenne SUV"
          src="/hero.png"
        />
        <div className="findYourPlaceWithWrapper p-4 text-center">
          <div className="findYourPlace text-lg font-medium">
            Is the 2024 Porsche Cayenne S a Good SUV? 4 Pros and 3 Cons
          </div>
        </div>
      </div>
    </div>

    {/* Blog 2 */}
    <div className="blog ">
      <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
        <Image
          className="frameChild w-full h-auto object-cover"
          width={500}
          height={350}
          alt="Toyota RAV4"
          src="/hero.png"
        />
        <div className="findYourPlaceWithWrapper p-4 text-center">
          <div className="findYourPlace text-lg font-medium">
            Compact Steamroller: 2024 Toyota RAV4 Starts at $29,825
          </div>
        </div>
      </div>
    </div>

    {/* Blog 3 */}
    <div className="blog ">
      <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
        <Image
          className="frameChild w-full h-auto object-cover"
          width={500}
          height={350}
          alt="Kia Niro EV"
          src="/hero.png"
        />
        <div className="findYourPlaceWithWrapper p-4 text-center">
          <div className="findYourPlace text-lg font-medium">
            2024 Kia Niro EV Costs $50 More, Nearly Unchanged Otherwise
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


</div>




      </main>
    </Suspense>
  );
}
