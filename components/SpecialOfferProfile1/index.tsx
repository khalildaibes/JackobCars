import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";


interface Props {
  className?: string;
  offerImage?: string;
  offerHeading?: React.ReactNode;
  offerDescription?: React.ReactNode;
}

export default function SpecialOfferProfile1({
  offerImage = "img_f1_svg_black_900_01.svg",
  offerHeading = "Special Financing Offers",
  offerDescription = "&lt;&gt;Our stress-free finance&lt;br /&gt;department that can find financial&lt;br /&gt;solutions to save you money.&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start justify-center w-[24%] md:w-full gap-[18px] px-10 py-[34px] sm:p-4 bg-white-a700 shadow-xs rounded-[16px]`}
    >
      <Img src={offerImage} width={50} height={60} alt="F1 Svg" className="mt-1 h-[60px] w-[20%] object-contain" />
      <Heading size="text6xl" as="p" className="text-[20px] font-medium">
        {offerHeading}
      </Heading>
      <Text as="p" className="text-[15px] font-normal leading-[27px]">
        {offerDescription}
      </Text>
    </div>
  );
}
