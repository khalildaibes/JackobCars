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
    priority?: boolean; // For above-the-fold images
    quality?: number; // Custom quality setting
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
  }>;

const Img: React.FC<React.PropsWithChildren<ImgProps>> = ({
  className,
  src = "defaultNoData.png",
  alt = "Image",
  external = false, // Default is false (local images)
  width,
  height,
  priority = false,
  quality = 100, // Maximum quality by default
  placeholder = "empty",
  blurDataURL,
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
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...restProps}
      onError={handleError}
    />
  );
};

export { Img };
export default Img;
