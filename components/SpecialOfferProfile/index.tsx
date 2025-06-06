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

export default function SpecialOfferProfile({
  offerImage = "img_f1_svg_black_900_01.svg",
  offerHeading = "Special Financing Offers",
  offerDescription = "&lt;&gt;Our stress-free finance department that can&lt;br /&gt;find financial solutions to save you money.&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-start`}>
      <Img src={offerImage} width={50} height={60} alt="F1 Svg" className="h-[60px] w-[16%] object-contain" />
      <Heading size="text6xl" as="p" className="mt-5 text-[20px] font-medium">
        {offerHeading}
      </Heading>
      <Text as="p" className="mt-2.5 text-[15px] font-normal leading-[27px]">
        {offerDescription}
      </Text>
    </div>
  );
}
