import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProblemStatement from '../components/ProblemStatement';
import PetitionLetter from '../components/PetitionLetter';
import SignatureForm from '../components/SignatureForm';
import WhyItMatters from '../components/WhyItMatters';
import Footer from '../components/Footer';
import Header from '../components/Header';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const Home = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/petition/sign`, formData);
      const signature = response.data;
      
      // Store signature ID for success page
      localStorage.setItem('signatureId', signature.id);
      
      toast.success('Petition signed successfully!');
      navigate('/success');
    } catch (error) {
      console.error('Error signing petition:', error);
      toast.error('Failed to submit signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('signature-form').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection onSignClick={scrollToForm} />
      <ProblemStatement />
      <PetitionLetter onSignClick={scrollToForm} />
      <SignatureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <WhyItMatters />
      <Footer />
      
      {showStickyButton && (
        <button
          onClick={scrollToForm}
          className="fixed bottom-8 right-8 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 z-50 border-2 border-gray-800"
        >
          Sign Now
        </button>
      )}
    </div>
  );
};

export default Home;