import React from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection = ({ onSignClick }) => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(https://customer-assets.emergentagent.com/job_delhi-air-truth/artifacts/y5wr300e_WhatsApp%20Image%202025-12-02%20at%2021.28.02.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-6 inline-block">
          <div className="bg-red-600 text-white px-4 py-1.5 rounded-full font-bold text-xs md:text-sm tracking-wider">
            URGENT CITIZEN ACTION REQUIRED
          </div>
        </div>
        
        {/* English Hero Heading - Poppins */}
        <h1 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight px-4">
          CLEAN AIR!<br />
          <span className="text-gray-300">MY RIGHT</span>
        </h1>
        
        {/* Hindi Hero Heading - Hind */}
        <h2 className="hindi-heading text-2xl md:text-5xl font-black text-white mb-6 md:mb-8 tracking-wide px-4">
          साफ़ हवा! मेरा हक़
        </h2>
        
        {/* English body - Inter */}
        <p className="text-base md:text-2xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-semibold px-4">
          Burning eyes. Tight chests. Children coughing through the night.<br />
          <span className="text-white">We deserve honesty. We deserve clean air.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 w-full max-w-2xl mx-auto">
          <button 
            onClick={onSignClick}
            className="w-full sm:w-auto bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-xl font-black hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            SIGN THE PETITION NOW
          </button>
          <a 
            href="#problem"
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-xl font-black hover:bg-white/20 transition-all duration-300 text-center"
          >
            READ WHY THIS MATTERS
          </a>
        </div>
        
        <div className="mt-12 md:mt-16 animate-bounce">
          <ArrowDown className="w-8 h-8 md:w-12 md:h-12 text-white mx-auto" />
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;