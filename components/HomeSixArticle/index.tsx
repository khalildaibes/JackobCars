import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import React from "react";
import { Button } from "../Button";

interface Props {
  className?: string;
  detailPostQgc?: string;
  p2024bmwalpina?: React.ReactNode;
  aliquamHendrerit?: React.ReactNode;
  link?: string;
}

export default function HomeSixArticle({
  detailPostQgc = "img_detail_post_qgc_296x404.png",
  p2024bmwalpina = "2024 BMW ALPINA XB7 with exclusive…",
  aliquamHendrerit = "&lt;&gt;Aliquam hendrerit sollicitudin purus, quis rutrum mi&lt;br /&gt;accumsan nec.&lt;/&gt;",
  link = "View",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-[32%] md:w-full gap-5 p-5 border-gray-200 border border-solid rounded-[16px]`}
    >
      <Img
        src={detailPostQgc}
        width={404}
        height={296}
        alt="Detail Post Qgc"
        className="h-[296px] w-full rounded-[16px] object-cover"
      />
      <div className="flex flex-col items-start gap-4 self-stretch">
        <Heading size="text3xl" as="p" className="text-[20px] font-medium">
          {p2024bmwalpina}
        </Heading>
        <Text as="p" className="text-[15px] font-normal leading-[27px]">
          {aliquamHendrerit}
        </Text>
        <Button
          color="indigo_A400"
          size="7xl"
          variant="outline"
          shape="round"
          rightIcon={
            <div className="flex h-[14px] w-[14px] items-center justify-center">
              <Img
                src="img_arrow_left_indigo_a400.svg"
                width={14}
                height={14}
                alt="Arrow Left"
                className="mb-0.5 mt-1 h-[14px] w-[14px] object-contain"
              />
            </div>
          }
          className="gap-2 self-stretch rounded-[16px] !border px-[33px] font-medium sm:px-5"
        >
          {link}
        </Button>
      </div>
    </div>
  );
}
