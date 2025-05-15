"use client";

import CarCard from "../../components/CarCard";
import ShowMore from "../../components/ShowMore";
import { CarProps } from "../../types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchCars } from "../../utils";
import { useTranslations } from "next-intl";
import { Loader2, Search } from "lucide-react";

export default function CarSearch() {
  const t = useTranslations("CarSearch");
  const searchParams = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plateNumber, setPlateNumber] = useState("");

  // Extract parameters from URL
  const selectedModel = searchParams.get("model") || "";
  const selectedManufacturer = searchParams.get("manufacturer") || "";
  const selectedFuel = searchParams.get("fuel") || "";
  const selectedYear = searchParams.get("year") || "";
  const selectedLimit = searchParams.get("limit") || "12";

  useEffect(() => {
    async function getCars() {
      setIsLoading(true);
      setError(null);
      try {
        const cars = await fetchCars({
          model: selectedModel,
          manufacturer: selectedManufacturer,
          fuel: selectedFuel,
          slug: "selectedSlug",
          year: selectedYear ? parseInt(selectedYear, 10) : undefined,
          limit: parseInt(selectedLimit, 10),
        });

        setFilteredCars(cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError(error instanceof Error ? error.message : t("error_fetching"));
        setFilteredCars([]);
      } finally {
        setIsLoading(false);
      }
    }

    getCars();
  }, [selectedModel, selectedManufacturer, selectedFuel, selectedYear, selectedLimit, t]);

  const handlePlateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement plate search logic here
    console.log("Searching for plate:", plateNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Plate Search */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/car-showroom.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">
            Search Cars by Plate Number
          </h1>
          <p className="text-xl text-white mb-12 text-center max-w-2xl">
            Instantly find car details and history using our plate search tool
          </p>
          
          <form onSubmit={handlePlateSearch} className="w-full max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="Enter license plate"
                className="w-full px-6 py-4 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Plate Number</h3>
              <p className="text-gray-600">Type in the license plate into search box</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find the Vehicle</h3>
              <p className="text-gray-600">Get instant access to car details and history</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Make Informed Choices</h3>
              <p className="text-gray-600">Use the insights to buy, sell, or research confidently</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">{t("loading")}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredCars.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard 
                  key={car.id}
                  car={{
                    hostname: car.store.hostname,
                    id: car.id,
                    slug: car.slug,
                    mainImage: car.mainImage,
                    
                    title: car.title,
                    year: car.year,
                    mileage: String(car.mileage),
                    price: car.price,
                    bodyType: car.class || "",
                    fuelType: car.fuel,
                    description: car.details
                  }}
                />
              ))}
            </div>
            <div className="mt-8">
              <ShowMore
                pageNumber={Math.ceil(filteredCars.length / 12)}
                isNext={filteredCars.length >= parseInt(selectedLimit)}
              />
            </div>
          </>
        )}

        {!isLoading && !error && filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">{t("no_cars_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
