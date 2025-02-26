import { Heading } from "../Heading";
import React from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  s1300x300jpg?: string;
  productName?: React.ReactNode;
  price?: React.ReactNode;
  p2?: React.ReactNode;
  frontAndRearBrake?: React.ReactNode;
  p120?: React.ReactNode;
  buttonText?: string;
}

export default function ShopPageBackgroundBorder({
  s1300x300jpg = "img_s1_300x300_jpg.png",
  productName = "SSSSS",
  p120 = "SSSSS",
  p2 = "(2)",
  frontAndRearBrake = "Front and Rear Brake Kit",
  price = "$120",
  buttonText = "Add to cart",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-full p-[30px] sm:p-4 border-gray-200 border border-solid bg-white-a700 rounded-[16px]`}
    >
      <Img src={s1300x300jpg} width={264} height={264} alt="S1 300x300 Jpg" className="h-[264px] w-full object-cover" />
      <div className="mt-5 flex items-center gap-[7px] self-stretch">
        <div className="flex w-[30%] flex-col items-start">
          <Text size="texts" as="p" className="!font-star text-[11px] font-normal tracking-[5.00px] !text-gray-300_01">
            {p2}
          </Text>
          <div className="relative mt-[-8px] flex self-stretch">
            <Text size="texts" as="p" className="!font-star text-[11px] font-normal tracking-[5.00px] !text-yellow-700">
              {p120}
            </Text>
          </div>
        </div>
        <Text as="p" className="text-[15px] font-normal !text-black-900">
          {p2}
        </Text>
      </div>
      <div className="mt-2 flex self-stretch">
        <Heading size="text3xl" as="p" className="text-[16px] font-medium">
          {frontAndRearBrake}
        </Heading>
      </div>
      <Heading size="headings" as="h5" className="mt-2 text-[20px] font-bold">
        {p120}
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
        {buttonText}
      </Button>
    </div>
  );
}
