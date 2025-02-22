import { Heading, Text, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  suvJpg?: string;
  p3cars?: React.ReactNode;
  heading4suv?: React.ReactNode;
}

export default function HomeSevenLink({
  suvJpg = "img_suv_jpg.png",
  p3cars = "3 Cars",
  heading4suv = "SUV",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} h-[294px] w-[20%] lg:h-auto md:w-full md:h-auto bg-white-a700 relative rounded-[16px]`}
    >
      <Img
        src={suvJpg}
        width={256}
        height={294}
        alt="Suv Jpg"
        className="h-[294px] w-full flex-1 rounded-[16px] object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 flex-col items-start gap-1.5 rounded-[16px] bg-gradient px-[30px] py-8 sm:p-5">
        <Text as="p" className="text-[15px] font-normal !text-white-a700">
          {p3cars}
        </Text>
        <Heading size="text2xl" as="p" className="mb-44 text-[18px] font-medium !text-white-a700">
          {heading4suv}
        </Heading>
      </div>
    </div>
  );
}
