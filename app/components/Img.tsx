import Image from 'next/image';
import { useState } from 'react';

interface ImgProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  external?: boolean;
}

export const Img = ({ src, alt, width, height, className = '', external = false }: ImgProps) => {
  const [error, setError] = useState(false);

  // If there's an error loading the image, use a default image
  const imageSrc = error ? '/default-image.png' : src;

  if (external) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}; 