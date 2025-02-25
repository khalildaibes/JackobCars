import { Text, Heading } from "./..";
import React from "react";

interface Props {
  className?: string;
  p836m?: React.ReactNode;
  cARSFORSALE?: React.ReactNode;
}

export default function HomeOne1({ p836m = "836M", cARSFORSALE = "CARS FOR SALE", ...props }: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center md:w-full gap-2.5`}>
      <Heading size="headingxl" as="h1" className="text-[38px] font-bold">
        {p836m}
      </Heading>
      <Text as="p" className="text-[15px] font-normal">
        {cARSFORSALE}
      </Text>
    </div>
  );
}
