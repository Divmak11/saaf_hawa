'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Select from '@radix-ui/react-select';
import { Card, CardContent } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import { ArrowDown, Users, AlertTriangle, Droplet, Wind, Trees, Heart, Share2, Twitter, Facebook } from 'lucide-react';

export default function AravalliSatyagraha() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statesData, setStatesData] = useState([]);
  const [error, setError] = useState('');
  const [certificates, setCertificates] = useState({
    url: "",
    name: ""
  });

  useEffect(() => {
    fetchCount();
    fetchIndiaData();
  }, []);

  const fetchCount = async () => {
    try {
      const response = await fetch('https://api.shaktiabhiyan.in/api/v1/petition/count');
      const data = await response.json();
      setCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const fetchIndiaData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Shubhangp/india-data/main/statesData.json');

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the raw text first to debug
      const textData = await response.text();
      // console.log('Raw response:', textData.substring(0, 200)); // Log first 200 chars

      // Try to parse the JSON
      const data = JSON.parse(textData);
      // console.log('Parsed data:', data);
      
      // Validate the data structure before setting state
      if (data && data.indianStates) {
        setStatesData(data.indianStates.states || []);
      } else {
        console.error('Invalid data structure:', data);
        Alert.alert('Error', 'Failed to load location data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching India data:', error);
      console.error('Error details:', error.message);

      // Show user-friendly error message
      Alert.alert(
        'Connection Error',
        'Unable to load location data. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => fetchIndiaData() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );

      // Set empty arrays as fallback
      setStatesData([]);
    }
  };

  // const generateCertificate = (name) => {
  //   const doc = new jsPDF({
  //     orientation: 'landscape',
  //     unit: 'mm',
  //     format: 'a4'
  //   });

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   doc.setLineWidth(1);
  //   doc.setFillColor(26, 77, 46);
  //   doc.rect(0, 0, pageWidth, 15, 'F');
  //   doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

  //   doc.setLineWidth(0.8);
  //   doc.setDrawColor(26, 77, 46);
  //   doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  //   doc.setTextColor(26, 77, 46);
  //   doc.setFontSize(32);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('CERTIFICATE OF SUPPORT', pageWidth / 2, 35, { align: 'center' });

  //   doc.setFontSize(16);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text('Save the Aravallis Campaign', pageWidth / 2, 48, { align: 'center' });

  //   doc.setTextColor(60, 60, 60);
  //   doc.setFontSize(12);
  //   doc.text('This certifies that', pageWidth / 2, 70, { align: 'center' });

  //   doc.setFontSize(28);
  //   doc.setFont('helvetica', 'bold');
  //   doc.setTextColor(26, 77, 46);
  //   doc.text(name, pageWidth / 2, 85, { align: 'center' });

  //   doc.setFontSize(12);
  //   doc.setFont('helvetica', 'normal');
  //   doc.setTextColor(60, 60, 60);
  //   const statement = 'has signed the petition to protect India\'s oldest mountain range';
  //   doc.text(statement, pageWidth / 2, 100, { align: 'center' });
  //   doc.text('from illegal mining and ecological destruction.', pageWidth / 2, 108, { align: 'center' });

  //   doc.setFontSize(10);
  //   const message = 'Your voice joins thousands demanding immediate action to save the Aravallis.';
  //   doc.text(message, pageWidth / 2, 125, { align: 'center' });

  //   doc.setFontSize(11);
  //   const today = new Date().toLocaleDateString('en-IN', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric'
  //   });
  //   doc.text(`Date: ${today}`, pageWidth / 2, 145, { align: 'center' });

  //   doc.save(`Save_Aravallis_Certificate_${name.replace(/\s+/g, '_')}.pdf`);
  // };

  const generateCertificate = async (name) => {
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return null;

      // Load the certificate template using native HTML Image constructor
      const templateImage = new (globalThis.Image || HTMLImageElement)();
      templateImage.crossOrigin = 'anonymous';

      return new Promise((resolve, reject) => {
        templateImage.onload = () => {
          // Set canvas size to match image
          canvas.width = templateImage.width;
          canvas.height = templateImage.height;

          // Draw the certificate template
          ctx.drawImage(templateImage, 0, 0);

          // Configure text styling for name
          ctx.fillStyle = '#155811'; // Black color
          ctx.font = 'bold 80px Arial';
          ctx.textAlign = 'center';

          // Calculate position (25% from top)
          const nameX = canvas.width / 2;
          const nameY = canvas.height * 0.56;

          // Add user name to certificate
          ctx.fillText(name, nameX, nameY);

          // Convert to blob and create URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/jpeg', 0.9);
        };

        templateImage.onerror = () => reject(new Error('Failed to load certificate template'));
        templateImage.src = '/CertificateAraval.jpeg';
      });
    } catch (error) {
      console.error('Certificate generation error:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://api.shaktiabhiyan.in/api/v1/petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, state, mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
      await fetchCount();

      if (data.status === 'success') {
        const certificateDataUrl = await generateCertificate(name);
        if (certificateDataUrl) {
          setCertificates({ url: certificateDataUrl, name: name });
        }
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (certificateUrl, userName) => {
    if (certificateUrl && userName) {
      const link = document.createElement('a');
      link.href = certificateUrl;
      link.download = `${userName}_Certificate.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = (platform) => {
    const text = "I’ve signed the *Save the Aravallis* petition to protect this ancient mountain range and the millions of lives it supports.%0a*The Aravallis are under threat* —now is the time to act. Join me!%0a%0a Visit:- https://www.saafhawa.in/AravalliSatyagraha/"

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?phone=&text=${text}&image=https://res.cloudinary.com/dbjr4qedz/image/upload/v1766415224/logo_aravalli_bgepaj.jpg`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://www.saafhawa.in/AravalliSatyagraha/`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://www.saafhawa.in/AravalliSatyagraha/`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  }

  const scrollToPetition = () => {
    document.getElementById('petition')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex flex-col gap-4 items-center justify-center px-4">
        <Card className="max-w-3xl w-full border-2 border-green-600 shadow-2xl">
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-green-700 fill-green-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Thank You for Your Voice
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your signature has been recorded. Together, we are building a movement to protect the Aravallis.
            </p>
            <p className="text-sm text-gray-600">
              Your Certificate of Participation is ready for download. Click the button below.
            </p>

            <button
              onClick={() => downloadCertificate(certificates.url, certificates.name || 'certificate')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 mx-auto"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Certificate
            </button>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-green-800 hover:bg-green-900 text-white px-8 py-6 text-lg"
            >
              Return to Campaign
            </Button>
          </CardContent>
        </Card>
        <div className="max-w-3xl bg-black text-white p-8 rounded-xl text-center mb-8 border-2 border-gray-800">
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
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01" /></svg>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-stone-300 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
          <div className='flex items-center gap-4'>
            <img className='w-12 h-12 rounded-md' src='/logo_aravalli.jpeg' />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">Save the Aravallis</h1>
          </div>
          <Button
            onClick={scrollToPetition}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-4 md:px-6 py-2 shadow-lg"
          >
            SIGN NOW
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[700px] mt-[57px] md:mt-[65px]" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1699083045149-359a38fe68ba?w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight">
              Save the Aravallis
            </h2>
            <p className="text-base md:text-xl text-white/95 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed font-light">
              A Supreme Court decision based on a Govt proposal removes protection from 90% of the Aravallis through an unscientific 100-metre rule, a death sentence for India’s oldest mountain range.
            </p>
            <Button
              onClick={scrollToPetition}
              className="bg-red-700 hover:bg-red-800 text-white px-6 md:px-10 py-5 md:py-7 text-base md:text-lg font-semibold flex items-center gap-2 mx-auto shadow-2xl"
            >
              SIGN THE PETITION <ArrowDown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Counter Bar */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 py-4 md:py-6 border-y-4 border-red-900">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-3">
          <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <p className="text-xl md:text-3xl font-bold text-white">
            {count.toLocaleString()} signatures and counting
          </p>
        </div>
      </div>

      {/* Hindi Section - MOVED DOWN */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-y-4 border-orange-600">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center text-stone-900 mb-8 md:mb-12" style={{ fontFamily: 'sans-serif' }}>
            अरावली बचाओ
          </h2>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 shadow-2xl">
            <CardContent className="p-6 md:p-10 space-y-6">
              <p className="text-xl md:text-2xl font-bold text-red-800 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                माननीय प्रधानमंत्री एवं माननीय नेता प्रतिपक्ष,
              </p>

              <div className="space-y-5 text-base md:text-lg text-stone-800 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                <p>
                  यह याचिका आने वाली पीढ़ियों की ओर से किया गया एक आवश्यक आग्रह है। अरावली पर्वतमाला भारत की सबसे प्राचीन पर्वत श्रृंखला है, जो गुजरात से राजस्थान, हरियाणा और दिल्ली तक फैली है। यह उत्तर भारत को मरुस्थलीकरण से बचाने वाली प्राकृतिक ढाल है और भूजल, हवा व तापमान के संतुलन में इसकी भूमिका अत्यंत महत्वपूर्ण है। आज अवैध खनन, वनों की कटाई और अनियंत्रित निर्माण के कारण अरावली का अस्तित्व गंभीर संकट में है।
                </p>

                <p className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                  सुप्रीम कोर्ट को गुमराह कर अरावली की परिभाषा को संकुचित किया जाना माइनिंग माफिया को लाभ पहुँचाने वाला कदम है। अरावली को केवल खनिज क्षेत्र नहीं बल्कि एक जीवित पारिस्थितिकी तंत्र मानते हुए उसका संरक्षण आवश्यक है। अरावली को बचाना जल संकट, वायु प्रदूषण और जलवायु परिवर्तन से लड़ने का मूल उपाय है।
                </p>

                <p className="font-semibold text-lg md:text-xl text-stone-900">
                  हम आपसे आग्रह करते हैं कि सख़्त क़ानूनी संरक्षण और त्वरित ज़मीनी कार्रवाई के माध्यम से इस ऐतिहासिक पर्वतमाला को बचाया जाए।
                </p>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={scrollToPetition}
                  className="bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-800 hover:to-red-800 text-white px-8 md:px-12 py-5 md:py-7 text-lg md:text-2xl font-bold shadow-2xl"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  अभी हस्ताक्षर करें
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Petition Form - MOVED HERE */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-stone-50 to-white" id="petition">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-700" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 md:mb-6">
              Sign the Petition
            </h2>
            <p className="text-base md:text-lg text-stone-700 leading-relaxed">
              Your signature will be recorded and sent to key decision-makers, including government authorities and the Supreme Court. Every voice matters.
            </p>
          </div>

          <Card className="border-2 border-stone-300 shadow-2xl bg-white">
            <CardContent className="pt-6 md:pt-8 pb-6 md:pb-8 px-4 md:px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-3 rounded">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base md:text-lg font-semibold text-stone-800">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="h-12 md:h-14 text-base md:text-lg border-2 border-stone-300 focus:border-green-700 focus:ring-green-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-base md:text-lg font-semibold text-stone-800">
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="h-12 md:h-14 text-base md:text-lg border-2 border-stone-300 focus:border-green-700 focus:ring-green-700"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label
                    htmlFor="state"
                    className="text-base md:text-lg font-semibold text-stone-800"
                  >
                    Your State *
                  </Label>

                  <select onChange={(e) => setState(e.target.value)} className="h-12 md:h-14 text-base md:text-lg border-2 border-stone-300 focus:border-green-700 focus:ring-green-700 bg-transparent outline-none rounded-md px-2">
                    <option value=''>Select your state</option>
                    {statesData.map((stateItem) => (
                      <option
                        key={stateItem.key}
                        value={stateItem.name}
                      >
                        {stateItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs md:text-sm text-stone-600 italic">
                  Your signature will be recorded and used only for this campaign.
                </p>

                <Button
                  type="submit"
                  disabled={loading || !name || !mobile}
                  className="w-full h-14 md:h-16 text-base md:text-xl font-bold bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Add My Name to Save the Aravallis'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why the Aravallis Matter */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-10 md:mb-16 text-center">
            Why the Aravallis Matter
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            <div className="text-center p-6 bg-stone-50 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-700">2B</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 font-serif">2 Billion Years Old</h3>
              <p className="text-stone-700 leading-relaxed">
                The Aravalli range stretches 692 km across Gujarat, Rajasthan, Haryana, and Delhi. It is India's oldest geological formation.
              </p>
            </div>
            <div className="text-center p-6 bg-stone-50 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplet className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 font-serif">Water Security</h3>
              <p className="text-stone-700 leading-relaxed">
                Recharges groundwater with up to 2 million litres per hectare annually. Critical for Delhi-NCR and surrounding regions.
              </p>
            </div>
            <div className="text-center p-6 bg-stone-50 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Wind className="w-10 h-10 text-green-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 font-serif">Desert Barrier</h3>
              <p className="text-stone-700 leading-relaxed">
                Acts as a natural shield against the Thar Desert's expansion into North-West India. Without it, desertification accelerates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Death By Definition */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-6 md:mb-10">
            Death By Definition
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 md:space-y-6 text-stone-800 text-base md:text-lg leading-relaxed">
              <p className="font-semibold text-red-800">
                On November 20, 2025, the Supreme Court accepted a new "uniform definition" of the Aravallis. Under this definition, only landforms rising more than 100 metres above local relief are recognized as Aravallis.
              </p>
              <p>
                This single decision removes legal protection from nearly 90% of the range, opening vast areas to mining and commercial exploitation.
              </p>
              <p>
                According to geologists, "Aravalli" refers to ancient geological formations—not just tall hills. Many formations exist below the surface yet perform vital ecological functions.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1549885606-bbc17accf949?w=800"
                alt="Cracked earth from drought"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Stand to Lose */}
      <section className="py-12 md:py-20 px-4 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-10 md:mb-16 text-center">
            What We Stand to Lose
          </h2>
          <div className="space-y-8 md:space-y-12">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-serif text-red-400">Rapid Desertification</h3>
                <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                  Destruction has already created breaches allowing desert winds and dust into Delhi-NCR. More mining will accelerate desert spread across Rajasthan, Haryana, UP, and MP—threatening food security.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1586400792375-d6b8f82db2e6?w=800"
                alt="Deforestation"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-xl order-first md:order-last"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <img
                src="https://images.pexels.com/photos/12442838/pexels-photo-12442838.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Water crisis"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-xl"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-serif text-blue-400">Water Crisis</h3>
                <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                  Mining blasts fracture aquifers, lower groundwater tables (reaching 1,500–2,000 feet in some regions), and contaminate drinking water. Rivers originating in the Aravallis are drying up.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-serif text-gray-400">Air Pollution & Climate Breakdown</h3>
                <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                  Loss of forest cover increases dust, heat stress, erratic rainfall, and extreme weather. Cities already among the world's most polluted will suffer further.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1582377224944-2c2a17affa38?w=800"
                alt="Air pollution"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-xl order-first md:order-last"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <img
                src="https://images.unsplash.com/photo-1589705320079-4fd380c4e9f4?w=800"
                alt="Wildlife loss"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-xl"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-serif text-green-400">Wildlife & Biodiversity Loss</h3>
                <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                  Mining fragments habitats, destroys wildlife corridors, and increases human-animal conflict. Sacred groves and native medicinal plants are vanishing.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-serif text-orange-400">Rural Livelihoods & Public Health</h3>
                <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                  Communities face falling farm yields, loss of grazing land, cracked homes from blasting, and rising cases of silicosis, asthma, kidney, and liver diseases.
                </p>
              </div>
              <img
                src="https://images.pexels.com/photos/4129380/pexels-photo-4129380.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Rural communities affected"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-xl order-first md:order-last"
              />
            </div>
          </div>

          <blockquote className="text-2xl md:text-4xl font-serif italic text-center text-red-400 mt-12 md:mt-16 py-8 border-t-2 border-b-2 border-red-800">
            "This is not just an environmental issue—it is a right to life issue."
          </blockquote>
        </div>
      </section>

      {/* Our Demands */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-10 md:mb-16 text-center">
            Our Demands (Citizens' Asks)
          </h2>
          <div className="space-y-6">
            {[
              'Scrap the regressive 100-metre definition of the Aravallis',
              'Recall the Supreme Court judgment dated 20 November 2025',
              'Declare the entire 692 km Aravalli range a Critical Ecological Zone',
              'Stop mining and stone crushing near habitations, farms, forests, and water bodies',
              'Promote alternative building materials to reduce reliance on virgin stone'
            ].map((demand, index) => (
              <div key={index} className="flex gap-4 md:gap-6 items-start bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-700 to-green-900 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
                  {index + 1}
                </div>
                <p className="text-base md:text-xl text-stone-800 pt-1 md:pt-2 font-medium">{demand}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={scrollToPetition}
              className="bg-red-700 hover:bg-red-800 text-white px-8 md:px-12 py-5 md:py-7 text-base md:text-xl font-bold shadow-2xl"
            >
              Sign the Petition Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-10 md:py-16 px-4 border-t-4 border-green-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4">Save the Aravallis</h3>
              <p className="text-stone-400 leading-relaxed">
                A citizens' movement to protect India's oldest mountain range from destruction.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-stone-400">
                <li><button onClick={scrollToPetition} className="hover:text-white transition-colors">Sign Petition</button></li>
                <li><a href="#" className="hover:text-white transition-colors">About the Campaign</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-stone-400 mb-4">
                Join {count.toLocaleString()}+ citizens demanding action.
              </p>
              <Button
                onClick={scrollToPetition}
                className="bg-green-700 hover:bg-green-800 text-white w-full"
              >
                Add Your Voice
              </Button>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-500 text-sm">
              This petition represents the collective voice of citizens demanding immediate action to protect the Aravallis. Your participation is vital.
            </p>
            <p className="text-stone-600 text-xs mt-4">
              © {new Date().getFullYear()} Save the Aravallis Campaign
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}