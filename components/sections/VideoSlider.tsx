'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight, Calendar, User, Eye } from 'lucide-react';
import { Img } from '../Img';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

interface VideoContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: string;
  publishDate: string;
  author: string;
  category: string;
  views: number;
  featured?: boolean;
}

interface VideoSliderProps {
  videos?: VideoContent[];
  title?: string;
  viewAllLink?: string;
}

// Fetch function for video articles
const fetchVideoContent = async (): Promise<VideoContent[]> => {
  const response = await fetch('/api/articles?sort=createdAt:desc');
  if (!response.ok) throw new Error('Failed to fetch video content');
  
  const data = await response.json();
  if (!data?.data) return [];
  
  // Filter articles that have 'video' in their categories
  const videoArticles = data.data.filter((article: any) => 
    article.categories?.some((category: any) => 
      category.name.toLowerCase().includes('video') || 
      category.name.toLowerCase().includes('watch') ||
      category.name.toLowerCase().includes('review video')
    )
  );
  
  // Transform Strapi articles to VideoContent format
  return videoArticles.map((article: any) => ({
    id: article.id,
    title: article.title || '',
    slug: article.slug || '',
    description: article.excerpt || article.description || '',
    thumbnailUrl: article.cover?.url || '',
    videoUrl: extractVideoUrl(article.description || ''), // Extract video URL from content
    duration: generateRandomDuration(),
    publishDate: article.publishedAt || article.createdAt,
    author: article.author?.data?.attributes?.name || 'Editorial Team',
    category: article.categories?.[0]?.name || 'Video',
    views: Math.floor(Math.random() * 50000) + 5000, // Random views for demo
    featured: Math.random() > 0.7 // Random featured flag
  }));
};

// Helper functions
const extractVideoUrl = (content: string): string => {
  // In a real implementation, you might extract actual video URLs from article content
  // For now, return a placeholder
  return '/videos/sample-video.mp4';
};

const generateRandomDuration = (): string => {
  const minutes = Math.floor(Math.random() * 15) + 2; // 2-17 minutes
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const VideoSlider: React.FC<VideoSliderProps> = ({
  videos,
  title,
  viewAllLink = '/videos'
}) => {
  const t = useTranslations('VideoSlider');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  // Use React Query to fetch video content
  const { data: fetchedVideos, isLoading, error } = useQuery({
    queryKey: ['videoContent'],
    queryFn: fetchVideoContent,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const videosToShow = videos || fetchedVideos || [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, videosToShow.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, videosToShow.length - 2)) % Math.max(1, videosToShow.length - 2));
  };

  const visibleVideos = videosToShow.slice(currentIndex, currentIndex + 3);

  const toggleVideo = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    if (!videoElement) return;

    if (playingVideo === videoId) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Pause other videos
      Object.values(videoRefs.current).forEach(video => {
        if (video && !video.paused) {
          video.pause();
        }
      });
      videoElement.play();
      setPlayingVideo(videoId);
    }
  };

  const toggleMute = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    if (!videoElement) return;

    const newMutedVideos = new Set(mutedVideos);
    if (mutedVideos.has(videoId)) {
      newMutedVideos.delete(videoId);
      videoElement.muted = false;
    } else {
      newMutedVideos.add(videoId);
      videoElement.muted = true;
    }
    setMutedVideos(newMutedVideos);
  };

  const restartVideo = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    if (!videoElement) return;

    videoElement.currentTime = 0;
    if (playingVideo !== videoId) {
      videoElement.play();
      setPlayingVideo(videoId);
    }
  };

  if (isLoading) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error || videosToShow.length === 0) {
    return null; // Don't render if no videos available
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title || t('title')}</h2>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={videosToShow.length <= 3}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={videosToShow.length <= 3}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <Link 
            href={viewAllLink}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('watch_all')}
            <Play className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
              {/* Thumbnail/Video */}
              <Img
                src={video.thumbnailUrl ? `http://64.227.112.249${video.thumbnailUrl}` : '/images/default-video-thumbnail.jpg'}
                alt={video.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                width={1290}
                height={1290}
                external={true}
              />

              {/* Video overlay controls */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => toggleVideo(video.id)}
                    className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    {playingVideo === video.id ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>

                {/* Featured badge */}
                {video.featured && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {t('featured')}
                  </div>
                )}

                {/* Video controls */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleMute(video.id)}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    {mutedVideos.has(video.id) ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => restartVideo(video.id)}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hidden video element for future video functionality */}
              <video
                ref={(el) => {
                  if (el) videoRefs.current[video.id] = el;
                }}
                className="hidden"
                src={video.videoUrl}
                muted={mutedVideos.has(video.id)}
                onEnded={() => setPlayingVideo(null)}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                  {video.category}
                </span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{video.views.toLocaleString()}</span>
                </div>
              </div>

              <Link href={`/news/${video.slug}`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{video.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(video.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Progress Indicators */}
      {videosToShow.length > 3 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.max(1, videosToShow.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-red-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default VideoSlider; 