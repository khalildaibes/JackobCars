import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  iconImage?: string;
  headingText?: React.ReactNode;
  descriptionText?: React.ReactNode;
}

export default function SpecialFinancingOffers({
  iconImage = "img_f1_svg.svg",
  headingText = "Special Financing Offers",
  descriptionText = "&lt;&gt;Our stress-free finance department that can&lt;br /&gt;find financial solutions to save you money.&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-start`}>
      <Img src={iconImage} width={60} height={60} alt="F1 Svg" className="h-[60px] w-[18%] object-contain" />
      <Heading size="text6xl" as="p" className="mt-5 text-[20px] font-medium">
        {headingText}
      </Heading>
      <Text as="p" className="mt-2.5 text-[15px] font-normal leading-[27px]">
        {descriptionText}
      </Text>
    </div>
  );
}
