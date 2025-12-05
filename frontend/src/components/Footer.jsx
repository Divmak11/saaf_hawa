import React from 'react';
import { Wind, Mail, Share2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 md:py-16 px-4 md:px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Logo and Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Wind className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black">SAAF HAWA</h3>
                <p className="text-sm text-gray-400 font-normal hindi-text">साफ़ हवा</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              A citizen-led movement demanding honest AQI data and real action on Delhi's air pollution crisis.
            </p>
          </div>

          {/* About This Initiative */}
          <div>
            <h4 className="text-lg font-black mb-4 text-gray-300">About This Initiative</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              This is an independent, non-partisan civic movement. We are concerned citizens demanding transparency and action on air quality. We are not affiliated with any political party.
            </p>
          </div>

          {/* Contact & Share */}
          <div>
            <h4 className="text-lg font-black mb-4 text-gray-300">Connect & Share</h4>
            <div className="space-y-3">
              <a href="mailto:contact@saafhawa.in" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                contact@saafhawa.in
              </a>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
                Share this petition
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h5 className="font-bold mb-2 text-gray-300">Privacy & Data Policy</h5>
            <p className="text-sm text-gray-400">
              Your information will only be used for this petition. We will compile signatures and submit them to government authorities. We will not share your data with third parties or use it for commercial purposes.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              Built with <Heart className="w-4 h-4 text-red-400" /> by concerned citizens for a healthier Delhi
            </p>
            <p className="text-gray-600 text-xs mt-2">
              © 2025 Saaf Hawa. Citizen-led initiative.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;