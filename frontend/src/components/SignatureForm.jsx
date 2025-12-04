import React, { useState, useEffect } from 'react';
import { Pen, User, Phone } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SignatureForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [stats, setStats] = useState({
    total_signatures: 12847,
    recent_signatures: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/petition/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    onSubmit(formData);
  };

  return (
    <section id="signature-form" className="py-12 md:py-24 px-4 md:px-6 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold mb-4 md:mb-6 border border-white/20 text-xs md:text-sm">
            <Pen className="w-3 h-3 md:w-4 md:h-4" />
            TAKE ACTION NOW
          </div>
          <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 px-2">Add Your Name to the Petition</h2>
          <p className="text-base md:text-3xl font-bold text-gray-300 max-w-3xl mx-auto leading-tight px-4">
            We are all breathing the same air. We should all know the truth about it.
          </p>
        </div>

        {/* Live Counter */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8 mb-10 md:mb-12 text-center">
          <div className="text-4xl md:text-6xl font-black text-white mb-2">{stats.total_signatures.toLocaleString()}</div>
          <div className="text-base md:text-xl font-bold text-gray-300">Citizens Have Already Signed</div>
          <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-3 max-w-full overflow-hidden">
            {stats.recent_signatures.slice(0, 3).map((sig, idx) => (
              <div key={idx} className="bg-white/10 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold border border-white/20 truncate max-w-full">
                {sig.name} • {sig.timestamp}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white text-black p-6 md:p-12 rounded-xl shadow-2xl border-2 border-gray-200">
          <div className="space-y-5 md:space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-base md:text-lg font-black mb-2 md:mb-3 flex items-center gap-2">
                <User className="w-4 h-4 md:w-5 md:h-5" />
                Your Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-semibold"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-base md:text-lg font-black mb-2 md:mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-semibold"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            
            <p className="text-xs md:text-sm font-bold text-gray-600 italic">
              Both fields are required to ensure the authenticity of signatures.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 md:mt-8 bg-black text-white px-8 md:px-12 py-4 md:py-6 rounded-lg text-lg md:text-2xl font-black hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT MY SIGNATURE'}
          </button>

          <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
            By signing, you agree to have your name included in the petition submission to government authorities.
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignatureForm;