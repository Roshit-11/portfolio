import React from 'react';
import { Heart, Code, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Roshit Lamichhane</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Passionate Web Developer & AI Student from Kathmandu, Nepal
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-6">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>and</span>
            <Code className="w-4 h-4 text-blue-500" />
            <span>fueled by</span>
            <Coffee className="w-4 h-4 text-yellow-600" />
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">
              © {currentYear} Roshit Lamichhane. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;