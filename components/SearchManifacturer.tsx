"use client";

import { SearchManufacturerProps } from "../types";
import { useState, Fragment } from "react";
import Image from "next/image";
import { manufacturers } from "../constants";
import { Combobox, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";

const SearchManufacturer = ({
  manufacturer,
  setManufacturer,
}: SearchManufacturerProps) => {
  const t = useTranslations("HomePage");
  const [query, setQuery] = useState("");

  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item) =>
          item.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="relative flex-1">
      {/* Car Logo Icon */}
      <Image
        src="/car-logo-with-bg.png" // Ensure the correct path
        width={20}
        height={20}
        alt={t("search_car_logo_alt")}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />

      {/* Search Input Field */}
      <Combobox value={manufacturer} onChange={setManufacturer}>
        <div className="relative">
          <Combobox.Input
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300 transition-all ease-in-out"
            placeholder={t("search_manufacturer_placeholder")}
            displayValue={(manufacturer: string) => manufacturer}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Dropdown Options */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-50 w-full border border-gray-300 rounded-lg bg-white shadow-lg mt-1 max-h-56 overflow-auto">
              {filteredManufacturers.length === 0 && query !== "" ? (
                <Combobox.Option
                  value={query}
                  className="px-4 py-2 text-gray-500"
                >
                  {t("search_no_results")}
                </Combobox.Option>
              ) : (
                filteredManufacturers.map((item) => (
                  <Combobox.Option
                    key={item}
                    className={({ active }) =>
                      `px-4 py-2 cursor-pointer ${
                        active ? "bg-blue-600text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {item}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchManufacturer;
