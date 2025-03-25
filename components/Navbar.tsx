"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import { Menu, X } from "lucide-react";

const buttonStyles = {
  carsMarket: "from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900",
  findByPlate: "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
  news: "from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700",
  afterMarket: "from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700",
  comparison: "from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600",
  stores: "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
};

export default function Navbar() {
const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navbar");

  const NavButton = ({ href, gradient, children }: { href: string; gradient: string; children: React.ReactNode }) => (
    <Link href={href} onClick={() => setIsMenuOpen(false)} className="w-full">
      <button 
        className={`
          relative group overflow-hidden
          px-4 py-2 rounded-xl
          text-white font-medium
          bg-gradient-to-br ${gradient}
          transition-all duration-300
          transform hover:scale-[1.02]
          shadow-[0_2px_8px_rgba(0,0,0,0.1)]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
          active:scale-[0.98]
          w-full
          max-h-[60]
          min-h-[60px]
          flex items-center justify-center
          text-base md:text-xl lg:text-sm
          leading-tight
        `}
      >
        <span className="relative z-10 text-center line-clamp-2">{children}</span>
        <div 
          className="absolute inset-0 w-full h-full 
          bg-gradient-to-r from-white/0 via-white/[0.1] to-white/0
          transform -translate-x-full group-hover:translate-x-full 
          transition-transform duration-1000"
        />
      </button>
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      {/* Main Container */}
      <div className="container mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="min-w-[80px] h-16 flex items-center justify-center rounded-2xl bg-white/90 p-2 transition-all hover:scale-105">
            <Image src="/logo-transparent.png" alt={t("logo_alt")} width={80} height={200} className="object-fill" />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links (Responsive) */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-4 items-stretch md:items-center absolute md:static top-20 left-0 w-full md:w-auto 
          bg-white/95 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none
          shadow-lg md:shadow-none p-6 md:p-0 
          transition-all duration-300 ease-in-out
          border-t md:border-t-0 border-gray-100`}
        >
          <NavButton href="/car-listing" gradient={buttonStyles.carsMarket}>
            {t("cars_market")}
          </NavButton>
          <NavButton href="/findcarbyplate" gradient={buttonStyles.findByPlate}>
            {t("find_by_plate")}
          </NavButton>
          <NavButton href="/news" gradient={buttonStyles.news}>
            {t("news")}
          </NavButton>
          <NavButton href="/after_market" gradient={buttonStyles.afterMarket}>
            {t("after_market")}
          </NavButton>
          <NavButton href="/comparison" gradient={buttonStyles.comparison}>
            {t("compare_cars")}
          </NavButton>
          <NavButton href="/stores" gradient={buttonStyles.stores}>
            {t("stores")}
          </NavButton>
          
          {/* Language Switcher for Mobile */}
          <div className="md:hidden w-full mt-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Language Switcher for Desktop */}
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
