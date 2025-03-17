
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface HeroSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  imageUrl,
  category,
  date,
}) => {
  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
      
      <div className="relative h-full container mx-auto px-6 md:px-0 flex flex-col justify-end pb-20">
        <div className="max-w-4xl animate-slideUp">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className="bg-blue-600-600 hover:bg-blue-600-700">{category}</Badge>
            <span className="text-white/80 text-sm font-medium">{date}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          
          <p className="text-lg text-white/90 mb-8 max-w-3xl">
            {description}
          </p>
          
          <Button className="group bg-white text-blue-800 hover:bg-blue-600-50">
            Read Article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
