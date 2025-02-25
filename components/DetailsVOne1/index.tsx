import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  comfort?: React.ReactNode;
  perfect?: React.ReactNode;
  p50?: React.ReactNode;
  exteriorStyling?: React.ReactNode;
  perfect1?: React.ReactNode;
  p501?: React.ReactNode;
  performance?: React.ReactNode;
  perfect2?: React.ReactNode;
  p502?: React.ReactNode;
}

export default function DetailsVOne1({
  comfort = "Comfort",
  perfect = "Perfect",
  p50 = "5.0",
  exteriorStyling = "Exterior Styling",
  perfect1 = "Perfect",
  p501 = "5.0",
  performance = "Performance",
  perfect2 = "Perfect",
  p502 = "5.0",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col w-[50%] md:w-full gap-3.5`}>
      <div className="self-stretch border-b border-solid border-gray-200">
        <div className="mb-3 flex items-center">
          <div className="flex w-full flex-col items-start gap-0.5">
            <Heading size="text3xl" as="p" className="text-[16px] font-medium">
              {comfort}
            </Heading>
            <Text as="p" className="text-[15px] font-normal">
              {perfect}
            </Text>
          </div>
          <div className="flex w-full items-center justify-end gap-[7px]">
            <Img src="img_checkmark_indigo_a400.svg" width={18} height={18} alt="Checkmark" className="h-[18px]" />
            <Heading size="text3xl" as="p" className="text-[16px] font-medium">
              {p50}
            </Heading>
          </div>
        </div>
      </div>
      <div className="self-stretch border-b border-solid border-gray-200">
        <div className="mb-2.5 flex items-center justify-between gap-5">
          <div className="flex flex-1 flex-col items-start">
            <Heading size="text3xl" as="p" className="text-[16px] font-medium">
              {exteriorStyling}
            </Heading>
            <Text as="p" className="text-[15px] font-normal">
              {perfect1}
            </Text>
          </div>
          <div className="flex items-center gap-[7px]">
            <Img src="img_checkmark_indigo_a400.svg" width={18} height={18} alt="Checkmark" className="h-[18px]" />
            <Heading size="text3xl" as="p" className="text-[16px] font-medium">
              {p501}
            </Heading>
          </div>
        </div>
      </div>
      <div className="self-stretch border-b border-solid border-gray-200">
        <div className="mb-3 flex items-center justify-between gap-5">
          <div className="flex flex-1 flex-col items-start gap-0.5">
            <Heading size="text3xl" as="p" className="text-[16px] font-medium">
              {performance}
            </Heading>
            <Text as="p" className="text-[15px] font-normal">
              {perfect2}
            </Text>
          </div>
          <div className="flex items-center gap-[7px]">
            <Img src="img_checkmark_indigo_a400.svg" width={18} height={18} alt="Checkmark" className="h-[18px]" />
            <Heading size="text3xl" as="p" className="text-[16px] font-medium">
              {p502}
            </Heading>
          </div>
        </div>
      </div>
    </div>
  );
}
