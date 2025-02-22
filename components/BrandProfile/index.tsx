import React from "react";
import { Img } from "../../components/Img";
import { Heading } from "../../components/Heading";


interface Props {
  className?: string;
  brandImage?: string;
  brandName?: React.ReactNode;
}

export default function BrandProfile({ brandImage = "img_brand1_jpg.png", brandName = "Audi", ...props }: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center md:w-full gap-1.5`}>
      <Img src={brandImage} width={70} height={70} alt="Brand1 Jpg" className="h-[70px] w-full object-cover" />
      <Heading size="text2xl" as="p" className="text-[18px] font-medium">
        {brandName}
      </Heading>
    </div>
  );
}
