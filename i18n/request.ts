import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
 
export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
// Get the cookies from the incoming request
const cookieStore = cookies();
// Try to read the locale from a cookie named "NEXT_LOCALE"
const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

// Fallback to a default locale if no cookie is set
const locale = cookieLocale ?? 'en';
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});