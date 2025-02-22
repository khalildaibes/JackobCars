import { Text } from "../../components/Text";
import { Heading } from "../../components/Heading";
import React from "react";

interface Props {
  className?: string;
  headingText?: React.ReactNode;
  subheadingText?: React.ReactNode;
}

export default function CarSalesHeader({ headingText = "836M", subheadingText = "CARS FOR SALE", ...props }: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col !items-center !justify-center w-full gap-1.5`}>
      <Heading size="headingxl" as="h1" className="text-[38px] font-bold">
        {headingText}
      </Heading>
      <Text as="p" className="text-[12px]  !items-center !justify-center">
        {subheadingText}
      </Text>
    </div>
  );
}
