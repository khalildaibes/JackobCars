import { Heading } from "../Heading";
import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";
import { Button } from "../Button";

interface Props {
  className?: string;
  car8660x440jpg?: string;
  link?: string;
  toyotaCamryNew?: React.ReactNode;
  p35d5powerpulse?: React.ReactNode;
  p20miles?: React.ReactNode;
  petrol?: React.ReactNode;
  automatic?: React.ReactNode;
  p40000?: React.ReactNode;
  viewDetails?: React.ReactNode;
}

export default function HomeThreeArticle({
  car8660x440jpg = "img_car8_660x440_jpg.png",
  link = "Great Price",
  toyotaCamryNew = "Toyota Camry New",
  p35d5powerpulse = "&lt;&gt;3.5 D5 PowerPulse Momentum 5dr AW…&lt;br /&gt;Geartronic Estate&lt;/&gt;",
  p20miles = "20 Miles",
  petrol = "Petrol",
  automatic = "Automatic",
  p40000 = "$40,000",
  viewDetails = "View Details",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col w-full bg-white-a700 rounded-[16px]`}>
      <div className="relative h-[218px] content-center self-stretch">
        <Img
          src={car8660x440jpg}
          width={326}
          height={218}
          alt="Car8 660x440 Jpg"
          className="h-[218px] w-full flex-1 object-cover"
        />
        <div className="absolute left-0 right-0 top-5 mx-auto flex flex-1 items-center justify-between gap-5 px-5">
          <Button
            size="sm"
            shape="round"
            className="min-w-[104px] rounded-[14px] !bg-green-700 px-3.5 font-medium capitalize !text-white-a700"
          >
            {link}
          </Button>
          <Button shape="round" className="w-[36px] rounded-[18px] px-3">
            <Img src="img_bookmark_black_900.svg" width={8} height={12} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-1 self-stretch rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 px-[30px] py-4 sm:px-5">
        <Heading size="text5xl" as="p" className="text-[18px] font-medium">
          {toyotaCamryNew}
        </Heading>
        <div className="self-stretch">
          <Text as="p" className="self-end text-[14px] font-normal leading-[14px]">
            {p35d5powerpulse}
          </Text>
        </div>
        <div className="self-stretch border-t border-solid border-gray-200 py-1.5">
          <div className="mt-2 flex">
            <div className="flex flex-col items-start gap-2">
              <Img src="img_icon_black_900.svg" width={18} height={18} alt="Icon" className="ml-[18px] h-[18px]" />
              <Text  as="p" className="text-[14px] font-normal">
                {p20miles}
              </Text>
            </div>
            <div className="flex flex-col items-center gap-2 px-[26px] sm:px-5">
              <Img src="img_icon_black_900_18x18.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
              <Text as="p" className="text-[14px] font-normal">
                {petrol}
              </Text>
            </div>
            <div className="flex flex-1 flex-col items-end gap-2">
              <Img src="img_icon_18x18.svg" width={18} height={18} alt="Icon" className="mr-6 h-[18px]" />
              <Text as="p" className="text-[14px] font-normal">
                {automatic}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex items-end self-stretch border-t border-solid border-gray-200 py-2.5">
          <Heading size="headings" as="h5" className="text-[20px] font-bold">
            {p40000}
          </Heading>
          <div className="mt-1.5 flex flex-1 items-center justify-end gap-2.5">
            <Text as="p" className="text-[15px] font-medium !text-indigo-a400">
              {viewDetails}
            </Text>
            <Img src="img_arrow_left_indigo_a400_1.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
