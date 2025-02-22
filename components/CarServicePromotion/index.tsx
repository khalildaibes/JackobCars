import { Img, Button, Text, Heading } from "./..";
import React from "react";

interface Props {
  className?: string;
  headingText?: React.ReactNode;
  descriptionText?: React.ReactNode;
  buttonText?: string;
  carImage?: string;
}

export default function CarServicePromotion({
  headingText = "&lt;&gt;Are You Looking&lt;br /&gt;For a Car ?&lt;/&gt;",
  descriptionText = "&lt;&gt;We are committed to providing our customers with&lt;br /&gt;exceptional service.&lt;/&gt;",
  buttonText = "Get Started",
  carImage = "img_electric_car_svg.svg",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex items-end w-[50%] md:w-full p-[50px] md:p-5 sm:p-4 rounded-[16px]`}
    >
      <div className="mt-[30px] flex w-full items-start sm:w-full">
        <div className="mb-[30px] flex flex-1 flex-col items-start gap-3.5 sm:gap-3.5">
          <Heading size="headingmd" as="h3" className="text-[30px] font-bold leading-[45px] sm:text-[25px]">
            {headingText}
          </Heading>
          <Text as="p" className="text-[15px] font-normal leading-[27px]">
            {descriptionText}
          </Text>
          <Button
            color="indigo_A400"
            size="8xl"
            shape="round"
            rightIcon={
              <div className="flex h-[14px] w-[14px] items-center justify-center">
                <Img
                  src="img_arrowleft_white_a700.svg"
                  width={14}
                  height={14}
                  alt="Arrow Left"
                  className="my-1 h-[14px] w-[14px] object-contain"
                />
              </div>
            }
            className="min-w-[158px] gap-2 rounded-[12px] border border-solid border-indigo-a400 px-[25px] font-medium sm:px-5"
          >
            {buttonText}
          </Button>
        </div>
        <Img
          src={carImage}
          width={110}
          height={110}
          alt="Electric Car Svg"
          className="h-[110px] w-[20%] self-end object-contain"
        />
      </div>
    </div>
  );
}
