import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2, Home, Twitter, Facebook } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Success = () => {
  const navigate = useNavigate();
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignature = async () => {
      const signatureId = localStorage.getItem('signatureId');
      
      if (!signatureId) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${API}/petition/signature/${signatureId}`);
        setSignature(response.data);
      } catch (error) {
        console.error('Error fetching signature:', error);
        toast.error('Failed to load signature details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSignature();
  }, [navigate]);

  const handleDownloadPDF = async () => {
    if (!signature) return;
    
    try {
      toast.info('Generating PDF...');
      const response = await axios.get(`${API}/petition/download-pdf/${signature.id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `saaf_hawa_petition_${signature.signature_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const handleDownloadImage = async () => {
    if (!signature) return;
    
    try {
      toast.info('Generating image...');
      const response = await axios.get(`${API}/petition/download-image/${signature.id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `saaf_hawa_petition_${signature.signature_number}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleShare = (platform) => {
    const text = `I just signed the Saaf Hawa petition demanding honest AQI data and real action on Delhi's air pollution. Join me!`;
    const url = window.location.origin;
    
    let shareUrl = '';
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading your signature...</p>
        </div>
      </div>
    );
  }

  if (!signature) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Message - NO IMAGE */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500 text-white p-6 rounded-full mb-6">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">Thank You!</h1>
          <p className="text-2xl text-gray-700 font-semibold">
            Your voice has been added to the movement.
          </p>
        </div>

        {/* Signed Petition Display */}
        <div className="bg-white border-2 border-gray-300 p-8 md:p-12 rounded-xl shadow-2xl mb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black">Your Signed Petition</h2>
              <p className="text-gray-600">Signature #{signature.signature_number}</p>
            </div>
            <div className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold">
              VERIFIED
            </div>
          </div>

          <div className="mb-8">
            <p className="font-bold text-sm tracking-widest text-gray-600 mb-2">TO:</p>
            <p className="text-xl font-black">Kind Attention Prime Minister, Chief Minister & the Leader of Opposition</p>
          </div>

          <div className="space-y-4 text-lg leading-relaxed mb-8">
            <p className="font-semibold">
              I am signing this because the air in Delhi has become a daily health threat for my family. The coughing, the burning throat, the breathlessness, these are now part of our lives. What makes it worse is that the AQI shown to us often does not match what we feel in our lungs.
            </p>

            <p className="font-bold text-xl">
              Please don't hiding the reality of our air. Please ensure that AQI data is not manipulated.
            </p>

            <p>
              Give us the truth so we can protect our children and elders. Treat this as the health emergency it is. Delhi deserves honest data and real action. We want you to act and take strong measures rather than Band-Aid solutions.
            </p>

            <p className="font-bold text-xl">
              Clean air is my fundamental right. Please protect it.
            </p>
          </div>

          <div className="border-t-4 border-dashed border-gray-300 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">SIGNED BY:</p>
                <p className="text-3xl font-black text-gray-800">{signature.name}</p>
                <p className="text-gray-600 mt-2">{signature.phone}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">DATE:</p>
                <p className="text-xl font-black">{new Date(signature.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleDownloadPDF}
            className="bg-black text-white px-8 py-4 rounded-lg text-lg font-black hover:bg-gray-800 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 border-2 border-gray-800"
          >
            <Download className="w-6 h-6" />
            Download as PDF
          </button>
          <button
            onClick={handleDownloadImage}
            className="bg-white text-black border-2 border-black px-8 py-4 rounded-lg text-lg font-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Download as Image
          </button>
        </div>

        {/* Share Section */}
        <div className="bg-black text-white p-8 rounded-xl text-center mb-8 border-2 border-gray-800">
          <h3 className="text-2xl font-black mb-4 flex items-center justify-center gap-2">
            <Share2 className="w-6 h-6" />
            Amplify the Movement
          </h3>
          <p className="text-gray-400 mb-6">
            Share this petition with your friends and family. Every signature brings us closer to real change.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Share on WhatsApp
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Twitter className="w-5 h-5" />
              Share on Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Facebook className="w-5 h-5" />
              Share on Facebook
            </button>
          </div>
        </div>

        {/* Return Home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-black font-bold inline-flex items-center gap-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;