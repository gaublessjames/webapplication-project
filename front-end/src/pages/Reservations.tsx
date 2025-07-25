import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationForm from "@/components/ReservationForm";
import { Calendar, Clock, Users, Phone, CheckCircle, Star } from "lucide-react";
import restaurantHero from "@/assets/restaurant-hero.jpg";

const Reservations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurantHero})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reserve Your Table
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Experience exceptional dining at Café Fausse. Book your perfect evening with us.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ReservationForm />
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              
              {/* Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Thursday</span>
                    <span>5:00 PM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday - Saturday</span>
                    <span>5:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>5:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>(202) 555-4567</p>
                  <p>For special requests or parties of 12+</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Available during business hours
                  </p>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Policies</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advance booking recommended</span>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Up to 12 guests per reservation</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24-hour cancellation policy</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reservations;