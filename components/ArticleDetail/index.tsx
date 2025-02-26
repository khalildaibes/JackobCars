import { Heading } from "@/components/Heading";
import {Text} from "../../components/Text";
import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
  postImage?: string;
  soundButtonLabel?: string;
  authorName?: React.ReactNode;
  publishDate?: React.ReactNode;
  articleTitle?: React.ReactNode;
  articleDescription?: React.ReactNode;
  readMoreLink?: React.ReactNode;
}

export default function ArticleDetail({
  postImage = "img_detail_post_qgc_550x950.png",
  soundButtonLabel = "Sound",
  authorName = "admin",
  publishDate = "November 22, 2023",
  articleTitle = "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
  articleDescription = "&lt;&gt;Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at malesuada orci congue.&lt;br /&gt;Nullam tempus ...&lt;/&gt;",
  readMoreLink = "Read More",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center self-stretch flex-1`}>
      <div className="mb-1 flex w-full flex-col items-start sm:w-full">
        <div className="relative h-[550px] content-center self-stretch rounded-[16px] sm:h-auto">
          <Img
            src={postImage}
            width={950}
            height={550}
            alt="Detail Post Qgc"
            className="h-[550px] w-full flex-1 object-cover"
          />
          <Button
            size="lg"
            shape="round"
            className="absolute left-5 top-5 m-auto min-w-[70px] rounded-[16px] px-3.5 font-medium"
          >
            {soundButtonLabel}
          </Button>
        </div>
        <div className="mt-[22px] flex items-center self-stretch">
          <Text as="p" className="text-[15px] font-normal capitalize">
            {authorName}
          </Text>
          <div className="ml-2 mt-2 h-[4px] w-[4px] self-start rounded-sm bg-gray-300_01" />
          <Text as="p" className="ml-3.5 text-[15px] font-normal capitalize">
            {publishDate}
          </Text>
        </div>
        <Heading as="p" className="mt-2 text-[30px] font-medium sm:text-[25px]">
          {articleTitle}
        </Heading>
        <Text as="p" className="mt-3.5 text-[15px] font-normal leading-[27px]">
          {articleDescription}
        </Text>
        <div className="mt-[22px] flex items-center gap-[11px] self-stretch">
          <Link href="#">
            <Text as="p" className="text-[15px] font-medium">
              {readMoreLink}
            </Text>
          </Link>
          <Img
            src="img_arrow_left_black_900.svg"
            width={14}
            height={14}
            alt="Arrow Left"
            className="h-[14px] self-end"
          />
        </div>
      </div>
    </div>
  );
}
