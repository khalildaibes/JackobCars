"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

interface CarGroupSignupFormData {
  plateNumber: string;
  phoneNumber: string;
  ownerName: string;
  carNickname?: string;
}

interface ToastMessage {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function CarGroupSignup() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  
  // React state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [formData, setFormData] = useState<CarGroupSignupFormData>({
    plateNumber: "",
    phoneNumber: "",
    ownerName: "",
    carNickname: "",
  });
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (field: keyof CarGroupSignupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setIsSubmitting(true);

    try {
      // Simulate form processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate form data
      if (!formData.plateNumber || !formData.phoneNumber || !formData.ownerName) {
        throw new Error('Please fill in all required fields');
      }

      // Validate plate number
      if (formData.plateNumber.length < 3) {
        throw new Error('Please enter a valid plate number');
      }

      // Validate phone number (Israeli format)
      const phoneRegex = /^05[02348]\d{7}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        throw new Error('Please enter a valid mobile number (050/052/053/054/058)');
      }

      // Show success message
      setToastMessage({
        type: 'success',
        title: 'Success!',
        message: 'Thank you for joining our car group! We will contact you soon.'
      });
      
      // Reset form
      setFormData({
        plateNumber: "",
        phoneNumber: "",
        ownerName: "",
        carNickname: "",
      });
    } catch (error: any) {
      setToastMessage({
        type: 'error',
        title: 'Error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <section className="w-full py-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-12 bg-gradient-to-br from-blue-50 to-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`bg-blue-600 p-3 rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <span className="text-white text-lg">🚗</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Join Our Car Community
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow car enthusiasts, share experiences, and stay updated with the latest automotive news and events.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="shadow-lg border-0 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📝</span>
                Sign Up for Car Group
              </h3>
              <p className="text-gray-600 mt-2">
                Fill out the form below to join our exclusive car community and receive updates about events, meetups, and special offers.
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>🔢</span>
                      License Plate Number
                    </label>
                    <input
                      type="text"
                      value={formData.plateNumber}
                      onChange={(e) => handleInputChange('plateNumber', e.target.value.toUpperCase())}
                      placeholder="Enter your plate number"
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter your vehicle's license plate number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>📞</span>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="050-1234567"
                      required
                      pattern="^05[02348]\d{7}$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Israeli mobile number (050/052/053/054/058)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>👤</span>
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      minLength={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Your full name as it appears on your license
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>🚗</span>
                      Car Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.carNickname}
                      onChange={(e) => handleInputChange('carNickname', e.target.value)}
                      placeholder="My beloved car"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Give your car a fun nickname
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <span>👥</span>
                        Join Car Group
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Toast Message - Pure React */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            toastMessage.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {toastMessage.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">{toastMessage.title}</h3>
                <p className="text-sm mt-1">{toastMessage.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={closeToast}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">👥</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              Connect with fellow car enthusiasts and share your passion for automobiles
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🚗</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Events</h3>
            <p className="text-gray-600 text-sm">
              Get notified about car shows, meetups, and exclusive automotive events
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📞</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-gray-600 text-sm">
              Access to expert advice, maintenance tips, and technical support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 