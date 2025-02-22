import { Text, Heading, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  offerImage?: string;
  offerHeading?: React.ReactNode;
  offerDescription?: React.ReactNode;
}

export default function SpecialOfferSection2({
  offerImage = "img_f1_white_svg.svg",
  offerHeading = "Special Financing Offers",
  offerDescription = "&lt;&gt;Our stress-free finance department that can&lt;br /&gt;find financial solutions to save you money.&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-start w-[24%] md:w-full`}>
      <Img src={offerImage} width={50} height={60} alt="F1 White Svg" className="h-[60px] w-[16%] object-contain" />
      <Heading size="text3xl" as="p" className="mt-[18px] text-[20px] font-medium !text-white-a700">
        {offerHeading}
      </Heading>
      <Text as="p" className="mt-2 text-[15px] font-normal leading-[27px] !text-white-a700">
        {offerDescription}
      </Text>
    </div>
  );
}
