"use client";

import { Heading } from "../Heading";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";
import { Slider } from "../Slider";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "../../app/lib/utils";
import CarCard from "../CarCard";

// Define the interface for a single listing
interface Listing {
  make: string;
  condition: string;
  driveType: string;
  color: string;
  id: number;
  mainImage: string;
  alt: string;
  category: string[];
  title: string;
  miles: string;
  fuel: string;
  store: any;
  hostname: string;
  transmission: string;
  year: number;
  mileage: string;
  price: string;
  bodyType: string;
  fuelType: string;
  description: string;
  location?: string;
  features?: string[];
  slug: string;
}

// Define the props for the component
interface FeaturedListingsSectionProps {
  listings: Listing[];
  initialFavorites: number[];
}

export default function FeaturedListingsSection({
  listings,
  initialFavorites,
}: FeaturedListingsSectionProps) {
  const t = useTranslations("HomePage");
  const [sliderState, setSliderState] = useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const tabs = ["all", "new", "used"];
  // Sync with localStorage on mount
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

  const add_to_favorites = (id: number) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex justify-center self-stretch sm:px-4 py-[5px] w-full h-[20%] bg-white">
      <Tabs
        className="flex w-[100%] flex-col items-center justify-center gap-[50px] rounded-[16px] lg:w-full lg:py-8 md:w-full md:py-5 sm:py-4"
        selectedTabClassName="!text-black-900"
        selectedTabPanelClassName="!relative tab-panel--selected"
      >
        <div className="container-xs lg:px-5 md:px-5">
          <div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center sm:flex-col">
                <Heading
                  as="h5"
                  className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]"
                >
                  {t("featured_listings")}
                </Heading>
              </div>
              <TabList className="flex flex-wrap items-start gap-7 border-b border-solid border-gray-200">
                {tabs.map((tab, index) => (
                  <Tab key={index} className="mb-3 text-[16px] font-medium text-black-900 lg:text-[13px]
                  inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background h-10 px-4 py-2 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    {t(tab)}
                  </Tab>
                ))}
              </TabList>
            </div>
          </div>
        </div>

        <div className="mb-1.5 flex w-[84%] flex-col items-center lg:w-full lg:px-5 md:w-full md:px-5">
          <div className="container-xs flex flex-col gap-[50px]">
            {tabs.map((tab, index) => (
              <TabPanel key={`tab-panel-${index}`} className="absolute justify-center">
                <div className="w-full">
                  <div className="mx-auto flex w-full gap-[30px] lg:mx-0 md:mx-0 md:flex-col">
                    <Slider
                      autoPlay
                      autoPlayInterval={2000}
                      responsive={{
                        "0": { items: 1 },
                        "551": { items: 1 },
                        "1051": { items: 2 },
                        "1441": { items: 4 },
                      }}
                      disableDotsControls
                      activeIndex={sliderState}
                      onSlideChanged={(e: EventObject) => setSliderState(e?.item)}
                      ref={sliderRef}
                      items={listings
                        .filter((listing) => tab === "all" 
                        || listing.category.includes(tab)
                      )
                        .map((listing) => (
                          <React.Fragment key={listing.id}>
                          <CarCard 
                            key={listing.id} 
                            car={{
                              hostname: listing.store.hostname,
                              id: listing.id,
                              slug: listing.slug,
                              mainImage: listing.mainImage,
                              make: listing.make || "",
                              condition: listing.condition || "",
                              transmission: listing.transmission || "",
                              category: listing.category || [],
                              title: listing.title,
                              price: listing.price,
                              year: listing.year || 0,
                              mileage: listing.mileage || "0",
                              bodyType: listing.bodyType || "",
                              fuelType: listing.fuelType || "",
                              description: listing.description || "",
                              // location: listing.location,
                              features: listing.features
                            }}
                            variant="grid" 
                          />

                        </React.Fragment>
                        ))}
                    />
                  </div>
                </div>
              </TabPanel>
            ))}
            <div className="flex gap-[25px]">
              <Button
                size="2xl"
                onClick={() => sliderRef?.current?.slidePrev()}
                className="w-[60px] rounded-[20px] border border-solid border-gray-200 px-3"
              >
                <Img src="img_icon_black_900_40x60.svg" width={12} height={12} />
              </Button>
              <Button
                size="2xl"
                onClick={() => sliderRef?.current?.slideNext()}
                className="w-[60px] rounded-[20px] border border-solid border-gray-200 px-3"
              >
                <Img src="img_arrow_right.svg" width={10} height={12} />
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
