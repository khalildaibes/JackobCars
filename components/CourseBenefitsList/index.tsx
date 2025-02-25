import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  benefittext1?: React.ReactNode;
  benefittext2?: React.ReactNode;
  benefittext3?: React.ReactNode;
  benefittext4?: React.ReactNode;
  benefittext5?: React.ReactNode;
}

export default function CourseBenefitsList({
  benefittext1 = "Become a UI/UX designer.",
  benefittext2 = "You will be able to start earning money Figma skills.",
  benefittext3 = "Build a UI project from beginning to end.",
  benefittext4 = "Work with colors & fonts.",
  benefittext5 = "You will create your own UI Kit.",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col justify-center w-[50%] md:w-full gap-6`}>
      <div className="flex items-center gap-2.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {benefittext1}
        </Text>
      </div>
      <div className="flex items-center gap-2.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {benefittext2}
        </Text>
      </div>
      <div className="flex items-center gap-2.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {benefittext3}
        </Text>
      </div>
      <div className="flex items-center gap-2.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {benefittext4}
        </Text>
      </div>
      <div className="flex items-center gap-2.5 self-stretch">
        <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
          <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
        </div>
        <Text as="p" className="text-[15px] font-normal">
          {benefittext5}
        </Text>
      </div>
    </div>
  );
}
