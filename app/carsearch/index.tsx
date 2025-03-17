"use client";

import CarCard from "../../components/CarCard";
import ShowMore from "../../components/ShowMore";
import { CarProps } from "../../types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchCars } from "../../utils"; // Ensure this function exists

export default function CarSearch1() {
  const searchParams = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract parameters from URL
  const selectedModel = searchParams.get("model") || "";
  const selectedManufacturer = searchParams.get("manufacturer") || "";
  const selectedFuel = searchParams.get("fuel") || "";
  const selectedYear = searchParams.get("year") || "";
  const selectedLimit = searchParams.get("limit") || "12";

  useEffect(() => {
    async function getCars() {
      setIsLoading(true);
      try {
        const cars = await fetchCars({
          model: selectedModel,
          manufacturer: selectedManufacturer,
          fuel: selectedFuel,
          year: selectedYear ? parseInt(selectedYear, 10) : undefined,
          limit: parseInt(selectedLimit, 10),
        });

        setFilteredCars(cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setFilteredCars([]);
      }
      setIsLoading(false);
    }

    getCars();
  }, [selectedModel, selectedManufacturer, selectedFuel, selectedYear, selectedLimit]);

  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto md:mt-[15%] mt-[5%]">
      {isLoading ? (
        <div className="text-center text-xl">Loading cars...</div>
      ) : filteredCars.length === 0 ? (
        <div className="home__error-container">
          <h2 className="text-black text-xl font-bold">Oops, no results</h2>
        </div>
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
            {filteredCars.map((car: CarProps) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <ShowMore
            pageNumber={parseInt(selectedLimit, 10) / 12}
            isNext={parseInt(selectedLimit, 10) > filteredCars.length}
          />
        </section>
      )}
    </div>
  );
}
