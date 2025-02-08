"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { generateCarImageUrl } from "@/utils";
import { allCars } from "@/app/src/data";
import { IoFilter } from "react-icons/io5";
import React from "react";

export default function Comparison() {
  const [selectedCars, setSelectedCars] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({});
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  
  useEffect(() => {
    const storedCars = localStorage.getItem("selectedCars");
    if (storedCars) {
      setSelectedCars(JSON.parse(storedCars));
    } else if (allCars && allCars.length > 0) {
      setSelectedCars(allCars);
    }
  }, []);

  useEffect(() => {
    if (selectedCars.length > 0) {
      const flattenedSpecs = selectedCars.map(flattenSpecs);
      const defaultFilters: { [key: string]: boolean } = {};
      Object.keys(flattenedSpecs[0]).forEach((key) => {
        defaultFilters[key] = true;
      });
      setFilters(defaultFilters);
    }
  }, [selectedCars]);

  const clearComparison = () => {
    localStorage.removeItem("selectedCars");
    setSelectedCars([]);
    router.push("/");
  };

  const flattenSpecs = (car: any) => {
    let flatSpecs: { [key: string]: any } = {};
    for (let key in car) {
      if (typeof car[key] === "object" && car[key] !== null) {
        const nestedSpecs = flattenSpecs(car[key]);
        for (let nestedKey in nestedSpecs) {
          flatSpecs[`${formatKey(key)} ${formatKey(nestedKey)}`] = nestedSpecs[nestedKey];
        }
      } else {
        flatSpecs[formatKey(key)] = car[key] || "N/A";
      }
    }
    return flatSpecs;
  };

  const formatKey = (key: string) => {
    return key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  };

  const allFlattenedSpecs = selectedCars.map(flattenSpecs);
  const uniqueSections = new Set<string>();

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <main className="max-w-5xl mx-auto py-40">
      <h1 className="text-4xl font-bold mb-5 text-center">Compare Cars</h1>
      {selectedCars.length < 2 ? (
        <p className="text-red-500 text-center">Please select at least 2 cars to compare.</p>
      ) : (
        <div className="overflow-x-auto ">
          <table className="min-w-full overflow-x-auto">
          <thead>
  <tr>
    <th className="p-2 text-left"></th>
    {selectedCars.map((car, index) => (
      <th key={index} className="text-center align-middle">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={generateCarImageUrl(car)}
            alt={`${car.brand} ${car.model}`}
            width={200}
            height={100}
            priority
            className="object-contain"
          />
          <div className="mt-2 text-sm">{car.brand} {car.model}</div>
        </div>
      </th>
    ))}
  </tr>
</thead>

            <tbody>
              {allFlattenedSpecs.length > 0 &&
                Object.keys(allFlattenedSpecs[0]).map((key) => {
                  const sectionHeader = key.split(" ")[0];
                  if (!filters[key] || uniqueSections.has(sectionHeader)) return null;
                  uniqueSections.add(sectionHeader);

                  return (
                    <React.Fragment key={sectionHeader}>
                      <tr className="bg-blue-500 text-white cursor-pointer  max-w-[200px]" onClick={() => toggleSection(sectionHeader)}>
                        <td colSpan={selectedCars.length + 1} className="border p-2 font-semibold">
                          {sectionHeader} {collapsedSections[sectionHeader] ? "▼" : "▲"}
                        </td>
                      </tr>
                      {!collapsedSections[sectionHeader] &&
                        Object.keys(allFlattenedSpecs[0])
                          .filter(k => k.startsWith(sectionHeader))
                          .map((subKey) => (
                            <tr key={subKey}>
                              <td className="border p-2 font-semibold max-w-[200px] break-words whitespace-normal">
                                  {subKey}</td>
                              {selectedCars.map((_, index) => (
                                <td key={index} className="border p-2 font-semibold max-w-[200px] break-words whitespace-normal">
                                  {allFlattenedSpecs[index][subKey]}
                                </td>
                              ))}
                            </tr>
                          ))}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center mt-5">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={clearComparison}
        >
          Clear Comparison
        </button>
      </div>
    </main>
    </Suspense>
  );
}