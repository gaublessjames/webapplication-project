import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import contactHero from "@/assets/contact-hero.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${contactHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Contact Us 📞
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
            Get in touch with us for reservations, inquiries, or special requests
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary-600 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary-600 mb-6">Get in touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        123 Culinary Street<br />
                        Food District, FD 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">
                        Reservations: (555) 123-4567<br />
                        General: (555) 123-4568
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        info@cafefausse.com<br />
                        reservations@cafefausse.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                      <p className="text-gray-600">
                        Tuesday - Sunday<br />
                        Lunch: 12:00 PM - 3:00 PM<br />
                        Dinner: 6:00 PM - 10:00 PM<br />
                        <span className="text-sm text-red-600">Closed Mondays</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    Find Us Here
                  </h3>
                </div>
                <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center relative">
                  <div className="text-center text-primary-600">
                    <MapPin className="w-16 h-16 mx-auto mb-3" />
                    <p className="font-medium text-lg mb-2">123 Culinary Street</p>
                    <p className="text-sm mb-4">Food District, FD 12345</p>
                    <a 
                      href="https://maps.google.com/?q=123+Culinary+Street,+Food+District,+FD+12345" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;