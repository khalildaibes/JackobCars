import { Heading } from "lucide-react";
import React from "react";
import { Button } from "../Button";
import { Img } from "../Img";

interface Props {
  className?: string;
  carImage?: string;
  link?: string;
  carTitle?: React.ReactNode;
  carDescription?: React.ReactNode;
  carDistance?: React.ReactNode;
  carFuelType?: React.ReactNode;
  carTransmission?: React.ReactNode;
  carPrice?: React.ReactNode;
  viewDetailsText?: React.ReactNode;
}

export default function CarProfile({
  carImage = "img_car8_660x440_jpg.png",
  link = "Great Price",
  carTitle = "Toyota Camry New",
  carDescription = "&lt;&gt;3.5 D5 PowerPulse Momentum 5dr AW…&lt;br /&gt;Geartronic Estate&lt;/&gt;",
  carDistance = "20 Miles",
  carFuelType = "Petrol",
  carTransmission = "Automatic",
  carPrice = "$40,000",
  viewDetailsText = "View Details",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col w-full bg-white-a700 rounded-[16px]`}>
      <div className="relative h-[218px] content-center self-stretch">
        <Img
          src={carImage}
          width={326}
          height={218}
          alt="Car8 660x440 Jpg"
          className="h-[218px] w-full flex-1 object-cover"
        />
        <div className="absolute left-0 right-0 top-5 mx-auto flex flex-1 items-center justify-between gap-5 px-5">
          <Button
            color="green_700"
            size="sm"
            shape="round"
            className="min-w-[104px] rounded-[14px] px-3.5 font-medium capitalize"
          >
            {link}
          </Button>
          <Button shape="circle" className="w-[36px] rounded-[18px] px-3">
            <Img src="img_bookmark.svg" width={8} height={12} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center self-stretch rounded-bl-[16px] rounded-br-[16px] border-b border-l border-r border-solid border-gray-200 px-[30px] py-4 sm:px-5">
        <Heading size="text2xl" as="p" className="text-[18px] font-medium">
          {carTitle}
        </Heading>
        <div className="self-stretch">
          <Text size="textmd" as="p" className="self-end text-[14px] font-normal leading-[14px]">
            {carDescription}
          </Text>
        </div>
        <div className="mt-1 self-stretch border-t border-solid border-gray-200 py-1.5">
          <div className="mt-2 flex">
            <div className="flex flex-col items-start gap-1.5">
              <Img src="img_icon_black_900.svg" width={18} height={18} alt="Icon" className="ml-[18px] h-[18px]" />
              <Text size="textmd" as="p" className="text-[14px] font-normal">
                {carDistance}
              </Text>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-[26px] sm:px-5">
              <Img src="img_icon_black_900_18x18.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
              <Text size="textmd" as="p" className="text-[14px] font-normal">
                {carFuelType}
              </Text>
            </div>
            <div className="flex flex-1 flex-col items-end gap-1.5">
              <Img src="img_icon_18x18.svg" width={18} height={18} alt="Icon" className="mr-6 h-[18px]" />
              <Text size="textmd" as="p" className="text-[14px] font-normal">
                {carTransmission}
              </Text>
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-end self-stretch border-t border-solid border-gray-200 py-2.5">
          <Heading size="headings" as="h5" className="mt-1 text-[20px] font-bold">
            {carPrice}
          </Heading>
          <div className="flex flex-1 items-center justify-end gap-2.5">
            <Text as="p" className="text-[15px] font-medium !text-indigo-a400">
              {viewDetailsText}
            </Text>
            <Img src="img_arrow_left_indigo_a400.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
