"use client";

import React, { useState } from "react";
import SearchManifacturer from "@/components/SearchManifacturer";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { fuels, yearsOfProduction } from "@/constants";
import CustomFilter from "@/components/CustomFilter";

const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!manufacturer && !model) {
      alert("Please enter a car manufacturer or model.");
      return;
    }

    const params = new URLSearchParams();
    if (model) params.set("model", model);
    if (manufacturer) params.set("manufacturer", manufacturer);
    if (selectedFuel) params.set("fuel", selectedFuel);
    if (selectedYear) params.set("year", selectedYear);

    router.push(`/carsearch?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-center bg-white shadow-md p-6 rounded-lg w-full max-w-4xl mx-auto gap-4"
    >
      {/* Manufacturer Input
      <div className="flex-1">
        <SearchManifacturer
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
        />
      </div> */}
       {/* Model Input */}
       <div className="relative flex-1">
        <Image
          src="/model-icon.png"
          width={20}
          height={20}
          alt="car-model"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
        <input
          type="text"
          name="model"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          placeholder="Enter Model (e.g., Tiguan)"
          className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Model Input */}
      <div className="relative flex-1">
        <Image
          src="/model-icon.png"
          width={20}
          height={20}
          alt="car-model"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
        <input
          type="text"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Enter Model (e.g., Tiguan)"
          className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <CustomFilter
          title="Fuel Type"
          options={fuels}
          selected={selectedFuel}
          onChange={(value) => setSelectedFuel(value)}
        />
        <CustomFilter
          title="Year"
          options={yearsOfProduction}
          selected={selectedYear}
          onChange={(value) => setSelectedYear(value)}
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition"
      >
        <Image
          src="/magnifying-glass.svg"
          alt="Search"
          width={20}
          height={20}
          className="mr-2"
        />
        Search
      </button>
    </form>
  );
};

export default SearchBar;
