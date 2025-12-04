import React from 'react';
import { AlertTriangle, Heart, Users, TrendingDown } from 'lucide-react';

const ProblemStatement = () => {
  // Using uploaded Delhi air pollution images
  const images = [
    'https://customer-assets.emergentagent.com/job_delhi-air-truth/artifacts/kn98egyk_WhatsApp%20Image%202025-12-02%20at%2021.28.02%20%281%29.jpeg',
    'https://images.unsplash.com/photo-1602727751184-d7b7d0cd9d8d?q=80&w=2070', // Delhi India Gate in smog
    'https://images.unsplash.com/photo-1644674649847-0690247ae9ee?q=80&w=2070'  // Person with mask in Delhi pollution
  ];

  return (
    <section id="problem" className="py-12 md:py-24 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold mb-4 md:mb-6 border border-red-200 text-xs md:text-sm">
            <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
            THE HARSH REALITY
          </div>
          <h2 className="text-2xl md:text-6xl font-black mb-3 md:mb-4 px-2">Delhi's Air Is <span className="text-red-600">Hurting Us</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left: Text */}
          <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
            <p className="font-semibold text-lg md:text-xl">
              Delhi's air is hurting us. This is a Health Emergency. We all feel it. Burning eyes. Tight chests. Children coughing through the night. Parents sitting awake because breathing has become a struggle.
            </p>
            
            <p className="text-gray-700">
              What hurts even more is not just the pollution, it's the feeling that the truth is being hidden from us. When the air looks toxic but AQI shows "moderate," when monitoring stations go silent on the worst days, it feels like our suffering is being covered up.
            </p>
            
            <div className="bg-black text-white p-6 md:p-8 rounded-xl my-6 md:my-8">
              <p className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-gray-300">We can live with bad news.</p>
              <p className="text-xl md:text-2xl font-black">We cannot live with false comfort.</p>
              <p className="text-xl md:text-2xl font-black mt-3 md:mt-4">We deserve honesty.</p>
            </div>
            
            <p className="text-gray-700">
              Clean air is our basic right. If the air is unsafe, we deserve to know. If it is dangerous for children and elders, we deserve clear warnings. This is not politics. This is survival.
            </p>
            
            <p className="font-bold text-lg md:text-xl text-black">
              We are asking for accountability. Real action. Real data. And a government that tells its people the truth.
            </p>
            
            <p className="text-gray-700 italic">
              Your voice matters. Together we can demand what should never have been denied: the right to breathe safely.
            </p>
          </div>

          {/* Right: Images and Stats */}
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {images.map((img, idx) => (
                <div key={idx} className={`${idx === 0 ? 'col-span-2' : ''} rounded-xl overflow-hidden shadow-xl border-2 border-gray-200`}>
                  <img src={img} alt="Delhi air pollution crisis" className="w-full h-48 md:h-64 object-cover" loading="lazy" />
                </div>
              ))}
            </div>

            {/* AQI Visualization */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border-2 border-gray-200">
              <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-2">
                <TrendingDown className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
                AQI Reality Check
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm md:text-base">Official AQI:</span>
                  <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 md:px-6 py-1.5 md:py-2 rounded-full font-black text-xs md:text-base">Moderate (150)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm md:text-base">What We Feel:</span>
                  <span className="bg-red-100 text-red-800 border border-red-300 px-3 md:px-6 py-1.5 md:py-2 rounded-full font-black text-xs md:text-base">Hazardous (400+)</span>
                </div>
              </div>
              <p className="mt-4 md:mt-6 text-xs md:text-sm text-gray-600 italic">The numbers don't match our reality.</p>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-black text-white p-4 md:p-6 rounded-xl border border-gray-800">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-400 mb-2" />
                <div className="text-2xl md:text-3xl font-black mb-1 md:mb-2">12,000+</div>
                <div className="text-xs md:text-sm text-gray-300">Daily hospital visits</div>
              </div>
              <div className="bg-black text-white p-4 md:p-6 rounded-xl border border-gray-800">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-gray-300 mb-2" />
                <div className="text-2xl md:text-3xl font-black mb-1 md:mb-2">20M+</div>
                <div className="text-xs md:text-sm text-gray-300">People affected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;