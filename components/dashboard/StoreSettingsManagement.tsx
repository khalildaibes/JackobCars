"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Settings,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Palette,
  Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  maxSimultaneousAppointments: number;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  appointmentDuration: number;
}

interface StoreSettings {
  // Basic Info
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  
  // Business Hours
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  appointmentDuration: number;
  maxSimultaneousAppointments: number;
  bufferTime: number; // minutes between appointments
  
  // Pricing
  currency: string;
  taxRate: number;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  reminderTime: number; // hours before appointment
  
  // Features
  allowOnlineBooking: boolean;
  requireDeposit: boolean;
  depositAmount: number;
  allowCancellation: boolean;
  cancellationDeadline: number; // hours before appointment
  
  // Appearance
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  
  // Advanced
  timezone: string;
  language: string;
  autoConfirmBookings: boolean;
}

interface StoreSettingsManagementProps {
  storeId: string;
  store: Store;
  onStoreUpdate: (store: Store) => void;
}

export default function StoreSettingsManagement({ 
  storeId, 
  store, 
  onStoreUpdate 
}: StoreSettingsManagementProps) {
  const t = useTranslations("Dashboard");
  const { toast } = useToast();

  const [settings, setSettings] = useState<StoreSettings>({
    // Initialize with store data
    name: store.name,
    address: store.address,
    phone: store.phone,
    email: store.email,
    website: "",
    description: "",
    workingHours: store.workingHours,
    workingDays: store.workingDays,
    appointmentDuration: store.appointmentDuration,
    maxSimultaneousAppointments: store.maxSimultaneousAppointments,
    bufferTime: 0,
    currency: "USD",
    taxRate: 0,
    emailNotifications: true,
    smsNotifications: false,
    reminderTime: 24,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositAmount: 0,
    allowCancellation: true,
    cancellationDeadline: 24,
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    timezone: "UTC",
    language: "en",
    autoConfirmBookings: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dayNames = [
    t("sunday"), t("monday"), t("tuesday"), t("wednesday"),
    t("thursday"), t("friday"), t("saturday")
  ];

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/stores?name=${storeId}`);
        if (response.ok) {
          const data = await response.json();
          setSettings(prevSettings => ({ ...prevSettings, ...data.settings }));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [storeId]);

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/stores/${storeId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the store object
        const updatedStore = {
          ...store,
          name: settings.name,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          workingHours: settings.workingHours,
          workingDays: settings.workingDays,
          appointmentDuration: settings.appointmentDuration,
          maxSimultaneousAppointments: settings.maxSimultaneousAppointments,
        };
        
        onStoreUpdate(updatedStore);
        
        toast({
          title: t("settings_saved"),
          description: t("settings_saved_successfully"),
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_save_settings"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings
  const handleReset = () => {
    setSettings({
      name: store.name,
      address: store.address,
      phone: store.phone,
      email: store.email,
      website: "",
      description: "",
      workingHours: store.workingHours,
      workingDays: store.workingDays,
      appointmentDuration: store.appointmentDuration,
      maxSimultaneousAppointments: store.maxSimultaneousAppointments,
      bufferTime: 0,
      currency: "USD",
      taxRate: 0,
      emailNotifications: true,
      smsNotifications: false,
      reminderTime: 24,
      allowOnlineBooking: true,
      requireDeposit: false,
      depositAmount: 0,
      allowCancellation: true,
      cancellationDeadline: 24,
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      timezone: "UTC",
      language: "en",
      autoConfirmBookings: true,
    });
  };

  // Toggle working day
  const toggleWorkingDay = (dayIndex: number) => {
    setSettings(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayIndex)
        ? prev.workingDays.filter(d => d !== dayIndex)
        : [...prev.workingDays, dayIndex].sort()
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{t("store_settings")}</h2>
          <p className="text-gray-600">{t("configure_store_preferences")}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("reset")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {t("save_changes")}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("general")}
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("business_hours")}
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("booking_settings")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t("notifications")}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t("appearance")}
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("basic_information")}
              </CardTitle>
              <CardDescription>{t("basic_information_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("store_name")}</Label>
                  <Input
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t("enter_store_name")}
                  />
                </div>
                
                <div>
                  <Label>{t("website")}</Label>
                  <Input
                    value={settings.website || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourstore.com"
                    type="url"
                  />
                </div>
              </div>

              <div>
                <Label>{t("address")}</Label>
                <Input
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder={t("enter_store_address")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("phone")}</Label>
                  <Input
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0501234567"
                    type="tel"
                  />
                </div>
                
                <div>
                  <Label>{t("email")}</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@store.com"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <Label>{t("description")}</Label>
                <Textarea
                  value={settings.description || ""}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t("enter_store_description")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("business_hours")}
              </CardTitle>
              <CardDescription>{t("business_hours_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Hours */}
              <div>
                <Label className="text-base font-medium">{t("working_hours")}</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>{t("opening_time")}</Label>
                    <Input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, start: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>{t("closing_time")}</Label>
                    <Input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <Label className="text-base font-medium">{t("working_days")}</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {dayNames.map((day, index) => (
                    <div key={index} className="text-center">
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <span className="text-sm font-medium">{day.slice(0, 3)}</span>
                        <input
                          type="checkbox"
                          checked={settings.workingDays.includes(index)}
                          onChange={() => toggleWorkingDay(index)}
                          className="w-4 h-4"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{t("appointment_duration")} ({t("minutes")})</Label>
                  <Input
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={settings.appointmentDuration}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      appointmentDuration: parseInt(e.target.value) 
                    }))}
                  />
                </div>
                
                <div>
                  <Label>{t("max_simultaneous_appointments")}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxSimultaneousAppointments}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      maxSimultaneousAppointments: parseInt(e.target.value) 
                    }))}
                  />
                </div>
                
                <div>
                  <Label>{t("buffer_time")} ({t("minutes")})</Label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    step="5"
                    value={settings.bufferTime}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      bufferTime: parseInt(e.target.value) 
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings Tab */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("booking_preferences")}
              </CardTitle>
              <CardDescription>{t("booking_preferences_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Online Booking */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("allow_online_booking")}</Label>
                  <p className="text-sm text-gray-600">{t("allow_online_booking_desc")}</p>
                </div>
                <Switch
                  checked={settings.allowOnlineBooking}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    allowOnlineBooking: checked 
                  }))}
                />
              </div>

              {/* Auto Confirm */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("auto_confirm_bookings")}</Label>
                  <p className="text-sm text-gray-600">{t("auto_confirm_bookings_desc")}</p>
                </div>
                <Switch
                  checked={settings.autoConfirmBookings}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    autoConfirmBookings: checked 
                  }))}
                />
              </div>

              {/* Cancellation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">{t("allow_cancellation")}</Label>
                    <p className="text-sm text-gray-600">{t("allow_cancellation_desc")}</p>
                  </div>
                  <Switch
                    checked={settings.allowCancellation}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      allowCancellation: checked 
                    }))}
                  />
                </div>

                {settings.allowCancellation && (
                  <div>
                    <Label>{t("cancellation_deadline")} ({t("hours_before")})</Label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={settings.cancellationDeadline}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        cancellationDeadline: parseInt(e.target.value) 
                      }))}
                    />
                  </div>
                )}
              </div>

              {/* Deposit */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">{t("require_deposit")}</Label>
                    <p className="text-sm text-gray-600">{t("require_deposit_desc")}</p>
                  </div>
                  <Switch
                    checked={settings.requireDeposit}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      requireDeposit: checked 
                    }))}
                  />
                </div>

                {settings.requireDeposit && (
                  <div>
                    <Label>{t("deposit_amount")} ({settings.currency})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.depositAmount}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        depositAmount: parseFloat(e.target.value) 
                      }))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("notification_settings")}
              </CardTitle>
              <CardDescription>{t("notification_settings_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("email_notifications")}</Label>
                  <p className="text-sm text-gray-600">{t("email_notifications_desc")}</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    emailNotifications: checked 
                  }))}
                />
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("sms_notifications")}</Label>
                  <p className="text-sm text-gray-600">{t("sms_notifications_desc")}</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    smsNotifications: checked 
                  }))}
                />
              </div>

              {/* Reminder Time */}
              <div>
                <Label>{t("reminder_time")} ({t("hours_before")})</Label>
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.reminderTime}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    reminderTime: parseInt(e.target.value) 
                  }))}
                />
                <p className="text-sm text-gray-600 mt-1">{t("reminder_time_desc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t("appearance_settings")}
              </CardTitle>
              <CardDescription>{t("appearance_settings_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("primary_color")}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        primaryColor: e.target.value 
                      }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        primaryColor: e.target.value 
                      }))}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>{t("secondary_color")}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        secondaryColor: e.target.value 
                      }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        secondaryColor: e.target.value 
                      }))}
                      placeholder="#10B981"
                    />
                  </div>
                </div>
              </div>

              {/* Language and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{t("language")}</Label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      language: e.target.value 
                    }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="he-IL">עברית</option>
                  </select>
                </div>
                
                <div>
                  <Label>{t("currency")}</Label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      currency: e.target.value 
                    }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ILS">ILS (₪)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                
                <div>
                  <Label>{t("timezone")}</Label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      timezone: e.target.value 
                    }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Jerusalem">Israel (UTC+2/3)</option>
                    <option value="Europe/London">London (UTC+0/1)</option>
                    <option value="America/New_York">New York (UTC-5/-4)</option>
                  </select>
                </div>
              </div>

              {/* Tax Rate */}
              <div>
                <Label>{t("tax_rate")} (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    taxRate: parseFloat(e.target.value) 
                  }))}
                />
                <p className="text-sm text-gray-600 mt-1">{t("tax_rate_desc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}