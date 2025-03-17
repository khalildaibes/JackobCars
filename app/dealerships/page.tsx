"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { SelectBox } from "../../components/SelectBox";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";


// ----- Data Types -----

interface Company {
  id: number;
  logo: string;
  companyName: string;
  location: string;
  products: string[];       // products they offer
  priceRange: string;       // example: "$20K - $50K"
  categories: string[];     // categories they provide
}

interface FilterOption {
  label: string;
  value: string;
}

// ----- Sample Data (15 Companies) -----

const companyGridData: Company[] = [
  {
    id: 1,
    logo: "/images/company1.png",
    companyName: "Alpha Motors",
    location: "New York",
    products: ["Sedan", "SUV"],
    priceRange: "$20K - $50K",
    categories: ["Cars", "Trucks"],
  },
  {
    id: 2,
    logo: "/images/company2.png",
    companyName: "Beta Autos",
    location: "Los Angeles",
    products: ["SUV", "Convertible"],
    priceRange: "$25K - $60K",
    categories: ["Luxury", "Sports"],
  },
  {
    id: 3,
    logo: "/images/company3.png",
    companyName: "Gamma Vehicles",
    location: "Chicago",
    products: ["Truck", "Sedan"],
    priceRange: "$15K - $45K",
    categories: ["Commercial", "Cars"],
  },
  {
    id: 4,
    logo: "/images/company4.png",
    companyName: "Delta Car Co.",
    location: "Houston",
    products: ["Coupe", "SUV"],
    priceRange: "$18K - $55K",
    categories: ["Cars", "Electric"],
  },
  {
    id: 5,
    logo: "/images/company5.png",
    companyName: "Epsilon Rides",
    location: "Phoenix",
    products: ["Sedan", "Hatchback"],
    priceRange: "$17K - $40K",
    categories: ["Economy", "Family"],
  },
  {
    id: 6,
    logo: "/images/company6.png",
    companyName: "Zeta Motors",
    location: "Philadelphia",
    products: ["Truck", "SUV"],
    priceRange: "$22K - $70K",
    categories: ["Trucks", "Commercial"],
  },
  {
    id: 7,
    logo: "/images/company7.png",
    companyName: "Eta Auto Group",
    location: "San Antonio",
    products: ["Sedan", "Convertible"],
    priceRange: "$30K - $80K",
    categories: ["Luxury", "Sports"],
  },
  {
    id: 8,
    logo: "/images/company8.png",
    companyName: "Theta Cars",
    location: "San Diego",
    products: ["SUV", "Truck"],
    priceRange: "$28K - $75K",
    categories: ["Cars", "Trucks"],
  },
  {
    id: 9,
    logo: "/images/company9.png",
    companyName: "Iota Vehicles",
    location: "Dallas",
    products: ["Sedan", "SUV"],
    priceRange: "$20K - $55K",
    categories: ["Family", "Economy"],
  },
  {
    id: 10,
    logo: "/images/company10.png",
    companyName: "Kappa Autos",
    location: "San Jose",
    products: ["Electric", "Sedan"],
    priceRange: "$35K - $90K",
    categories: ["Electric", "Luxury"],
  },
  {
    id: 11,
    logo: "/images/company11.png",
    companyName: "Lambda Motors",
    location: "Austin",
    products: ["Truck", "SUV"],
    priceRange: "$25K - $65K",
    categories: ["Trucks", "Commercial"],
  },
  {
    id: 12,
    logo: "/images/company12.png",
    companyName: "Mu Auto",
    location: "Jacksonville",
    products: ["Sedan", "Coupe"],
    priceRange: "$18K - $45K",
    categories: ["Cars", "Economy"],
  },
  {
    id: 13,
    logo: "/images/company13.png",
    companyName: "Nu Rides",
    location: "Fort Worth",
    products: ["SUV", "Convertible"],
    priceRange: "$27K - $70K",
    categories: ["Luxury", "Sports"],
  },
  {
    id: 14,
    logo: "/images/company14.png",
    companyName: "Xi Motors",
    location: "Columbus",
    products: ["Truck", "SUV"],
    priceRange: "$23K - $68K",
    categories: ["Trucks", "Commercial"],
  },
  {
    id: 15,
    logo: "/images/company15.png",
    companyName: "Omicron Cars",
    location: "San Francisco",
    products: ["Electric", "Sedan"],
    priceRange: "$40K - $100K",
    categories: ["Electric", "Luxury"],
  },
];

// ----- Generate Dynamic Filter Options -----

// For Location:
const uniqueLocations = Array.from(new Set(companyGridData.map(c => c.location)));
const locationOptions: FilterOption[] = [
  { label: "All Locations", value: "all" },
  ...uniqueLocations.map(loc => ({ label: loc, value: loc })),
];

// For Products:
const uniqueProducts = Array.from(new Set(companyGridData.flatMap(c => c.products)));
const productOptions: FilterOption[] = [
  { label: "All Products", value: "all" },
  ...uniqueProducts.map(prod => ({ label: prod, value: prod })),
];

// For Price Range, we hardcode options (adjust as needed):
const priceOptions: FilterOption[] = [
  { label: "All Prices", value: "all" },
  { label: "Under $30K", value: "under30k" },
  { label: "$30K - $60K", value: "30kto60k" },
  { label: "Above $60K", value: "above60k" },
];

