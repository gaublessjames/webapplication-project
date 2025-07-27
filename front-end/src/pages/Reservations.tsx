import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, Phone, CheckCircle, Star, MapPin, Mail, Award, Heart } from "lucide-react";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReservationForm from "@/components/ReservationForm";

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
              Experience exceptional French cuisine at Café Fausse. Book your perfect evening in our elegant, intimate atmosphere.
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
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <ReservationForm />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              
              {/* Hours */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-primary-600 mr-3" />
                    <CardTitle className="text-lg">Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Saturday</span>
                    <span>5:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>5:00 PM - 9:00 PM</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-primary-600 mr-3" />
                    <CardTitle className="text-lg">Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>info@cafefausse.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>123 Gourmet Avenue, Culinary District</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    For special requests or parties of 8+ guests
                  </p>
                </CardContent>
              </Card>

              {/* Policies */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-primary-600 mr-3" />
                    <CardTitle className="text-lg">Reservation Policies</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advance booking recommended for weekends</span>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maximum 8 guests per reservation</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24-hour cancellation notice required</span>
                  </div>
                  <div className="flex items-start">
                    <Heart className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Special dietary requests accommodated</span>
                  </div>
                </CardContent>
              </Card>

              {/* About Café Fausse */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <Award className="w-6 h-6 text-primary-600 mr-3" />
                    <CardTitle className="text-lg">About Café Fausse</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <p>
                    Fine-dining establishment combining traditional French cuisine with modern culinary techniques. 
                    Award-winning chefs create unforgettable dining experiences in an elegant, intimate atmosphere.
                  </p>
                  <div className="flex items-start">
                    <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Multiple culinary excellence awards</span>
                  </div>
                  <div className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Founded in 2010 by Chef Marie Dubois</span>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reservations;