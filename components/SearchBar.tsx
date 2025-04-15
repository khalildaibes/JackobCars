"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { fuels, yearsOfProduction } from "../constants";
import CustomFilter from "../components/CustomFilter";
import SearchManifacturer from "../components/SearchManifacturer";
import { useTranslations } from "next-intl";

const SearchBar: React.FC = () => {
  const t = useTranslations("HomePage");
  const [manufacturer, setManufacturer] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSelectedFuel(searchParams.get("fuel") || "");
    setSelectedYear(searchParams.get("year") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!manufacturer && !model) {
      alert(t("search_alert"));
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (model) params.set("model", model.toLowerCase());
    else params.delete("model");

    if (manufacturer) params.set("manufacturer", manufacturer.toLowerCase());
    else params.delete("manufacturer");

    router.push(`/carsearch?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (title: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(title, value);
    else params.delete(title);

    router.push(`/carsearch?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row md:items-center bg-white shadow-md p-6 rounded-xl w-full max-w-4xl mx-auto gap-4"
    >
      <div className="relative flex-1">
        <SearchManifacturer
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
        />
      </div>

      {/* Model Input */}
      <div className="relative flex-1">
        <Image
          src="/model-icon.png"
          width={20}
          height={20}
          alt={t("search_model_alt")}
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
        <input
          type="text"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={t("search_model_placeholder")}
          className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-row items-center justify-center md:justify-start gap-4 z-10">
        <CustomFilter
          title={t("search_fuel_type")}
          options={fuels}
          selected={selectedFuel}          
          onChange={(value) => {
            setSelectedFuel(value);
            handleFilterChange("fuel", value);
          }}
        />
        <CustomFilter
          title={t("search_year")}
          options={yearsOfProduction}
          selected={selectedYear}
          
          onChange={(value) => {
            setSelectedYear(value);
            handleFilterChange("year", value);
          }}
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-600-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Image
          src="/magnifying-glass.svg"
          alt={t("search_button_alt")}
          width={20}
          height={20}
          className="m-2 "
        />
        {t("search")}
      </button>
    </form>
  );
};

export default SearchBar;
