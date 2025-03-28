"use client";

import CarCard from "../../components/CarCard";
import ShowMore from "../../components/ShowMore";
import { CarProps } from "../../types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchCars } from "../../utils";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export default function CarSearch() {
  const t = useTranslations("CarSearch");
  const searchParams = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Results Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("search_results")}
        </h1>
        <p className="text-gray-600">
          {filteredCars.length > 0 
            ? t("results_count", { count: filteredCars.length })
            : t("no_results")}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">{t("loading")}</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !error && (
        <div>
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard 
                  key={car.id}
                  car={{
                    id: car.id,
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">{t("no_cars_found")}</p>
            </div>
          )}

          {/* Pagination */}
          {filteredCars.length > 0 && (
            <div className="mt-8">
              <ShowMore
                pageNumber={Math.ceil(filteredCars.length / 12)}
                isNext={filteredCars.length >= parseInt(selectedLimit)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
