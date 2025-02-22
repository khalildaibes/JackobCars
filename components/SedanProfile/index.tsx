import React from "react";
import { Heading } from "../Heading";
import { Img } from "../Img";

interface Props {
  className?: string;
  sedanImage?: string;
  sedanHeading?: React.ReactNode;
}

export default function SedanProfile({ sedanImage = "img_sedan_jpg.png", sedanHeading = "Sedan", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[16%] md:w-full mb-3.5 gap-2.5 px-4 md:mb-0 bg-white-a700`}
    >
      <Img src={sedanImage} width={200} height={150} alt="Sedan Jpg" className="h-[150px] w-full object-cover" />
      <Heading size="text2xl" as="p" className="text-[18px] font-medium">
        {sedanHeading}
      </Heading>
    </div>
  );
}
