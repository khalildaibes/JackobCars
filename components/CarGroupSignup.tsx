"use client";

import { useTranslations, useLocale } from "next-intl";

interface CarGroupSignupFormData {
  plateNumber: string;
  phoneNumber: string;
  ownerName: string;
  carNickname?: string;
}

export default function CarGroupSignup() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {
      plateNumber: formData.get('plateNumber') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      ownerName: formData.get('ownerName') as string,
      carNickname: formData.get('carNickname') as string,
      locale: locale
    };

    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (!submitButton) return;
    
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <div class="flex items-center gap-2 justify-center">
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ${t('car_group_signup_button_loading')}
      </div>
    `;

    try {
      const response = await fetch("/api/car-group-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      // Show success message
      showToast('success', t('car_group_signup_success_title'), result.message || t('car_group_signup_success'));
      
      // Reset form safely
      if (form && typeof form.reset === 'function') {
        form.reset();
      }
    } catch (error: any) {
      showToast('error', t('car_group_signup_error_title'), error.message || t('car_group_signup_error'));
    } finally {
      // Restore button safely
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = `
          <div class="flex items-center gap-2 justify-center">
            <span>👥</span>
            ${t('car_group_signup_button')}
          </div>
        `;
      }
    }
  };

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    // Remove existing toast
    const existingToast = document.getElementById('toast-message');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' 
        ? 'bg-green-100 border border-green-400 text-green-700' 
        : 'bg-red-100 border border-red-400 text-red-700'
    }`;
    
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${type === 'success' ? 
            '<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>' :
            '<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>'
          }
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium">${title}</h3>
          <p class="text-sm mt-1">${message}</p>
        </div>
        <div class="ml-auto pl-3">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="inline-flex text-gray-400 hover:text-gray-600">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  const handlePlateNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      event.target.value = event.target.value.toUpperCase();
    }
  };

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
              {t('car_group_title')}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('car_group_description')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="shadow-lg border-0 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📝</span>
                {t('car_group_signup_title')}
              </h3>
              <p className="text-gray-600 mt-2">
                {t('car_group_signup_description')}
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>🔢</span>
                      {t('car_group_signup_plate_label')}
                    </label>
                    <input
                      type="text"
                      name="plateNumber"
                      placeholder={t('car_group_signup_plate_placeholder')}
                      onChange={handlePlateNumberChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('car_group_signup_plate_description')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>📞</span>
                      {t('car_group_signup_phone_label')}
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder={t('car_group_signup_phone_placeholder')}
                      required
                      pattern="^05[02348]\d{7}$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('car_group_signup_phone_description')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>👤</span>
                      {t('car_group_signup_owner_label')}
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      placeholder={t('car_group_signup_owner_placeholder')}
                      required
                      minLength={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('car_group_signup_owner_description')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>🚗</span>
                      {t('car_group_signup_nickname_label')}
                    </label>
                    <input
                      type="text"
                      name="carNickname"
                      placeholder={t('car_group_signup_nickname_placeholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('car_group_signup_nickname_description')}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <span>👥</span>
                      {t('car_group_signup_button')}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">👥</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('car_group_benefits_community')}</h3>
            <p className="text-gray-600 text-sm">
              {t('car_group_benefits_community_desc')}
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🚗</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('car_group_benefits_events')}</h3>
            <p className="text-gray-600 text-sm">
              {t('car_group_benefits_events_desc')}
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📞</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('car_group_benefits_support')}</h3>
            <p className="text-gray-600 text-sm">
              {t('car_group_benefits_support_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 