"use client";

import React, { useState } from "react";
import { SearchManifacturer } from ".";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const router = useRouter();

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
    model
      ? searchParms.set("manufacturer", manufacturer)
      : searchParms.delete("manufacturer");

    const newPathname = `${window.location.pathname}?${searchParms.toString()}`;

    router.push(newPathname, { scroll: false });
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManifacturer
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
        />
        <SearchButton otherClasses="sm:hidden" />
      </div>
      <div className="searchbar__item">
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
    </form>
  );
};

export default SearchBar;
