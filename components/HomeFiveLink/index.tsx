import { Heading, Button, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  heading4suv?: React.ReactNode;
}

export default function HomeFiveLink({ heading4suv = "SUV", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[16%] md:w-full gap-3 p-10 sm:p-4 border-gray-200 border border-solid bg-white-a700 rounded-[16px]`}
    >
      <Button size="13xl" shape="round" className="w-[70px] rounded-[34px] !bg-gray-50_01 px-[18px]">
        <Img src="img_clip_path_group.svg" width={34} height={34} />
      </Button>
      <Heading size="text5xl" as="p" className="text-[18px] font-medium">
        {heading4suv}
      </Heading>
    </div>
  );
}
