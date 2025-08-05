"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, Car, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/use-toast";
import BookingCalendar from "../../components/BookingCalendar";
import StoreHeader from "../../components/StoreHeader";

interface WorkingHours {
  [key: string]: {
    open?: string;
    close?: string;
    closed?: boolean;
  };
}

interface SocialMedia {
  facebook?: string;
  whatsapp?: string;
  instagram?: string;
}

interface Store {
  id: number;
  documentId: string;
  name: string;
  phone: string;
  address: string;
  details: string;
  hostname: string;
  visits: number;
  tags: string;
  provider: string;
  slug: string;
  socialMedia: SocialMedia;
  apiToken: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  clicks: number;
  shares: number;
  additional: {
    working_hours: WorkingHours;
    maxSimultaneousAppointments?: number;
    appointmentDuration?: number;
    storechatassistant?: {
      url: string;
    };
  };
}

interface Service {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  duration?: number;
  category?: string;
  categories?: Array<{ id: number; name: string; slug?: string; }>;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carMake: string;
  carModel: string;
  carYear: string;
  plateNumber: string;
  serviceType: string;
  notes: string;
  selectedDate: Date | null;
  selectedTime: string;
}

export default function BookAppointmentPage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId") || "default";
  const t = useTranslations("BookingPage");
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  const { toast } = useToast();

  const [store, setStore] = useState<Store | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    carMake: "",
    carModel: "",
    carYear: "",
    plateNumber: "",
    serviceType: "",
    notes: "",
    selectedDate: null,
    selectedTime: "",
  });

  // Load store information
  useEffect(() => {
    const loadStoreInfo = async () => {
      try {
        let storeId = searchParams.get("storeId") || "default";
        if(storeId === 'default') {
          storeId = 'ASD Auto Spa Detailing';
        }
        const response = await fetch(`/api/stores?name=${storeId}`);
        if (response.ok) {
          const storeData = await response.json();
          setStore(storeData);
        } else {
          throw new Error("Store not found");
        }
      } catch (error) {
        console.error("Error loading store:", error);
        toast({
          title: t('error_title'),
          description: t('store_not_found'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreInfo();
  }, [storeId, t, toast]);

  // Load services for the store
  useEffect(() => {
    const loadServices = async () => {
      if (!store) return;
      
      setIsServicesLoading(true);
      try {
        // Get store hostname for API calls
        let storeHostname = store.hostname;
        if (storeHostname === 'default') {
          storeHostname = 'ASD Auto Spa Detailing';
        }
        
        const response = await fetch(`/api/services?hostname=${storeHostname}`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.data || []);
        } else {
          console.error("Failed to load services");
        }
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setIsServicesLoading(false);
      }
    };

    loadServices();
  }, [store]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: time
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'customerName', 'customerPhone', 'customerEmail',
      'carMake', 'carModel', 'plateNumber', 'serviceType'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof BookingFormData]) {
        toast({
          title: t('validation_error_title'),
          description: t('missing_required_fields'),
          variant: "destructive",
        });
        return false;
      }
    }

    if (!formData.selectedDate || !formData.selectedTime) {
      toast({
        title: t('validation_error_title'),
        description: t('missing_datetime'),
        variant: "destructive",
      });
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^05[02348]\d{7}$/;
    if (!phoneRegex.test(formData.customerPhone.replace(/\s/g, ''))) {
      toast({
        title: t('validation_error_title'),
        description: t('invalid_phone'),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          storeId,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to book appointment");
      }

      toast({
        title: t('success_title'),
        description: t('booking_success'),
        duration: 5000,
      });

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        carMake: "",
        carModel: "",
        carYear: "",
        plateNumber: "",
        serviceType: "",
        notes: "",
        selectedDate: null,
        selectedTime: "",
      });

    } catch (error: any) {
      toast({
        title: t('error_title'),
        description: error.message || t('booking_error'),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center mt-20 mb-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center mt-20 mb-20">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('store_not_found')}</h2>
            <p className="text-gray-600">{t('store_not_found_desc')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 mt-20 mb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Store Header */}
        <StoreHeader store={store} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Calendar Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t('select_datetime')}
              </CardTitle>
              <CardDescription>
                {t('select_datetime_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingCalendar
                storeId={storeId}
                store={store}
                onDateTimeSelect={handleDateTimeSelect}
                selectedDate={formData.selectedDate}
                selectedTime={formData.selectedTime}
              />
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {t('booking_details')}
              </CardTitle>
              <CardDescription>
                {t('booking_details_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('customer_info')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">{t('customer_name')} *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder={t('customer_name_placeholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone">{t('customer_phone')} *</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        placeholder="0501234567"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">{t('customer_email')} *</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('vehicle_info')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="carMake">{t('car_make')} *</Label>
                      <Input
                        id="carMake"
                        name="carMake"
                        value={formData.carMake}
                        onChange={handleInputChange}
                        placeholder={t('car_make_placeholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="carModel">{t('car_model')} *</Label>
                      <Input
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleInputChange}
                        placeholder={t('car_model_placeholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="carYear">{t('car_year')}</Label>
                      <Input
                        id="carYear"
                        name="carYear"
                        type="number"
                        min="1990"
                        max="2025"
                        value={formData.carYear}
                        onChange={handleInputChange}
                        placeholder="2020"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="plateNumber">{t('plate_number')} *</Label>
                    <Input
                      id="plateNumber"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      placeholder={t('plate_number_placeholder')}
                      className="font-mono text-center"
                      required
                    />
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('service_info')}</h3>
                  
                  <div>
                    <Label htmlFor="serviceType">{t('service_type')} *</Label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={isServicesLoading}
                    >
                      <option value="">
                        {isServicesLoading ? t('loading') : t('select_service')}
                      </option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title || service.name}
                          {service.price > 0 && ` - $${service.price}`}
                        </option>
                      ))}
                      {!isServicesLoading && services.length === 0 && (
                        <option value="" disabled>
                          {t('no_services_available')}
                        </option>
                      )}
                    </select>
                    {!isServicesLoading && services.length > 0 && formData.serviceType && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md">
                        {(() => {
                          const selectedService = services.find(s => s.id === formData.serviceType);
                          if (selectedService) {
                            return (
                              <div className="text-sm text-gray-600">
                                <p className="font-medium">{selectedService.title || selectedService.name}</p>
                                {selectedService.description && (
                                  <p className="mt-1">{selectedService.description}</p>
                                )}
                                {selectedService.duration && (
                                  <p className="mt-1">
                                    <strong>{t('duration')}:</strong> {selectedService.duration} {t('minutes')}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">{t('additional_notes')}</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder={t('notes_placeholder')}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Selected Date & Time Display */}
                {formData.selectedDate && formData.selectedTime && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">{t('selected_appointment')}</h4>
                    <div className="flex items-center gap-4 text-blue-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formData.selectedDate.toLocaleDateString(locale)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formData.selectedTime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={isSubmitting || !formData.selectedDate || !formData.selectedTime}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('booking_in_progress')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('book_appointment')}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}