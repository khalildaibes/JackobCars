"use client";

import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { Slider } from "@/components/Slider";

export default function RelatedListingsSection() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <>
      {/* related listings section */}
      <div className="mb-3.5  flex flex-col items-center gap-[22px] self-stretch !mt-[15%]">
        <div className="container-xs lg:px-5 md:px-5">
          <div className="flex items-start justify-center sm:flex-col">
            <Heading as="h1" className="self-center text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Related Listings
            </Heading>
            <div className="mt-2.5 flex flex-1 items-center justify-end gap-[15px] sm:self-stretch">
              <Text as="p" className="text-[15px] font-medium">
                View All{" "}
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
        <div className="flex w-[74%] justify-center lg:w-full lg:px-5 md:w-full md:px-5">
          <div className="container-xs flex">
            <div className="flex w-full flex-col gap-[50px]">
              <div className="flex items-center gap-[30px] md:flex-col">
                <div className="w-[24%] rounded-[16px] bg-white-a700 md:w-full">
                  <div className="relative h-[218px] content-center lg:h-auto md:h-auto">
                    <Img
                      src="img_car6_660x440_jpg_218x328.png"
                      width={328}
                      height={218}
                      alt="Car6 660x440 Jpg"
                      className="h-[218px] w-full flex-1 object-cover"
                    />
                    <div className="absolute left-0 right-0 top-5 mx-auto flex flex-1 items-center justify-between gap-5 px-5">
                      <Button
                        size="sm"
                        shape="round"
                        className="min-w-[104px] rounded-[14px] px-3.5 font-medium capitalize"
                      >
                        Great Price
                      </Button>
                      <Button shape="circle" className="w-[36px] rounded-[18px] px-3">
                        <Img src="img_bookmark_black_900.svg" width={8} height={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 p-4">
                    <div className="flex">
                      <Heading size="text5xl" as="p" className="text-[18px] font-medium lg:text-[15px]">
                        Mercedes-Benz, C Class
                      </Heading>
                    </div>
                    <div>
                      <Text  as="p" className="self-end text-[14px] font-normal leading-[14px]">
                        <>
                          2.0 D5 PowerPulse Momentum 5dr AW…
                          <br />
                          Geartronic Estate
                        </>
                      </Text>
                    </div>
                    <div className="flex items-end justify-between gap-5 border-t border-solid border-gray-200 py-1.5">
                      <div className="mt-2 flex flex-col items-center gap-2">
                        <Img src="img_icon_black_900.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
                        <Text  as="p" className="text-[14px] font-normal">
                          100 Miles
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Img
                          src="img_icon_black_900_18x18.svg"
                          width={18}
                          height={18}
                          alt="Icon"
                          className="h-[18px]"
                        />
                        <Text  as="p" className="text-[14px] font-normal">
                          Petrol
                        </Text>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Img src="img_icon_18x18.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
                        <Text  as="p" className="text-[14px] font-normal">
                          Automatic
                        </Text>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-center gap-0.5 border-t border-solid border-gray-200 py-2.5">
                      <Text  as="p" className="mt-1 text-[14px] font-normal line-through">
                        $40,000
                      </Text>
                      <div className="flex items-center self-stretch">
                        <Heading size="headings" as="h5" className="text-[20px] font-bold lg:text-[17px]">
                          $35,000
                        </Heading>
                        <div className="flex flex-1 items-center justify-end gap-2.5">
                          <Text as="p" className="text-[15px] font-medium !text-indigo-a400">
                            View Details
                          </Text>
                          <Img
                            src="img_arrow_left_indigo_a400_1.svg"
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
                <div className="mx-auto flex w-full gap-[30px] md:mx-0 md:flex-col md:self-stretch">
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
                          <div className="flex flex-col rounded-[16px] bg-white-a700">
                            <div className="relative h-[218px] content-center lg:h-auto md:h-auto">
                              <Img
                                src="img_car3_660x440_jpg_218x328.png"
                                width={328}
                                height={218}
                                alt="Car3 660x440 Jpg"
                                className="h-[218px] w-full flex-1 object-cover"
                              />
                              <div className="absolute left-0 right-0 top-5 mx-auto flex flex-1 items-center justify-between gap-5 px-5">
                                <Button
                                  size="sm"
                                  shape="round"
                                  className="min-w-[110px] rounded-[14px] px-3.5 font-medium capitalize"
                                >
                                  Low Mileage
                                </Button>
                                <Button shape="circle" className="w-[36px] rounded-[18px] px-3">
                                  <Img src="img_bookmark_black_900.svg" width={8} height={12} />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 p-4">
                              <div className="flex">
                                <Heading size="text5xl" as="p" className="text-[18px] font-medium lg:text-[15px]">
                                  Ranger White – 2022
                                </Heading>
                              </div>
                              <div>
                                <Text  as="p" className="self-end text-[14px] font-normal leading-[14px]">
                                  <>
                                    2.0 D5 PowerPulse Momentum 5dr AW…
                                    <br />
                                    Geartronic Estate
                                  </>
                                </Text>
                              </div>
                              <div className="flex items-end justify-between gap-5 border-t border-solid border-gray-200 py-1.5">
                                <div className="mt-2 flex flex-col items-center gap-2">
                                  <Img
                                    src="img_icon_black_900.svg"
                                    width={18}
                                    height={18}
                                    alt="Icon"
                                    className="h-[18px]"
                                  />
                                  <Text  as="p" className="text-[14px] font-normal">
                                    30000 Miles
                                  </Text>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                  <Img
                                    src="img_icon_black_900_18x18.svg"
                                    width={18}
                                    height={18}
                                    alt="Icon"
                                    className="h-[18px]"
                                  />
                                  <Text  as="p" className="text-[14px] font-normal">
                                    Diesel
                                  </Text>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                  <Img
                                    src="img_icon_18x18.svg"
                                    width={18}
                                    height={18}
                                    alt="Icon"
                                    className="h-[18px]"
                                  />
                                  <Text  as="p" className="text-[14px] font-normal">
                                    Manual
                                  </Text>
                                </div>
                              </div>
                              <div className="flex items-end justify-center border-t border-solid border-gray-200 py-2.5">
                                <Heading size="headings" as="h5" className="text-[20px] font-bold lg:text-[17px]">
                                  $25,000
                                </Heading>
                                <div className="mt-1.5 flex flex-1 items-center justify-end gap-2.5">
                                  <Text as="p" className="text-[15px] font-medium !text-indigo-a400">
                                    View Details
                                  </Text>
                                  <Img
                                    src="img_arrow_left_indigo_a400_1.svg"
                                    width={14}
                                    height={14}
                                    alt="Arrow Left"
                                    className="h-[14px]"
                                  />
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
      </div>
    </>
  );
}
