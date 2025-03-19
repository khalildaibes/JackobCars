"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { SelectBox } from "../../components/SelectBox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../components/Breadcrumb";
import { Img } from "../../components/Img";
import Link from "next/link";

interface Car {
  id: number;
  category: string;
  image: string;
  title: string;
  price: number;
  fuel: string;
  transmission: string;
}
interface ProductProps {
  product: any; // Adjust the type to match the actual structure
}
export default function ProductDetailsPage({ product }: ProductProps) {
  const { slug } = useParams(); // Get the dynamic category slug
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ State for fetched products
  const [carGrid, setCarGrid] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [carCategories, setCarCategories] = useState<{ label: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "latest");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from Strapi
  const fetchProducts = async () => {
    try {

      const response = await fetch(`/api/deals?category=${slug}`);
      if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
  
      const data = await response.json();
      if (!data || !data.data) throw new Error("Invalid API response structure");
  
  
      // ✅ Transform API data into expected format
      const formattedCars = data.data.map((product: any) => ({
        id: product.id,
        category: product.categories || "Unknown", // ✅ Store categories as a string
        image: product.image?.length ? `http://68.183.215.202${product.image[0].url}` : "/default-car.png",
        title: product.name || "Unknown Car",
        price: product.price || 0,
        fuel: product.details?.car?.fuel || "Unknown",
        transmission: product.details?.car?.transmission || "Unknown",
      }));

      setCarGrid(formattedCars);
      setFilteredCars(formattedCars);
    } catch (error) {
      console.error("Error fetching products:", error);
      setCarGrid([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Process and split categories
  useEffect(() => {
    const categorySet = new Set<string>(); // ✅ Ensure unique categories

    carGrid.forEach((car) => {
      if (car.category) {
        car.category.split(",").forEach((cat) => {
          categorySet.add(cat.trim()); // ✅ Trim spaces & avoid duplicates
        });
      }
    });

    // ✅ Convert to an array and sort alphabetically
    const uniqueCategories = Array.from(categorySet).sort().map((category) => ({
      label: category,
      count: carGrid.filter((car) => car.category.includes(category)).length,
    }));

    setCarCategories([{ label: "All", count: carGrid.length }, ...uniqueCategories]);
  }, [carGrid]);

  // ✅ Update filtered results when filters change
  useEffect(() => {
    let filtered = [...carGrid];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((car) => car.category.split(",").map((c) => c.trim()).includes(selectedCategory));
    }

    if (selectedSort === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(filtered);
  }, [selectedCategory, selectedSort, carGrid]);

  // ✅ Handle Filter Change
  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(filterType, value);
    router.push(`?${params.toString()}`);

    if (filterType === "category") setSelectedCategory(value);
    if (filterType === "sort") setSelectedSort(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[5%]">
      {/* Header */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <Heading size="heading2xl" className="mt-2 text-3xl font-bold text-gray-800 capitalize">
            After Market Listings
          </Heading>
        </div>
      </div>

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
                    selectedCategory === cat.label ? "bg-blue-600text-blue" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label.replaceAll("_"," ")} ({cat.count})
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
              placeholder="Sort Cars "
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
          {/* Listings Grid */}
          <div className="mt-10">
            {loading ? (
              <div className="text-center text-lg font-medium mt-10">Loading products...</div>
            ) : (
              <>
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
                              <Img src={car.image} width={328} height={218} className="h-full w-full object-cover rounded-t-lg"  external={true}/>
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
