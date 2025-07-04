'use client';

import React, { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon, XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { BiHandicap } from 'react-icons/bi';

interface AccessibilitySettings {
  fontSize: number;
  contrast: 'normal' | 'high';
}

const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    contrast: 'normal',
  });

  const applyAccessibilitySettings = () => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    if (settings.contrast === 'high') {
      document.documentElement.style.setProperty('--text-color', '#000000');
      document.documentElement.style.setProperty('--background-color', '#FFFFFF');
    } else {
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--background-color');
    }
  };

  const handleFontSizeChange = (increment: boolean) => {
    setSettings(prev => {
      const newSize = increment 
        ? Math.min(prev.fontSize + 10, 200)
        : Math.max(prev.fontSize - 10, 50);
      return { ...prev, fontSize: newSize };
    });
  };

  const toggleContrast = () => {
    setSettings(prev => ({
      ...prev,
      contrast: prev.contrast === 'normal' ? 'high' : 'normal'
    }));
  };

  useEffect(() => {
    applyAccessibilitySettings();
  }, [settings]);

  return (
    <div className="relative flex items-start mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 w-14 h-14 flex items-center justify-center"
        aria-label="Accessibility Controls"
      >
        <BiHandicap className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-4 sm:p-6 border border-gray-100 animate-fadeIn
            w-[90vw] max-w-xs sm:w-auto sm:max-w-sm md:max-w-md md:w-80 lg:w-96 z-50
          "
          style={{
            boxSizing: 'border-box',
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Accessibility</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Close Accessibility Panel">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base">Text Size</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFontSizeChange(false)}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Decrease text size"
                >
                  <ArrowsPointingInIcon className="h-4 w-4" />
                </button>
                <span className="text-xs sm:text-sm">{settings.fontSize}%</span>
                <button
                  onClick={() => handleFontSizeChange(true)}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Increase text size"
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={toggleContrast}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-pressed={settings.contrast === 'high'}
            >
              <span className="text-sm sm:text-base">High Contrast</span>
              <div className={`ml-auto w-10 h-6 rounded-full relative ${settings.contrast === 'high' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.contrast === 'high' ? 'translate-x-4' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls; 