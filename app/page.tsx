"use client"; // This marks the component as a Client Component

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import ShowMore from "@/components/ShowMore";
import Hero from "@/components/Hero";
import { fetchCars } from "@/utils";
import { CarProps } from "@/types";
import {  SearchBar } from "@/components";
import MobileFilters from "@/components/SearchCar";
import dynamic from "next/dynamic";
const FindCarByPlate = dynamic(() => import('./findcarbyplate/FindCarByPlate'), { ssr: false });

export default function Home() {
  if (typeof window === 'undefined') {
    return null; // Ensure nothing runs during SSR
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get("fuel") || "");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
  const selectedManufacturer = searchParams.get("manufacturer");
  const selectedLimit = searchParams.get("limit");
  const selectedModel = searchParams.get("model");

  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCars() {
      setIsLoading(true);
      try {
        var allCars = [];
        if(selectedManufacturer || selectedModel)
           allCars = await fetchCars({
            manufacturer: selectedManufacturer || "",
            year: selectedYear ? parseInt(selectedYear, 10) : 2022,
            fuel: selectedFuel || "",
            limit: selectedLimit ? parseInt(selectedLimit, 10) : 12,
            model: selectedModel || "",
          });

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
    <main className="mt-16 p-4 pt-16 pb-0">
      <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
      <p>Explore the cars you might like</p>

      {/* Mobile Filters Component */}
      <MobileFilters
        selectedFuel={selectedFuel}
        selectedYear={selectedYear}
        setSelectedFuel={setSelectedFuel}
        setSelectedYear={setSelectedYear}
        handleFilterChange={handleFilterChange}
      />

      {/* Filters on larger screens */}
      <div className="hidden md:flex items-center justify-center space-x-4 mb-4 mx-auto">
                <SearchBar />
      
      </div>

      {isLoading ? (
        <div className="text-center text-xl py-10">Loading cars...</div>
      ) : !filteredCars.length ? (
        selectedManufacturer || selectedModel ?
        <div className="home__error-container">
          <h2 className="text-black text-xl font-bold">Oops, no results</h2>
        </div>
        :
        <div className="home__error-container">
          <h2 className="text-black text-xl font-bold">Select model Or Brand</h2>
        </div>

      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative py-20">
            {filteredCars.map((car: CarProps) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <ShowMore
            pageNumber={parseInt(selectedLimit || "12", 10) / 12}
            isNext={parseInt(selectedLimit || "12", 10) > filteredCars.length}
          />
        </section>
      )}

<h1 className="text-4xl font-extrabold pt-10">Find your car by plate number</h1>
<p>Explore the cars specs</p>
      <FindCarByPlate>


      </FindCarByPlate>

      <Hero />
    </main>
    </Suspense>
  );
}
