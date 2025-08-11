"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Upload, Plus, Car, X, Camera, ArrowLeft, ArrowRight } from 'lucide-react';
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
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { manufacturers_arabic, manufacturers_english, manufacturers_hebrew } from '../../../data/manufacturers_multilingual';

// Use based on locale
// locale is not defined yet here, so we must export a function to get manufacturers based on locale
function getManufacturers(locale: string) {
  // if (locale === 'ar') return manufacturers_arabic;
  // if (locale === 'en') return manufacturers_hebrew;
  return manufacturers_hebrew;
}

const engineTypes = ['petrol', 'diesel', 'hybrid', 'electric'] as const;
const conditions = ['excellent', 'good', 'fair', 'poor'] as const;

interface ManufacturerData {
  submodels: any[];
  manufacturerImage: string;
  year: {
    from: number;
    to: number;
    step: number;
  };
}

// Define the steps for the wizard
const STEPS = [
  { id: 'basic', title: 'Basic Information', icon: Car },
  { id: 'condition', title: 'Condition', icon: Car },
  { id: 'trade-in', title: 'Trade-in Option', icon: Car },
  { id: 'price', title: 'Price', icon: Car },
  { id: 'contact', title: 'Contact Info', icon: Car },
  { id: 'images', title: 'Upload Images', icon: Camera },
];

