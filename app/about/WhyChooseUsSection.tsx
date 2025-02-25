import { Heading } from "../../components";
import SpecialFinancingOffers from "../../components/SpecialFinancingOffers";
import React, { Suspense } from "react";

const dealershipBenefitsList = [
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

export default function WhyChooseUsSection() {
  return (
    <>
      {/* why choose us section */}
      <div className="mt-[126px] flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col items-start gap-7 lg:px-5 md:px-5">
          <Heading as="h5" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
            Why Choose Us?
          </Heading>
          <div className="mr-4 flex gap-[46px] self-stretch md:mr-0 md:flex-col">
            <Suspense fallback={<div>Loading feed...</div>}>
              {dealershipBenefitsList.map((d, index) => (
                <SpecialFinancingOffers {...d} key={"group9187" + index} className="w-[24%] md:w-full" />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
