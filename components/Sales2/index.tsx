"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Heading } from "../Heading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../Breadcrumb";
import { Button } from "../Button";
import { Img } from "../Img";
import { SelectBox } from "../SelectBox";
import { Text } from "../Text";

interface Car {
  id: number;
  category: string;
  image: string;
  title: string;
  price: number;
  fuel: string;
  transmission: string;
}

interface Sales2Props {
  carGrid: Car[];
  breadcrumbLinks: { label: string; href: string }[];
  pageTitle: string;
}

export default function Sales2({ carGrid, breadcrumbLinks, pageTitle }: Sales2Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "latest");
  const [filteredCars, setFilteredCars] = useState(carGrid);
  const [carCategories, setCarCategories] = useState<{ label: string; count: number }[]>([]);

  // Calculate Category Counts Dynamically
  useEffect(() => {
    const categoryCounts = carGrid.reduce<{ [key: string]: number }>((acc, car) => {
      acc[car.category] = (acc[car.category] || 0) + 1;
      return acc;
    }, {});

    const dynamicCategories = [
      { label: "All", count: carGrid.length },
      ...Object.entries(categoryCounts).map(([category, count]) => ({ label: category, count })),
    ];

    setCarCategories(dynamicCategories);
  }, [carGrid]);

  // Update filtered results when filters change
  useEffect(() => {
    let filtered = carGrid;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((car) => car.category === selectedCategory);
    }

    if (selectedSort === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(filtered);
  }, [selectedCategory, selectedSort]);

  // Handle Filter Change
  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(filterType, value);
    router.push(`?${params.toString()}`);

    if (filterType === "category") setSelectedCategory(value);
    if (filterType === "sort") setSelectedSort(value);
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <Breadcrumb className="flex flex-wrap items-center gap-1">
            {breadcrumbLinks.map((link, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={link.href}>
                  <Text as="p" className={`text-sm ${index === breadcrumbLinks.length - 1 ? "text-gray-800" : "text-indigo-400"}`}>
                    {link.label}
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Heading size="heading2xl" className="mt-2 text-3xl font-bold text-gray-800 capitalize">
            {pageTitle}
          </Heading>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
            <Heading size="text5xl" className="text-lg font-medium text-gray-800">Categories</Heading>
            <div className="mt-4 space-y-3">
              {carCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleFilterChange("category", cat.label)}
                  className={`w-full text-left p-2 rounded-lg ${
                    selectedCategory === cat.label ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Heading size="text5xl" className="text-lg font-medium text-gray-800">Sort By</Heading>
            <SelectBox
              shape="square"
              name="sortOptions"
              placeholder="Sort Cars"
              options={[
                { label: "Sort by Latest", value: "latest" },
                { label: "Sort by Price: Low to High", value: "price_low" },
                { label: "Sort by Price: High to Low", value: "price_high" },
              ]}
              value={selectedSort}
              onChange={(option) => handleFilterChange("sort", option.value)}
              className="mt-4 w-full bg-cover bg-no-repeat px-3 text-gray-800"
            />
          </div>
        </aside>

        {/* Car Listings Grid */}
        <main className="w-full lg:w-3/4">
          <div className="mb-4">
            <Text as="p" className="text-sm text-gray-700">Showing {filteredCars.length} results</Text>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Suspense fallback={<div>Loading cars...</div>}>
              {filteredCars.map((car) => (
                <Link key={car.id} href={`/detailsvone?car=${car.id}`}>
                  <div className="px-4 cursor-pointer flex-shrink-0 w-80">
                    <div className="flex flex-col rounded-lg bg-white shadow-md">
                      <div className="relative h-56">
                        <Img src={car.image} width={328} height={218} className="h-full w-full object-cover rounded-t-lg" />
                      </div>
                      <div className="p-4">
                        <Heading size="text5xl" as="p" className="text-sm font-medium text-gray-800">{car.title}</Heading>
                        <Text as="p" className="text-xs text-gray-600">{car.fuel} • {car.transmission}</Text>
                        <Heading size="headings" as="h5" className="text-base font-bold text-gray-800">${car.price.toLocaleString()}</Heading>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
