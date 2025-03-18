
import React from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-600-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold mb-6">AutoNews</h2>
            <p className="text-blue-200 mb-6 max-w-md">
              Your premier destination for the latest automotive news, in-depth reviews, and industry insights.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-blue-200 hover:bg-blue-600-800">
                <FacebookIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-blue-200 hover:bg-blue-600-800">
                <TwitterIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-blue-200 hover:bg-blue-600-800">
                <InstagramIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-blue-200 hover:bg-blue-600-800">
                <LinkedinIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">News</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Subscribe</h3>
            <p className="text-blue-200 mb-4">Get the latest automotive news straight to your inbox.</p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-blue-600-800 border-blue-700 text-white placeholder:text-blue-300"
              />
              <Button className="bg-white text-blue-900 hover:bg-blue-600-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
          <p>© 2023 AutoNews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
