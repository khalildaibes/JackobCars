'use client';

import React, { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon, XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

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
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label="Accessibility Controls"
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Accessibility</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Text Size</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFontSizeChange(false)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Decrease text size"
                >
                  <ArrowsPointingInIcon className="h-4 w-4" />
                </button>
                <span className="text-sm">{settings.fontSize}%</span>
                <button
                  onClick={() => handleFontSizeChange(true)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Increase text size"
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={toggleContrast}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
            >
              <span>High Contrast</span>
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