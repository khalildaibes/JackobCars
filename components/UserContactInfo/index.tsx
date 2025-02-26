import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import React from "react";

interface Props {
  className?: string;
  cityName?: React.ReactNode;
  address?: React.ReactNode;
  mapLinkText?: React.ReactNode;
  emailAddress?: React.ReactNode;
  phoneNumber?: React.ReactNode;
}

export default function UserContactInfo({
  cityName = "San Francisco",
  address = "&lt;&gt;416 Dewey Blvd, San Francisco,&lt;br /&gt;CA 94116, USA&lt;/&gt;",
  mapLinkText = "See on Map",
  emailAddress = "alisan@boxcars.com",
  phoneNumber = "+88 656 123 456",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col md:w-full gap-[22px]`}>
      <div className="flex flex-col items-start gap-3 self-stretch">
        <Heading size="text5xl" as="p" className="text-[18px] font-medium">
          {cityName}
        </Heading>
        <Text as="p" className="text-[15px] font-normal leading-[27px]">
          {address}
        </Text>
        <div className="flex items-start gap-2.5 self-stretch">
          <Text as="p" className="self-center text-[15px] font-medium">
            {mapLinkText}
          </Text>
          <Img src="img_arrow_left_black_900.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 self-stretch">
        <div className="flex flex-1 items-center justify-center gap-3.5">
          <Img src="img_mail_1_svg.svg" width={24} height={22} alt="Mail 1 Svg" className="h-[22px]" />
          <Text as="p" className="text-[15px] font-normal">
            {emailAddress}
          </Text>
        </div>
        <div className="flex items-center gap-3.5">
          <Img src="img_phone_1_svg.svg" width={26} height={26} alt="Phone 1 Svg" className="h-[26px]" />
          <Text as="p" className="text-[15px] font-normal">
            {phoneNumber}
          </Text>
        </div>
      </div>
    </div>
  );
}
