import { Heading } from "../Heading";
import React from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  blog7qgcqjcnfx?: string;
  link?: string;
  admin?: React.ReactNode;
  november222023?: React.ReactNode;
  bmwx5gold2024?: React.ReactNode;
}

export default function BlogDetailsArticle({
  blog7qgcqjcnfx = "img_blog7_qgcqjcnfx_252x436.png",
  link = "Exterior",
  admin = "admin",
  november222023 = "November 22, 2023",
  bmwx5gold2024 = "&lt;&gt;BMW X5 Gold 2024 Sport Review: Light on&lt;br /&gt;Sport&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center w-[32%] md:w-full`}>
      <div className="flex w-full flex-col items-start">
        <div className="relative h-[252px] content-center self-stretch rounded-[16px]">
          <Img
            src={blog7qgcqjcnfx}
            width={436}
            height={252}
            alt="Blog7 Qgcqjcnfx"
            className="h-[252px] w-full flex-1 rounded-[16px] object-cover"
          />
          <Button
            size="lg"
            shape="round"
            className="absolute left-5 top-5 m-auto min-w-[80px] rounded-[16px] px-3.5 font-medium"
          >
            {link}
          </Button>
        </div>
        <div className="mt-[22px] flex items-center self-stretch">
          <Text as="p" className="text-[15px] font-normal capitalize">
            {admin}
          </Text>
          <div className="ml-2 mt-2 h-[4px] w-[4px] self-start rounded-sm bg-gray-300_01" />
          <Text as="p" className="ml-3.5 text-[15px] font-normal capitalize">
            {november222023}
          </Text>
        </div>
        <Heading size="text6xl" as="p" className="mt-2 text-[20px] font-medium leading-[30px]">
          {bmwx5gold2024}
        </Heading>
      </div>
    </div>
  );
}
