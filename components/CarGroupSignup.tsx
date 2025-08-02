"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Car, Users, Phone, User, Hash } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";

interface CarGroupSignupFormData {
  plateNumber: string;
  phoneNumber: string;
  ownerName: string;
  carNickname?: string;
}

export default function CarGroupSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("HomePage");
  const locale = useLocale(); // Get current locale for dynamic translations
  const isRTL = locale === 'ar' || locale === 'he-IL'; // Check if RTL language

  const form = useForm<CarGroupSignupFormData>({
    defaultValues: {
      plateNumber: "",
      phoneNumber: "",
      ownerName: "",
      carNickname: "",
    },
  });

  const onSubmit = async (data: CarGroupSignupFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/car-group-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          locale: locale // Include current locale for better data management
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      toast({
        title: t('car_group_signup_success_title'),
        description: result.message || t('car_group_signup_success'),
        duration: 5000,
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: t('car_group_signup_error_title'),
        description: error.message || t('car_group_signup_error'),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full py-12 bg-gradient-to-br from-blue-50 to-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className={`bg-blue-600 p-3 rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('car_group_title')}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('car_group_description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                {t('car_group_signup_title')}
              </CardTitle>
              <CardDescription>
                {t('car_group_signup_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="plateNumber"
                      rules={{
                        required: t('car_group_signup_plate_required'),
                        minLength: {
                          value: 3,
                          message: t('car_group_signup_plate_min_length'),
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            {t('car_group_signup_plate_label')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('car_group_signup_plate_placeholder')}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              className="text-center font-mono"
                            />
                          </FormControl>
                          <FormDescription>
                            {t('car_group_signup_plate_description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      rules={{
                        required: t('car_group_signup_phone_required'),
                        pattern: {
                          value: /^05[02348]\d{7}$/,
                          message: t('car_group_signup_phone_invalid'),
                        },
                      }}
                                              render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {t('car_group_signup_phone_label')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('car_group_signup_phone_placeholder')}
                                type="tel"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('car_group_signup_phone_description')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      rules={{
                        required: t('car_group_signup_owner_required'),
                        minLength: {
                          value: 2,
                          message: t('car_group_signup_owner_min_length'),
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t('car_group_signup_owner_label')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('car_group_signup_owner_placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t('car_group_signup_owner_description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="carNickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            {t('car_group_signup_nickname_label')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('car_group_signup_nickname_placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t('car_group_signup_nickname_description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4"
                  >
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('car_group_signup_button_loading')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {t('car_group_signup_button')}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('car_group_benefits_community')}</h3>
            <p className="text-gray-600 text-sm">
              {t('car_group_benefits_community_desc')}
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('car_group_benefits_events')}</h3>
            <p className="text-gray-600 text-sm">
              {t('car_group_benefits_events_desc')}
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('car_group_benefits_support')}</h3>
            <p className="text-gray-600 text-sm">
              {t('car_group_benefits_support_desc')}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
} 