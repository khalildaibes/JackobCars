"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, ChevronRight, Star, Car, Music, Coffee, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../hooks/use-toast';
import { useTranslations } from 'next-intl';

const LuxuryCarMeetupPage = () => {
  const t = useTranslations('Pages.events.luxury_car_meetup');
  const [formData, setFormData] = useState({
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/events/register?event_name=Luxury Car Meetup Akko&name=${formData.name}`);

      const result = await response.json();

      if (response.ok) {
        toast({
          title: t('registration_success'),
          description: t('registration_success_desc'),
        });
        setFormData({
          name: ''
        });
      } else {
        toast({
          title: t('registration_error'),
          description: result.error || t('registration_error_desc'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('network_error'),
        description: t('network_error_desc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventDetails = {
    title: t('title'),
    date: "18 أغسطس 2025",
    time: "6:30 مساءً (18:30)",
    location: "Baltimore 32, Acco Darom, عكا",
    organizer: "ASD Auto Spa Detailing",
    description: "دعوة لعشاق السيارات! 📣✨ في 18/8/2025، الساعة 6:30 مساءً (18:30)، سيكون لدينا تجمع سيارات خرافي في عكا، في موقع \"Baltimore 32, Acco Darom\" بتنظيم ASD Auto Spa Detailing. استعدوا لرؤية سيارات مميزة مثل أفينتادور، هوراكان، R8، طرازات M-Power و AMG، وكذلك فيراري F8 وحتى دودج هيلكات وغيرها وغيرها! نرجو من الجميع الحفاظ على الهدوء وتجنب المشاكل مع الشرطة. سيكون هناك دي جي، مشروبات خفيفة، وأجواء رائعة للجميع. نراكم هناك!",
    features: [
      { icon: Car, title: t('luxury_cars'), description: t('luxury_cars_desc') },
      { icon: Music, title: t('dj'), description: t('dj_desc') },
      { icon: Coffee, title: t('refreshments'), description: t('refreshments_desc') },
      { icon: Shield, title: t('safety'), description: t('safety_desc') }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" dir="rtl">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
        <Image
          src="/images/img_car11_qgcqjcn7t.png"
          alt="Luxury Cars Meetup"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-4 bg-blue-600/20 text-blue-200 border-blue-400/30">
                {t('exclusive_event')}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {eventDetails.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                {t('description')}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="text-blue-400" size={24} />
                  <span>{eventDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-400" size={24} />
                  <span>{eventDetails.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-blue-400" size={24} />
                  <span>{eventDetails.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Event Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                    {t('event_details')}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    {eventDetails.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {t('what_awaits')}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {eventDetails.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <feature.icon className="text-blue-600" size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">{t('organizer')}</h3>
                    <p className="text-xl text-blue-100 mb-4">{eventDetails.organizer}</p>
                    <p className="text-blue-200">
                      {t('organizer_desc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Registration Form Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="sticky top-8"
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {t('register_now')}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('register_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        {t('full_name')}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('full_name_placeholder')}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>


                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{t('registering')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center">
                          <Star size={20} />
                          <span>{t('register_button')}</span>
                        </div>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      {t('terms_notice')}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-gray-900 to-blue-900 text-white overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-6">
                  {t('dont_miss')}
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                  {t('dont_miss_desc')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-400" size={24} />
                    <span>{t('limited_spots')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400" size={24} />
                    <span>{t('exclusive_event_badge')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-green-400" size={24} />
                    <span>18 أغسطس 2025</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LuxuryCarMeetupPage;
