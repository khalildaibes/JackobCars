"use client";
import { Heading } from "../Heading";
import React, { useCallback } from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";
// Use Next.js 13's navigation hook
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  detailPostQgc?: string;
  link?: string;
  admin?: React.ReactNode;
  november222023?: React.ReactNode;
  p2024bmwalpina?: React.ReactNode;
}

export default function BlogVOneArticle({
  detailPostQgc = "img_detail_post_qgc_266x414.png",
  link = "Sound",
  admin = "admin",
  november222023 = "November 22, 2023",
  p2024bmwalpina = "2024 BMW ALPINA XB7 with exclusive details, extraordinary;",
  ...props
}: Props) {
  const router = useRouter();

  const handleFilterChange = useCallback((title: number) => {
    router.push(`/blogdetails?title=${title.toString()}`);
  }, [router]);

  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-full gap-[18px]`}
      onClick={() => handleFilterChange(1)}
    >
      <div className="relative h-[266px] content-center self-stretch rounded-[16px]">
        <Img
          src={detailPostQgc}
          width={414}
          height={266}
          alt="Detail Post Qgc"
          className="h-[266px] w-full flex-1 rounded-[16px] object-cover"
        />
        <Button
          size="lg"
          shape="round"
          className="absolute left-5 top-5 m-auto min-w-[70px] rounded-[16px] px-3.5 font-medium"
        >
          {link}
        </Button>
      </div>
      <div className="flex flex-col gap-1 self-stretch">
        <div className="flex items-center gap-3.5">
          <div className="flex w-[14%] items-center gap-2">
            <Text as="p" className="text-[15px] font-normal capitalize">
              {admin}
            </Text>
            <div className="h-[4px] w-[4px] rounded-sm bg-gray-300_01" />
          </div>
          <Text as="p" className="self-end text-[15px] font-normal capitalize">
            {november222023}
          </Text>
        </div>
        <Heading
          size="text6xl"
          as="p"
          className="text-[20px] font-medium leading-[30px]"
        >
          {p2024bmwalpina}
        </Heading>
      </div>
    </div>
  );
}
