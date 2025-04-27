import React from 'react';
import Image from 'next/image';
import { Img } from './Img';

interface AdBannerProps {
  imageUrl: string;
  link: string;
  alt: string;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ imageUrl, link, alt, className = '' }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${className}`}
    >
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={alt}
          width={2090}
          height={2787}
          className="object-fit"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 250px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </a>
  );
};

export default AdBanner; 