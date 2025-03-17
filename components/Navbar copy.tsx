
import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="font-display text-2xl font-bold text-blue-800">AutoNews</a>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Home</a>
            <a href="/reviews" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Reviews</a>
            <a href="/news" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">News</a>
            <a href="/videos" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Videos</a>
            <a href="/electric" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">Electric</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-blue-600">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slideDown">
          <div className="flex flex-col py-4 px-6 space-y-4">
            <a href="/" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors py-2">Home</a>
            <a href="/reviews" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors py-2">Reviews</a>
            <a href="/news" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors py-2">News</a>
            <a href="/videos" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors py-2">Videos</a>
            <a href="/electric" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors py-2">Electric</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
