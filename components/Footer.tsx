"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "../constants";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="flex flex-col  mt-5 border-t border-gray-100" lang="ar">
      <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
        <div className="flex flex-col justify-start items-start gap-6">
        

          <p className="text-base text-white">
            K.D Technology Solutions 2025 <br />
            {t('all_rights_reserved')} &copy;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-white">{t(section.title.toLowerCase())}</h3>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link
                    key={link.title}
                    href={link.url}
                    className="text-white hover:text-gray-300 transition-colors"
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
        <p className="text-white">
          @2025 K.D Technology Solutions. {t('all_rights_reserved')}
        </p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link href="/privacy-policy" className="text-white hover:text-gray-300 transition-colors">
            {t('privacy_policy')}
          </Link>
          <Link href="/terms-of-use" className="text-white hover:text-gray-300 transition-colors">
            {t('terms_of_use')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
