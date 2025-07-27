import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header, Footer } from "@/components/layout";
import contactHero from "@/assets/contact-hero.jpg";
import { ContactForm, ContactInfo } from '@/components/features/contact';

const Contact = () => {
  const { toast } = useToast();

  const handleContactSubmit = async (data: any) => {
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
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
            <ContactForm onSubmit={handleContactSubmit} />

            {/* Contact Information */}
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;