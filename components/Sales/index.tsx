"use client";

import { Heading } from "../Heading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../Breadcrumb";
import { Button } from "../Button";
import { Img } from "../Img";
import { SeekBar } from "../SeekBar";
import { Text } from "../Text";
import { SelectBox } from "../SelectBox";
import ShopPageBackgroundBorder from "../ShopPageBackgroundBorder";
import Link from "next/link";
import React, { Suspense, useState } from "react";

// Define a clear product type.
interface Product {
  image: string;
  productName: string;
  stock: number;
  price: number;
  buttonText: string;
  categories: string[];
}

// Define a type for filter options.
interface FilterOption {
  label: string;
  value: string;
}

const productGridData: Product[] = [
  {
    image: "img_brake_kit.png",
    productName: "Front and Rear Brake Kit",
    stock: 2,
    price: 120,
    buttonText: "Add to cart",
    categories: ["Brakes", "Car Parts"],
  },
  {
    image: "img_tire_michelin.png",
    productName: "Michelin Defender LTX M/S",
    stock: 1,
    price: 150,
    buttonText: "Add to cart",
    categories: ["Tires", "Car Parts"],
  },
  {
    image: "img_brake_kit.png",
    productName: "Front and Rear Brake Kit",
    stock: 2,
    price: 120,
    buttonText: "Add to cart",
    categories: ["Brakes", "Car Parts", "Food"],
  },
  {
    image: "img_brake_kit_discount.png",
    productName: "Brake Kit (Discount)",
    stock: 1,
    price: 60,
    buttonText: "Add to cart",
    categories: ["Brakes", "Car Parts"],
  },
  {
    image: "img_brake_kit.png",
    productName: "Front and Rear Brake Kit",
    stock: 2,
    price: 120,
    buttonText: "Add to cart",
    categories: ["Brakes", "Car Parts"],
  },
  {
    image: "img_brake_kit.png",
    productName: "Front and Rear Brake Kit",
    stock: 2,
    price: 120,
    buttonText: "Add to cart",
    categories: ["Brakes", "Car Parts"],
  },
];

const priceOptions: FilterOption[] = [
  { label: "All Prices", value: "all" },
  { label: "Under $100", value: "under100" },
  { label: "$100 - $150", value: "100to150" },
  { label: "Above $150", value: "above150" },
];

// Build dynamic category options based on product data.
const uniqueCategories = Array.from(
  new Set(productGridData.flatMap((product) => product.categories))
);

const dynamicCategoryOptions: FilterOption[] = [
  { label: "All Categories", value: "all" },
  ...uniqueCategories.map((category) => ({ label: category, value: category })),
];

interface Props {
  className?: string;
}

export default function Sales2({ ...props }: Props) {
  // Store filter values as strings.
  const [priceFilter, setPriceFilter] = useState<string>(priceOptions[0].value);
  const [categoryFilter, setCategoryFilter] = useState<string>(
    dynamicCategoryOptions[0].value
  );

  // Filter products based on selected filters.
  const filteredProducts = productGridData.filter((product) => {
    let priceCondition = true;
    let categoryCondition = true;

    if (priceFilter === "under100") {
      priceCondition = product.price < 100;
    } else if (priceFilter === "100to150") {
      priceCondition = product.price >= 100 && product.price <= 150;
    } else if (priceFilter === "above150") {
      priceCondition = product.price > 150;
    }

    if (categoryFilter !== "all") {
      categoryCondition = product.categories.includes(categoryFilter);
    }

    return priceCondition && categoryCondition;
  });

  return (
    <div {...props} className={`${props.className} flex flex-col items-center mt-[5%]`}>
      {/* Header Section */}
      <div className="w-full">
        <div className="flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-8 sm:py-4">
          <div className="container-xs mt-1 flex flex-col items-start gap-2 px-4 sm:px-5">
            <Breadcrumb
              separator={<Text className="h-5 w-1.5 text-sm font-normal">/</Text>}
              className="flex flex-wrap items-center gap-1 w-full"
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <Text className="text-sm font-normal text-indigo-a400">
                    Home
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">
                  <Text className="text-sm font-normal text-black-900">
                    Shop
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading
              size="heading2xl"
              className="text-3xl font-bold capitalize sm:text-2xl"
            >
              Shop
            </Heading>
          </div>
        </div>
      </div>
      {/* Filter Section */}
      <div className="mx-auto w-full max-w-[1430px] px-4 sm:px-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Sidebar Filters */}
          <div className="flex-1 flex flex-col gap-4">
            
          </div>
          {/* Dropdown Filters */}
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 justify-end">
            <SelectBox
              shape="square"
              name="Price Filter"
              placeholder={
                priceOptions.find((opt) => opt.value === priceFilter)?.label ||
                "Filter by Price"
              }
              options={priceOptions}
              value={priceFilter as any}
              onChange={(newValue: unknown) => {
                const selectedValue = (newValue as string) || priceOptions[0].value;
                setPriceFilter(selectedValue);
              }}
              className="w-full sm:w-40 bg-cover bg-no-repeat px-3 text-black-900"
            />
            <SelectBox
              shape="square"
              name="Category Filter"
              placeholder={
                dynamicCategoryOptions.find((opt) => opt.value === categoryFilter)
                  ?.label || "Filter by Category"
              }
              options={dynamicCategoryOptions}
              value={categoryFilter as any}
              onChange={(newValue: unknown) => {
                const selectedValue = (newValue as string) || dynamicCategoryOptions[0].value;
                setCategoryFilter(selectedValue);
              }}
              className="w-full sm:w-40 bg-cover bg-no-repeat px-3 text-black-900"
            />
          </div>
        </div>
      </div>
      {/* Product Grid Section */}
      <div className="mx-auto w-full max-w-[1430px] px-4 sm:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div>Loading feed...</div>}>
            {filteredProducts.map((product, index) => (
              // If you can update ShopPageBackgroundBorder's type, do so.
              // Otherwise, cast the component as any to bypass type checking.
              (<ShopPageBackgroundBorder
                key={"group371" + index}
                productName={product.productName}
                price={`$${product.price}`}
                buttonText={product.buttonText}
                className="items-start"
              />) as any
            ))}
          </Suspense>
        </div>
      </div>
      {/* Pagination Section */}
      <div className="mt-12 flex justify-center gap-3 w-full">
        <Button
          size="2xl"
          shape="round"
          className="min-w-[40px] rounded-full border border-black-900 px-4"
        >
          1
        </Button>
        <Button size="2xl" className="min-w-[40px] rounded-full px-3.5">
          2
        </Button>
        <div className="flex flex-1 justify-center rounded-full border border-gray-200 bg-gray-50 p-3">
          <Img
            src="img_arrow_right.svg"
            width={10}
            height={12}
            alt="Arrow Right"
            className="h-3"
          />
        </div>
      </div>
      {/* Footer Section */}
      <div className="mt-16 w-full bg-black-900">
        <div className="h-20 rounded-bl-2xl rounded-br-2xl bg-white-a700" />
      </div>
    </div>
  );
}
