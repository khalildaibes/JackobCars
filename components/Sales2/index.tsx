"use client";

import React, { Suspense } from "react";
import Link from "next/link";

import ShopPageBackgroundBorder from "../../components/ShopPageBackgroundBorder";
import ShopPageBackgroundBorder1 from "../../components/ShopPageBackgroundBorder1";
import { useTranslations } from "next-intl";
import { Heading } from "../Heading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../Breadcrumb";
import { Button } from "../Button";
import { Img } from "../Img";
import { SeekBar } from "../SeekBar";
import { SelectBox } from "../SelectBox";
import { Text } from "../Text";


const carCategories = [
  { label: "Sedan", count: 12 },
  { label: "SUV", count: 8 },
  { label: "Truck", count: 5 },
  { label: "Coupe", count: 3 },
  { label: "Convertible", count: 4 },
];

const dropDownOptions = [
  { label: "Sort by Latest", value: "latest" },
  { label: "Sort by Price: Low to High", value: "price_low" },
  { label: "Sort by Price: High to Low", value: "price_high" },
];

const carGrid = [
  {
    id: 1,
    image: "/images/car1.jpg",
    title: "Toyota Camry 2020",
    description: "Reliable and fuel-efficient sedan.",
    price: "$20,000",
    miles: "20,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 2,
    image: "/images/car2.jpg",
    title: "Honda Accord 2019",
    description: "Spacious with modern features.",
    price: "$18,000",
    miles: "18,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 3,
    image: "/images/car3.jpg",
    title: "Ford Focus 2018",
    description: "Compact design with great performance.",
    price: "$15,000",
    miles: "25,000 Miles",
    fuel: "Diesel",
    transmission: "Manual",
  },
  {
    id: 4,
    image: "/images/car4.jpg",
    title: "Chevrolet Malibu 2021",
    description: "Modern styling with efficient performance.",
    price: "$22,000",
    miles: "10,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 5,
    image: "/images/car5.jpg",
    title: "Nissan Altima 2020",
    description: "Smooth ride and advanced features.",
    price: "$19,000",
    miles: "15,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 6,
    image: "/images/car6.jpg",
    title: "BMW 3 Series 2019",
    description: "Luxury and performance combined.",
    price: "$28,000",
    miles: "18,000 Miles",
    fuel: "Diesel",
    transmission: "Automatic",
  },
  {
    id: 7,
    image: "/images/car7.jpg",
    title: "Audi A4 2018",
    description: "Sleek design with premium tech.",
    price: "$27,000",
    miles: "22,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 8,
    image: "/images/car8.jpg",
    title: "Mercedes C-Class 2020",
    description: "Elegance and performance in one.",
    price: "$35,000",
    miles: "12,000 Miles",
    fuel: "Diesel",
    transmission: "Automatic",
  },
  {
    id: 9,
    image: "/images/car9.jpg",
    title: "Hyundai Sonata 2021",
    description: "Modern, efficient, and safe.",
    price: "$21,000",
    miles: "8,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 10,
    image: "/images/car10.jpg",
    title: "Kia Optima 2019",
    description: "Affordable and comfortable.",
    price: "$17,000",
    miles: "16,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
  },
];

