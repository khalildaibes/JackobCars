"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, Download } from 'lucide-react';

const podcastEpisodes = [
  {
    id: 1,
    title: "The Future of Electric Vehicles",
    description: "We discuss the latest trends in electric vehicles and what to expect in the coming years.",
    duration: "45:30",
    date: "2024-03-15",
    image: "/podcast/ev-future.jpg",
    audioUrl: "/podcast/episode-1.mp3"
  },
  {
    id: 2,
    title: "Autonomous Driving Technology",
    description: "Expert insights into self-driving technology and its impact on the automotive industry.",
    duration: "38:15",
    date: "2024-03-08",
    image: "/podcast/autonomous.jpg",
    audioUrl: "/podcast/episode-2.mp3"
  },
  {
    id: 3,
    title: "Classic Car Restoration Tips",
    description: "Professional restorers share their secrets for bringing vintage cars back to life.",
    duration: "52:20",
    date: "2024-03-01",
    image: "/podcast/classic-cars.jpg",
    audioUrl: "/podcast/episode-3.mp3"
  }
];

const PodcastPage = () => {
  const [currentEpisode, setCurrentEpisode] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = (episodeId: number) => {
    if (currentEpisode === episodeId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentEpisode(episodeId);
      setIsPlaying(true);
    }
  };

  return (
    <PageLayout pageKey="podcast">
      <div className="space-y-8">
        {/* Featured Episode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Latest Episode</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{podcastEpisodes[0].title}</h3>
              <p className="text-white/80 mb-4">{podcastEpisodes[0].description}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => togglePlay(podcastEpisodes[0].id)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full px-6 py-2"
                >
                  {isPlaying && currentEpisode === podcastEpisodes[0].id ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying && currentEpisode === podcastEpisodes[0].id ? 'Pause' : 'Play'}
                </button>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {podcastEpisodes[0].duration}
                </span>
              </div>
            </div>
            <div className="w-full md:w-48 h-48 bg-white/10 rounded-lg"></div>
          </div>
        </motion.div>

        {/* Episode List */}
        <div className="space-y-4">
          {podcastEpisodes.slice(1).map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-6">
                <button
                  onClick={() => togglePlay(episode.id)}
                  className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  {isPlaying && currentEpisode === episode.id ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{episode.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{episode.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(episode.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {episode.duration}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Download size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Podcast</h3>
          <p className="text-gray-600 mb-6">Listen on your favorite platform</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Apple Podcasts
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Spotify
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Google Podcasts
            </button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default PodcastPage; 