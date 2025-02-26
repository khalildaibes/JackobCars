import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import React from "react";
import { Button } from "../Button";

interface Props {
  className?: string;
  userImage?: string;
  linkButton?: string;
  adminText?: React.ReactNode;
  dateText?: React.ReactNode;
  descriptionText?: React.ReactNode;
}

export default function UserProfile5({
  userImage = "img_detail_post_qgc.png",
  linkButton = "Sound",
  adminText = "admin",
  dateText = "November 22, 2023",
  descriptionText = "&lt;&gt;2024 BMW ALPINA XB7 with exclusive details,&lt;br /&gt;extraordinary&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center w-[32%] md:w-full`}>
      <div className="flex w-full flex-col items-center">
        <div className="relative h-[298px] content-center self-stretch rounded-[16px]">
          <Img
            src={userImage}
            width={446}
            height={298}
            alt="Detail Post Qgc"
            className="h-[298px] w-full flex-1 rounded-[16px] object-cover"
          />
          <Button
            size="lg"
            shape="round"
            className="absolute left-5 top-5 m-auto min-w-[70px] rounded-[16px] px-3.5 font-medium"
          >
            {linkButton}
          </Button>
        </div>
        <div className="mt-[22px] flex items-center self-stretch">
          <Text as="p" className="text-[15px] font-normal capitalize">
            {adminText}
          </Text>
          <div className="ml-2 mt-2 h-[4px] w-[4px] self-start rounded-sm bg-gray-300_01" />
          <Text as="p" className="ml-3.5 text-[15px] font-normal capitalize">
            {dateText}
          </Text>
        </div>
        <Heading size="text6xl" as="p" className="mt-2 text-[20px] font-medium leading-[30px]">
          {descriptionText}
        </Heading>
      </div>
    </div>
  );
}
