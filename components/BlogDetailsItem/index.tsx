import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  adminImage: string;
  admin?: React.ReactNode;
  date?: string;
  reply?: React.ReactNode;
  comment: string;
}

export default function BlogDetailsItem({
  adminImage,
  admin = "admin",
  date = "November 22, 2023",
  reply = "Reply",
  comment,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center self-stretch gap-3.5 flex-1`}
    >
      <div className="flex items-center justify-between gap-5 self-stretch">
        <div className="flex flex-1 items-center">
          <Img
            src={adminImage}
            width={40}
            height={40}
            alt="Admin Avatar"
            className="h-[40px] rounded-[20px] object-cover"
          />
          <div className="flex py-1">
            <Heading size="text5xl" as="p" className="text-[18px] font-medium capitalize sm:text-[15px]">
              {admin}
            </Heading>
          </div>
          <Text as="p" className="ml-3 text-[14px] font-normal">
            {date}
          </Text>
        </div>
        <div className="flex">
          <Text as="p" className="text-[14px] font-medium !text-teal-a700">
            {reply}
          </Text>
        </div>
      </div>
      <Text as="p" className="text-[15px] font-normal leading-[27px]">
        {comment}
      </Text>
    </div>
  );
}
