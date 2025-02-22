"use client";

import React, { useState } from "react";
import { CustomFilter, SearchManifacturer } from ".";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { fuels, yearsOfProduction } from "@/constants";

const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get("fuel") || "");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
  // const selectedManufacturer = searchParams.get("manufacturer");
  // const selectedLimit = searchParams.get("limit");
  // const selectedModel = searchParams.get("model");

  const handleFilterChange = (title: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(title, value);
    } else {
      params.delete(title);
    }
    router.push(`/carsearch?${params.toString()}`);
  };

  const SearchButton = ({ otherClasses }: { otherClasses: string }) => {
    return (
      <button type="submit" className={`-ml-3 z-10 ${otherClasses}`}>
        <Image
          src="/magnifying-glass.svg"
          alt="magnifying glass"
          width={40}
          height={40}
          className="object-contain"
        />
      </button>
    );
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (manufacturer === "" && model === "") {
      return alert("Please fill in the search bar");
    }

    updateSearchParams(model.toLowerCase(), manufacturer.toLowerCase());
  };

  const updateSearchParams = (model: string, manufacturer: string) => {
    const searchParms = new URLSearchParams(window.location.search);

    model ? searchParms.set("model", model) : searchParms.delete("model");
    manufacturer
      ? searchParms.set("manufacturer", manufacturer)
      : searchParms.delete("manufacturer");

    const newPathname = `${window.location.pathname}?${searchParms.toString()}`;

    router.push(newPathname, { scroll: false });
  };

  return (
    <form className="searchbar items-center justify-center" onSubmit={handleSearch}>
      <div className="searchbar__item  px-2 z-50">
        <SearchManifacturer
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
        />
        <SearchButton otherClasses="sm:hidden" />
        
      </div>
      <div className="searchbar__item px-2">
        <Image
          src="/model-icon.png"
          width={25}
          height={25}
          className="absolute w-[20px] height-[20px] ml-4"
          alt="car-modal"
        />
        <input
          type="text"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Tigaun"
          className="searchbar__input"
        />
        <SearchButton otherClasses="sm:hidden" />
      </div>
      <SearchButton otherClasses="max-sm:hidden" />
      <div className="flex space-x-4">
          <CustomFilter
            title="fuel"
            options={fuels}
            onChange={(value) => {
              setSelectedFuel(value);
              handleFilterChange("fuel", value);
            }}
            selected={selectedFuel}
          />
          <CustomFilter
            title="year"
            options={yearsOfProduction}
            onChange={(value) => {
              setSelectedYear(value);
              handleFilterChange("year", value);
            }}
            selected={selectedYear}
          />
        </div>
    </form>
  );
};

export default SearchBar;
