'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Define STRAPI_URL directly since we can't import from config
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';

interface CarFormData {
  brand: string;
  model: string;
  description: string;
  price: number;
  year: number;
  miles: string;
  mileage: string;
  fuel: string;
  transmission: string;
  body_type: string;
  pros: string[];
  cons: string[];
  features: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  badges: Array<{
    color: string;
    label: string;
    textColor: string;
  }>;
  dimensions_capacity: Array<{
    label: string;
    value: string;
  }>;
  engine_transmission_details: Array<{
    label: string;
    value: string;
  }>;
  images: {
    main: File | null;
    additional: File[];
  };
  video?: {
    file: File | null;
    icon: string;
    label: string;
  };
}

export default function CreateCarListing() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [carData, setCarData] = useState<CarFormData>({
    brand: '',
    model: '',
    description: '',
    price: 0,
    year: new Date().getFullYear(),
    miles: '',
    mileage: '',
    fuel: '',
    transmission: 'Automatic',
    body_type: '',
    pros: [],
    cons: [],
    features: [
      { icon: 'img_calendar.svg', label: 'Year', value: '' },
      { icon: 'img_mileage.svg', label: 'Mileage', value: '' },
      { icon: 'img_transmission.svg', label: 'Transmission', value: '' },
      { icon: 'img_fuel.svg', label: 'Fuel', value: '' },
      { icon: 'img_offer.svg', label: 'Offer', value: 'Make an Offer Price' }
    ],
    badges: [
      {
        color: 'blue-400',
        label: 'Best Seller',
        textColor: 'white'
      }
    ],
    dimensions_capacity: [],
    engine_transmission_details: [],
    images: {
      main: null,
      additional: []
    }
  });

  const handleMainImageUpload = (file: File) => {
    setCarData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        main: file
      }
    }));
  };

  const handleAdditionalImagesUpload = (files: FileList) => {
    setCarData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        additional: Array.from(files)
      }
    }));
  };

  const handleVideoUpload = (file: File) => {
    setCarData(prev => ({
      ...prev,
      video: {
        file,
        icon: 'img_video_icon.svg',
        label: 'Video'
      }
    }));
  };

  const generateCarDetails = async () => {
    try {
      const specs = {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        fuel: carData.fuel,
        transmission: carData.transmission,
        body_type: carData.body_type,
        mileage: carData.mileage,
        price: carData.price,
        miles: carData.miles
      };

      const response = await fetch('/api/generate-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: carData.brand,
          model: carData.model,
          year: carData.year,
          specs
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate car details');
      }
      const data = await response.json();
      console.log("response data ", data);

      // Update car data with generated information
      setCarData(prev => ({
        ...prev,
        pros: data.pros,
        cons: data.cons,
        engine_transmission_details: [
          { label: 'Engine Type', value: data.additionalFeatures.performance },
          { label: 'Horsepower', value: data.additionalFeatures.performance },
          { label: 'Torque', value: data.additionalFeatures.performance },
          { label: 'Transmission', value: carData.transmission },
          { label: 'Drivetrain', value: data.additionalFeatures.performance },
          { label: 'Fuel Economy', value: carData.mileage },
          { label: 'Emissions', value: data.additionalFeatures.environmentalImpact }
        ],
        dimensions_capacity: [
          { label: 'Width', value: '2300mm' },
          { label: 'Width (including mirrors)', value: '2400mm' },
          { label: 'Gross Vehicle Weight (kg)', value: '2800' },
          { label: 'Max. Loading Weight (kg)', value: '1500' },
          { label: 'Max. Roof Load (kg)', value: '500' },
          { label: 'No. of Seats', value: '5' }
        ]
      }));

      return true;
    } catch (error) {
      console.error('Error generating car details:', error);
      return false;
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);
      setSuccess(null);

      // First, upload all images
      const uploadImage = async (file: File) => {
        // const formData = new FormData();
        // formData.append('files', file);

        // const uploadResponse = await fetch(`/api/upload`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
        //   },
        //   body: formData
        // });

        // if (!uploadResponse.ok) {
        //   throw new Error('Failed to upload image');
        // }

        // return await uploadResponse.json();
      };

      // Upload main image
      let mainImageId = null;
      if (carData.images.main) {
        const mainImageData = await uploadImage(carData.images.main);
        mainImageId = mainImageData[0]?.id ?? null;
      }

      // Upload additional images
      const additionalImageIds = await Promise.all(
        carData.images?.additional.map(file => uploadImage(file))
      );

      // Upload video if exists
      let videoId = null;
      if (carData.video?.file) {
        const videoData = await uploadImage(carData.video.file);
        videoId = videoData[0]?.id ?? null;
      }

      // Prepare the data for the API
      const listingData = {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        specs: {
          price: carData.price,
          miles: carData.miles,
          mileage: carData.mileage,
          fuel: carData.fuel,
          transmission: carData.transmission,
          body_type: carData.body_type
        },
        images: {
          main: mainImageId,
          additional: additionalImageIds.map(img => img[0].id)
        },
        video: videoId ? {
          id: videoId,
          icon: 'img_video_icon.svg',
          label: 'Video'
        } : null
      };

      // Send to our new API endpoint
      const response = await fetch('/api/addListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create car listing');
      }

      setSuccess('Car listing published successfully! Redirecting...');
      setTimeout(() => {
        router.push('/car-listing');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to publish car listing');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-[10%]  bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8">Create New Car Listing</h1>

      <div className="space-y-6">
        {/* Basic Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  value={carData.brand}
                  onChange={e => setCarData(prev => ({ ...prev, brand: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="e.g. Ford"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={carData.model}
                  onChange={e => setCarData(prev => ({ ...prev, model: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="e.g. F-150"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={carData.description}
                onChange={e => setCarData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 w-full p-2 border rounded-md"
                rows={3}
                placeholder="Brief description of the vehicle"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  value={carData.price}
                  onChange={e => setCarData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="55000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  value={carData.year}
                  onChange={e => setCarData(prev => ({ ...prev, year: Number(e.target.value) }))}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="2022"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Miles</label>
                <input
                  type="text"
                  value={carData.miles}
                  onChange={e => setCarData(prev => ({ ...prev, miles: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="10,000 miles"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mileage</label>
                <input
                  type="text"
                  value={carData.mileage}
                  onChange={e => setCarData(prev => ({ ...prev, mileage: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="20 MPG City / 25 MPG Highway"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Images and Video */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Images & Video</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Main Image</label>
              <input
                type="file"
                ref={mainImageRef}
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleMainImageUpload(file);
                }}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Images</label>
              <input
                type="file"
                ref={additionalImagesRef}
                accept="image/*"
                multiple
                onChange={e => {
                  if (e.target.files) handleAdditionalImagesUpload(e.target.files);
                }}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Video (optional)</label>
              <input
                type="file"
                ref={videoRef}
                accept="video/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                }}
                className="mt-1 w-full"
              />
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Specifications</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
              <input
                type="text"
                value={carData.fuel}
                onChange={e => setCarData(prev => ({ ...prev, fuel: e.target.value }))}
                className="mt-1 w-full p-2 border rounded-md"
                placeholder="e.g. Gasoline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Transmission</label>
              <select
                value={carData.transmission}
                onChange={e => setCarData(prev => ({ ...prev, transmission: e.target.value }))}
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Body Type</label>
              <input
                type="text"
                value={carData.body_type}
                onChange={e => setCarData(prev => ({ ...prev, body_type: e.target.value }))}
                className="mt-1 w-full p-2 border rounded-md"
                placeholder="e.g. Pickup Truck"
              />
            </div>
          </div>
        </section>

        {/* Note about AI Generation */}
        <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
          <p>Pros, cons, and detailed specifications will be automatically generated based on the provided information when you publish the listing.</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-blue-100 text-blue-700 rounded-md">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 
              ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPublishing ? 'Publishing...' : 'Publish Car Listing'}
          </button>
        </div>
      </div>
    </div>
  );
} 