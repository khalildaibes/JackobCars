"use client";

import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PartsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Extract locale from the pathname (e.g., /ar/stores/... or /he-IL/stores/...)
  const locale = pathname.split('/')[1] || 'ar'; // Default to 'ar' if not found

  return (
    <NextIntlClientProvider locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
} 