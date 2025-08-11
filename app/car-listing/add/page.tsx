import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import AddCarListingForm from './AddCarListingForm';

export default function AddCarListingPage() {
  const t = useTranslations('CarListing');
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg">
            <img src="/img_icon_indigo_a400.png" alt="Car" className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('add_car_listing')}</h1>
            <p className="text-gray-600">{t('fill_details')}</p>
          </div>
        </div>

        {/* Progress Steps Header */}
        <div className="mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Car Listing Wizard</h2>
            <p className="text-gray-600">Complete all steps to create your car listing</p>
          </div>
        </div>

        {/* Client Component for Interactive Form */}
        <AddCarListingForm />
      </div>
    </div>
  );
} 