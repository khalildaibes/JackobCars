"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, ChevronRight, Filter } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "International Auto Show 2024",
    description: "Experience the future of automotive technology with the latest models and innovations.",
    date: "2024-05-15",
    time: "10:00 AM - 6:00 PM",
    location: "Convention Center, New York",
    image: "/events/auto-show.jpg",
    category: "Exhibition",
    attendees: 1500,
    featured: true,
    upcoming: true
  },
  {
    id: 2,
    title: "Electric Vehicle Summit",
    description: "Join industry leaders in discussing the future of electric vehicles and sustainable transportation.",
    date: "2024-06-20",
    time: "9:00 AM - 5:00 PM",
    location: "Tech Hub, San Francisco",
    image: "/events/ev-summit.jpg",
    category: "Conference",
    attendees: 800,
    upcoming: true
  },
  {
    id: 3,
    title: "Classic Car Meetup",
    description: "A gathering of vintage car enthusiasts showcasing their prized possessions.",
    date: "2024-04-10",
    time: "11:00 AM - 4:00 PM",
    location: "Central Park, Chicago",
    image: "/events/classic-cars.jpg",
    category: "Meetup",
    attendees: 300,
    upcoming: false
  }
];

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [showUpcoming, setShowUpcoming] = React.useState(true);

  const filteredEvents = events.filter(event => {
    if (selectedCategory !== "all" && event.category !== selectedCategory) return false;
    if (showUpcoming && !event.upcoming) return false;
    return true;
  });

  return (
    <PageLayout pageKey="events">
      <div className="space-y-8">
        {/* Featured Event */}
        {events.find(event => event.featured) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-2xl overflow-hidden"
          >
            <Image
              src={events.find(event => event.featured)?.image || ''}
              alt={events.find(event => event.featured)?.title || ''}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <span className="text-blue-400 font-medium mb-2">Featured Event</span>
              <h2 className="text-3xl font-bold text-white mb-2">
                {events.find(event => event.featured)?.title}
              </h2>
              <p className="text-gray-200 mb-4">
                {events.find(event => event.featured)?.description}
              </p>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-fit">
                Register Now
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">Filter by:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Show upcoming events only</span>
          </label>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {event.upcoming ? 'Register Now' : 'View Details'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-white/80 mb-6">
            Subscribe to our newsletter to receive updates about upcoming events and exclusive offers.
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white"
            />
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default EventsPage; 