export default function AddCarListing() {
  const t = useTranslations('CarListing');
  const locale = useLocale();
  const manufacturers = getManufacturers(locale);

  const isRTL = locale === 'ar' || locale === 'he-IL';
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

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

  // Update available models when manufacturer changes
  useEffect(() => {
    if (selectedManufacturer && manufacturers[selectedManufacturer]) {
      const models = manufacturers[selectedManufacturer].submodels || [];
      setAvailableModels(models);
      setSelectedModel(''); // Reset model selection
      setAvailableYears([]); // Clear years until model is selected
    } else {
      setAvailableModels([]);
      setAvailableYears([]);
    }
  }, [selectedManufacturer, manufacturers]);

  // Update available years when model changes
  useEffect(() => {
    if (selectedManufacturer && selectedModel && manufacturers[selectedManufacturer]) {
      const manufacturer = manufacturers[selectedManufacturer];
      
      // Generate year options based on manufacturer data
      const yearData = manufacturer.year;
      if (yearData && yearData.from && yearData.to) {
        const years = [];
        for (let year = yearData.to; year >= yearData.from; year -= yearData.step || 1) {
          years.push(year);
        }
        setAvailableYears(years);
      } else {
        // Fallback to default years
        const years = [];
        for (let year = 2025; year >= 1990; year--) {
          years.push(year);
        }
        setAvailableYears(years);
      }
    } else {
      setAvailableYears([]);
    }
  }, [selectedManufacturer, selectedModel, manufacturers]);

  // Update formData.makeModel when both manufacturer and model are selected
  useEffect(() => {
    if (selectedManufacturer && selectedModel) {
      const manufacturerName = manufacturers[selectedManufacturer]?.manufacturerImage ? 
        Object.keys(manufacturers).find(key => key === selectedManufacturer) : selectedManufacturer;
      const modelName = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
      
      setFormData(prev => ({
        ...prev,
        makeModel: `${manufacturerName} ${modelName}`.trim()
      }));
    }
  }, [selectedManufacturer, selectedModel, availableModels, manufacturers]);

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    const currentStepId = STEPS[currentStep].id;

    switch (currentStepId) {
      case 'basic':
        if (!formData.title) newErrors.title = t('validation_required');
        if (!selectedManufacturer) newErrors.manufacturer = t('validation_required');
        if (!selectedModel) newErrors.model = t('validation_required');
        if (!formData.year) newErrors.year = t('validation_required');
        if (!formData.plateNumber) newErrors.plateNumber = t('validation_required');
        break;
      case 'contact':
        if (!formData.email) {
          newErrors.email = t('validation_required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = t('validation_email');
        }
        if (!formData.phone) newErrors.phone = t('validation_required');
        break;
      case 'images':
        if (!formData.images.length) newErrors.images = t('validation_images');
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
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
    if (!validateCurrentStep()) return;

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
        setSelectedManufacturer('');
        setSelectedModel('');
        setAvailableModels([]);
        setAvailableYears([]);
        setErrors(prev => ({ ...prev, manufacturer: '', model: '' }));
        setCurrentStep(0);
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

  const renderStepContent = () => {
    const currentStepId = STEPS[currentStep].id;

    switch (currentStepId) {
      case 'basic':
        return (
          <motion.div 
            key="basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                <div>
                  <Select
                    value={selectedManufacturer}
                    onValueChange={(value) => {
                      if (value && manufacturers[value]) {
                        const models = manufacturers[value].submodels || [];
                        setAvailableModels(models);
                        setSelectedModel(''); // Reset model selection
                        setAvailableYears([]); // Clear years until model is selected
                      } else {
                        setAvailableModels([]);
                        setAvailableYears([]);
                      }
                      setSelectedManufacturer(value);
                      setErrors(prev => ({ ...prev, manufacturer: '' }));
                    }}
                  >
                    <SelectTrigger className="rounded-xl py-5 bg-white">
                      <SelectValue placeholder={t('select_manufacturer') || 'Select Manufacturer'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.keys(manufacturers).length === 0 ? (
                        <SelectItem value="loading_manufacturers" disabled>
                          Loading manufacturers...
                        </SelectItem>
                      ) : (
                        Object.keys(manufacturers).map((manufacturer) => (
                          <SelectItem key={manufacturer} value={manufacturer}>
                            {manufacturers[manufacturer].submodels[0].manufacturer.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.manufacturer && <p className="mt-1 text-sm text-red-500">{errors.manufacturer}</p>}
                </div>

                <div>
                  <Select
                    value={selectedModel}
                    onValueChange={(value) => {
                      setSelectedModel(value);
                      setErrors(prev => ({ ...prev, model: '' }));
                    }}
                    disabled={!selectedManufacturer || availableModels.length === 0}
                  >
                    <SelectTrigger className="rounded-xl py-5">
                      <SelectValue placeholder={t('select_model') || 'Select Model'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {!selectedManufacturer ? (
                        <SelectItem value="select_manufacturer_first" disabled>
                          Select manufacturer first
                        </SelectItem>
                      ) : availableModels.length === 0 ? (
                        <SelectItem value="no_models_available" disabled>
                          No models available
                        </SelectItem>
                      ) : (
                        availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id?.toString()}>
                            {model.title || 'Unknown Model'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
                </div>

                <div>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, year: value }));
                      setErrors(prev => ({ ...prev, year: '' }));
                    }}
                    disabled={!selectedManufacturer || !selectedModel || availableYears.length === 0}
                  >
                    <SelectTrigger className={`rounded-xl py-5 ${errors.year ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={t('year') || 'Year'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableYears.length === 0 ? (
                        <SelectItem value="no_years_available" disabled>
                          {!selectedManufacturer ? 'Select manufacturer first' : 
                           !selectedModel ? 'Select model first' : 'No years available'}
                        </SelectItem>
                      ) : (
                        availableYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
                  <SelectContent className="bg-white">
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
                  <SelectContent className="bg-white">
                    <SelectItem value="automatic">{t('transmission_automatic')}</SelectItem>
                    <SelectItem value="manual">{t('transmission_manual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 'condition':
        return (
          <motion.div 
            key="condition"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                <SelectContent className="bg-white">
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {t(`condition_${condition}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('known_problems')}</Label>
                <Textarea
                  placeholder={t('known_problems_placeholder') || 'Describe any known problems...'}
                  value={formData.knownProblems}
                  onChange={(e) => setFormData(prev => ({ ...prev, knownProblems: e.target.value }))}
                  className="min-h-[100px] rounded-xl"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('pros')}</Label>
                <Textarea
                  placeholder={t('pros_placeholder') || 'List the pros (one per line)...'}
                  value={formData.pros}
                  onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                  className="min-h-[100px] rounded-xl"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('cons')}</Label>
                <Textarea
                  placeholder={t('cons_placeholder') || 'List the cons (one per line)...'}
                  value={formData.cons}
                  onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                  className="min-h-[100px] rounded-xl"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'trade-in':
        return (
          <motion.div 
            key="trade-in"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ${locale === 'ar' ? 'rtl' : ''}`}
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
        );

      case 'price':
        return (
          <motion.div 
            key="price"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
        );

      case 'contact':
        return (
          <motion.div 
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
        );

      case 'images':
        return (
          <motion.div 
            key="images"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
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

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  index <= currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-200 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-lg font-medium text-gray-700">
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg"
          >
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('submitting') : t('submit_listing')}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
} 