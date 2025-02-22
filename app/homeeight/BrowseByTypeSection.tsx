
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { Img } from "../../components/Img/index";
import Link from "next/link";
import React from "react";

// const vehicleCategories = [
//   { userImage: "img_clip_path_group.svg", userHeading: "suv" },
//   { userImage: "img_car.svg", userHeading: "Sedan" },
//   { userImage: "img_car_black_900.svg", userHeading: "Hatchback" },
//   { userImage: "img_car_black_900_01.svg", userHeading: "Coupe" },
//   { userImage: "img_car_black_900_34x34.svg", userHeading: "Hybrid" },
//   { userImage: "img_svg_white_a700.svg", userHeading: "Convertible" },
//   { userImage: "img_mask_group.svg", userHeading: "Van" },
//   { userImage: "img_car_black_900_01_34x34.svg", userHeading: "Truck" },
//   { userImage: "img_clip_path_group.svg", userHeading: "Electric" },
// ];

export default function BrowseByTypeSection() {
  return (
    <>
      {/* browse by type section */}
      <div className="mt-[30px] flex flex-col items-center gap-3.5 self-stretch">
        <div className="flex justify-center self-stretch bg-white-a700 py-2.5">
          <div className="container-xs mt-[68px] flex items-center justify-center lg:px-5 md:px-5 sm:flex-col">
            <Heading as="h3" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Browse by Type
            </Heading>
            <div className="mb-4 flex flex-1 items-center justify-end gap-[11px] self-end sm:self-stretch">
              <Link href="#">
                <Text as="p" className="text-[15px] font-medium">
                  View All
                </Text>
              </Link>
              <Img src="img_arrow_left.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
            </div>
          </div>
        </div>
       
      </div>
    </>
  );
}
