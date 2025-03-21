"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "../constants";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="flex flex-col text-black-100 mt-5 border-t border-gray-100">
      <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
        <div className="flex flex-col justify-start items-start gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="min-w-[80px] h-16 flex items-center justify-center rounded-2xl bg-white/90 p-2 transition-all hover:scale-105">
              <Image
                src="/logo-transparent.png"
                alt="logo"
                width={118}
                height={18}
                className="object-contain"
              />
            </div>
          </Link>

          <p className="text-base text-gray-700">
            K.D Technology Solutions 2025 <br />
            {t('all_rights_reserved')} &copy;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">{t(section.title.toLowerCase())}</h3>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link
                    key={link.title}
                    href={link.url}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    target={link.url.startsWith('http') ? '_blank' : '_self'}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {t(link.title.toLowerCase().replace(' ', '_'))}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap mt-10 border-t border-gray-100 sm:px-16 px-6 py-10">
        <p className="text-gray-500">
          @2025 K.D Technology Solutions. {t('all_rights_reserved')}
        </p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-800 transition-colors">
            {t('privacy_policy')}
          </Link>
          <Link href="/terms-of-use" className="text-gray-500 hover:text-gray-800 transition-colors">
            {t('terms_of_use')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
