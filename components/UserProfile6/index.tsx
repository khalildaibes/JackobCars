import { Heading } from "../Heading";
import { Text } from "../Text";
import { Img } from "../Img";
import React from "react";
import { RatingBar } from "../RatingBar";

interface Props {
  className?: string;
  userName?: React.ReactNode;
  userJoinDate?: React.ReactNode;
  userRatingValue?: React.ReactNode;
  userDescription?: React.ReactNode;
}

export default function UserProfile6({
  userName = "demo",
  userJoinDate = "November 30, 2023",
  userRatingValue = "4.7",
  userDescription = "&lt;&gt;Etiam sit amet ex pharetra, venenatis ante vehicula, gravida sapien. Fusce eleifend vulputate nibh, non cursus augue placerat&lt;br /&gt;pellentesque. Sed venenatis risus nec felis mollis.&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center self-stretch flex-1`}>
      <div className="flex w-full flex-col gap-3.5 sm:w-full sm:gap-3.5">
        <div className="flex flex-wrap items-center">
          <Img
            src="img_team2_150x150_jpg.png"
            width={40}
            height={40}
            alt="Team2 150x150 Jpg"
            className="h-[40px] rounded-[20px] object-cover"
          />
          <Heading size="text5xl" as="p" className="ml-3 text-[18px] font-medium capitalize sm:text-[15px]">
            {userName}
          </Heading>
          <Text  as="p" className="ml-3.5 text-[14px] font-normal">
            {userJoinDate}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <RatingBar
            value={1}
            isEditable={true}
            color="#e1e1e1"
            activeColor="#e1e1e1"
            size={18}
            starCount={2}
            className="flex gap-2.5 self-end"
          />
          <Text as="p" className="text-[15px] font-normal">
            {userRatingValue}
          </Text>
        </div>
        <Text as="p" className="text-[15px] font-normal leading-[27px]">
          {userDescription}
        </Text>
      </div>
    </div>
  );
}
