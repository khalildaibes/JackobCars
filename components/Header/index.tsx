"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, User, Car } from "lucide-react";
import { Button } from "../Button/index";

interface Props {
  className?: string;
}

export default function Header({ className, ...props }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { label: "Reviews", href: "/reviews" },
    { label: "News", href: "/news" },
    { label: "Cars", href: "/cars" },
    { label: "Buying Guide", href: "/buying-guide" },
    { label: "Research", href: "/research" },
    { label: "Videos", href: "/videos" }
  ];

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className={`cd-header ${className || ''}`} {...props}>
      <div className="cd-header-content">
        {/* Logo */}
        <Link href="/" className="cd-logo">
          <div className="flex items-center gap-2">
            <Car className="w-8 h-8 text-red-600" />
            <span className="font-bold text-xl tracking-tight">
              Car<span className="text-red-600">&</span>Driver
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="cd-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`cd-nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Sign In */}
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Sign In</span>
          </Link>

          {/* Submit Listing Button */}
          <Link href="/car-listing/create">
            <button className="cd-btn cd-btn-primary">
              List Your Car
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="cd-mobile-nav">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/" className="cd-logo" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2">
                  <Car className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-lg">Car&Driver</span>
                </div>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto">
              <div className="px-4 py-6 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                      isActiveLink(item.href) 
                        ? 'bg-red-50 text-red-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="px-4 py-6 border-t border-gray-200 space-y-4">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>

                <Link 
                  href="/car-listing/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <button className="cd-btn cd-btn-primary w-full">
                    List Your Car
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export { Header };
