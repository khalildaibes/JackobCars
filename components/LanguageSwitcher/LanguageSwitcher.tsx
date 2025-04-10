"use client";
import React, { useEffect } from "react";

const LanguageSwitcher = () => {
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "he-IL", label: "עברית" },
  ];

  // Read the current locale from cookie (if available), default to "en"
  const getCurrentLocale = (): string => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    return match ? match[1] : "ar";
  };

  const [currentLocale, setCurrentLocale] = React.useState(getCurrentLocale());

  // Set the site's text direction based on the current locale.
  useEffect(() => {
    // if the current locale is not "en", set the direction to rtl; otherwise, ltr
    document.documentElement.setAttribute("dir", currentLocale !== "en" ? "rtl" : "ltr");
  }, [currentLocale]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    // Set the cookie so next-intl (or your app) can pick up the new locale
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/;`;
    setCurrentLocale(newLocale);
    // Reload the page so that the provider can re-read the new locale and update the direction
    window.location.reload();
  };

  return (
    <select 
      value={currentLocale} 
      onChange={handleChange}
      className="bg-white px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
