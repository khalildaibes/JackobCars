"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Upload, Plus, Car, X, Camera } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { motion } from "framer-motion";
import axios from 'axios';

const engineTypes = ['petrol', 'diesel', 'hybrid', 'electric'] as const;
const conditions = ['excellent', 'good', 'fair', 'poor'] as const;

export default function AddCarListing() {
  const t = useTranslations('CarListing');
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    makeModel: '',
    year: '',
    plateNumber: '',
    mileage: '',
    color: '',
    engineType: '',
    transmission: 'Automatic',
    currentCondition: '',
    knownProblems: '',
    pros: '',
    cons: '',
    tradeIn: '',
    targetBuyer: '',
    askingPrice: '',
    name: '',
    email: '',
    phone: '',
    images: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = t('validation_required');
    if (!formData.makeModel) newErrors.makeModel = t('validation_required');
    if (!formData.year) newErrors.year = t('validation_required');
    if (!formData.plateNumber) newErrors.plateNumber = t('validation_required');
    if (!formData.email) {
      newErrors.email = t('validation_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation_email');
    }
    if (!formData.phone) newErrors.phone = t('validation_required');
    if (!formData.images.length) newErrors.images = t('validation_images');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('files', file);
      
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data[0].id; // Return the uploaded file ID
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // First upload all images
      const imageIds = await uploadImages(formData.images);

      // Format the car details object
      const carDetails = {
        car: {
          name: formData.title,
          year: parseInt(formData.year),
          fuel: formData.engineType,
          transmission: formData.transmission,
          mileage: `${formData.mileage} KM`,
          price: parseFloat(formData.askingPrice),
          body_type: formData.makeModel.split(' ')[0], // This is a simplification
          pros: formData.pros.split('\n').filter(item => item.trim() !== ''),
          cons: formData.cons.split('\n').filter(item => item.trim() !== ''),
          features: [
            {
              icon: "img_calendar_indigo_a400.svg",
              label: t('year'),
              value: formData.year.toString()
            },
            {
              icon: "img_icon_indigo_a400.svg",
              label: t('mileage'),
              value: `${formData.mileage} KM`
            },
            {
              icon: "img_icon_indigo_a400_18x18.svg",
              label: t('transmission'),
              value: formData.transmission
            },
            {
              icon: "img_icon_4.svg",
              label: t('fuel_type'),
              value: formData.engineType
            }
          ],
          description: formData.knownProblems,
          images: {
            main: imageIds[0] || '',
            additional: imageIds.slice(1)
          }
        }
      };

      // Prepare the data for Strapi
      const carListingData = {
        data: {
          image: imageIds[0], // First image as main image
          categories: ['car-listing'],
          quantity: 1,
          name: formData.title,
          slug: generateSlug(formData.title),
          price: parseFloat(formData.askingPrice),
          details: carDetails,
          store: 'khalil store', // You might want to make this dynamic
          locale: locale,
          publishedAt: null // Will be published after admin approval
        }
      };

      // Send the data to Strapi
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/car-listings`, 
        carListingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        alert(t('success_message'));
        // Reset form
        setFormData({
          title: '',
          makeModel: '',
          year: '',
          plateNumber: '',
          mileage: '',
          color: '',
          engineType: '',
          transmission: 'Automatic',
          currentCondition: '',
          knownProblems: '',
          pros: '',
          cons: '',
          tradeIn: '',
          targetBuyer: '',
          askingPrice: '',
          name: '',
          email: '',
          phone: '',
          images: []
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('error_message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)].slice(0, 8) // Limit to 8 images
      }));
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('add_car_listing')}</h1>
            <p className="text-gray-600">{t('fill_details')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('basic_information')}</h2>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder={t('title_placeholder')}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder={t('make_model')}
                    value={formData.makeModel}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, makeModel: e.target.value }));
                      setErrors(prev => ({ ...prev, makeModel: '' }));
                    }}
                    className={`rounded-xl py-5 ${errors.makeModel ? 'border-red-500' : ''}`}
                  />
                  {errors.makeModel && <p className="mt-1 text-sm text-red-500">{errors.makeModel}</p>}
                </div>

                <div>
                  <Input
                    placeholder={t('year')}
                    value={formData.year}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, year: e.target.value }));
                      setErrors(prev => ({ ...prev, year: '' }));
                    }}
                    className={`rounded-xl py-5 ${errors.year ? 'border-red-500' : ''}`}
                  />
                  {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                </div>

                <div>
                  <Input
                    placeholder={t('plate_number')}
                    value={formData.plateNumber}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, plateNumber: e.target.value }));
                      setErrors(prev => ({ ...prev, plateNumber: '' }));
                    }}
                    className={`rounded-xl py-5 ${errors.plateNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.plateNumber && <p className="mt-1 text-sm text-red-500">{errors.plateNumber}</p>}
                </div>

                <Input
                  placeholder={t('mileage')}
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  className="rounded-xl py-5"
                />

                <Input
                  placeholder={t('color')}
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="rounded-xl py-5"
                />

                <Select
                  value={formData.engineType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, engineType: value }))}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('engine_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {engineTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`fuel_types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('transmission')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">{t('transmission_automatic')}</SelectItem>
                    <SelectItem value="manual">{t('transmission_manual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Condition */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('condition')}</h2>
            <div className="space-y-4">
              <Select
                value={formData.currentCondition}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currentCondition: value }))}
              >
                <SelectTrigger className="rounded-xl py-5">
                  <SelectValue placeholder={t('current_condition')} />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {t(`condition_${condition}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  placeholder={t('known_problems')}
                  value={formData.knownProblems}
                  onChange={(e) => setFormData(prev => ({ ...prev, knownProblems: e.target.value }))}
                  className="h-24 rounded-xl py-5"
                />
                <Textarea
                  placeholder={t('pros')}
                  value={formData.pros}
                  onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                  className="h-24 rounded-xl py-5"
                />
                <Textarea
                  placeholder={t('cons')}
                  value={formData.cons}
                  onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                  className="h-24 rounded-xl py-5"
                />
              </div>
            </div>
          </motion.div>

          {/* Trade-in Option */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('trade_in_option')}</h2>
            <RadioGroup
              value={formData.tradeIn}
              onValueChange={(value) => setFormData(prev => ({ ...prev, tradeIn: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">{t('yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">{t('no')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe">{t('maybe')}</Label>
              </div>
            </RadioGroup>
          </motion.div>

          {/* Target Buyer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('target_buyer')}</h2>
            <Textarea
              placeholder={t('target_buyer_placeholder')}
              value={formData.targetBuyer}
              onChange={(e) => setFormData(prev => ({ ...prev, targetBuyer: e.target.value }))}
              className="h-24 rounded-xl py-5"
            />
          </motion.div>

          {/* Price */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('price')}</h2>
            <Input
              placeholder={t('asking_price_placeholder')}
              type="number"
              value={formData.askingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
              className="w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('contact_info')}</h2>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder={t('name_placeholder')}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Input
                  placeholder={t('email_placeholder')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <Input
                  placeholder={t('phone_placeholder')}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('upload_images')}</h2>
            <div className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 hover:border-blue-500 ${errors.images ? 'border-red-500' : 'border-gray-200'}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="bg-blue-50 rounded-full p-4 mb-4">
                  <Camera className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">{t('drag_drop')}</p>
                <p className="text-sm text-gray-500">{t('image_requirements')}</p>
              </label>
              
              {errors.images && <p className="mt-2 text-sm text-red-500 text-center">{errors.images}</p>}
              
              {formData.images.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {formData.images.map((file, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={t('image_preview', { number: index + 1 })}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label={t('remove_image')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('submitting') : t('submit_listing')}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
} 