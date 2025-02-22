import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img/index";
import { Text } from "../../components/Text";
import SpecialFinancingOffer from "../../components/SpecialFinancingOffer";
import React, { Suspense } from "react";

const financeOptionsGrid = [
  {
    iconImage: "img_f1_svg.svg",
    headingText: "Special Financing Offers",
    descriptionText: (
      <>
        Our stress-free finance department that can
        <br />
        find financial solutions to save you money.
      </>
    ),
  },
  {
    iconImage: "img_f2_svg.svg",
    headingText: "Trusted Car Dealership",
    descriptionText: (
      <>
        Our stress-free finance department that can
        <br />
        find financial solutions to save you money.
      </>
    ),
  },
  {
    iconImage: "img_f3_svg.svg",
    headingText: "Transparent Pricing",
    descriptionText: (
      <>
        Our stress-free finance department that can
        <br />
        find financial solutions to save you money.
      </>
    ),
  },
  {
    iconImage: "img_thumbs_up.svg",
    headingText: "Expert Car Service",
    descriptionText: (
      <>
        Our stress-free finance department that can
        <br />
        find financial solutions to save you money.
      </>
    ),
  },
];

export default function ElectricVehiclesOverviewSection() {
  return (
    <>
      {/* electric vehicles overview section */}
      <div className="mt-[114px] flex justify-center self-stretch">
        <div className="container-xs flex justify-center lg:px-5 md:px-5">
          <div className="flex w-full items-start md:flex-col">
            <div className="flex flex-1 flex-col items-start md:self-stretch">
              <Heading
                as="h1"
                className="text-[40px] font-bold leading-[48px] lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                <>
                  Why Electric
                  <br />
                  Vehicles?
                </>
              </Heading>
              <Text as="p" className="mt-[18px] text-[15px] font-normal leading-[27px]">
                <>
                  We are committed to providing our customers with exceptional
                  <br />
                  service, competitive pricing, and a wide range of.
                </>
              </Text>
              <Button
                color="indigo_A400"
                size="7xl"
                shape="round"
                rightIcon={
                  <div className="flex h-[14px] w-[14px] items-center justify-center">
                    <Img
                      src="img_arrowleft_white_a700.svg"
                      width={14}
                      height={14}
                      alt="Arrow Left"
                      className="my-1 h-[14px] w-[14px] object-contain"
                    />
                  </div>
                }
                className="mt-10 min-w-[158px] gap-2 rounded-[12px] border border-solid border-indigo-a400 px-[25px] font-medium sm:px-4"
              >
                Get Started
              </Button>
            </div>
            <div className="mr-4 grid w-[48%] grid-cols-2 gap-[46px] self-center lg:grid-cols-2 md:mr-0 md:grid-cols-1">
              <Suspense fallback={<div>Loading feed...</div>}>
                {financeOptionsGrid.map((d, index) => (
                  <SpecialFinancingOffer {...d} key={"group4896" + index} className="w-full" />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
