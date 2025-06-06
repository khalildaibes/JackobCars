import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

interface PriceDisplayProps {
  price: number | string;
  className?: string;
  showCurrency?: boolean;
}

const PriceDisplay = ({ 
  price, 
  className = 'text-2xl font-bold text-blue-600 mb-2', 
  showCurrency = true 
}: PriceDisplayProps) => {
  const locale = useLocale();
  const t = useTranslations('CarListing');

  // Convert price to number and remove any non-numeric characters
  const numericPrice = parseInt(price.toString().replace(/[^0-9]/g, ''));
  
  // Convert price based on locale
  const convertedPrice = locale === 'ar' 
    ? (numericPrice )  // ILS
    : locale === 'en'
    ? (numericPrice * 0.27)  // ILS to USD 
    : numericPrice;  // Keep as ILS

  // Format the number with commas for thousands
  const formattedPrice = Number(convertedPrice).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  // Get currency symbol from translations
  const currencySymbol = t('currency_symbol');

  return (
    <span className={`font-semibold ${className}`}>
      {locale === 'ar' ? (
        <>
          {formattedPrice}
          {showCurrency && <span className="mr-1"> {currencySymbol} </span>}
        </>
      ) : (
        <>
          {showCurrency && <span className="ml-1"> {currencySymbol} </span>}
          {formattedPrice}
        </>
      )}
    </span>
  );
};

export default PriceDisplay; 