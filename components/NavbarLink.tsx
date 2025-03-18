
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "../app/lib/utils"
;

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ href, children, className }) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "px-4 py-2 text-sm font-medium hover:bg-blue-600-50 rounded-md transition-colors", 
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavbarLink;
