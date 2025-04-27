import { Heading } from "../Heading";
import SpecialFinancingOffers from "../SpecialFinancingOffers";
import React, { Suspense } from "react";

const financeOffersList = [
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
    iconImage: "img_thumbs_up_indigo_a400.svg",
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

export default function CustomerBenefitsSection() {
  return (
    <>
      {/* customer benefits section */}
      <div className="flex justify-center px-14 md:px-5 sm:px-4">
        <div className="flex w-[94%] flex-col items-center justify-center rounded-[16px] bg-gray-50_01 py-[108px] lg:w-full lg:py-8 md:w-full md:py-5 sm:py-4">
          <div className="container-xs mb-1.5 flex flex-col items-start gap-[62px] lg:px-5 md:px-5 sm:gap-[31px]">
            <Heading as="h3" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Customers Get Great benefits!
            </Heading>
            <div className="mr-4 flex gap-[46px] self-stretch md:mr-0 md:flex-col">
              <Suspense fallback={<div>Loading feed...</div>}>
                {financeOffersList.map((d, index) => (
                  <SpecialFinancingOffers {...d} key={"group8946" + index} className="w-[24%] md:w-full" />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
