import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";
import { Button } from "../Button";

interface Props {
  className?: string;
  price?: React.ReactNode;
  planName?: React.ReactNode;
  description?: React.ReactNode;
  listings?: React.ReactNode;
  visibilityDuration?: React.ReactNode;
  highlightedFeature?: React.ReactNode;
  revisions?: React.ReactNode;
  deliveryTime?: React.ReactNode;
  support?: React.ReactNode;
  buttonText?: string;
}

export default function PricingPlan({
  price = "$29",
  planName = "Basic Plan",
  description = "&lt;&gt;Quis autem vel eum iure reprehenderit&lt;br /&gt;qui in ea voluptate velit.&lt;/&gt;",
  listings = "50 Listings",
  visibilityDuration = "120 Days Visibility",
  highlightedFeature = "Highlighted in Search Results",
  revisions = "3 Revisions",
  deliveryTime = "7 days Delivery Time",
  support = "Products Support",
  buttonText = "Add to cart",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start w-[24%] md:w-full px-[30px] py-6 sm:p-4 border-gray-200 border border-solid rounded-[16px]`}
    >
      <Heading size="headingxl" as="h1" className="text-[38px] font-bold">
        {price}
      </Heading>
      <Heading size="text6xl" as="p" className="mt-1.5 text-[20px] font-medium capitalize">
        {planName}
      </Heading>
      <Text as="p" className="mt-3 text-[14px] font-normal leading-[25px]">
        {description}
      </Text>
      <div className="mt-3 flex flex-col gap-[22px] self-stretch">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
            <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
          </div>
          <Text as="p" className="text-[15px] font-normal">
            {listings}
          </Text>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
            <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
          </div>
          <Text as="p" className="text-[15px] font-normal">
            {visibilityDuration}
          </Text>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
            <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
          </div>
          <Text as="p" className="text-[15px] font-normal">
            {highlightedFeature}
          </Text>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
            <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
          </div>
          <Text as="p" className="text-[15px] font-normal">
            {revisions}
          </Text>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
            <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
          </div>
          <Text as="p" className="text-[15px] font-normal">
            {deliveryTime}
          </Text>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
            <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
          </div>
          <Text as="p" className="text-[15px] font-normal">
            {support}
          </Text>
        </div>
      </div>
      <Button
        size="12xl"
        shape="round"
        className="mb-1.5 mt-6 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium capitalize !text-indigo-a400 sm:px-5"
      >
        {buttonText}
      </Button>
    </div>
  );
}
