import { Text, Heading, Img } from "./..";
import React from "react";

interface Props {
  className?: string;
  userImage?: string;
  userName?: React.ReactNode;
  userTitle?: React.ReactNode;
}

export default function UserProfile3({
  userImage = "img_team1_jpg.png",
  userName = "Courtney Henry",
  userTitle = "Development Manager",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-start justify-center w-[24%] md:w-full`}>
      <Img
        src={userImage}
        width={326}
        height={398}
        alt="Team1 Jpg"
        className="h-[398px] w-full rounded-[16px] object-cover"
      />
      <Heading size="text3xl" as="p" className="mt-3.5 text-[20px] font-medium">
        {userName}
      </Heading>
      <Text size="textmd" as="p" className="text-[14px] font-normal">
        {userTitle}
      </Text>
    </div>
  );
}