export default function CarStorePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <Breadcrumb
            separator={<Text className="text-sm text-gray-500">/</Text>}
            className="flex flex-wrap items-center gap-1"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Text as="p" className="text-sm text-indigo-400">
                  {t("Home") || "Home"}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">
                <Text as="p" className="text-sm text-gray-800">
                  {t("CARS_FOR_SALE") || "Cars for Sale"}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading
            size="heading2xl"
            className="mt-2 text-3xl font-bold text-gray-800 capitalize"
          >
            {t("CARS_FOR_SALE") || "Cars for Sale"}
          </Heading>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
            <Heading size="text5xl" className="text-lg font-medium text-gray-800">
              Categories
            </Heading>
            <div className="mt-4 space-y-3">
              {carCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <Text as="p" className="text-sm text-gray-700">
                    {cat.label}
                  </Text>
                  <Text as="p" className="text-sm text-gray-700">
                    ({cat.count})
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
            <Heading size="text5xl" className="text-lg font-medium text-gray-800">
              Price Range
            </Heading>
            <div className="mt-4">
              <SeekBar
                inputValue={[5000, 50000]}
                trackColors={["#050b2033", "#050b2033"]}
                trackClassName="h-1 w-full"
                className="h-8"
              />
              <div className="mt-2 flex justify-between">
                <Text as="p" className="text-xs text-gray-600">
                  $5,000
                </Text>
                <Text as="p" className="text-xs text-gray-600">
                  $50,000
                </Text>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Heading size="text5xl" className="text-lg font-medium text-gray-800">
              Sort By
            </Heading>
            <SelectBox
              shape="square"
              name="sortOptions"
              placeholder={t("select_price") || "Select Price"}
              options={dropDownOptions}
              className="mt-4 w-full bg-cover bg-no-repeat px-3 text-gray-800"
            />
          </div>
        </aside>

        {/* Car Listings Grid */}
        <main className="w-full lg:w-3/4">
          <div className="mb-4">
            <Text as="p" className="text-sm text-gray-700">
              Showing 1–10 of 50 results
            </Text>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Suspense fallback={<div>Loading cars...</div>}>
              {carGrid.map((car) => (
                <Link href={`/detailsvone?car=${car.id}`}>
        <div className="px-4 cursor-pointer flex-shrink-0 w-80">
          <div className="flex flex-col rounded-lg bg-white shadow-md">
            {/* Image Section */}
            <div className="relative h-56">
              <Img
                src={car.image}
                width={328}
                height={218}
                className="h-full w-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
                <Button
                  size="sm"
                  shape="round"
                  className="min-w-[110px] rounded-lg px-3 font-medium capitalize bg-indigo-400 text-white shadow-md"
                >
                  {t("great_price") || "Great Price"}
                </Button>
                <Button shape="circle" className="w-9 rounded-full px-3">
                  <Img
                    src="img_bookmark_black_900.svg"
                    width={8}
                    height={12}
                    alt="Bookmark"
                  />
                </Button>
              </div>
            </div>
            {/* Content Section */}
            <div className="flex flex-col gap-2 rounded-b-lg border-t border-gray-200 p-4">
              <Heading
                size="text5xl"
                as="p"
                className="text-sm font-medium text-gray-800"
              >
                {car.title}
              </Heading>
              <Text
                as="p"
                className="text-xs font-normal text-gray-600 leading-tight"
              >
                {car.description}
              </Text>
              <div className="flex items-end justify-between gap-4 border-t border-gray-200 py-2">
                <div className="flex flex-col items-center gap-1">
                  <Img
                    src="img_icon_black_900.svg"
                    width={18}
                    height={18}
                    alt="Mileage Icon"
                    className="h-4"
                  />
                  <Text
                    as="p"
                    className="text-xs font-normal text-gray-700"
                  >
                    {car.miles}
                  </Text>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Img
                    src="img_icon_black_900_18x18.svg"
                    width={18}
                    height={18}
                    alt="Fuel Icon"
                    className="h-4"
                  />
                  <Text
                    as="p"
                    className="text-xs font-normal text-gray-700"
                  >
                    {car.fuel}
                  </Text>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Img
                    src="img_icon_18x18.svg"
                    width={18}
                    height={18}
                    alt="Transmission Icon"
                    className="h-4"
                  />
                  <Text
                    as="p"
                    className="text-xs font-normal text-gray-700"
                  >
                    {car.transmission}
                  </Text>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-t border-gray-200 py-2">
                <Heading
                  size="headings"
                  as="h5"
                  className="text-base font-bold text-gray-800"
                >
                  {car.price}
                </Heading>
                <div className="mt-1 flex w-full items-center justify-end gap-2">
                  <Text
                    as="p"
                    className="text-sm font-medium text-indigo-400"
                  >
                    {t("view_details") || "View Details"}
                  </Text>
                  <Img
                    src="img_arrow_left_indigo_a400_1.svg"
                    width={14}
                    height={14}
                    alt="Arrow Left"
                    className="h-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
              ))}
            </Suspense>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-3">
            <Button
              size="2xl"
              shape="round"
              className="min-w-[40px] rounded-full border border-gray-200 px-3"
            >
              1
            </Button>
            <Button size="2xl" className="min-w-[40px] rounded-full px-3">
              2
            </Button>
            <div className="flex flex-1 justify-center rounded-full border border-gray-200 bg-gray-50 p-3">
              <Img
                src="img_arrow_right.svg"
                width={10}
                height={12}
                alt="Next"
                className="h-3"
              />
            </div>
          </div>
        </main>
      </div>
      {/* Footer Border */}
      <div className="mt-12 bg-black-900">
        <div className="h-20 rounded-bl-2xl rounded-br-2xl bg-white" />
      </div>
    </div>
  );
}
