import React from 'react';
import { Wind } from 'lucide-react';

const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('signature-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-black text-white py-3 px-4 sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="bg-white p-1.5 rounded-lg flex-shrink-0">
            <Wind className="w-6 h-6 md:w-8 md:h-8 text-black" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-2xl font-black tracking-tight truncate">SAAF HAWA</h1>
            <p className="text-xs text-gray-400 tracking-wide font-normal hindi-text hidden sm:block">साफ़ हवा</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
          <a href="#problem" className="hidden md:block hover:text-gray-300 transition-colors font-semibold">The Problem</a>
          <a href="#petition" className="hidden md:block hover:text-gray-300 transition-colors font-semibold">The Petition</a>
          <button 
            onClick={scrollToForm}
            className="bg-white text-black px-4 py-2 md:px-6 md:py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Sign Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;