import React from "react";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props {
  className?: string;
  articleImage?: string;
  headlineText?: React.ReactNode;
  subheadlineText?: React.ReactNode;
  authorText?: React.ReactNode;
  dateText?: React.ReactNode;
}

export default function NewsArticle({
  articleImage = "img_rectangle_24.png",
  headlineText = "U.S. downs suspected Chinese spy balloon over the Atlantic coast",
  subheadlineText = "China called the vessel’s downing “an excessive reaction” and said it “retains the right to respond further.”",
  authorText = "By Caleb Hudnall",
  dateText = "Feb. 5, 2023",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col self-stretch gap-[1.38rem] flex-1`}>
      <div className="mt-[1.50rem] flex items-center gap-[1.50rem] self-stretch">
        <Img src={articleImage} width={140} height={120} alt="Image" className="h-[7.50rem] w-[42%] object-contain" />
        <div className="flex flex-1 flex-col gap-[1.38rem]">
          <div className="flex flex-col gap-[0.63rem]">
            <Text
              size="textmd"
              as="p"
              className="!font-georgia text-[0.94rem] font-normal leading-[100%] !text-gray-900"
            >
              {headlineText}
            </Text>
            <Text
              size="texts"
              as="p"
              className="!font-georgia text-[0.63rem] font-normal leading-[100%] !text-teal-900"
            >
              {subheadlineText}
            </Text>
          </div>
          <div className="flex flex-wrap justify-between gap-[1.25rem]">
            <Text size="textxs" as="p" className="!font-helvetica text-[0.56rem] font-normal !text-gray-700">
              {authorText}
            </Text>
            <Text size="textxs" as="p" className="!font-helvetica text-[0.56rem] font-normal !text-gray-700">
              {dateText}
            </Text>
          </div>
        </div>
      </div>
      <div className="h-[0.13rem] w-full self-stretch bg-gray-200" />
    </div>
  );
}
