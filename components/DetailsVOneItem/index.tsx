import { Img } from "../Img";
import { Text } from "../Text";
import React from "react";

interface Props {
  className?: string;
  androidAuto?: React.ReactNode;
}

export default function DetailsVOneItem({ androidAuto = " Android Auto", ...props }: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center self-stretch flex-1`}>
      <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
        <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
      </div>
      <Text as="p" className="text-[15px] font-normal">
        {androidAuto}
      </Text>
    </div>
  );
}
