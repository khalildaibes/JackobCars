import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import React from "react";
import { GoogleMap } from "@/components/GoogleMap";

export default function LocationDetailsSection() {
  return (
    <>
      {/* location details section */}
      <div className="mt-11 flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col items-start lg:px-5 md:px-5">
          <Heading size="text8xl" as="p" className="text-[26px] font-medium lg:text-[22px]">
            Location
          </Heading>
          <div className="mt-[26px] flex self-stretch">
            <Text as="p" className="self-end text-[15px] font-normal">
              329 Kent Ave, Brooklyn
            </Text>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5 self-stretch">
            <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
              Get Direction
            </Text>
            <Img src="img_arrow_left_indigo_a400_1.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
          </div>
          <div className="relative mt-5 h-[450px] w-[66%] content-center rounded-[16px] bg-gray-300_02 lg:h-auto md:h-auto">
            <GoogleMap showMarker={false} className="h-[450px] flex-1 rounded-[16px]" />
            <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 flex-col items-start">
              <div className="ml-3 flex flex-col items-center rounded border-2 border-solid border-black-900_33_01 md:ml-0">
                <Button size="md"  className="w-[30px]">
                  <Img src="defaultNoData.png" width={30} height={30} />
                </Button>
                <Button size="md"  className="w-[30px]">
                  <Img src="defaultNoData.png" width={30} height={30} />
                </Button>
              </div>
              <Button
                size="5xl"
                shape="circle"
                className="mt-[104px] w-[44px] self-center rounded-[22px] px-3 shadow-lg"
              >
                <Img src="img_linkedin.svg" width={12} height={16} />
              </Button>
              <div className="mt-[210px] flex w-[22%] items-center justify-center self-end bg-white-a700_b2 px-1 lg:w-full md:w-full">
                <div className="flex">
                  <Heading
                    as="p"
                    className="!font-helveticaneue text-[10.48px] font-medium !text-light_blue-800"
                  >
                    Leaflet
                  </Heading>
                </div>
                <Text size="texts" as="p" className="!font-helveticaneue text-[11px] font-medium !text-blue_gray-900">
                  | ©{" "}
                </Text>
                <div className="flex flex-1 justify-center">
                  <Heading
                    as="p"
                    className="!font-helveticaneue text-[10.48px] font-medium !text-light_blue-800"
                  >
                    OpenStreetMap
                  </Heading>
                </div>
                <Heading
                  as="p"
                  className="self-end !font-helveticaneue text-[10.66px] font-medium !text-blue_gray-900"
                >
                  contributors
                </Heading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
