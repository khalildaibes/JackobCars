export const locales = ['en', 'ar', 'he-IL'] as const;
export const defaultLocale = 'ar';

export type Locale = typeof locales[number];

/**
 * Generate a shareable link with a specific locale
 * @param path - The path without locale (e.g., '/news', '/car-details/my-car')
 * @param locale - The target locale
 * @param baseUrl - Optional base URL for absolute links
 * @returns The complete URL with locale
 */
export function generateLocaleLink(
  path: string, 
  locale: Locale = defaultLocale, 
  baseUrl?: string
): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Generate the localized path
  const localizedPath = `/${locale}${cleanPath}`;
  
  // Return absolute URL if baseUrl provided, otherwise relative
  return baseUrl ? `${baseUrl}${localizedPath}` : localizedPath;
}

/**
 * Generate shareable links for all supported locales
 * @param path - The path without locale
 * @param baseUrl - Optional base URL for absolute links
 * @returns Object with locale as key and URL as value
 */
export function generateAllLocaleLinks(path: string, baseUrl?: string): Record<Locale, string> {
  return locales.reduce((acc, locale) => {
    acc[locale] = generateLocaleLink(path, locale, baseUrl);
    return acc;
  }, {} as Record<Locale, string>);
}

/**
 * Get the current locale from pathname
 * @param pathname - The current pathname
 * @returns The extracted locale or default locale
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

/**
 * Remove locale from pathname
 * @param pathname - The pathname with locale
 * @returns The pathname without locale
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (locales.includes(firstSegment as Locale)) {
    return `/${segments.slice(2).join('/')}`;
  }
  
  return pathname;
}

/**
 * Switch current URL to a different locale
 * @param currentPathname - Current pathname with locale
 * @param targetLocale - Target locale to switch to
 * @returns New pathname with target locale
 */
export function switchLocale(currentPathname: string, targetLocale: Locale): string {
  const pathWithoutLocale = removeLocaleFromPathname(currentPathname);
  return generateLocaleLink(pathWithoutLocale, targetLocale);
}

/**
 * Get shareable URL for the current page
 * @param pathname - Current pathname
 * @param locale - Target locale
 * @param search - URL search params
 * @param baseUrl - Base URL (usually window.location.origin)
 * @returns Complete shareable URL
 */
export function getShareableUrl(
  pathname: string, 
  locale: Locale = defaultLocale, 
  search = '', 
  baseUrl = ''
): string {
  const pathWithoutLocale = removeLocaleFromPathname(pathname);
  const localizedPath = generateLocaleLink(pathWithoutLocale, locale);
  const fullPath = search ? `${localizedPath}${search}` : localizedPath;
  
  return baseUrl ? `${baseUrl}${fullPath}` : fullPath;
} 