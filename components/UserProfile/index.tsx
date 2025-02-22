import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import React from "react";
import { Button } from "../Button";

interface Props {
  className?: string;
  userImage?: string;
  actionButton?: string;
  userName?: React.ReactNode;
  postDate?: React.ReactNode;
  postTitle?: React.ReactNode;
}

export default function UserProfile({
  userImage = "img_detail_post_qgc.png",
  actionButton = "Sound",
  userName = "admin",
  postDate = "November 22, 2023",
  postTitle = "&lt;&gt;2024 BMW ALPINA XB7 with exclusive details,&lt;br /&gt;extraordinary&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center w-[32%] md:w-full`}>
      <div className="self-stretch rounded-[16px]">
        <div className="relative h-[298px] content-center rounded-[16px]">
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
            {actionButton}
          </Button>
        </div>
      </div>
      <div className="mt-[18px] flex items-center gap-3.5 self-stretch">
        <div className="flex w-[14%] items-center gap-2">
          <Text as="p" className="text-[15px] font-normal capitalize">
            {userName}
          </Text>
          <div className="h-[4px] w-[4px] rounded-sm bg-gray-300" />
        </div>
        <Text as="p" className="self-end text-[15px] font-normal capitalize">
          {postDate}
        </Text>
      </div>
      <Heading size="text3xl" as="p" className="mt-1 text-[20px] font-medium leading-[30px]">
        {postTitle}
      </Heading>
    </div>
  );
}
