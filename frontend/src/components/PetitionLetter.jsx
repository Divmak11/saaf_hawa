import React from 'react';
import { FileText, Pen } from 'lucide-react';

const PetitionLetter = ({ onSignClick }) => {
  return (
    <section id="petition" className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-bold mb-6 border border-gray-300 text-sm">
            <FileText className="w-4 h-4" />
            THE PETITION LETTER
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 px-2">The Letter <span className="text-gray-600">You Will Sign</span></h2>
        </div>

        {/* Letter Card */}
        <div className="bg-gray-50 border-2 border-gray-300 p-8 md:p-12 rounded-xl shadow-xl relative">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200 rounded-bl-full opacity-50"></div>
          
          <div className="relative">
            <div className="mb-8">
              <p className="font-bold text-sm tracking-widest text-gray-600 mb-2">TO:</p>
              <p className="text-xl font-black">Hon'ble Prime Minister, Chief Minister & Leader of Opposition</p>
            </div>

            <div className="space-y-6 text-lg leading-relaxed">
              <p className="font-semibold">
                I am signing this because the air in Delhi has become a daily health threat for my family. The coughing, the burning throat, the breathlessness, these are now part of our lives. What makes it worse is that the AQI shown to us often does not match what we feel in our lungs.
              </p>

              <p className="font-bold text-xl bg-black text-white p-6 rounded-lg">
                Please stop hiding the reality of our air. Please stop softening or manipulating AQI data.
              </p>

              <p>
                Give us the truth so we can protect our children and elders. Treat this as the health emergency it is. Delhi deserves honest data and real action. We want you to act.
              </p>

              <p className="font-bold text-xl">
                Clean air is my right. Please protect it.
              </p>

              <div className="mt-8 pt-8 border-t-2 border-gray-300">
                <p className="font-semibold">Sincerely,</p>
                <p className="text-2xl font-black mt-2 text-gray-700">A Citizen of Delhi</p>
              </div>
            </div>

            {/* Signature line placeholder */}
            <div className="mt-12 pt-8 border-t-4 border-dashed border-gray-400 flex justify-between items-end">
              <div>
                <div className="h-1 w-64 bg-gray-300 mb-2"></div>
                <p className="text-sm font-bold text-gray-600">YOUR NAME WILL APPEAR HERE</p>
              </div>
              <div>
                <div className="h-1 w-32 bg-gray-300 mb-2"></div>
                <p className="text-sm font-bold text-gray-600">DATE</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
            onClick={onSignClick}
            className="bg-black text-white px-12 py-5 rounded-lg text-xl font-black hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            <Pen className="w-6 h-6" />
            ADD YOUR NAME NOW
          </button>
        </div>
      </div>
    </section>
  );
};

export default PetitionLetter;