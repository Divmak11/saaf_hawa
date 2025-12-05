import React from 'react';
import { Target, Users, FileCheck, TrendingUp } from 'lucide-react';

const WhyItMatters = () => {
  const reasons = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collective Voice",
      description: "Every signature adds to the pressure on authorities to act. Together, we become impossible to ignore."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Official Submission",
      description: "All signatures will be compiled and officially submitted to the PM, CM, and Leader of Opposition."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Real Accountability",
      description: "This petition demands transparent AQI data and immediate action - not just promises, but results."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Building Momentum",
      description: "Media coverage and public awareness grow with each signature, creating unstoppable civic pressure."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6 px-2">Why Your <span className="text-gray-600">Signature Matters</span></h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            This is not just a petition. It's a movement for our fundamental right to breathe clean air and know the truth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 p-8 rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-black text-white p-4 rounded-lg inline-block mb-4">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-black mb-4">{reason.title}</h3>
              <p className="text-gray-700 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 bg-black text-white p-12 rounded-xl text-center border-2 border-gray-800">
          <h3 className="text-3xl md:text-4xl font-black mb-4">
            Don't Wait for Someone Else to Act
          </h3>
          <p className="text-xl mb-4 text-gray-300">
            Change starts when citizens stand together. Your signature is your voice.
          </p>
          <p className="text-xl mb-8 text-gray-300">
            Give a Missed Call to <a href="tel:+919873036161" className="text-white font-bold underline hover:text-gray-200">+91 9873036161</a>
          </p>
          <a 
            href="#signature-form"
            className="inline-block bg-white text-black px-12 py-5 rounded-lg text-xl font-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          >
            SIGN THE PETITION NOW
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;