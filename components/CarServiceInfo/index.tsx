import { Heading } from "../Heading";
import React from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  headingText?: React.ReactNode;
  descriptionText?: React.ReactNode;
  buttonText?: string;
}

export default function CarServiceInfo({
  headingText = "&lt;&gt;Are You Looking&lt;br /&gt;For a Car ?&lt;/&gt;",
  descriptionText = "&lt;&gt;We are committed to providing our customers with&lt;br /&gt;exceptional service.&lt;/&gt;",
  buttonText = "Get Started",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start justify-center h-[392px] w-[50%] lg:h-auto md:w-full md:h-auto pl-20 pr-14 gap-3.5 py-20 lg:pl-8 lg:py-8 md:p-5 sm:p-4 bg-cover bg-no-repeat rounded-[16px]`}
    >
      <Heading
        size="headingmd"
        as="h3"
        className="text-[30px] font-bold leading-[45px] !text-white-a700 sm:text-[25px]"
      >
        {headingText}
      </Heading>
      <Text as="p" className="text-[15px] font-normal leading-[27px] !text-white-a700">
        {descriptionText}
      </Text>
      <Button
        size="8xl"
        shape="round"
        rightIcon={
          <div className="flex h-[14px] w-[14px] items-center justify-center">
            <Img
              src="img_arrow_left.svg"
              width={14}
              height={14}
              alt="Arrow Left"
              className="my-1 h-[14px] w-[14px] object-contain"
            />
          </div>
        }
        className="min-w-[158px] gap-2 rounded-[12px] border border-solid border-white-a700 px-[25px] font-medium sm:px-5"
      >
        {buttonText}
      </Button>
    </div>
  );
}
