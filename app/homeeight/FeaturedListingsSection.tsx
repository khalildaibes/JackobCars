"use client";

import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img/index";
import { Text } from "../../components/Text";
import { Slider } from "../../components/Slider";
import Link from "next/link";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useTranslations } from "next-intl";

// Define the interface for a single listing
interface Listing {
  id: number;
  image: string;
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
}

export default function FeaturedListingsSection({ listings }: FeaturedListingsSectionProps) {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const t = useTranslations("HomePage");
  const tabs= ["all", "new", "used"];
  return (
    <>
      {/* Featured Listings Section */}
      <div className="flex justify-center self-stretch sm:px-4 py-[20px] w-full ">
        <Tabs
          className="flex w-[100%] flex-col items-center justify-center gap-[50px] rounded-[16px] bg-gray-50 py-[20px] lg:w-full lg:py-8 md:w-full md:py-5 sm:py-4"
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
                  <div className="mb-4 flex flex-1 items-center justify-end gap-[11px] self-end sm:self-stretch">
                    <Link href="#">
                      <Img
                        src="img_arrow_left.svg"
                        width={14}
                        height={14}
                        alt="Arrow Left"
                        className="h-[14px]"
                      />
                    </Link>
                  </div>
                </div>
                <TabList className="flex flex-wrap items-start gap-7 border-b border-solid border-gray-200">
                  <Tab className="mb-3 text-[16px] font-medium text-black-900 lg:text-[13px]">
                    {t("in_stock")}
                  </Tab>
                  <Tab className="text-[16px] font-medium text-black-900 lg:text-[13px]">
                    {t("new_cars")}
                  </Tab>
                  <Tab className="text-[16px] font-medium text-black-900 lg:text-[13px]">
                    {t("used_cars")}
                  </Tab>
                </TabList>
              </div>
            </div>
          </div>
          <div className="mb-1.5 flex w-[84%] flex-col items-center lg:w-full lg:px-5 md:w-full md:px-5">
            <div className="container-xs flex flex-col gap-[50px]">
              {[...Array(3)].map((_, index) => (
                <TabPanel key={`tab-panel${index}`} className="absolute justify-center">
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
                        onSlideChanged={(e: EventObject) => {
                          setSliderState(e?.item);
                        }}
                        ref={sliderRef}
                        items={listings.filter((listing) => tabs[index] === "all" || listing.condition === tabs[index]).map((listing) => (
                          <React.Fragment key={listing.id}>
                            <div className="px-[15px]">
                              <div className="flex flex-col rounded-[16px] bg-white-a700 bg-[url(/images/img_background_820x1860.png)] bg-no-repeat bg-cover">
                                <div className="relative h-[218px] content-center lg:h-auto md:h-auto text-white">
                                  <Img
                                    src={listing.image}
                                    width={328}
                                    height={218}
                                    alt={listing.alt}
                                    className="h-[218px] w-full flex-1 object-cover rounded-t-[16px] !text-white"
                                  />
                                  <div className="absolute left-0 right-0 top-5 mx-auto flex flex-1 items-center justify-between gap-5 px-5">
                                    <Button
                                      size="sm"
                                      shape="round"
                                      className="min-w-[104px] rounded-[14px] px-3.5 font-medium capitalize bg-[url(/images/img_background_820x1860.png)] bg-no-repeat bg-cover"
                                    >
                                      {t("great_price")}
                                    </Button>
                                    <Button shape="circle" className="w-[36px] rounded-[18px] px-3 text-white">
                                      <Img
                                        src="img_bookmark.svg"
                                        width={8}
                                        height={12}
                                        color="white"
                                      />
                                    </Button>
                                  </div>
                                </div>
                                <div className="rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 p-3.5">
                                  <div className="mb-2 flex flex-col gap-[18px]">
                                    <div className="flex flex-col items-start gap-1">
                                      <Heading
                                        size="text2xl"
                                        as="h6"
                                        className="text-[18px] font-medium lg:text-[15px] !text-white"
                                      >
                                        {listing.title}
                                      </Heading>
                                      <div className="flex items-center self-stretch">
                                        <Text size="textmd" as="p" className="text-[14px] font-normal !text-white">
                                          {listing.miles}
                                        </Text>
                                        <div className="mb-1.5 ml-2 h-[4px] w-[4px] self-end rounded-sm bg-gray-500" />
                                        <Text size="textmd" as="p" className="ml-2.5 text-[14px] font-normal !text-white">
                                          {listing.fuel}
                                        </Text>
                                        <div className="mb-1.5 ml-2 h-[4px] w-[4px] self-end rounded-sm bg-gray-500" />
                                        <Text size="textmd" as="p" className="ml-2.5 text-[14px] font-normal !text-white">
                                          {listing.transmission}
                                        </Text>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-1.5">
                                      <Heading
                                        size="headings"
                                        as="h5"
                                        className="text-[20px] font-bold lg:text-[17px] !text-white"
                                      >
                                        {listing.price}
                                      </Heading>
                                      <div className="flex items-center gap-2.5 self-stretch">
                                        <Text as="p" className="text-[15px] font-medium !text-indigo-a400 !text-white">
                                          {t("view_details")}
                                        </Text>
                                        <Img
                                          src="img_arrow_left_indigo_a400.svg"
                                          width={14}
                                          height={14}
                                          alt="Arrow Left"
                                          className="h-[14px] self-end"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                  onClick={() => {
                    sliderRef?.current?.slidePrev();
                  }}
                  className="w-[60px] rounded-[20px] border border-solid border-gray-200 px-3"
                >
                  <Img src="img_icon_black_900_40x60.svg" width={12} height={12} />
                </Button>
                <Button
                  size="2xl"
                  onClick={() => {
                    sliderRef?.current?.slideNext();
                  }}
                  className="w-[60px] rounded-[20px] border border-solid border-gray-200 px-3"
                >
                  <Img src="img_arrow_right.svg" width={10} height={12} />
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
