import { Text, Heading, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  userImage?: string;
  userName?: React.ReactNode;
  userRole?: React.ReactNode;
}

export default function UserProfile1({
  userImage = "img_team9_jpg.png",
  userName = "Courtney Henry",
  userRole = "Development Manager",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${props.className} h-[392px] w-[20%] lg:h-auto md:w-full md:h-auto md:px-5 relative rounded-[16px]`}
    >
      <Img
        src={userImage}
        width={256}
        height={392}
        alt="Team9 Jpg"
        className="h-[392px] w-full flex-1 rounded-[16px] object-cover"
      />
      <div className="absolute left-0 right-0 top-[24.08px] mx-auto flex flex-1 flex-col items-center gap-0.5 px-[52px] md:px-5">
        <Heading size="text3xl" as="p" className="text-[20px] font-medium">
          {userName}
        </Heading>
        <Text size="textmd" as="p" className="text-[14px] font-normal">
          {userRole}
        </Text>
      </div>
    </div>
  );
}
