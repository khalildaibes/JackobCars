import { Heading } from "../Heading";
import React from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  sSSSS?: React.ReactNode;
  sssss1?: React.ReactNode;
  p1?: React.ReactNode;
  electricMotorFor?: React.ReactNode;
  p118?: React.ReactNode;
  link?: string;
}

export default function ShopPageBackgroundBorder1({
  sSSSS = "SSSSS",
  sssss1 = "SSSSS",
  p1 = "(1)",
  electricMotorFor = "Electric Motor For Car Mini",
  p118 = "$118",
  link = "Add to cart",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-[32%] md:w-full p-[30px] sm:p-4 border-gray-200 border border-solid bg-white-a700 rounded-[16px]`}
    >
      <div className="flex flex-col items-start self-stretch">
        <Img
          src="img_s2_300x300_jpg.png"
          width={264}
          height={264}
          alt="S2 300x300 Jpg"
          className="h-[264px] w-full object-cover"
        />
        <div className="mt-5 flex items-center gap-[7px] self-stretch">
          <div className="flex flex-col items-start justify-center">
            <Text
              size="texts"
              as="p"
              className="!font-star text-[11px] font-normal tracking-[5.00px] !text-gray-300_01"
            >
              {sSSSS}
            </Text>
            <Text
              size="texts"
              as="p"
              className="relative mt-[-8px] !font-star text-[11px] font-normal tracking-[5.00px] !text-yellow-700"
            >
              {sssss1}
            </Text>
          </div>
          <Text as="p" className="text-[15px] font-normal !text-black-900">
            {p1}
          </Text>
        </div>
        <div className="mt-2 flex self-stretch">
          <Heading size="text3xl" as="p" className="text-[16px] font-medium">
            {electricMotorFor}
          </Heading>
        </div>
        <Heading size="headings" as="h5" className="mt-2 text-[20px] font-bold">
          {p118}
        </Heading>
        <Button
          size="10xl"
          leftIcon={
            <Img
              src="img_cart_indigo_a400.svg"
              width={24}
              height={24}
              alt="Cart"
              className="h-[24px] w-[24px] object-contain"
            />
          }
          className="mt-5 gap-2.5 self-stretch rounded-lg border border-solid border-indigo-a400 px-[33px] capitalize !text-indigo-a400 sm:px-5"
        >
          {link}
        </Button>
      </div>
    </div>
  );
}
