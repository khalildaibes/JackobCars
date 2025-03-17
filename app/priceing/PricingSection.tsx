import { Heading } from "../../components/Heading";
import PricingPlan from "../../components/PricingPlan";
import React, { Suspense } from "react";

const pricingPlansList = [
  {
    price: "$29",
    planName: "Basic Plan",
    description: (
      <>
        Quis autem vel eum iure reprehenderit
        <br />
        qui in ea voluptate velit.
      </>
    ),
    listings: "50 Listings",
    visibilityDuration: "120 Days Visibility",
    highlightedFeature: "Highlighted in Search Results",
    revisions: "3 Revisions",
    deliveryTime: "7 days Delivery Time",
    support: "Products Support",
    buttonText: "Add to cart",
  },
  {
    price: "$39",
    planName: "Standard Plan",
    description: (
      <>
        Quis autem vel eum iure reprehenderit
        <br />
        qui in ea voluptate velit.
      </>
    ),
    listings: "60 Listings",
    visibilityDuration: "150 Days Visibility",
    highlightedFeature: "Highlighted in Search Results",
    revisions: "3 Revisions",
    deliveryTime: "7 days Delivery Time",
    support: "Products Support",
    buttonText: "Add to cart",
  },
  {
    price: "$89",
    planName: "Extended Plan",
    description: (
      <>
        Quis autem vel eum iure reprehenderit
        <br />
        qui in ea voluptate velit.
      </>
    ),
    listings: "80 Listings",
    visibilityDuration: "200 Days Visibility",
    highlightedFeature: "Highlighted in Search Results",
    revisions: "3 Revisions",
    deliveryTime: "7 days Delivery Time",
    support: "Products Support",
    buttonText: "Add to cart",
  },
  {
    price: "$129",
    planName: "Enterprise Plan",
    description: (
      <>
        Quis autem vel eum iure reprehenderit
        <br />
        qui in ea voluptate velit.
      </>
    ),
    listings: "100 Listings",
    visibilityDuration: "365 Days Visibility",
    highlightedFeature: "Highlighted in Search Results",
    revisions: "3 Revisions",
    deliveryTime: "7 days Delivery Time",
    support: "Products Support",
    buttonText: "Add to cart",
  },
];

export default function PricingSection() {
  return (
    <>
      {/* pricing section */}
      <div>
        <div className="flex flex-col items-center gap-8">
          <div className="self-stretch bg-black-900">
            <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
          </div>
          <div className="container-xs mb-11 flex flex-col items-center gap-[58px] lg:px-5 md:px-5 sm:gap-[29px]">
            <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Membership Plans
            </Heading>
            <div className="flex gap-[30px] self-stretch md:flex-col">
              <Suspense fallback={<div>Loading feed...</div>}>
                {pricingPlansList.map((d, index) => (
                  <PricingPlan {...d} key={"group9087" + index} className="bg-white-a700" />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
        <div className="bg-black-900">
          <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
        </div>
      </div>
    </>
  );
}
