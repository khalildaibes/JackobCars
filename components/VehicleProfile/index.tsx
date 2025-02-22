import { Heading, Button, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  vehicleTypeText?: React.ReactNode;
}

export default function VehicleProfile({ vehicleTypeText = "SUV", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center w-[16%] md:w-full gap-2.5 p-[38px] sm:p-4 border-gray-200 border border-solid bg-white-a700 rounded-[16px]`}
    >
      <Button color="gray_50" size="11xl" className="w-[70px] rounded-[34px] px-[18px]">
        <Img src="img_clip_path_group.svg" width={34} height={34} />
      </Button>
      <Heading size="text2xl" as="p" className="text-[18px] font-medium">
        {vehicleTypeText}
      </Heading>
    </div>
  );
}
