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
import CarCard from "../CarCard";

interface RecentlyAddedSectionProps {
  listings: any[];
  title?: string;
  viewAllLink?: string;
}

export default function RecentlyAddedSection({ 
  listings, 
  title = "Recently Added", // default title if none provided
  viewAllLink = "#" 
}: RecentlyAddedSectionProps) {
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
                {title || t("recently_added")}
              </Heading>
              <div className="flex items-center gap-2">
                <Link href={viewAllLink}>
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
                    responsive={{ 
                      "0": { items: 1 }, 
                      "551": { items: 1 }, 
                      "1051": { items: 2 }, 
                      "1441": { items: 4 } 
                    }}
                    disableDotsControls
                    activeIndex={sliderState}
                    onSlideChanged={(e: EventObject) => {
                      setSliderState(e?.item);
                    }}
                    ref={sliderRef}
                    items={listings.map((car) => (
                      <CarCard key={car.id} car={car} />
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
