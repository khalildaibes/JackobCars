import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import DetailsVOneList from "../../components/DetailsVOneList";
import React from "react";

export default function DetailsSection1() {
  return (
    <>
      {/* details section */}
      <div className="mt-12 flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col items-start gap-12 lg:px-5 md:px-5">
          <div className="flex flex-col items-start gap-6 self-stretch">
            <Heading size="text8xl" as="p" className="text-[26px] font-medium lg:text-[22px]">
              Dimensions & Capacity
            </Heading>
            <div className="mr-[468px] flex gap-5 self-stretch md:mr-0 md:flex-col">
              <DetailsVOneList
                length="Length"
                p4950mm="4950mm"
                height="Height"
                p1550mm="1550mm"
                wheelbase="Wheelbase"
                p2580mm="2580mm"
                heightIncluding="Height (including roof rails)"
                p1850mm="1850mm"
                luggageCapacity="Luggage Capacity (Seats Up - Litres)"
                p480="480"
                luggagecapacity1="Luggage Capacity (Seats Down - Litres)"
                p850="850"
                className="w-[60%]"
              />
              <DetailsVOneList
                length="Width"
                p4950mm="2100mm"
                height="Width (including mirrors)"
                p1550mm="2140mm"
                wheelbase="Gross Vehicle Weight (kg)"
                p2580mm="1550"
                heightIncluding="Max. Loading Weight (kg)"
                p1850mm="1200"
                luggageCapacity="Max. Roof Load (kg)"
                p480="400"
                luggagecapacity1="No. of Seats"
                p850="5"
                className="w-[40%]"
              />
            </div>
          </div>
          <div className="h-px w-[66%] bg-gray-300_01" />
          <div className="flex flex-col items-start gap-6 self-stretch">
            <Heading size="text8xl" as="p" className="text-[26px] font-medium lg:text-[22px]">
              Engine and Transmission
            </Heading>
            <div className="flex items-start gap-2.5 self-stretch md:flex-col">
              <div className="flex w-[38%] flex-col gap-[22px] self-center md:w-full">
                <div className="flex flex-wrap gap-[143px] lg:gap-5 md:gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Fuel Tank Capacity (Litres)
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    80
                  </Text>
                </div>
                <div className="flex flex-wrap gap-[99px] lg:gap-5 md:gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Max. Towing Weight - Braked (kg)
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    1000
                  </Text>
                </div>
                <div className="flex flex-wrap gap-[79px] lg:gap-5 md:gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Max. Towing Weight - Unbraked (kg)
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    1100
                  </Text>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-[22px] px-2.5 md:self-stretch">
                <div className="flex flex-wrap gap-[42px]">
                  <Text as="p" className="text-[15px] font-normal">
                    Minimum Kerbweight (kg)
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    350
                  </Text>
                </div>
                <div className="flex items-center gap-[22px]">
                  <Text as="p" className="w-[24%] text-[15px] font-normal leading-[27px]">
                    <>
                      Turning Circle - Kerb to Kerb
                      <br />
                      (m)
                    </>
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    6500
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="h-px w-[66%] bg-gray-300_01" />
        </div>
      </div>
    </>
  );
}
