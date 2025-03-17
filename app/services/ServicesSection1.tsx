"use client";

import { Heading } from "../../components/Heading";
import {Text} from "../../components/Text";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { Slider } from "../../components/Slider";

export default function ServicesSection1() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <>
      {/* services section */}
      <div className="flex flex-col items-center gap-[42px]">
        <div className="container-xs flex flex-col items-start lg:px-5 md:px-5">
          <Heading as="h4" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
            Our Services
          </Heading>
        </div>
        <div className="flex w-[86%] flex-col gap-[50px] self-end lg:w-full lg:px-5 md:w-full md:px-5">
          <div className="mx-auto flex w-full gap-[30px] md:mx-0 md:flex-col">
            <Slider
              autoPlay
              autoPlayInterval={2000}
              responsive={{ "0": { items: 1 }, "551": { items: 1 }, "1051": { items: 3 }, "1441": { items: 5 } }}
              disableDotsControls
              activeIndex={sliderState}
              onSlideChanged={(e: EventObject) => {
                setSliderState(e?.item);
              }}
              ref={sliderRef}
              items={[...Array(15)].map(() => (
                <React.Fragment key={Math.random()}>
                  <div className="px-[15px]">
                    <div className="flex flex-1 flex-col gap-5 rounded-[16px] bg-white-a700 shadow-xl md:self-stretch">
                      <Img
                        src="img_detail_post_qgc_256x328.png"
                        width={328}
                        height={256}
                        alt="Detail Post Qgc"
                        className="h-[256px] rounded-tl-[16px] rounded-tr-[16px] object-cover"
                      />
                      <div className="mb-6 ml-[30px] mr-8 flex flex-col items-start gap-3 md:mx-0">
                        <Heading size="text6xl" as="h5" className="text-[20px] font-medium lg:text-[17px]">
                          2024 BMW ALPINA XB7 wit…
                        </Heading>
                        <Text as="p" className="text-[15px] font-normal leading-[27px]">
                          <>
                            Aliquam hendrerit sollicitudin purus,
                            <br />
                            quis rutrum mi accumsan nec.
                          </>
                        </Text>
                        <div className="flex items-center gap-2.5 self-stretch">
                          <Text as="p" className="text-[15px] font-medium">
                            Explore More
                          </Text>
                          <Img
                            src="img_arrow_left_black_900.svg"
                            width={14}
                            height={14}
                            alt="Arrow Left"
                            className="h-[14px] self-end"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            />
          </div>
          <div className="container-xs">
            <div className="flex gap-[25px]">
              <Button
                size="3xl"
                onClick={() => {
                  sliderRef?.current?.slidePrev();
                }}
                className="w-[60px] rounded-[20px] border border-solid border-gray-200 px-3"
              >
                <Img src="img_icon_black_900_40x60.svg" width={12} height={12} />
              </Button>
              <Button
                size="3xl"
                onClick={() => {
                  sliderRef?.current?.slideNext();
                }}
                className="w-[60px] rounded-[20px] border border-solid border-gray-200 px-3"
              >
                <Img src="img_arrow_right_black_900_1.svg" width={10} height={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
