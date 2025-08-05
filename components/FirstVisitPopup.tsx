"use client";

import React, { useState, useEffect } from 'react';
import { X, Car, Star, Shield, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FirstVisitPopupProps {
  onClose: () => void;
  isVisible?: boolean; 
}

const FirstVisitPopup: React.FC<FirstVisitPopupProps> = ({ onClose, isVisible = true }) => {
  const t = useTranslations("FirstVisitPopup");
  const [animate, setAnimate] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setAnimate(true), 100);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        .popup-backdrop {
          transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0;
        }
        .popup-backdrop.animate {
          opacity: 1;
        }
        .popup-overlay {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          height: 0;
          opacity: 0;
        }
        .popup-overlay.animate {
          height: 5vh;
          opacity: 1;
        }
        .popup-container {
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(0.7) translateY(100px) rotateX(-15deg);
          opacity: 0;
        }
        .popup-container.animate {
          transform: scale(1) translateY(0) rotateX(0);
          opacity: 1;
        }
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease-out;
        }
        .fade-in.animate {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-delay-1 { transition-delay: 0.6s; }
        .animate-delay-2 { transition-delay: 1.0s; }
        .animate-delay-3 { transition-delay: 1.4s; }
        .animate-delay-4 { transition-delay: 1.8s; }
        .animate-delay-5 { transition-delay: 2.2s; }
        .animate-delay-6 { transition-delay: 2.4s; }
        .animate-delay-7 { transition-delay: 2.8s; }
        .animate-delay-8 { transition-delay: 3.2s; }
        .animate-delay-9 { transition-delay: 3.4s; }
        .animate-delay-10 { transition-delay: 3.7s; }
        .animate-delay-11 { transition-delay: 4.0s; }
        .animate-delay-12 { transition-delay: 4.3s; }
        .animate-delay-13 { transition-delay: 4.6s; }
        .animate-delay-14 { transition-delay: 4.8s; }
        .animate-delay-15 { transition-delay: 5.2s; }
        .animate-delay-16 { transition-delay: 5.5s; }
        .animate-delay-17 { transition-delay: 5.8s; }
        .animate-delay-18 { transition-delay: 6.0s; }
      `}</style>
      
      <div
        className={`popup-backdrop fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 ${animate ? 'animate' : ''}`}
        onClick={handleBackdropClick}
      >
        {/* 5% Height Overlay Div */}
        <div
          className={`popup-overlay fixed top-0 left-0 right-0 bg-gradient-to-b from-blue-600 to-blue-700 z-40 shadow-lg ${animate ? 'animate' : ''}`}
        />
        
        <div
          className={`popup-container bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative ${animate ? 'animate' : ''}`}
          onClick={(e) => e.stopPropagation()}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`fade-in animate-delay-18 absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 z-10 border-2 border-red-500 hover:scale-110 ${animate ? 'animate' : ''}`}
          >
            <X className="w-5 h-5 text-black" />
          </button>

          {/* Header with Logo/Image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-t-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className={`fade-in animate-delay-1 text-center text-white ${animate ? 'animate' : ''}`}>
                <div className={`fade-in animate-delay-2 ${animate ? 'animate' : ''}`}>
                  <Car className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h1 
                  className={`fade-in animate-delay-3 text-3xl font-bold text-black border-2 border-red-500 rounded-lg px-4 py-2 mb-4 ${animate ? 'animate' : ''}`}
                  style={{ backgroundColor: 'transparent' }}
                >
                  {t('welcome')}
                </h1>
                <p 
                  className={`fade-in animate-delay-4 text-lg text-black border-2 border-red-500 rounded-lg px-3 py-2 ${animate ? 'animate' : ''}`}
                  style={{ backgroundColor: 'transparent' }}
                >
                  {t('tagline')}
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className={`fade-in animate-delay-5 ${animate ? 'animate' : ''}`}>
              <h2 
                className={`fade-in animate-delay-6 text-2xl font-bold text-black mb-4 text-center border-2 border-red-500 rounded-lg px-4 py-2 ${animate ? 'animate' : ''}`}
                style={{ backgroundColor: 'transparent' }}
              >
                {t('title')}
              </h2>
              <p 
                className={`fade-in animate-delay-7 text-black text-center mb-6 border-2 border-red-500 rounded-lg px-4 py-3 ${animate ? 'animate' : ''}`}
                style={{ backgroundColor: 'transparent' }}
              >
                {t('description')}
              </p>
            </div>

            {/* Features */}
            <div className={`fade-in animate-delay-8 space-y-4 mb-6 ${animate ? 'animate' : ''}`}>
              <div className={`fade-in animate-delay-9 flex items-center gap-3 ${animate ? 'animate' : ''}`}>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div className="border-2 border-red-500 rounded-lg px-3 py-2" style={{ backgroundColor: 'transparent' }}>
                  <h3 className="font-semibold text-black">{t('verified_listings')}</h3>
                  <p className="text-sm text-black">{t('verified_listings_desc')}</p>
                </div>
              </div>

              <div className={`fade-in animate-delay-10 flex items-center gap-3 ${animate ? 'animate' : ''}`}>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="border-2 border-red-500 rounded-lg px-3 py-2" style={{ backgroundColor: 'transparent' }}>
                  <h3 className="font-semibold text-black">{t('trusted_service')}</h3>
                  <p className="text-sm text-black">{t('trusted_service_desc')}</p>
                </div>
              </div>

              <div className={`fade-in animate-delay-11 flex items-center gap-3 ${animate ? 'animate' : ''}`}>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="border-2 border-red-500 rounded-lg px-3 py-2" style={{ backgroundColor: 'transparent' }}>
                  <h3 className="font-semibold text-black">{t('expert_reviews')}</h3>
                  <p className="text-sm text-black">{t('expert_reviews_desc')}</p>
                </div>
              </div>

              <div className={`fade-in animate-delay-12 flex items-center gap-3 ${animate ? 'animate' : ''}`}>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="border-2 border-red-500 rounded-lg px-3 py-2" style={{ backgroundColor: 'transparent' }}>
                  <h3 className="font-semibold text-black">{t('community')}</h3>
                  <p className="text-sm text-black">{t('community_desc')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`fade-in animate-delay-13 space-y-3 ${animate ? 'animate' : ''}`}>
              <button
                onClick={onClose}
                className={`fade-in animate-delay-14 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-red-500 ${animate ? 'animate' : ''}`}
              >
                {t('start_exploring')}
              </button>
              
              <div className={`fade-in animate-delay-15 text-center ${animate ? 'animate' : ''}`}>
                <label className="flex items-center justify-center gap-2 text-sm text-black cursor-pointer border-2 border-red-500 rounded-lg px-3 py-2" style={{ backgroundColor: 'transparent' }}>
                  <input 
                    type="checkbox" 
                    className="rounded border-red-500" 
                    defaultChecked 
                  />
                  {t('dont_show_again')}
                </label>
              </div>
            </div>

            {/* Special Offer Badge */}
            <div className={`fade-in animate-delay-16 mt-4 p-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl text-center border-2 border-red-500 ${animate ? 'animate' : ''}`}>
              <p 
                className={`fade-in animate-delay-17 text-black font-semibold text-sm border border-red-600 rounded px-2 py-1 ${animate ? 'animate' : ''}`}
                style={{ backgroundColor: 'transparent' }}
              >
                {t('special_offer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstVisitPopup;