"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  user: {
    username: string;
    email: string;
  } | null;
  isMobile?: boolean;
  onLogout: () => void;
}

export default function UserMenu({ user, isMobile, onLogout }: UserMenuProps) {
  if (!user) return null;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("UserMenu");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: t("settings"),
      icon: <Settings className="w-5 h-5" />,
      href: "/settings"
    },
    {
      label: t("logout"),
      icon: <LogOut className="w-5 h-5" />,
      onClick: onLogout
    }
  ];

  const MenuContent = () => (
    <div className="py-2 w-full">
      <div className="px-4 py-2 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-900">{user.username}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      {menuItems.map((item, index) => (
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </button>
        )
      ))}
    </div>
  );

  if (isMobile) {
    return <MenuContent />;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-medium">{user.username}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <MenuContent />
        </div>
      )}
    </div>
  );
} 