/**
 * BasicInformationStep - First step of the car listing form
 * 
 * This component handles the initial car information input with two methods:
 * 1. Automatic: Search by license plate number
 * 2. Manual: Select manufacturer, model, and year manually
 * 
 * Features:
 * - Toggle between input methods
 * - Plate number search with Israeli styling
 * - Dropdown-based manual selection
 * - Auto-population of form fields
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Settings, Search, Loader2 } from 'lucide-react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { FormData, ValidationErrors, InputMethod } from '../types';
import { ENGINE_TYPES, TRANSMISSION_OPTIONS, COLOR_OPTIONS, REGION_OPTIONS, OWNERSHIP_TYPE_OPTIONS, SEAT_COUNT_OPTIONS } from '../constants';

interface BasicInformationStepProps {
  inputMethod: InputMethod;
  onInputMethodChange: (method: InputMethod) => void;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
  manufacturersData: any;
  selectedManufacturer: string;
  setSelectedManufacturer: (manufacturer: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedSubmodel: string;
  setSelectedSubmodel: (submodel: string) => void;
  availableModels: any[];
  availableYears: number[];
  availableSubmodels: any[];
  subModelID: string;
  setSubModelID: (id: string) => void;
  plateNumber: string;
  onPlateNumberChange: (value: string) => void;
  onFetchCarData: () => void;
  onFetchSubmodels: (modelId: string) => void;
  loading: boolean;
  govCarInfo: any;
  yad2ModelInfo: any;
  yad2PriceInfo: any;
  t: (key: string, values?: any) => string;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  inputMethod,
  onInputMethodChange,
  formData,
  setFormData,
  errors,
  setErrors,
  manufacturersData,
  selectedManufacturer,
  setSelectedManufacturer,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  selectedSubmodel,
  setSelectedSubmodel,
  availableModels,
  availableYears,
  availableSubmodels,
  subModelID,
  setSubModelID,
  plateNumber,
  onPlateNumberChange,
  onFetchCarData,
  onFetchSubmodels,
  loading,
  govCarInfo,
  yad2ModelInfo,
  yad2PriceInfo,
  t
}) => {
  const [localPlateNumber, setLocalPlateNumber] = useState(plateNumber);

  /**
   * Formats plate number with dashes for better readability
   */
  const formatPlateNumber = (value: string) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
    
    if (cleanValue.length <= 2) {
      return cleanValue;
    } else if (cleanValue.length <= 5) {
      return `${cleanValue.slice(0, 2)}-${cleanValue.slice(2)}`;
    } else if (cleanValue.length <= 7) {
      return `${cleanValue.slice(0, 2)}-${cleanValue.slice(2, 5)}-${cleanValue.slice(5)}`;
    } else if (cleanValue.length <= 8) {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 5)}-${cleanValue.slice(5)}`;
    }
    return cleanValue;
  };

  /**
   * Handles plate number input changes
   */
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPlateNumber(e.target.value);
    setLocalPlateNumber(formattedValue);
    onPlateNumberChange(formattedValue);
    setErrors({ ...errors, plateNumber: '' });
  };

  /**
   * Handles search button click
   */
  const handleSearch = () => {
    if (localPlateNumber.trim()) {
      onFetchCarData();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl font-semibold mb-6 text-gray-800"
      >
        {t('basic_information')}
      </motion.h2>
      
      {/* Input Method Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => onInputMethodChange('plate')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              inputMethod === 'plate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Car className="h-5 w-5" />
              {t('search_by_plate') || 'Search by Plate Number'}
            </div>
          </button>
          <button
            type="button"
            onClick={() => onInputMethodChange('manual')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              inputMethod === 'manual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              {t('enter_manually') || 'Enter Manually'}
            </div>
          </button>
        </div>
      </motion.div>

      {/* Title Field */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('title')} <span className="text-gray-500">({t('auto_generated_hint')})</span>
        </label>
        <Input
          placeholder={t('title_placeholder')}
          value={formData.title}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, title: e.target.value }));
            setErrors({ ...errors, title: '' });
          }}
          className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        {!formData.title && selectedManufacturer && selectedModel && selectedYear && (
          <p className="mt-2 text-sm text-blue-600">
            💡 {t('title_auto_generation_hint')} "{manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer} {formData.commercialNickname || t('model')} {selectedYear}" {t('when_click_next')}
          </p>
        )}
      </motion.div>

      {/* Mileage Field */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('mileage')} <span className="text-gray-500">({t('in_kilometers')})</span>
        </label>
        <Input
          placeholder={t('mileage')}
          value={formData.mileage}
          onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
          className={`rounded-xl py-5 ${errors.mileage ? 'border-red-500' : ''}`}
        />
        {errors.mileage && <p className="mt-1 text-sm text-red-500">{errors.mileage}</p>}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Plate Number Input Method */}
        {inputMethod === 'plate' && (
          <motion.div 
            key="plate-method"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="w-full max-w-xl mx-auto">
              <div className="relative">
                <div className="relative flex items-center bg-[#ffca11] rounded shadow-lg p-2">
                  <div className="flex items-center gap-4">
                    <img 
                      src="/a1.png" 
                      alt={t("logo_alt")} 
                      width={40} 
                      height={50} 
                      className="object-fill w-[60px] md:w-[80px] p-[2px]" 
                    />
                  </div>
                  <Input
                    type="text"
                    value={localPlateNumber}
                    onChange={handlePlateNumberChange}
                    placeholder={t("enter_plate")}
                    className="w-full px-4 sm:px-6 py-4 sm:py-8 text-xl sm:text-2xl md:text-3xl font-black tracking-[0.1em] bg-transparent border-0 focus:ring-0 text-center uppercase"
                    maxLength={10}
                    style={{
                      letterSpacing: '0.1em',
                      fontFamily: 'monospace',
                      lineHeight: '1',
                      WebkitTextStroke: '1px black',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 px-4 w-full justify-center pt-4">
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading || !localPlateNumber.trim()}
                    className="rounded-full w-50 text-black h-12 hover:bg-blue-700 transition-colors bg-[#ffca11] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        {t("search_by_vin")}
                      </>
                    )}
                  </Button>
                </div>

                {/* Car Information Display */}
                {(yad2PriceInfo?.data || yad2ModelInfo?.data) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 space-y-4"
                  >
                    {/* Price Information */}
                    {yad2PriceInfo?.data && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
                          <span>{t('min')} {Number(yad2PriceInfo.data.minPrice).toLocaleString()}</span>
                          <span>{t('predicted')} {Number(yad2PriceInfo.data.predictedPrice).toLocaleString()}</span>
                          <span>{t('max')} {Number(yad2PriceInfo.data.maxPrice).toLocaleString()}</span>
                        </div>
                        <div className="mt-3">
                          <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" aria-label="Price heatmap" />
                          {(() => {
                            const min = Number(yad2PriceInfo.data.minPrice) || 0;
                            const max = Number(yad2PriceInfo.data.maxPrice) || 0;
                            const pred = Number(yad2PriceInfo.data.predictedPrice) || 0;
                            const range = Math.max(max - min, 1);
                            const pct = Math.min(100, Math.max(0, ((pred - min) / range) * 100));
                            return (
                              <div className="relative h-6">
                                <div className="absolute top-0 -mt-2" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                                  <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow" />
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {t('accuracy')}: {String(yad2PriceInfo.data.accuracyId)}
                        </div>
                      </div>
                    )}

                    {/* ALL Government Car Information - Complete Data Display */}
                    {yad2ModelInfo?.data && (
                      <div className="space-y-4">
                        {/* Basic Car Information */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-blue-600 font-semibold">🚗 {t('basic_car_info') || 'Basic Car Information'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('manufacturer') || 'Manufacturer'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.manufacturerName || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('model') || 'Model'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.modelName || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('year') || 'Year'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.carYear || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('submodel') || 'Submodel'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.subModelTitle || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('fuel_type') || 'Fuel Type'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.fuelType || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('owner') || 'Owner Type'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.owner || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('car_title') || 'Car Title'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.carTitle || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('model_id') || 'Model ID'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.modelId || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('manufacturer_id') || 'Manufacturer ID'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.manufacturerId || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('submodel_id') || 'Submodel ID'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.subModelId || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('commercial_nickname') || 'Commercial Nickname'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.commercialNickname || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Technical Specifications */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-green-600 font-semibold">⚙️ {t('technical_specs') || 'Technical Specifications'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('engine_capacity') || 'Engine Capacity'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.engineCapacity || 'N/A'} {yad2ModelInfo.data.engineCapacity ? 'cc' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('total_weight') || 'Total Weight'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.totalWeight || 'N/A'} {yad2ModelInfo.data.totalWeight ? 'kg' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('height') || 'Height'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.height || 'N/A'} {yad2ModelInfo.data.height ? 'mm' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('drive_type') || 'Drive Type'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.driveType || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('transmission') || 'Transmission'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.transmission || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('body_type') || 'Body Type'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.bodyType || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('engine_code') || 'Engine Code'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.engineCode || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('seating_capacity') || 'Seating Capacity'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.seatingCapacity || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('pollution_group') || 'Pollution Group'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.pollutionGroup || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Safety Features */}
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-yellow-600 font-semibold">🛡️ {t('safety_features') || 'Safety Features'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('abs') || 'ABS'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.abs || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('airbags') || 'Airbags'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.airbags !== null && yad2ModelInfo.data.airbags !== undefined ? yad2ModelInfo.data.airbags : 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('safety_rating') || 'Safety Rating'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.safetyRating || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('power_windows') || 'Power Windows'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.powerWindows !== null && yad2ModelInfo.data.powerWindows !== undefined ? yad2ModelInfo.data.powerWindows : 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('safety_rating_no_seatbelts') || 'Safety Rating (No Seatbelts)'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.safetyRatingWithoutSeatbelts || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Environmental Data */}
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-emerald-600 font-semibold">🌱 {t('environmental_data') || 'Environmental Data'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('co2_emission') || 'CO2 Emission'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.co2Emission || 'N/A'} {yad2ModelInfo.data.co2Emission ? 'g/km' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('nox_emission') || 'NOx Emission'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.noxEmission || 'N/A'} {yad2ModelInfo.data.noxEmission ? 'mg/km' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('pm_emission') || 'PM Emission'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.pmEmission || 'N/A'} {yad2ModelInfo.data.pmEmission ? 'mg/km' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('hc_emission') || 'HC Emission'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.hcEmission || 'N/A'} {yad2ModelInfo.data.hcEmission ? 'mg/km' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('co_emission') || 'CO Emission'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.coEmission || 'N/A'} {yad2ModelInfo.data.coEmission ? 'mg/km' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('green_index') || 'Green Index'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.greenIndex || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-purple-600 font-semibold">📋 {t('additional_info') || 'Additional Information'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('fuel_tank_capacity') || 'Fuel Tank Capacity'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.fuelTankCapacity || 'N/A'} {yad2ModelInfo.data.fuelTankCapacity ? 'kg' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('fuel_tank_capacity_no_reserve') || 'Fuel Tank (No Reserve)'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.fuelTankCapacityWithoutReserve || 'N/A'} {yad2ModelInfo.data.fuelTankCapacityWithoutReserve ? 'kg' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('date_on_road') || 'Date on Road'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.dateOnRoad || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('frame_number') || 'Frame Number'}</div>
                              <div className="font-semibold text-gray-900 font-mono text-sm">{yad2ModelInfo.data.frameNumber || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('last_test_date') || 'Last Test Date'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.lastTestDate || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('tokef_test_date') || 'Tokef Test Date'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.tokefTestDate || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('mileage') || 'Mileage'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.mileage || 'N/A'} {yad2ModelInfo.data.mileage ? 'km' : ''}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('rank') || 'Rank'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.rank || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('commercial_name') || 'Commercial Name'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.commercialName || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tires and Colors */}
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-orange-600 font-semibold">🛞 {t('tires_and_colors') || 'Tires and Colors'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('front_tires') || 'Front Tires'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.frontTires || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('rear_tires') || 'Rear Tires'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.rearTires || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('car_color_group_id') || 'Car Color Group ID'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.carColorGroupID || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('yad2_color_id') || 'Yad2 Color ID'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.yad2ColorID || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-xs text-gray-500 font-medium">{t('yad2_car_title') || 'Yad2 Car Title'}</div>
                              <div className="font-semibold text-gray-900">{yad2ModelInfo.data.yad2CarTitle || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Debug Information - Raw Data */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl text-gray-600 font-semibold">🔍 {t('debug_info') || 'Debug Information'}</span>
                          </div>
                          <div className="bg-white p-4 rounded-lg border overflow-auto max-h-60">
                            <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap">
                              {JSON.stringify(yad2ModelInfo.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Manual Entry Method */}
        {inputMethod === 'manual' && (
          <motion.div 
            key="manual-method"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manufacturer Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('manufacturer') || 'Manufacturer'} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedManufacturer}
                  onValueChange={(value) => {
                    if (value && manufacturersData[value]) {
                      const models = manufacturersData[value].submodels || [];
                              setSelectedModel('');
                      setSelectedYear('');
                      setSelectedSubmodel('');
                    } else {
                      // setAvailableModels([]);
                      // setAvailableYears([]);
                      // setAvailableSubmodels([]);
                      setSelectedSubmodel('');
                    }
                    setSelectedManufacturer(value);
                    setErrors({ ...errors, manufacturer: '' });
                  }}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('select_manufacturer') || 'Select Manufacturer'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.keys(manufacturersData).length === 0 ? (
                      <SelectItem value="loading_manufacturers" disabled>
                        Loading manufacturers...
                      </SelectItem>
                    ) : (
                      Object.keys(manufacturersData).map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturersData[manufacturer]?.submodels?.[0]?.manufacturer?.title || manufacturer}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.manufacturer && <p className="mt-1 text-sm text-red-500">{errors.manufacturer}</p>}
              </motion.div>

              {/* Model Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('model') || 'Model'} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedModel}
                  onValueChange={(value) => {
                    setSelectedModel(value);
                    setSubModelID(value);
                    const selectedModelData = availableModels.find(model => model.id?.toString() === value);
                    if (selectedModelData) {
                      setFormData(prev => ({ ...prev, commercialNickname: selectedModelData.title || '' }));
                    }
                    onFetchSubmodels(value);
                    setSelectedSubmodel('');
                    setErrors({ ...errors, model: '' });
                  }}
                  disabled={!selectedManufacturer || availableModels.length === 0}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('select_model') || 'Select Model'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {!selectedManufacturer ? (
                      <SelectItem value="no_models_available" disabled>
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
              </motion.div>

              {/* Year Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('year') || 'Year'} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    setFormData(prev => ({ ...prev, year: value }));
                    setErrors({ ...errors, year: '' });
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
              </motion.div>

              {/* Additional Fields */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="space-y-4"
              >
                {/* Engine Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('engine_type')} <span className="text-gray-500">({t('optional')})</span>
                  </label>
                  <Select
                    value={formData.engineType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, engineType: value }))}
                  >
                    <SelectTrigger className="rounded-xl py-5 text-black">
                      <SelectValue placeholder={t('engine_type')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {ENGINE_TYPES.map((engineType) => (
                        <SelectItem key={engineType.value} value={engineType.value}>
                          {engineType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('transmission')} <span className="text-gray-500">({t('optional')})</span>
                  </label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                  >
                    <SelectTrigger className="rounded-xl py-5 text-black">
                      <SelectValue placeholder={t('select_transmission')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {TRANSMISSION_OPTIONS.map((transmission) => (
                        <SelectItem key={transmission.value} value={transmission.value}>
                          {transmission.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
