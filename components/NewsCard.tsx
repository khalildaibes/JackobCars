
import React from 'react';
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { cn } from '../app/lib/utils';

interface NewsCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  imageUrl,
  category,
  date,
  author,
  className,
  size = 'medium',
}) => {
  return (
    <Card className={cn(
      'overflow-hidden border-0 card-hover bg-white rounded-xl',
      size === 'small' ? 'h-[300px]' : size === 'large' ? 'h-[500px]' : 'h-[400px]',
      className
    )}>
      <div className="relative h-full flex flex-col">
        <div 
          className={cn(
            "relative overflow-hidden",
            size === 'small' ? 'h-40' : size === 'large' ? 'h-72' : 'h-56'
          )}
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600-600 hover:bg-blue-600-700">{category}</Badge>
          </div>
        </div>
        
        <CardContent className="flex-grow pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">{date}</span>
            <span className="text-sm font-medium text-gray-700">{author}</span>
          </div>
          
          <h3 className={cn(
            "font-display font-bold text-gray-900 leading-tight hover:text-blue-700 transition-colors",
            size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'
          )}>
            <a href="#">{title}</a>
          </h3>
          
          {size !== 'small' && (
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{excerpt}</p>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-5">
          <a 
            href="#" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
          >
            Read More
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </CardFooter>
      </div>
    </Card>
  );
};

export default NewsCard;
