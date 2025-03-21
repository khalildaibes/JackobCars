"use client";

import { Heading } from "../Heading";
import { Button } from "../Button";
import { Img } from "../Img/index";
import { Text } from "../Text";
import { Slider } from "../Slider";
import Link from "next/link";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { useTranslations } from "next-intl";
import { cn } from "../../app/lib/utils";

export default function RecentlyAddedSection({ listings }) {
  const t = useTranslations("HomePage");
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <>
      <div className="mt-[108px] flex justify-end self-stretch">
        <div className="flex w-[100%] flex-col gap-6 lg:w-full lg:px-5 md:w-full md:px-5">
          <div className="container mx-auto px-4">
            <div className="w-[90%] flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
              <Heading
                as="h1"
                className="text-2xl font-bold text-center sm:text-[40px] sm:font-bold sm:text-left md:text-[34px] lg:text-[34px]"
              >
                {t("recently_added")}
              </Heading>
              <div className="flex items-center gap-2">
                <Link href="#">
                  <Text as="p" className="text-base font-medium">
                    {t("view_all")}
                  </Text>
                </Link>
                <Img
                  src="img_arrow_left.svg"
                  width={14}
                  height={14}
                  alt={t("arrow_left")}
                  className="h-4"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-start">
              <div className="container-xs flex flex-col gap-[50px] lg:px-5 md:px-5 rounded-[16px]">
                <div className="mx-auto flex w-full gap-[30px] md:mx-0 md:flex-col rounded-[16px]">
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
                    responsive={{ "0": { items: 1 }, "551": { items: 1 }, "1051": { items: 2 }, "1441": { items: 4 } }}
                    disableDotsControls
                    activeIndex={sliderState}
                    onSlideChanged={(e: EventObject) => {
                      setSliderState(e?.item);
                    }}
                    ref={sliderRef}
                    items={listings.map((car) => (
                      <React.Fragment key={car.id}>
                        <Link href={`detailsvone?car=${car.id}`}>
                          <div className="px-[15px] rounded-[16px]">
                             <div className={cn("px-[15px] cursor-pointer text-card-foreground shadow-sm overflow-hidden border-0 card-hover bg-white rounded-xl",
                                                                'overflow-hidden border-0 card-hover bg-white rounded-xl w-full h-full object-cover transition-transform duration-500 hover:scale-105')}>
                              <div className="relative h-[218px] content-center lg:h-auto md:h-auto">
                                <Img
                                  src={car.mainImage}
                                  width={328}
                                  height={218}
                                  external={true}
                                  alt={car.alt}
                                  className="h-[218px] w-full flex-1 object-cover rounded-t-[16px]"
                                />
                                <Button
                                  shape="circle"
                                  className="absolute right-5 top-5 m-auto w-[36px] rounded-[18px] px-3"
                                >
                                  <Img
                                    src="img_bookmark.svg"
                                    width={8}
                                    height={12}
                                    className="rounded-[16px]"
                                    alt={t("bookmark")}
                                  />
                                </Button>
                              </div>
                              <div className="flex flex-col items-center gap-[18px] rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 p-3.5">
                                <div className="flex w-[88%] flex-col items-start gap-1 lg:w-full md:w-full">
                                  <Heading
                                    size="text2xl"
                                    as="p"
                                    className="text-[18px] font-medium lg:text-[15px] !text-black"
                                  >
                                    {car.title}
                                  </Heading>
                                  <div className="flex items-center self-stretch">
                                    <Text
                                      size="textmd"
                                      as="p"
                                      className="text-[14px] font-normal !text-black"
                                    >
                                      {car.miles}
                                    </Text>
                                    <div className="mb-1.5 ml-2 h-[4px] w-[4px] self-end rounded-sm bg-gray-500" />
                                    <Text
                                      size="textmd"
                                      as="p"
                                      className="ml-2.5 text-[14px] font-normal !text-black"
                                    >
                                      {car.fuel}
                                    </Text>
                                    <div className="mb-1.5 ml-2 h-[4px] w-[4px] self-end rounded-sm bg-gray-500" />
                                    <Text
                                      size="textmd"
                                      as="p"
                                      className="ml-2.5 text-[14px] font-normal !text-black"
                                    >
                                      {car.transmission}
                                    </Text>
                                  </div>
                                </div>
                                <div className="mb-2 flex w-[88%] flex-col items-start gap-1.5 lg:w-full md:w-full">
                                  <Heading
                                    size="headings"
                                    as="h5"
                                    className="text-[20px] font-bold lg:text-[17px] !text-black"
                                  >
                                    {car.price}
                                  </Heading>
                                  <div className="flex items-center gap-2.5 self-stretch">
                                    <Text as="p" className="text-[15px] font-medium !text-black">
                                      {t("view_details")}
                                    </Text>
                                    <Img
                                      src="img_arrow_left_indigo_a400.svg"
                                      width={14}
                                      height={14}
                                      alt={t("arrow_left")}
                                      className="h-[14px] self-end"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
