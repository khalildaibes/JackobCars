"use client";

import { Heading } from "../Heading";
import { Button } from "../Button";
import { Img } from "../Img/index";
import { Text } from "../Text";
import { Slider } from "../Slider"
import Link from "next/link";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";

export default function RecentlyAddedSection() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <>
      {/* recently added section */}
      <div className="mt-[108px] flex justify-end self-stretch">
        <div className="flex w-[100%] flex-col gap-6 lg:w-full lg:px-5 md:w-full md:px-5">
          <div className="container-xs">
            <div className="flex items-center justify-center sm:flex-col">
              <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                Recently Added
              </Heading>
              <div className="mb-4 flex flex-1 items-center justify-end gap-[11px] self-end sm:self-stretch">
                <Link href="#">
                  <Text as="p" className="text-[15px] font-medium">
                    View All
                  </Text>
                </Link>
                <Img src="img_arrow_left.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
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
                    items={[...Array(12)].map(() => (
                      <React.Fragment key={Math.random()}>
                        <Link href={"cartdetails?car="}>
                        <div className="px-[15px] rounded-[16px]">
                          <div className="flex flex-col rounded-[16px] bg-white-a700    bg-[url(/images/img_background_820x1860.png)] bg-no-repeat bg-cover  ">
                            <div className="relative h-[218px] content-center lg:h-auto md:h-auto">
                              <Img
                                src="img_car9_660x440_jpg.png"
                                width={328}
                                height={218}
                                alt="Car9 660x440 Jpg"
                                className="h-[218px] w-full flex-1 object-cover rounded-t-[16px] "
                              />
                              <Button
                                shape="circle"
                                className="absolute right-5 top-5 m-auto w-[36px] rounded-[18px] px-3"
                              >
                                <Img src="img_bookmark.svg" width={8} height={12} className="rounded-[16px]"/>
                              </Button>
                            </div>
                            <div className="flex flex-col items-center gap-[18px] rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 p-3.5">
                              <div className="flex w-[88%] flex-col items-start gap-1 lg:w-full md:w-full">
                                <Heading size="text2xl" as="p" className="text-[18px] font-medium lg:text-[15px] !text-white">
                                  T-Cross – 2023
                                </Heading>
                                <div className="flex items-center self-stretch">
                                  <Text size="textmd" as="p" className="text-[14px] font-normal !text-white">
                                    15 Miles
                                  </Text>
                                  <div className="mb-1.5 ml-2 h-[4px] w-[4px] self-end rounded-sm bg-gray-500" />
                                  <Text size="textmd" as="p" className="ml-2.5 text-[14px] font-normal !text-white">
                                    Petrol
                                  </Text>
                                  <div className="mb-1.5 ml-2 h-[4px] w-[4px] self-end rounded-sm bg-gray-500" />
                                  <Text size="textmd" as="p" className="ml-2.5 text-[14px] font-normal !text-white">
                                    CVT
                                  </Text>
                                </div>
                              </div>
                              <div className="mb-2 flex w-[88%] flex-col items-start gap-1.5 lg:w-full md:w-full">
                                <Heading size="headings" as="h5" className="text-[20px] font-bold lg:text-[17px] !text-white">
                                  $15,000
                                </Heading>
                                <div className="flex items-center gap-2.5 self-stretch">
                                  <Text as="p" className="text-[15px] font-medium  !text-white">
                                    View Details
                                  </Text>
                                  <Img
                                    src="img_arrow_left_indigo_a400.svg"
                                    width={14}
                                    height={14}
                                    alt="Arrow Left"
                                    className="h-[14px] self-end "
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
                <div className="flex gap-[25px] items-center justify-center">
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
          </div>
        </div>
      </div>
    </>
  );
}
