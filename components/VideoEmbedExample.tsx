"use client";

import React from 'react';

// Example video data for testing
const exampleVideos = {
  tiktok: "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
  instagram: "https://www.instagram.com/p/ABC123xyz/",
  youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  multiple: [
    "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
    "https://www.instagram.com/p/ABC123xyz/",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ],
  withMetadata: [
    {
      url: "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
      platform: "tiktok",
      title: "Car Review on TikTok",
      description: "Quick 30-second review",
      thumbnail: "https://example.com/thumbnail.jpg",
      duration: "0:30"
    },
    {
      url: "https://www.instagram.com/p/ABC123xyz/",
      platform: "instagram",
      title: "Car Photos on Instagram",
      description: "Beautiful car photos",
      thumbnail: "https://example.com/instagram-thumb.jpg"
    }
  ]
};

// Helper functions to extract video IDs
const extractTikTokVideoId = (url: string): string | null => {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
};

const extractYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Render video embeds for TikTok, Instagram, YouTube, etc.
const renderVideoEmbed = (videoData: any) => {
  // Handle different video formats
  if (typeof videoData === 'string') {
    const videoUrl = videoData;
    
    // TikTok embed
    if (videoUrl.includes('tiktok.com')) {
      const videoId = extractTikTokVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="w-full max-w-md">
            <blockquote 
              className="tiktok-embed" 
              cite={videoUrl}
              data-video-id={videoId}
              style={{ maxWidth: '325px', minWidth: '325px' }}
            >
              <section></section>
            </blockquote>
          </div>
        );
      }
    }
    
    // Instagram embed
    if (videoUrl.includes('instagram.com')) {
      return (
        <div className="w-full max-w-md">
          <iframe
            src={`${videoUrl}/embed`}
            width="400"
            height="480"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="rounded-lg"
          ></iframe>
        </div>
      );
    }
    
    // YouTube embed
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="w-full max-w-2xl">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        );
      }
    }
    
    // Generic iframe for other video platforms
    return (
      <div className="w-full max-w-2xl">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <iframe
            src={videoUrl}
            title="Video content"
            frameBorder="0"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </div>
    );
  }
  
  // Handle video object with metadata
  if (typeof videoData === 'object' && videoData.url) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {videoData.thumbnail && (
            <div className="relative aspect-video">
              <img
                src={videoData.thumbnail}
                alt={videoData.title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{videoData.title || 'Video'}</h3>
            {videoData.description && (
              <p className="text-gray-600 text-sm">{videoData.description}</p>
            )}
            <div className="mt-3">
              {renderVideoEmbed(videoData.url)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback for unknown video format
  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">Video content: {JSON.stringify(videoData)}</p>
      </div>
    </div>
  );
};

export default function VideoEmbedExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Video Embed Examples</h1>
      
      {/* TikTok Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">TikTok Video</h2>
        <div className="flex justify-center">
          {renderVideoEmbed(exampleVideos.tiktok)}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Article Object Structure:</h3>
          <pre className="text-sm overflow-x-auto">
{`{
  "id": 1,
  "title": "Car Review Article",
  "videos": "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789"
}`}
          </pre>
        </div>
      </section>

      {/* Instagram Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Instagram Video</h2>
        <div className="flex justify-center">
          {renderVideoEmbed(exampleVideos.instagram)}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Article Object Structure:</h3>
          <pre className="text-sm overflow-x-auto">
{`{
  "id": 1,
  "title": "Car Review Article",
  "videos": "https://www.instagram.com/p/ABC123xyz/"
}`}
          </pre>
        </div>
      </section>

      {/* YouTube Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">YouTube Video</h2>
        <div className="flex justify-center">
          {renderVideoEmbed(exampleVideos.youtube)}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Article Object Structure:</h3>
          <pre className="text-sm overflow-x-auto">
{`{
  "id": 1,
  "title": "Car Review Article",
  "videos": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}`}
          </pre>
        </div>
      </section>

      {/* Multiple Videos Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Multiple Videos</h2>
        <div className="space-y-6">
          {exampleVideos.multiple.map((video, index) => (
            <div key={index} className="flex justify-center">
              {renderVideoEmbed(video)}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Article Object Structure:</h3>
          <pre className="text-sm overflow-x-auto">
{`{
  "id": 1,
  "title": "Car Review Article",
  "videos": [
    "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
    "https://www.instagram.com/p/ABC123xyz/",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ]
}`}
          </pre>
        </div>
      </section>

      {/* Video Objects with Metadata Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Videos with Metadata</h2>
        <div className="space-y-6">
          {exampleVideos.withMetadata.map((video, index) => (
            <div key={index} className="flex justify-center">
              {renderVideoEmbed(video)}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Article Object Structure:</h3>
          <pre className="text-sm overflow-x-auto">
{`{
  "id": 1,
  "title": "Car Review Article",
  "videos": [
    {
      "url": "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
      "platform": "tiktok",
      "title": "Car Review on TikTok",
      "description": "Quick 30-second review",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "duration": "0:30"
    },
    {
      "url": "https://www.instagram.com/p/ABC123xyz/",
      "platform": "instagram",
      "title": "Car Photos on Instagram",
      "description": "Beautiful car photos",
      "thumbnail": "https://example.com/instagram-thumb.jpg"
    }
  ]
}`}
          </pre>
        </div>
      </section>
    </div>
  );
} 