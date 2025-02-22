import { Heading, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  b1jpg?: string;
  heading3audi?: React.ReactNode;
}

export default function HomeOneBackgroundBorder({ b1jpg = "img_b1_jpg.png", heading3audi = "Audi", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center w-[16%] md:w-full gap-0.5 p-6 sm:p-4 border-gray-200 border border-solid bg-white-a700 rounded-[16px]`}
    >
      <Img src={b1jpg} width={100} height={100} alt="B1 Jpg" className="h-[100px] w-[62%] object-contain" />
      <Heading size="text2xl" as="p" className="text-[18px] font-medium">
        {heading3audi}
      </Heading>
    </div>
  );
}
