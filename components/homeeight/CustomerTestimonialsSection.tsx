"use client";

import { Heading } from "../Heading";
import { Button } from "../Button";
import { Img } from "../Img/index";
import { Text } from "../Text";
import { Slider } from "../Slider"
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";

export default function CustomerTestimonialsSection() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <>
      {/* customer testimonials section */}
      <div className="mt-[84px] flex justify-center self-stretch px-14 md:px-5 sm:px-4">
        <div className="flex w-[94%] flex-col items-center justify-center gap-[34px] rounded-[16px] bg-black-900 py-[108px] lg:w-full lg:py-8 md:w-full md:py-5 sm:py-4">
          <div className="container-xs lg:px-5 md:px-5">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <Heading
                as="h1"
                className="text-[40px] font-bold !text-white-a700 lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                What our customers say
              </Heading>
              <Text as="p" className="mb-3.5 self-end text-[15px] font-normal !text-white-a700">
                Rated 4.7 / 5 based on 28,370 reviews Showing our 4 & 5 star reviews
              </Text>
            </div>
          </div>
          <div className="mb-1.5 flex w-[86%] flex-col items-center lg:w-full lg:px-5 md:w-full md:px-5">
            <div className="container-xs flex flex-col gap-[50px]">
              <div className="mx-auto flex w-full gap-[30px] md:mx-0 md:flex-col">
                <Slider
                  autoPlay
                  autoPlayInterval={2000}
                  responsive={{ "0": { items: 1 }, "551": { items: 1 }, "1051": { items: 2 }, "1441": { items: 3 } }}
                  disableDotsControls
                  activeIndex={sliderState}
                  onSlideChanged={(e: EventObject) => {
                    setSliderState(e?.item);
                  }}
                  ref={sliderRef}
                  items={[...Array(9)].map(() => (
                    <React.Fragment key={Math.random()}>
                      <div className="px-[15px]">
                        <div className="flex flex-col gap-10 rounded-[16px] bg-white-a700 p-7 shadow-xs sm:p-4">
                          <div>
                            <div className="flex flex-col items-center gap-[34px]">
                              <div className="flex items-center justify-between gap-5 self-stretch">
                                <Heading size="text3xl" as="p" className="text-[20px] font-medium lg:text-[17px]">
                                  Great Work
                                </Heading>
                                <Img
                                  src="img_settings.svg"
                                  width={36}
                                  height={26}
                                  alt="Settings"
                                  className="h-[26px] self-end"
                                />
                              </div>
                              <Text as="p" className="text-[15px] font-normal leading-[27px]">
                                <>
                                  “Amazing design, easy to customize and a design
                                  <br />
                                  quality superlative account on its cloud platform for
                                  <br />
                                  the optimized performance. And we didn’t on our
                                  <br />
                                  original designs.”
                                </>
                              </Text>
                            </div>
                          </div>
                          <div className="flex items-start gap-3.5">
                            <Img
                              src="img_team3_150x150_jpg.png"
                              width={60}
                              height={60}
                              alt="Team3 150x150 Jpg"
                              className="h-[60px] w-[16%] self-center rounded-[30px] object-contain"
                            />
                            <div className="mt-1 flex flex-1 flex-col items-start">
                              <Heading size="textxl" as="p" className="text-[16px] font-medium lg:text-[13px]">
                                Leslie Alexander
                              </Heading>
                              <Text size="textmd" as="p" className="text-[14px] font-normal">
                                Facebook
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                />
              </div>
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
        </div>
      </div>
    </>
  );
}
