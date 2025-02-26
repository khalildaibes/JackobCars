
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Img } from "@/components/Img";
import { Text } from "@/components/Text";
import React from "react";

export default function AboutUsSection() {
  return (
    <>
      {/* about us section */}
      <div className="mt-[114px] flex justify-center self-stretch px-14 md:flex-col md:px-5 sm:px-4">
        <Img
          src="img_background_698x804.png"
          width={804}
          height={698}
          alt="Background"
          className="h-[698px] w-[44%] rounded-bl-[16px] rounded-tl-[16px] object-contain md:w-full"
        />
        <div className="flex w-[48%] flex-col items-start justify-center rounded-br-[16px] rounded-tr-[16px] bg-gray-100 py-[122px] pl-[134px] pr-14 lg:py-8 lg:pl-8 md:w-full md:p-5 sm:p-4">
          <Heading
            as="h6"
            className="text-[40px] font-bold leading-[56px] lg:text-[34px] md:text-[34px] sm:text-[32px]"
          >
            <>
              Get A Fair Price For Your Car
              <br />
              Sell To Us Today
            </>
          </Heading>
          <Text as="p" className="mt-[18px] text-[15px] font-normal leading-[27px]">
            <>
              We are committed to providing our customers with exceptional service, competitive
              <br />
              pricing, and a wide range of.
            </>
          </Text>
          <div className="mt-5 flex w-[88%] flex-col gap-4 lg:w-full md:w-full">
            <div className="flex items-center gap-[11px]">
              <Button size="xs" shape="circle" className="w-[24px] rounded-[12px] px-1.5">
                <Img src="img_facebook.svg" width={8} height={10} />
              </Button>
              <Text as="p" className="text-[15px] font-medium">
                We are the UK’s largest provider, with more patrols in more places
              </Text>
            </div>
            <div>
              <div className="flex items-center gap-[11px]">
                <Button size="xs" shape="circle" className="w-[24px] rounded-[12px] px-1.5">
                  <Img src="img_facebook.svg" width={8} height={10} />
                </Button>
                <Text as="p" className="self-start text-[15px] font-medium">
                  You get 24/7 roadside assistance
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-[11px]">
              <Button size="xs" shape="circle" className="w-[24px] rounded-[12px] px-1.5">
                <Img src="img_facebook.svg" width={8} height={10} />
              </Button>
              <Text as="p" className="self-start text-[15px] font-medium">
                We fix 4 out of 5 cars at the roadside
              </Text>
            </div>
          </div>
          <Button
            shape="round"
            rightIcon={
              <div className="flex h-[14px] w-[14px] items-center justify-center">
                <Img
                  src="img_arrowleft.svg"
                  width={14}
                  height={14}
                  alt="Arrow Left"
                  className="mt-0.5 h-[14px] w-[14px] object-contain"
                />
              </div>
            }
            className="mt-[50px] min-w-[158px] gap-2 rounded-[12px] border border-solid border-indigo-a400 px-[23px] font-medium sm:px-4"
          >
            Get Started
          </Button>
        </div>
      </div>
    </>
  );
}
