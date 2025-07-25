import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, Phone, Mail, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import faqHero from "@/assets/faq-hero.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I make a reservation?",
      answer: "You can make a reservation through our online booking system on the homepage, call us directly at (555) 123-4567, or visit us in person. We recommend booking in advance, especially for weekend dining."
    },
    {
      question: "What are your operating hours?",
      answer: "We're open Tuesday through Sunday. Lunch: 12:00 PM - 3:00 PM, Dinner: 6:00 PM - 10:00 PM. We're closed on Mondays for maintenance and staff training."
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer: "Absolutely! We offer vegetarian, vegan, gluten-free, and other dietary options. Please inform us of any allergies or dietary requirements when making your reservation so our chef can prepare accordingly."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We require 24-hour notice for cancellations. For parties of 6 or more, we require 48-hour notice. Cancellations made with less notice may incur a fee."
    },
    {
      question: "Do you have private dining options?",
      answer: "Yes, we offer private dining for special occasions and business events. Our private dining room accommodates up to 20 guests. Please contact us for pricing and availability."
    },
    {
      question: "Is there parking available?",
      answer: "We offer complimentary valet parking for all our guests. Street parking is also available, and there's a public parking garage two blocks away."
    },
    {
      question: "Do you serve alcohol?",
      answer: "Yes, we have an extensive wine list featuring local and international selections, craft cocktails, and premium spirits. Our sommelier is available to help with wine pairings."
    },
    {
      question: "Can I modify my reservation?",
      answer: "Yes, you can modify your reservation up to 4 hours before your scheduled time by calling us or using our online system. Changes are subject to availability."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${faqHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Frequently Asked Questions ❓
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
            Find answers to common questions about dining at Café Fausse
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50 rounded-t-lg">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-600 mb-4">Still have questions?</h2>
            <p className="text-gray-600 text-lg">Get in touch with us directly</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <Phone className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@cafefausse.com</p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Culinary Street<br />Food District, FD 12345</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;