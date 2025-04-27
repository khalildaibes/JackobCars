
import { Heading } from "../../components/Heading";
import {Text} from "../../components/Text";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import React from "react";


export default function ServicesSection() {
  return (
    <>
      {/* services section */}
      <div className="flex justify-center">
        <div className="container-xs flex items-center justify-center lg:px-5 md:flex-col md:px-5">
          <div className="flex flex-1 flex-col items-start gap-[30px] md:self-stretch">
            <div className="flex self-stretch">
              <Heading
                as="h2"
                className="w-[66%] text-[40px] font-bold leading-[54px] lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                <>
                  Service Options Offered
                  <br />
                  by BoxCar
                </>
              </Heading>
            </div>
            <Text as="p" className="text-[15px] font-normal leading-[27px]">
              <>
                Choose from thousands of vehicles from multiple brands and buy online
                <br />
                with Click & Drive, or visit us at one of our dealerships today.
              </>
            </Text>
            <a href="https://www.youtube.com/embed/bv8Fxk0sz7I" target="_blank">
              <Button
                size="7xl"
                shape="round"
                rightIcon={
                  <div className="flex h-[14px] w-[14px] items-center justify-center">
                    <Img
                      src="img_arrowleft.svg"
                      width={14}
                      height={14}
                      alt="Arrow Left"
                      className="mb-1 h-[14px] w-[14px] object-contain"
                    />
                  </div>
                }
                className="min-w-[252px] gap-2 rounded-[12px] border border-solid border-indigo-a400 px-[25px] font-medium sm:px-4"
              >
                See Your Service Options
              </Button>
            </a>
          </div>
          <Img
            src="img_service1_jpg.png"
            width={686}
            height={600}
            alt="Service1 Jpg"
            className="h-[600px] w-[48%] object-contain md:w-full"
          />
        </div>
      </div>
    </>
  );
}
