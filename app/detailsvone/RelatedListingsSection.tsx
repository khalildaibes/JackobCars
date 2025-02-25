"use client";

import { Button, Img, Heading, Text, Slider } from "@/components";
import Link from "next/link";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { useTranslations } from "next-intl";

const relatedListings = [
  {
    id: 1,
    image: "/images/car1.jpg",
    alt: "Car 1",
    title: "Toyota Camry – 2020",
    miles: "20,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$20,000",
    description: "Reliable and fuel-efficient sedan.",
  },
  {
    id: 2,
    image: "/images/car2.jpg",
    alt: "Car 2",
    title: "Honda Accord – 2019",
    miles: "18,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$18,000",
    description: "Spacious and comfortable.",
  },
  {
    id: 3,
    image: "/images/car3.jpg",
    alt: "Car 3",
    title: "Ford Focus – 2018",
    miles: "25,000 Miles",
    fuel: "Diesel",
    transmission: "Manual",
    price: "$15,000",
    description: "Compact with efficient performance.",
  },
  {
    id: 4,
    image: "/images/car4.jpg",
    alt: "Car 4",
    title: "Chevrolet Malibu – 2021",
    miles: "10,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$22,000",
    description: "Modern design with great performance.",
  },
  {
    id: 5,
    image: "/images/car5.jpg",
    alt: "Car 5",
    title: "Nissan Altima – 2020",
    miles: "15,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$19,000",
    description: "Smooth ride with advanced features.",
  },
  {
    id: 6,
    image: "/images/car6.jpg",
    alt: "Car 6",
    title: "BMW 3 Series – 2019",
    miles: "18,000 Miles",
    fuel: "Diesel",
    transmission: "Automatic",
    price: "$28,000",
    description: "Luxury meets performance.",
  },
  {
    id: 7,
    image: "/images/car7.jpg",
    alt: "Car 7",
    title: "Audi A4 – 2018",
    miles: "22,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$27,000",
    description: "Stylish design with premium tech.",
  },
  {
    id: 8,
    image: "/images/car8.jpg",
    alt: "Car 8",
    title: "Mercedes C-Class – 2020",
    miles: "12,000 Miles",
    fuel: "Diesel",
    transmission: "Automatic",
    price: "$35,000",
    description: "Elegance and performance combined.",
  },
  {
    id: 9,
    image: "/images/car9.jpg",
    alt: "Car 9",
    title: "Hyundai Sonata – 2021",
    miles: "8,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$21,000",
    description: "Modern, efficient and safe.",
  },
  {
    id: 10,
    image: "/images/car10.jpg",
    alt: "Car 10",
    title: "Kia Optima – 2019",
    miles: "16,000 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$17,000",
    description: "Affordable with a comfortable ride.",
  },
];

export default function RelatedListingsSection() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const t = useTranslations("HomePage");

  return (
    <div className="mt-24 mb-8 flex flex-col items-center gap-6">
      {/* Header */}
      <div className="w-full container mx-auto px-4 lg:px-5 md:px-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Heading
            as="h1"
            className="text-3xl font-bold text-gray-800 text-center sm:text-left"
          >
            {t("featured_listings") || "Related Listings"}
          </Heading>
          <div className="flex items-center gap-2">
            <Text as="p" className="text-sm font-medium text-gray-700">
              {t("view_all") || "View All"}
            </Text>
            <Img
              src="img_arrow_left_black_900.svg"
              width={14}
              height={14}
              alt="Arrow Left"
              className="h-4"
            />
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="w-full container mx-auto px-4 lg:px-5 md:px-5">
      <AliceCarousel
  autoPlay
  autoPlayInterval={2000}
  responsive={{
    "0": { items: 1 },       // Mobile: one item per slide (stage)
    "768": { items: 3 }      // Desktop: three items per slide (row)
  }}
  disableDotsControls
  activeIndex={sliderState}
  onSlideChanged={(e: EventObject) => setSliderState(e?.item)}
  ref={sliderRef}
  items={relatedListings.map((listing) => (
    <React.Fragment key={listing.id}>
      <Link href={`/detailsvone?car=${listing.id}`}>
        <div className="px-4 cursor-pointer flex-shrink-0 w-80">
          <div className="flex flex-col rounded-lg bg-white shadow-md">
            {/* Image Section */}
            <div className="relative h-56">
              <Img
                src={listing.image}
                width={328}
                height={218}
                alt={listing.alt}
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
                {listing.title}
              </Heading>
              <Text
                size="textxl"
                as="p"
                className="text-xs font-normal text-gray-600 leading-tight"
              >
                {listing.description}
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
                    {listing.miles}
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
                    {listing.fuel}
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
                    {listing.transmission}
                  </Text>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-t border-gray-200 py-2">
                <Heading
                  size="headings"
                  as="h5"
                  className="text-base font-bold text-gray-800"
                >
                  {listing.price}
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
    </React.Fragment>
  ))}
/>

      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex w-full justify-center gap-6">
        <Button
          size="3xl"
          onClick={() => sliderRef?.current?.slidePrev()}
          className="w-14 rounded-full border border-gray-200 px-3"
        >
          <Img
            src="img_icon_black_900_40x60.svg"
            width={12}
            height={12}
            alt="Previous"
          />
        </Button>
        <Button
          size="3xl"
          onClick={() => sliderRef?.current?.slideNext()}
          className="w-14 rounded-full border border-gray-200 px-3"
        >
          <Img
            src="img_arrow_right_black_900_1.svg"
            width={10}
            height={12}
            alt="Next"
          />
        </Button>
      </div>
    </div>
  );
}
