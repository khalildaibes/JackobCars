"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { generateCarImageUrl } from "@/utils"; // Ensure this function generates the correct image URLs

export default function Comparison() {
  const [selectedCars, setSelectedCars] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedCars = localStorage.getItem("selectedCars");
    if (storedCars) {
      setSelectedCars(JSON.parse(storedCars));
    }
  }, []);

  const clearComparison = () => {
    localStorage.removeItem("selectedCars");
    setSelectedCars([]);
    router.push("/");
  };

  return (
    <main className="max-w-5xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5 text-center">Compare Cars</h1>

      {selectedCars.length < 2 ? (
        <p className="text-red-500 text-center">Please select at least 2 cars to compare.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full ">
            {/* Table Header with Images */}
            <thead>
              <tr className="">
                <th className=" p-2 text-left"> </th>
                {selectedCars.map((car, index) => (
                  <th key={index} className="text-center">
                    <div className="relative w-full h-40 my-3">
                      <Image
                        src={generateCarImageUrl(car)}
                        alt={`${car.make} ${car.model}`}
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                    {car.make} {car.model}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body with Specs */}
            <tbody>
              {/* Year */}
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Year</td>
                {selectedCars.map((car, index) => (
                  <td key={index} className="border border-gray-300 p-2 text-center">
                    {car.year}
                  </td>
                ))}
              </tr>
              
              {/* Transmission */}
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Transmission</td>
                {selectedCars.map((car, index) => (
                  <td key={index} className="border border-gray-300 p-2 text-center">
                    {car.transmission === "a" ? "Automatic" : "Manual"}
                  </td>
                ))}
              </tr>

              {/* Drive Type */}
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Drive Type</td>
                {selectedCars.map((car, index) => (
                  <td key={index} className="border border-gray-300 p-2 text-center">
                    {car.drive.toUpperCase()}
                  </td>
                ))}
              </tr>

              {/* City MPG */}
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">City MPG</td>
                {selectedCars.map((car, index) => (
                  <td key={index} className="border border-gray-300 p-2 text-center">
                    {car.city_mpg} MPG
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Clear Comparison Button */}
      <div className="flex justify-center mt-5">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={clearComparison}
        >
          Clear Comparison
        </button>
      </div>
    </main>
  );
}
