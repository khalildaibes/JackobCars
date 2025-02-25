import { Text } from "../Text";
import React from "react";

interface Props {
  className?: string;
  length?: React.ReactNode;
  p4950mm?: React.ReactNode;
  height?: React.ReactNode;
  p1550mm?: React.ReactNode;
  wheelbase?: React.ReactNode;
  p2580mm?: React.ReactNode;
  heightIncluding?: React.ReactNode;
  p1850mm?: React.ReactNode;
  luggageCapacity?: React.ReactNode;
  p480?: React.ReactNode;
  luggagecapacity1?: React.ReactNode;
  p850?: React.ReactNode;
}

export default function DetailsVOneList({
  length = "Length",
  p4950mm = "4950mm",
  height = "Height",
  p1550mm = "1550mm",
  wheelbase = "Wheelbase",
  p2580mm = "2580mm",
  heightIncluding = "Height (including roof rails)",
  p1850mm = "1850mm",
  luggageCapacity = "Luggage Capacity (Seats Up - Litres)",
  p480 = "480",
  luggagecapacity1 = "Luggage Capacity (Seats Down - Litres)",
  p850 = "850",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col md:w-full gap-[22px]`}>
      <div className="flex flex-wrap justify-between gap-5 self-stretch">
        <Text as="p" className="text-[15px] font-normal">
          {length}
        </Text>
        <Text as="p" className="mr-[152px] text-[15px] font-medium">
          {p4950mm}
        </Text>
      </div>
      <div className="flex flex-wrap justify-between gap-5 self-stretch">
        <Text as="p" className="text-[15px] font-normal">
          {height}
        </Text>
        <Text as="p" className="mr-[156px] text-[15px] font-medium">
          {p1550mm}
        </Text>
      </div>
      <div className="flex flex-wrap justify-between gap-5 self-stretch">
        <Text as="p" className="text-[15px] font-normal">
          {wheelbase}
        </Text>
        <Text as="p" className="mr-[152px] text-[15px] font-medium">
          {p2580mm}
        </Text>
      </div>
      <div className="flex flex-wrap justify-between gap-5 self-stretch">
        <Text as="p" className="text-[15px] font-normal">
          {heightIncluding}
        </Text>
        <Text as="p" className="mr-[156px] text-[15px] font-medium">
          {p1850mm}
        </Text>
      </div>
      <div className="flex flex-wrap gap-[73px] self-stretch">
        <Text as="p" className="text-[15px] font-normal">
          {luggageCapacity}
        </Text>
        <Text as="p" className="text-[15px] font-medium">
          {p480}
        </Text>
      </div>
      <div className="flex flex-wrap gap-[53px] self-stretch">
        <Text as="p" className="text-[15px] font-normal">
          {luggagecapacity1}
        </Text>
        <Text as="p" className="text-[15px] font-medium">
          {p850}
        </Text>
      </div>
    </div>
  );
}
