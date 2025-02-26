import {Text} from "../../components/Text";
import { Img } from "@/components/Img";import React from "react";

interface Props {
  className?: string;
  pinImage?: string;
  addressHeading?: React.ReactNode;
  addressText?: React.ReactNode;
}

export default function AddressCard({
  pinImage = "img_pin_svg.svg",
  addressHeading = "Address",
  addressText = "&lt;&gt;123 Queensberry Street, North&lt;br /&gt;Melbourne VIC3051, Australia.&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center self-stretch flex-1`}>
      <div className="flex w-full flex-col items-end">
        <div className="flex items-start gap-[15px] self-stretch">
          <Img src={pinImage} width={20} height={22} alt="Pin Svg" className="mt-1 h-[22px] self-end" />
          <Text as="p" className="text-[15px] font-medium">
            {addressHeading}
          </Text>
        </div>
        <Text as="p" className="relative mt-[-2px] text-[15px] font-normal leading-[27px]">
          {addressText}
        </Text>
      </div>
    </div>
  );
}
