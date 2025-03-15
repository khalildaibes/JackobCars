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

// Define the interface for a single listing
interface Listing {
  id: number;
  mainImage: string;
  alt: string;
  condition: string;
  title: string;
  miles: string;
  fuel: string;
  transmission: string;
  price: string;
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
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);
  const t = useTranslations("HomePage");
  const [sliderState, setSliderState] = useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const tabs = ["all", "new", "used"];

  // Sync with localStorage on mount
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

  return (
    <div className="flex justify-center self-stretch sm:px-4 py-[20px] w-full bg-white">
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
                  <Tab key={index} className="mb-3 text-[16px] font-medium text-black-900 lg:text-[13px]">
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
                        .filter((listing) => tab === "all" || listing.condition === tab)
                        .map((listing) => (
                          <React.Fragment key={listing.id}>
                            <Link href={`/detailsvone?car=${listing.id}`}>
                              <div className="px-[15px] cursor-pointer">
                                <div className="flex flex-col rounded-[16px] bg-white-a700 bg-dark-blue bg-no-repeat bg-cover">
                                  <div className="relative h-[218px] content-center lg:h-auto md:h-auto text-white">
                                    <Img
                                      src={listing.mainImage}
                                      width={328}
                                      external={true}
                                      height={218}
                                      alt={listing.alt}
                                      className="h-[218px] w-full flex-1 object-cover rounded-t-[16px] !text-white"
                                    />
                                    <div className="absolute left-0 right-0 top-5 mx-auto flex flex-1 items-center justify-between gap-5 px-5">
                                      <Button
                                        size="sm"
                                        shape="round"
                                        className="min-w-[104px] rounded-[14px] px-3.5 font-medium capitalize bg-dark-blue bg-no-repeat bg-cover"
                                      >
                                        {t("great_price")}
                                      </Button>
                                      <Button
                                        shape="circle"
                                        className="w-[36px] rounded-[18px] px-3 text-white"
                                        onClick={() => add_to_favorites(listing.id)}
                                      >
                                        <Img
                                          src={
                                            favorites.includes(listing.id)
                                              ? "img_bookmarked.svg"
                                              : "img_bookmark.svg"
                                          }
                                          width={8}
                                          height={12}
                                          alt="Bookmark"
                                          className="rounded-[16px]"
                                        />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
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
