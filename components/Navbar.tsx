"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import UserMenu from "./UserMenu";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import AccessibilityControls from "./AccessibilityControls";
import { authService } from "../services/authService";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [textColor, setTextColor] = useState('text-white/80');
  const router = useRouter();
  const t = useTranslations("Navbar");

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Function to check if background is light
    const checkBackgroundColor = () => {
      // Get the navbar element
      const nav = document.querySelector('nav');
      if (!nav) return;

      // Get the navbar's position and dimensions
      const navRect = nav.getBoundingClientRect();
      
      // Check multiple points to get a better average
      const points = [
        { x: navRect.left + navRect.width / 2, y: navRect.top + navRect.height / 2 },
        { x: navRect.left + navRect.width / 4, y: navRect.top + navRect.height / 2 },
        { x: navRect.left + (navRect.width * 3) / 4, y: navRect.top + navRect.height / 2 }
      ];

      let totalBrightness = 0;
      let validPoints = 0;

      points.forEach(point => {
        const element = document.elementFromPoint(point.x, point.y);
        if (!element) return;

        // Skip if the element is the navbar itself
        if (element.closest('nav')) return;

        const style = window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        
        // Convert RGB to brightness
        const rgb = backgroundColor.match(/\d+/g);
        if (!rgb) return;
        
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        totalBrightness += brightness;
        validPoints++;
      });

      if (validPoints === 0) return;

      // Calculate average brightness
      const averageBrightness = totalBrightness / validPoints;
      
      // If background is light, use black text
      setTextColor(averageBrightness > 128 ? 'text-white/80 hover:text-white' : 'text-white/80 hover:text-white');
    };

    // Initial check
    checkBackgroundColor();

    // Create a MutationObserver to watch for style changes
    const observer = new MutationObserver(checkBackgroundColor);
    
    // Observe the entire document for changes
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true 
    });

    // Check on scroll and resize
    window.addEventListener('scroll', checkBackgroundColor);
    window.addEventListener('resize', checkBackgroundColor);

    // Also check periodically to catch any missed updates
    const interval = setInterval(checkBackgroundColor, 1000);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkBackgroundColor);
      window.removeEventListener('resize', checkBackgroundColor);
      clearInterval(interval);
    };
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

  const dropdownItems = {
    carsMarket: [
      { label: t("dropdown.cars_market.new_cars"), href: "/car-listing" },
      { label: t("dropdown.cars_market.used_cars"), href: "/car-listing" },
      { label: t("dropdown.cars_market.electric_vehicles"), href: "/car-listing" },
      { label: t("dropdown.cars_market.luxury_cars"), href: "/car-listing" }
    ],
    plate_search: [
      { label: t("dropdown.find_by_plate.plate_search"), href: "/plate_search" },
      // { label: t("dropdown.find_by_plate.vehicle_history"), href: "/plate_search" },
      // { label: t("dropdown.find_by_plate.ownership_check"), href: "/plate_search" }
    ],
    news: [
      { label: t("dropdown.news.latest_news"), href: "/news/?category=latest" },
      { label: t("dropdown.news.car_reviews"), href: "/news/?category=reviews" },
      { label: t("dropdown.news.industry_updates"), href: "/news/?category=industry" }
    ],
    after_market: [
      { label: t("dropdown.after_market.parts_accessories"), href: "/after_market?category=parts" },
      { label: t("dropdown.after_market.service_centers"), href: "/after_market?category=service-centers" },
      { label: t("dropdown.after_market.maintenance_tips"), href: "/after_market?category=maintenance-tips" }
    ],
    compareCars: [
      { label: t("dropdown.comparison.compare_models"), href: "/compareCars?category=models" },
      { label: t("dropdown.comparison.price_comparison"), href: "/compareCars?category=prices" },
      { label: t("dropdown.comparison.feature_comparison"), href: "/compareCars?category=features" }
    ],
    stores: [
      { label: t("dropdown.stores.find_dealers"), href: "/stores" },
      { label: t("dropdown.stores.service_centers"), href: "/stores?category=service-centers" },
      { label: t("dropdown.stores.parts_stores"), href: "/stores?category=parts-stores" }
    ]
  };

  const buttonStyles = {
    carsMarket: "text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5",
    plate_search: "text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5",
    news: "text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5",
    after_market: "text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5",
    compareCars: "text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5",
    stores: "text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5"
  };

  const NavButton = ({ href, gradient, children, dropdownKey }: { 
    href: string; 
    gradient: string; 
    children: React.ReactNode;
    dropdownKey: keyof typeof dropdownItems;
  }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    const handleClick = (e: React.MouseEvent) => {
      if (isMobile) {
        e.preventDefault();
        setMobileDropdown(mobileDropdown === dropdownKey ? null : dropdownKey);
      }
    };

    return (
      <div className="relative group rounded-xl">
        <Link href={href} className="w-full" onClick={handleClick}>
          <button 
            className={`
              relative group overflow-hidden
              px-4 py-2 rounded-xl
              font-medium md:font-bold
              ${gradient}
              transition-all duration-300
              transform hover:scale-[1.02]
              shadow-[0_2px_8px_rgba(0,0,0,0.1)]
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
              active:scale-[0.98]
              w-full
              max-h-[60]
              min-h-[60px]
              
              flex items-center justify-center gap-2
              text-base md:text-xl lg:text-sm
              leading-tight
              
            `}
            onMouseEnter={() => !isMobile && setActiveDropdown(dropdownKey)}
            onMouseLeave={() => !isMobile && setActiveDropdown(null)}
          >
            <span className="relative z-10 text-center line-clamp-2 h-[30px]">{children}</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${
                (isMobile ? mobileDropdown === dropdownKey : activeDropdown === dropdownKey) 
                  ? 'rotate-180' 
                  : ''
              }`} 
            />
            <div 
              className="absolute inset-0 w-full h-full 
              bg-gradient-to-r from-white/0 via-white/[0.1] to-white/0
              transform -translate-x-full group-hover:translate-x-full 
              transition-transform duration-1000"
            />
          </button>
        </Link>
        
        {/* Dropdown Menu */}
        <div 
          className={`
            ${isMobile ? 'relative w-full' : 'absolute top-full left-0 w-48'}
            bg-black/80 backdrop-blur-lg
            rounded-xl shadow-lg
            overflow-hidden
            transition-all duration-300
            ${(isMobile ? mobileDropdown === dropdownKey : activeDropdown === dropdownKey) 
              ? 'opacity-100 visible max-h-[500px]' 
              : 'opacity-0 invisible max-h-0'}
            transform ${(isMobile ? mobileDropdown === dropdownKey : activeDropdown === dropdownKey) 
              ? 'translate-y-0' 
              : 'translate-y-2'}
            z-50
          `}
          onMouseEnter={() => !isMobile && setActiveDropdown(dropdownKey)}
          onMouseLeave={() => !isMobile && setActiveDropdown(null)}
        >
          <div className={`${isMobile ? 'container mx-auto px-4 ' : ''}`}>
            {dropdownItems[dropdownKey].map((item, index) => (
              <Link 
                key={index}
                href={item.href}
                className={`
                  block px-4 py-3 
                  ${textColor} hover:bg-white/5/20 
                  transition-all duration-500 ease-in-out
                  ${isMobile ? 'text-lg' : ''}
                  border-b border-white/10 last:border-b-0
                `}
                onClick={() => {
                  setIsMenuOpen(false);
                  setMobileDropdown(null);
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add a class to the navbar based on the text color
  const navbarClass = `fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md z-50 ${textColor}`;

  return (
    <nav className={navbarClass}>
      <AccessibilityControls />
      <div className="container mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="min-w-[80px] h-16 flex items-center justify-center rounded-2xl p-2 transition-all hover:scale-105 bg-white">
            <Image src="/logo-transparent-1.png" alt={t("logo_alt")} width={80} height={200} className="object-fill w-[60px] md:w-[80px] p-[2px]" />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white/80 hover:text-white hover:bg-white/5/10 p-2 rounded-full transition-all duration-500 ease-in-out"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links (Responsive) */}
        <div
          className={`
            ${isMenuOpen ? "flex" : "hidden"}
            md:flex flex-col md:flex-row gap-4 items-stretch md:items-center 
            absolute md:static top-20 left-0 w-full md:w-auto 
            bg-black/50 md:bg-transparent backdrop-blur-lg
            p-6 md:p-0 
            transition-all duration-300 ease-in-out
          `}
        >
          {Object.keys(dropdownItems).map((key) => (
            <NavButton 
              key={key}
              href={`/${key}`}
              gradient={buttonStyles[key as keyof typeof buttonStyles]}
              dropdownKey={key as keyof typeof dropdownItems}
            >
              {t(key)}
            </NavButton>
          ))}
          <div className="md:hidden w-full mt-4 ">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} isMobile={true} />
            ) : (
              <Button 
                variant="outline" 
                className="text-white/80  border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out w-full bg-white/5 rounded-xl"
              >
                {t("login")}
              </Button>
            )}
          </div>

          <div className="md:hidden w-full mt-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Button 
              variant="outline" 
              className="text-white/80 border-transparent hover:border-white/80 hover:text-white transition-all duration-500 ease-in-out bg-white/5 rounded-xl"
            >
              {t("login")}
            </Button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
