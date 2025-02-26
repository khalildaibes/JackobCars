import { Text } from "../Text";
import React from "react";

interface Props {
  className?: string;
  usedCarsText?: React.ReactNode;
}

export default function UsedCarsCombobox({ usedCarsText = "Used Cars", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex items-center w-[32%] md:w-full px-1 border-white-a700_26 border-r border-solid`}
    >
      <div className="w-full px-6 sm:px-5">
        <div className="flex items-center justify-between gap-5 py-1.5">
          <Text as="p" className="text-[15px] font-normal !text-white-a700">
            {usedCarsText}
          </Text>
          <div className="white_A700_black_900_00_border h-[5px] w-[8px] border-l-4 border-r-4 border-t-[5px] border-solid" />
        </div>
      </div>
    </div>
  );
}
