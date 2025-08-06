"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import VideoPlayer from '@/components/VideoPlayer';

interface Script {
  id: number;
  title: string;
  content: string;
  avatar: string;
}

const scripts: Script[] = [
  {
    id: 1,
    title: "Welcome Message",
    content: "Hello! I'm Sarah, your virtual automotive assistant. I'm here to help you find the perfect car, answer your questions about our services, and guide you through our extensive collection of vehicles and auto parts.",
    avatar: "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg"
  },
  {
    id: 2,
    title: "Car Buying Guide",
    content: "Today, I'll walk you through our step-by-step car buying process. Whether you're looking for a new or used vehicle, I'll explain everything from financing options to warranty coverage.",
    avatar: "https://create-images-results.d-id.com/DefaultPresenters/Anna_f/image.jpeg"
  },
  {
    id: 3,
    title: "Service Overview",
    content: "Let me tell you about our comprehensive service department. We offer everything from routine maintenance to major repairs, all performed by certified technicians using state-of-the-art equipment.",
    avatar: "https://create-images-results.d-id.com/DefaultPresenters/Liam_m/image.jpeg"
  }
];

export default function VirtualAssistantPage() {
  const [selectedScript, setSelectedScript] = useState<Script>(scripts[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('VirtualAssistant');

  const generateVideo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: selectedScript.content,
          avatar: selectedScript.avatar,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate video');

      const data = await response.json();
      setVideoUrl(data.url);
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error('Error generating video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScriptSelect = (script: Script) => {
    setSelectedScript(script);
    setVideoUrl('');
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!videoUrl && !isPlaying) {
      generateVideo();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoUrl) {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play();
        setIsPlaying(true);
      }
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Script Selection */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-4">{t('select_script')}</h2>
                <div className="space-y-4">
                  {scripts.map((script) => (
                    <motion.button
                      key={script.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleScriptSelect(script)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedScript.id === script.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{script.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {script.content}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Video Player */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                {isLoading ? (
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center text-white">
                    <p>{error}</p>
                  </div>
                ) : videoUrl ? (
                  <VideoPlayer
                    src={videoUrl}
                    title={selectedScript.title}
                    className="aspect-video mb-4"
                    autoPlay={isPlaying}
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center text-white">
                    <p>{t('click_play')}</p>
                  </div>
                )}

                {/* Generate Video Button */}
                {!videoUrl && !isLoading && (
                  <div className="flex justify-center mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateVideo}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Video'}
                    </motion.button>
                  </div>
                )}

                {/* Script Content */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">{selectedScript.title}</h2>
                  <p className="text-gray-600">{selectedScript.content}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
} 