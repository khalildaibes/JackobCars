/**
 * ImageUploadStep - Sixth and final step of the car listing form
 * 
 * This component allows users to upload and manage car images and video
 * with drag-and-drop functionality and previews.
 * 
 * Features:
 * - Drag and drop image upload
 * - Multiple image support (up to 10 images)
 * - Video upload with duration validation (max 15 seconds)
 * - Image and video preview with remove functionality
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Image as ImageIcon, Video, Play } from 'lucide-react';
import { FormData, ValidationErrors } from '../types';
import { VALIDATION_RULES } from '../constants';
import { validateVideo, formatDuration } from '../../../../utils/videoUtils';

interface ImageUploadStepProps {
  formData: FormData;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onVideoChange: (file: File | null) => void;
  errors: ValidationErrors;
  t: (key: string, values?: any) => string;
}

export const ImageUploadStep: React.FC<ImageUploadStepProps> = ({
  formData,
  onImageChange,
  onRemoveImage,
  onVideoChange,
  errors,
  t
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [videoError, setVideoError] = useState<string>('');
  const [isVideoValidating, setIsVideoValidating] = useState(false);

  /**
   * Handles drag and drop events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Create a synthetic event for the existing onImageChange handler
      const syntheticEvent = {
        target: { 
          files: files.slice(0, VALIDATION_RULES.MAX_IMAGES - formData.images.length) 
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onImageChange(syntheticEvent);
    }
  }, [formData.images.length, onImageChange]);

  /**
   * Handles file input change
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(e);
  };

  /**
   * Opens file dialog
   */
  const openFileDialog = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  /**
   * Handles video file selection and validation
   */
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVideoValidating(true);
    setVideoError('');

    try {
      const validation = await validateVideo(file, VALIDATION_RULES.MAX_VIDEO_DURATION);
      
      if (validation.isValid) {
        onVideoChange(file);
        setVideoError('');
      } else {
        setVideoError(validation.error || 'Invalid video file');
        onVideoChange(null);
      }
    } catch (error) {
      setVideoError('Error validating video file');
      onVideoChange(null);
    } finally {
      setIsVideoValidating(false);
    }
  };

  /**
   * Removes video file
   */
  const handleRemoveVideo = () => {
    onVideoChange(null);
    setVideoError('');
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
        className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3"
      >
        <Camera className="h-6 w-6 text-indigo-600" />
        {t('upload_images')}
      </motion.h2>
      
      <div className="space-y-6">
        {/* Upload Area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div
            className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 hover:border-blue-500 ${
              isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            } ${errors.images ? 'border-red-500' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              id="image-upload"
            />
            
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 rounded-full p-4 mb-4 mx-auto w-20 h-20 flex items-center justify-center"
              >
                {isDragOver ? (
                  <Upload className="h-8 w-8 text-blue-500 animate-pulse" />
                ) : (
                  <Camera className="h-8 w-8 text-blue-500" />
                )}
              </motion.div>
              
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragOver ? t('drop_images_here') || 'Drop images here' : t('drag_drop') || 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {t('image_requirements') || 'PNG, JPG, GIF up to 10MB. Maximum 10 images.'}
              </p>
              
              <button
                type="button"
                onClick={openFileDialog}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
              >
                <ImageIcon className="h-4 w-4" />
                {t('select_images') || 'Select Images'}
              </button>
              
              {errors.images && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 text-center"
                >
                  {errors.images}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Video Upload Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              {t('upload_video') || 'Upload Video (Optional)'}
            </h3>
            
            <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 hover:border-purple-500 ${
              formData.video ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            } ${videoError ? 'border-red-500' : ''}`}>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-purple-50 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center"
                >
                  {formData.video ? (
                    <Play className="h-6 w-6 text-purple-600" />
                  ) : (
                    <Video className="h-6 w-6 text-purple-600" />
                  )}
                </motion.div>
                
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {formData.video ? t('video_uploaded') || 'Video Uploaded' : t('upload_video_here') || 'Upload Video Here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t('video_requirements') || 'MP4, MOV, AVI up to 100MB. Maximum 15 seconds.'}
                </p>
                
                {!formData.video && (
                  <button
                    type="button"
                    onClick={() => document.getElementById('video-upload')?.click()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 mx-auto"
                  >
                    <Video className="h-4 w-4" />
                    {t('select_video') || 'Select Video'}
                  </button>
                )}
                
                {videoError && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 text-center"
                  >
                    {videoError}
                  </motion.p>
                )}
                
                {isVideoValidating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-purple-600 text-center"
                  >
                    {t('validating_video') || 'Validating video...'}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Image Preview Grid */}
        {formData.images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">
                {t('uploaded_images') || 'Uploaded Images'} ({formData.images.length}/{VALIDATION_RULES.MAX_IMAGES})
              </h3>
              <span className="text-sm text-gray-500">
                {t('drag_to_reorder') || 'Drag to reorder'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {formData.images.map((file, index) => (
                  <motion.div 
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative aspect-square group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={t('image_preview', { number: index + 1 }) || `Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                    
                    {/* Remove Button */}
                    <motion.button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      aria-label={t('remove_image') || 'Remove image'}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                    
                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}
                    </div>
                    
                    {/* File Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="truncate">{file.name}</p>
                      <p className="text-gray-300">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Image Upload Tips */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">{t('image_tips_title') || 'Image Upload Tips:'}</p>
                  <ul className="text-xs space-y-1">
                    <li>• {t('image_tip_1') || 'Upload high-quality, well-lit photos of your car'}</li>
                    <li>• {t('image_tip_2') || 'Include exterior, interior, and engine bay shots'}</li>
                    <li>• {t('image_tip_3') || 'Show any damage or issues clearly'}</li>
                    <li>• {t('image_tip_4') || 'First image will be the main listing photo'}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Video Preview */}
        {formData.video && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">
                {t('uploaded_video') || 'Uploaded Video'}
              </h3>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                {t('remove_video') || 'Remove Video'}
              </button>
            </div>
            
            <div className="relative">
              <video
                src={URL.createObjectURL(formData.video)}
                controls
                className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              
              <div className="mt-2 text-center text-sm text-gray-600">
                <p className="font-medium">{formData.video.name}</p>
                <p className="text-gray-500">
                  {(formData.video.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
