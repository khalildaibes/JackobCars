"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from 'next-intl';

interface Story {
  id: string;
  title: string;
  description: string;
  url: string;
  title_ar?: string;
  title_he?: string;
  description_ar?: string;
  description_he?: string;
}

interface StoriesCarouselProps {
  initialStories: Story[];
}

export default function StoriesCarousel({ initialStories }: StoriesCarouselProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>(initialStories || []);
  const locale = useLocale();

  // Update stories when initialStories changes
  useEffect(() => {
    if (initialStories && initialStories.length > 0) {
      setStories(initialStories);
    }
  }, [initialStories]);

  // Auto-advance stories
  useEffect(() => {
    if (!stories || stories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
    }, 5000); // Change story every 5 seconds

    return () => clearInterval(timer);
  }, [stories]);

  // Get localized content
  const getLocalizedContent = (story: Story) => {
    if (!story) return { title: '', description: '' };
    
    const localizedTitle = story[`title_${locale}`] || story.title || '';
    const localizedDescription = story[`description_${locale}`] || story.description || '';
    return {
      title: localizedTitle,
      description: localizedDescription
    };
  };

  if (!stories || stories.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-[16px]">
        <p className="text-gray-500">No stories available</p>
      </div>
    );
  }

  const currentStory = stories[currentStoryIndex];
  if (!currentStory) return null;

  return (
    <motion.section 
      initial={{ opacity: 1, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.2
      }}
      className="w-full relative mb-6"
    >
      <div className="relative max-w-7xl mx-auto h-[500px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden rounded-[16px]">
        {/* Main Story Container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-white rounded-xl shadow-2xl rounded-full">
          <div className="w-full h-full relative overflow-hidden rounded-xl rounded-full">
            {/* Story Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2 rounded-full">
              {stories.map((_, index) => (
                <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden rounded-full">
                  <div 
                    className={`h-full ${currentStoryIndex === index ? 'w-1/2 bg-white' : ''} rounded-full`}
                  />
                </div>
              ))}
            </div>
            {/* Story Content */}
            <iframe
              src={`https://www.instagram.com/p/${currentStory.url.match(/reel\/(.*?)(?:\?|$)/)?.[1]}embed`}
              allowFullScreen 
              className="w-full h-full" 
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                aspectRatio: '2/1'
              }}
            />
            
            {/* Story Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              {(() => {
                const { title, description } = getLocalizedContent(currentStory);
                return (
                  <>
                    <h3 className="text-white text-lg font-semibold">{title}</h3>
                    <p className="text-white/80 text-sm">{description}</p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Side Story Previews */}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center w-full justify-between px-8 max-w-5xl">
          {/* Previous Stories */}
          <div className="flex -space-x-32">
            {(() => {
              const prevIndex = currentStoryIndex === 0 ? stories.length - 1 : currentStoryIndex - 1;
              const prevStory = stories[prevIndex];
              if (!prevStory) return null;
              
              return (
                <iframe
                  key={prevStory.id}
                  className="w-[250px] h-[350px] bg-gray-800 rounded-lg transform -rotate-6 opacity-50"
                  src={`https://www.instagram.com/p/${prevStory.url.match(/reel\/(.*?)(?:\?|$)/)?.[1]}embed`}
                  allowFullScreen 
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    aspectRatio: '2/1'
                  }}
                />
              );
            })()}
          </div>

          {/* Space for Main Story */}
          <div className="w-[300px]"></div>

          {/* Next Stories */}
          <div className="flex -space-x-32">
            {(() => {
              const nextIndex = currentStoryIndex === stories.length - 1 ? 0 : currentStoryIndex + 1;
              const nextStory = stories[nextIndex];
              if (!nextStory) return null;
              
              return (
                <iframe
                  key={nextStory.id}
                  className="w-[250px] h-[350px] bg-gray-800 rounded-lg transform rotate-6 opacity-50"
                  src={`https://www.instagram.com/p/${nextStory.url.match(/reel\/(.*?)(?:\?|$)/)?.[1]}embed`}
                  allowFullScreen 
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    aspectRatio: '2/1'
                  }}
                />
              );
            })()}
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentStoryIndex > 0 && (
          <button 
            onClick={() => setCurrentStoryIndex(prev => prev - 1)}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors z-30"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {stories && currentStoryIndex < stories.length - 1 && (
          <button
            onClick={() => setCurrentStoryIndex(prev => prev + 1)} 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors z-30"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </motion.section>
  );
} 