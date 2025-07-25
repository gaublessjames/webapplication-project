import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Eye, Cookie, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import policiesHero from "@/assets/policies-hero.jpg";

const Policies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${policiesHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Policies & Terms 📋
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
            Your privacy and safety are our top priorities
          </p>
        </div>
      </section>

      {/* Policies Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="privacy" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Privacy Policy
              </TabsTrigger>
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Terms of Service
              </TabsTrigger>
              <TabsTrigger value="cookies" className="flex items-center gap-2">
                <Cookie className="w-4 h-4" />
                Cookie Policy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-primary-600 mb-6">Privacy Policy</h2>
                
                <div className="prose prose-gray max-w-none space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Information We Collect</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We collect information you provide directly to us, such as when you make a reservation, 
                      create an account, or contact us. This may include your name, email address, phone number, 
                      and dining preferences.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Process reservations and provide dining services</li>
                      <li>Send confirmation emails and reservation reminders</li>
                      <li>Improve our services and customer experience</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Sharing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We do not sell, trade, or otherwise transfer your personal information to third parties 
                      without your consent, except as described in this policy or as required by law.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Security</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We implement appropriate security measures to protect your personal information against 
                      unauthorized access, alteration, disclosure, or destruction.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-primary-600 mb-6">Terms of Service</h2>
                
                <div className="prose prose-gray max-w-none space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Reservation Policy</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Reservations are held for 15 minutes past the reserved time</li>
                      <li>Cancellations must be made at least 24 hours in advance</li>
                      <li>Large parties (6+) require 48-hour cancellation notice</li>
                      <li>No-shows may incur a charge</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Dress Code</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We maintain a smart casual dress code. We ask that guests avoid overly casual attire 
                      such as athletic wear, flip-flops, or baseball caps.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment and Gratuity</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We accept all major credit cards and cash. A service charge of 18% may be added to 
                      parties of 6 or more. Additional gratuity is at your discretion.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                    <p className="text-gray-600 leading-relaxed">
                      While we strive to provide excellent service, we cannot be held responsible for 
                      circumstances beyond our reasonable control.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cookies" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-primary-600 mb-6">Cookie Policy</h2>
                
                <div className="prose prose-gray max-w-none space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What Are Cookies?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Cookies are small text files that are stored on your device when you visit our website. 
                      They help us provide you with a better browsing experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                      <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                      <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                      <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Managing Cookies</h3>
                    <p className="text-gray-600 leading-relaxed">
                      You can control and/or delete cookies as you wish through your browser settings. 
                      You can delete all cookies that are already on your device and set most browsers 
                      to prevent them from being placed.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Cookies</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Some of our pages may contain content from third-party services, which may set 
                      their own cookies. We do not control these cookies.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary-600 mb-4">Questions about our policies?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these policies, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
              <Link to="/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Policies;