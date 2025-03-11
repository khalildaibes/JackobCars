"use client";
import React from "react";
import Image from "next/image";

const BASE_URL = "/images/";

type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> &
  Partial<{
    className: string;
    src: string;
    alt: string;
    external: boolean; // New prop to decide image source
    width: number;
    height: number;
  }>;

const Img: React.FC<React.PropsWithChildren<ImgProps>> = ({
  className,
  src = "defaultNoData.png",
  alt = "Image",
  external = false, // Default is false (local images)
  width,
  height,
  ...restProps
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // Handle image loading error
  const handleError = () => {
    setImgSrc(external ? "https://via.placeholder.com/150" : `${BASE_URL}defaultNoData.png`);
  };

  return (
    <Image
      className={className}
      src={external ? imgSrc : `${BASE_URL}${imgSrc}`}
      alt={alt}
      width={width}
      height={height}
      {...restProps}
      onError={handleError}
    />
  );
};

export { Img };
