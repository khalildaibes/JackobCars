import { Img } from "../Img";
import { Text } from "../Text";
import React from "react";

interface Props {
  className?: string;
  heater?: React.ReactNode;
  leatherSeats?: React.ReactNode;
  panoramicMoonroof?: React.ReactNode;
  tachometer?: React.ReactNode;
}

export default function DetailsVTwo1({
  heater = " Heater",
  leatherSeats = " Leather Seats",
  panoramicMoonroof = " Panoramic Moonroof",
  tachometer = " Tachometer",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col sm:w-full gap-3.5`}>
      <div className="flex items-center gap-3.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {heater}
        </Text>
      </div>
      <div className="flex items-center gap-3.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {leatherSeats}
        </Text>
      </div>
      <div className="flex items-center gap-3.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {panoramicMoonroof}
        </Text>
      </div>
      <div className="flex items-center gap-[13px] self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {tachometer}
        </Text>
      </div>
    </div>
  );
}
