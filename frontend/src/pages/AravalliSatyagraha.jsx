'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import { ArrowDown, Users, AlertTriangle, Droplet, Wind, Trees, Heart } from 'lucide-react';

export default function AravalliSatyagraha() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCount();
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

  const generateCertificate = (name) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setLineWidth(1);
    doc.setFillColor(26, 77, 46);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setLineWidth(0.8);
    doc.setDrawColor(26, 77, 46);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    doc.setTextColor(26, 77, 46);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF SUPPORT', pageWidth / 2, 35, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Save the Aravallis Campaign', pageWidth / 2, 48, { align: 'center' });

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.text('This certifies that', pageWidth / 2, 70, { align: 'center' });

    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 77, 46);
    doc.text(name, pageWidth / 2, 85, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const statement = 'has signed the petition to protect India\'s oldest mountain range';
    doc.text(statement, pageWidth / 2, 100, { align: 'center' });
    doc.text('from illegal mining and ecological destruction.', pageWidth / 2, 108, { align: 'center' });

    doc.setFontSize(10);
    const message = 'Your voice joins thousands demanding immediate action to save the Aravallis.';
    doc.text(message, pageWidth / 2, 125, { align: 'center' });

    doc.setFontSize(11);
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Date: ${today}`, pageWidth / 2, 145, { align: 'center' });

    doc.save(`Save_Aravallis_Certificate_${name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://api.shaktiabhiyan.in/api/v1/petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, state: 'Not specified', mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
      await fetchCount();
      
      setTimeout(() => {
        generateCertificate(name);
      }, 500);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToPetition = () => {
    document.getElementById('petition')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-2 border-green-600 shadow-2xl">
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
              Your certificate of participation is downloading now.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-green-800 hover:bg-green-900 text-white px-8 py-6 text-lg"
            >
              Return to Campaign
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-stone-300 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">Save the Aravallis</h1>
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
              India's oldest mountain range is facing a death sentence. A Supreme Court decision from November 20, 2025, removes protection from 90% of the Aravallis using an unscientific 100-metre height rule.
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

      {/* Hindi Section - MOVED UP */}
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