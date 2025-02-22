import { Text } from "../../components/Text";
import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img/index";
import { Slider } from "../../components/Slider"
import React from "react";

interface Props {
  className?: string;
  detailPostQgc?: string;
  link?: string;
  admin?: React.ReactNode;
  november222023?: React.ReactNode;
  p2024bmwalpina?: React.ReactNode;
}

export default function HomeEightArticle({
  detailPostQgc = "img_detail_post_qgc.png",
  link = "Sound",
  admin = "admin",
  november222023 = "November 22, 2023",
  p2024bmwalpina = "2024 BMW ALPINA XB7 with exclusive details",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center w-[42%] md:w-full`}>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="relative h-[298px] content-center self-stretch rounded-[16px]">
          <Img
            src={detailPostQgc}
            width={446}
            height={298}
            alt="Detail Post Qgc"
            className="h-[298px] w-full flex-1 rounded-[16px] object-cover items-center justify-center "
          />
          <Button
            size="lg"
            shape="round"
            className="absolute left-5 top-5 m-auto min-w-[70px] rounded-[16px] px-3.5 font-medium"
          >
            {link}
          </Button>
        </div>
        <div className="mt-5 flex items-center self-stretch">
          <Text as="p" className="text-[15px] font-normal capitalize">
            {admin}
          </Text>
          <div className="ml-2 mt-2 h-[4px] w-[4px] self-start rounded-sm bg-gray-300" />
          <Text as="p" className="ml-3.5 text-[15px] font-normal capitalize">
            {november222023}
          </Text>
        </div>
        <Heading size="text3xl" as="p" className="mt-1.5 text-[20px] font-medium leading-[30px]">
          {p2024bmwalpina}
        </Heading>
      </div>
    </div>
  );
}
