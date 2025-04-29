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
  title = "", // default title if none provided
  viewAllLink = "#" 
}: RecentlyAddedSectionProps) {
  const t = useTranslations("HomePage");
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  return (
    <>
      <div className="flex justify-end self-stretch">
        <div className="flex w-[100%] flex-col gap-1 lg:w-full lg:px-1 md:w-full md:px-1">
        {title && (<div className="container mx-auto px-1">
            <div className="w-[90%] flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
              <h2 className="text-base font-bold text-white bg-[#050B20] p-1 rounded-md flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
                </svg>
                {title || t("recently_added")}
              </h2>
              <div className="flex items-center gap-1">
                <Link href={viewAllLink}>
                  <Text as="p" className="text-xs font-medium">
                    {t("view_all")}
                  </Text>
                </Link>
                <Img
                  src="img_arrow_left.svg"
                  width={10}
                  height={10}
                  alt={t("arrow_left")}
                  className="h-2.5"
                />
              </div>
            </div>
          </div>
          )
        }

          <div>
            <div className="flex flex-col items-start">
              <div className="container-xs flex flex-col gap-1 lg:px-1 md:px-1 rounded-[8px]">
                <div className="mx-auto flex w-full gap-[10px] md:mx-0 md:flex-col rounded-[8px] ">
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
                    paddingLeft={10}
                    paddingRight={10}
                    items={listings.map((car) => (
                      <div key={car.id} className="px-2 ">
                      <CarCard key={car.id} car={car} variant={window.innerWidth <= 768 ? "list" : "grid"} />
                  </div>
                    ))}
                    ref={sliderRef}
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
