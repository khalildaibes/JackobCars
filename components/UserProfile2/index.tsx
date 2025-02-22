import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import React from "react";
import { Button } from "../Button";

interface Props {
  className?: string;
  userImage?: string;
  buttonText?: string;
}

export default function UserProfile2({ userImage = "img_h44_jpg.png", buttonText = "Hatchback", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} h-[348px] w-[32%] lg:h-auto md:w-full md:h-auto relative rounded-[16px]`}
    >
      <Img
        src={userImage}
        width={446}
        height={348}
        alt="H44 Jpg"
        className="h-[348px] w-full flex-1 rounded-[16px] object-cover"
      />
      <Button
        size="4xl"
        leftIcon={
          <Img
            src="img_car_black_900.svg"
            width={26}
            height={34}
            alt="Car"
            className="h-[34px] w-[26px] object-contain"
          />
        }
        className="absolute bottom-[29.05px] left-[30px] m-auto min-w-[172px] gap-2.5 rounded-[22px] px-7 font-medium sm:px-5"
      >
        {buttonText}
      </Button>
    </div>
  );
}
