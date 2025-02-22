import { Heading, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  userImage?: string;
  userHeading?: React.ReactNode;
}

export default function UserProfile4({ userImage = "img_clip_path_group.svg", userHeading = "suv", ...props }: Props) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center w-[10%] md:w-full gap-2.5 p-[22px] sm:p-4 border-gray-200 border border-solid bg-white-a700 rounded-[16px]`}
    >
      <Img src={userImage} width={34} height={34} alt="Clip Path Group" className="h-[34px]" />
      <Heading size="text2xl" as="p" className="text-[18px] font-medium">
        {userHeading}
      </Heading>
    </div>
  );
}
