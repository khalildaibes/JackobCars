import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
interface Props {
  className?: string;
  sedanJpg?: string;
  heading4sedan?: React.ReactNode;
}

export default function HomeTenLink({ sedanJpg = "img_sedan_jpg.png", heading4sedan = "Sedan", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[16%] md:w-full mb-3.5 gap-3 px-4 md:mb-0 bg-white-a700`}
    >
      <Img src={sedanJpg} width={200} height={150} alt="Sedan Jpg" className="h-[150px] w-full object-cover" />
      <Heading size="text5xl" as="p" className="text-[18px] font-medium">
        {heading4sedan}
      </Heading>
    </div>
  );
}