// For Categories:
const uniqueCategories = Array.from(new Set(companyGridData.flatMap(c => c.categories)));
const categoryOptions: FilterOption[] = [
  { label: "All Categories", value: "all" },
  ...uniqueCategories.map(cat => ({ label: cat, value: cat })),
];

// ----- Company Card Component -----

interface CompanyCardProps {
  company: Company;
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <div className="flex items-center space-x-4">
        <Img
          src={company.logo}
          alt={company.companyName}
          width={50}
          height={50}
          className="w-12 h-12 object-contain"
        />
        <div>
          <Heading as="h3" className="text-lg font-bold">
            {company.companyName}
          </Heading>
          <Text as="p" className="text-sm text-gray-600">
            {company.location}
          </Text>
        </div>
      </div>
      <div className="mt-3">
        <Text as="p" className="text-sm text-gray-700">
          Products: {company.products.join(", ")}
        </Text>
        <Text as="p" className="text-sm text-gray-700">
          Price Range: {company.priceRange}
        </Text>
        <Text as="p" className="text-sm text-gray-700">
          Categories: {company.categories.join(", ")}
        </Text>
      </div>
    </div>
  );
}

// ----- Companies Page Component -----

export default function CompaniesPage() {
  // Store filter values as strings.
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter companies.
  const filteredCompanies = companyGridData.filter((company) => {
    const locationMatch =
      locationFilter === "all" || company.location === locationFilter;
    const productMatch =
      productFilter === "all" || company.products.includes(productFilter);
    const categoryMatch =
      categoryFilter === "all" || company.categories.includes(categoryFilter);
    let priceMatch = true;
    // For demonstration purposes, we do a simple string check on priceRange.
    if (priceFilter === "under30k") {
      priceMatch = company.priceRange.startsWith("$20") || company.priceRange.startsWith("$17");
    } else if (priceFilter === "30kto60k") {
      priceMatch = company.priceRange.includes("30") || company.priceRange.includes("40") || company.priceRange.includes("50") || company.priceRange.includes("60");
    } else if (priceFilter === "above60k") {
      priceMatch = company.priceRange.includes("70") || company.priceRange.includes("80") || company.priceRange.includes("90") || company.priceRange.includes("100");
    }
    return locationMatch && productMatch && categoryMatch && priceMatch;
  });

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Header & Breadcrumb */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <Breadcrumb
            separator={<Text className="text-sm text-gray-500">/</Text>}
            className="flex flex-wrap items-center gap-1"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Text as="p" className="text-sm text-indigo-400">Home</Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">
                <Text as="p" className="text-sm text-gray-800">Companies</Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading size="heading2xl" className="mt-2 text-3xl font-bold text-gray-800 capitalize">
            Companies
          </Heading>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <SelectBox
            shape="square"
            name="Location Filter"
            placeholder={locationOptions.find(opt => opt.value === locationFilter)?.label || "All Locations"}
            options={locationOptions}
            value={locationFilter}
            onChange={(newValue: unknown) => {
              setLocationFilter(newValue as string);
            }}
            className="w-full"
          />
          <SelectBox
            shape="square"
            name="Product Filter"
            placeholder={productOptions.find(opt => opt.value === productFilter)?.label || "All Products"}
            options={productOptions}
            value={productFilter}
            onChange={(newValue: unknown) => {
              setProductFilter(newValue as string);
            }}
            className="w-full"
          />
          <SelectBox
            shape="square"
            name="Price Filter"
            placeholder={priceOptions.find(opt => opt.value === priceFilter)?.label || "All Prices"}
            options={priceOptions}
            value={priceFilter}
            onChange={(newValue: unknown) => {
              setPriceFilter(newValue as string);
            }}
            className="w-full"
          />
          <SelectBox
            shape="square"
            name="Category Filter"
            placeholder={categoryOptions.find(opt => opt.value === categoryFilter)?.label || "All Categories"}
            options={categoryOptions}
            value={categoryFilter}
            onChange={(newValue: unknown) => {
              setCategoryFilter(newValue as string);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense fallback={<div>Loading companies...</div>}>
            {filteredCompanies.map((company) => (
              <Link key={company.id} href={`/company/${company.id}`}>
                <div className="cursor-pointer">
                  <CompanyCard company={company} />
                </div>
              </Link>
            ))}
          </Suspense>
        </div>
      </div>

      {/* Pagination (if needed) */}
      <div className="container mx-auto px-4 pb-8 flex justify-center gap-3">
        <Button size="2xl" shape="round" className="min-w-[40px] rounded-full border border-gray-200 px-3">1</Button>
        <Button size="2xl" className="min-w-[40px] rounded-full px-3">2</Button>
        <div className="flex flex-1 justify-center rounded-full border border-gray-200 bg-gray-50 p-3">
          <Img src="/images/arrow_right.svg" width={10} height={12} alt="Next" className="h-3" />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-4 shadow-sm">
        <Text as="p" className="text-center text-sm text-gray-600">
          © 2025 Your Company Name. All rights reserved.
        </Text>
      </div>
    </div>
  );
}
