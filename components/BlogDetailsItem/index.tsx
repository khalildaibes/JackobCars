import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  test1150x150jpg?: string;
  admin?: React.ReactNode;
  november222023?: React.ReactNode;
  reply?: React.ReactNode;
  loremIpsumDolor?: React.ReactNode;
}

export default function BlogDetailsItem({
  test1150x150jpg = "img_test1_150x150_jpg_40x40.png",
  admin = "admin",
  november222023 = "November 22, 2023",
  reply = "Reply",
  loremIpsumDolor = "&lt;&gt;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim&lt;br /&gt;ad minim veniam.&lt;/&gt;",
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
            src={test1150x150jpg}
            width={40}
            height={40}
            alt="Test1 150x150 Jpg"
            className="h-[40px] rounded-[20px] object-cover"
          />
          <div className="flex py-1">
            <Heading size="text5xl" as="p" className="text-[18px] font-medium capitalize sm:text-[15px]">
              {admin}
            </Heading>
          </div>
          <Text  as="p" className="ml-3 text-[14px] font-normal">
            {november222023}
          </Text>
        </div>
        <div className="flex">
          <Text as="p" className="text-[14px] font-medium !text-teal-a700">
            {reply}
          </Text>
        </div>
      </div>
      <Text as="p" className="text-[15px] font-normal leading-[27px]">
        {loremIpsumDolor}
      </Text>
    </div>
  );
}
