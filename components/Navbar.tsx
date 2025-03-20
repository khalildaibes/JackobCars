"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md pb-3 z-50">
      {/* Main Container */}
      <div className="container mx-auto max-w-screen-xl px-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="min-w-[200px] h-20 flex items-center justify-center rounded-full shadow-lg md:shadow-xl bg-white p-2 md:p-3">
            <Image src="/logo.svg" alt={t("logo_alt")} width={200} height={200} className="object-fill" />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Nav Links (Responsive) */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-4 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 transition-all`}
        >
          <Link href="/car-listing" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">
              {t("cars_market")}
            </button>
          </Link>
          <Link href="/findcarbyplate" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-royal-blue text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">
              {t("find_by_plate")}
            </button>
          </Link>
          <Link href="/news" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-navy-blue text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">
              {t("news")}
            </button>
          </Link>
          <Link href="/after_market" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">
              {t("after_market")}
            </button>
          </Link>
          <Link href="/comparison" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-royal-blue text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">
              {t("compare_cars")}
            </button>
          </Link>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
