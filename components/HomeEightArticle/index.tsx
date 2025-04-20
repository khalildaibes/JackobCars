"use client";

import { Text } from "../../components/Text";
import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img/index";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface ArticleProps {
  className?: string;
  image: string;
  category: string;
  author: string;
  date: string;
  title: string;
  description?: string;
  slug: string;
}

export default function HomeEightArticle({
  className,
  image,
  category,
  author,
  date,
  slug, 
  title,
  description,
  ...props
}: ArticleProps) {
    // Sync with localStorage on mount
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    }, []);
  
    const add_to_favorites = (id: number) => {
      let updatedFavorites;
      if (favorites.includes(id)) {
        updatedFavorites = favorites.filter((favId) => favId !== id);
      } else {
        updatedFavorites = [...favorites, id];
      }
  
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };
  
  return (
    <div {...props} className={`${className} flex items-center md:w-full`}>
      <div className="flex w-full flex-col items-center justify-center">
        <Link href={`/news/${slug}`}>
        <div className="relative h-[298px] content-center self-stretch rounded-[16px]">

            <Img
              src={`http://64.227.112.249${image}`}
              width={446}
            height={298}
            external={true}
            alt={title}
            className="h-[298px] w-full flex-1 rounded-[16px] object-cover items-center justify-center"
          />
          <Button
            size="lg"
            shape="round"
            className="absolute left-5 top-5 m-auto min-w-[70px] rounded-[16px] px-3.5 font-medium bg-white/90 backdrop-blur-sm"
          >
            {category}
          </Button>
        </div>
        <div className="mt-5 flex items-center self-stretch">
          <Text as="p" className="text-[15px] font-normal capitalize">
            {author}
          </Text>
          <div className="ml-2 mt-2 h-[4px] w-[4px] self-start rounded-sm bg-gray-300" />
          <Text as="p" className="ml-3.5 text-[15px] font-normal capitalize">
            {date}
          </Text>
        </div>
        <div className="mt-1.5 w-full">
          <Heading size="text3xl" as="h3" className="text-[20px] font-medium leading-[30px] line-clamp-2">
            {title}
          </Heading>
          {description && (
            <Text as="p" className="mt-2 text-[16px] font-normal text-gray-600 line-clamp-2">
              {description}
            </Text>
          )}
        </div>
        </Link>
      </div>
      </div>
   
  );
}
