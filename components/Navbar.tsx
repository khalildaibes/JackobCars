"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import UserMenu from "./UserMenu";
import { Menu, X } from "lucide-react";
import { authService } from "../app/services/authService";

const buttonStyles = {
  carsMarket: "from-blue-600 to-blue-400 hover:from-slate-200 hover:to-slate-400",
  findByPlate: "from-blue-600 to-blue-400 hover:from-slate-200 hover:to-slate-400", 
  news: "from-blue-600 to-blue-400 hover:from-slate-200 hover:to-slate-400",
  afterMarket: "from-blue-600 to-blue-400 hover:from-slate-200 hover:to-slate-400",
  comparison: "from-blue-600 to-blue-400 hover:from-slate-200 hover:to-slate-400",
  stores: "from-blue-600 to-blue-400 hover:from-slate-200 hover:to-slate-400"
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const t = useTranslations("Navbar");

  useEffect(() => {
    // Get user from cookies on component mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 ">
      {/* Main Container */}
      <div className="container mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 ">
          <div className="min-w-[80px] h-16 flex items-center justify-center rounded-2xl p-2 transition-all hover:scale-105">
            <Image src="/logo-transparent-1.png" alt={t("logo_alt")} width={80} height={200} className="object-fill w-[60px] md:w-[80px]" />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black hover:bg-gray-100 p-2 rounded-full transition-colors"
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
          border-t md:border-t-0 border-gray-100 text-black`}
        >
          <NavButton href="/car-listing" gradient={buttonStyles.carsMarket}>
            <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
              {t("cars_market")}
            </span>
          </NavButton>
          <NavButton href="/findcarbyplate" gradient={buttonStyles.findByPlate}>
            <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
              {t("find_by_plate")}
            </span>
          </NavButton>
          <NavButton href="/news" gradient={buttonStyles.news}>
            <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
              {t("news")}
            </span>
          </NavButton>
          <NavButton href="/after_market" gradient={buttonStyles.afterMarket}>
            <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
              {t("after_market")}
            </span>
          </NavButton>
          <NavButton href="/comparison" gradient={buttonStyles.comparison}>
            <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
              {t("compare_cars")}
            </span>
          </NavButton>
          <NavButton href="/stores" gradient={buttonStyles.stores}>
            <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
              {t("stores")}
            </span>
          </NavButton>
          
          {/* Add UserMenu or Login Button for Mobile */}
          <div className="md:hidden w-full mt-4 text-black ">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} isMobile={true} />
            ) : (
              <NavButton href="/login" gradient={buttonStyles.carsMarket}>
                <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
                  {t("login")}
                </span>
              </NavButton>
            )}
          </div>

          {/* Language Switcher for Mobile */}
          <div className="md:hidden w-full mt-4 text-black">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4 text-black">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <NavButton href="/login" gradient={buttonStyles.carsMarket}>
              <span className="relative z-10 text-center line-clamp-2 text-black" lang="ar">
                {t("login")}
              </span>
            </NavButton>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
