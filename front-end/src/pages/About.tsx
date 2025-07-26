import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Heart, Leaf, Award, Phone, MapPin, Clock, Star, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  const chefTeam = [
    {
      name: "Chef Laurent Dubois",
      role: "Executive Chef & Co-Founder",
      bio: "With over 15 years of Michelin-starred experience in Paris and Lyon, Chef Laurent brings authentic French culinary traditions infused with contemporary innovation. His philosophy centers on celebrating seasonal ingredients through refined techniques.",
      specialties: ["French Cuisine", "Molecular Gastronomy", "Wine Pairing"],
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop",
      achievements: ["Michelin Star Winner", "James Beard Nominated", "World's 50 Best Restaurants"]
    },
    {
      name: "Isabella Rodriguez",
      role: "Pastry Chef & Creative Director", 
      bio: "Isabella's artistic background in fine arts translates into stunning dessert presentations that are as visually striking as they are delicious. Her innovative approach to classic pastries has earned international recognition.",
      specialties: ["Artisan Desserts", "Chocolate Sculpture", "Plated Presentations"],
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=400&fit=crop",
      achievements: ["World Pastry Champion", "Top Chef Winner", "Culinary Institute Instructor"]
    }
  ];

  const values = [
    {
      icon: ChefHat,
      title: "Culinary Mastery",
      description: "Every dish represents the pinnacle of culinary artistry, combining traditional techniques with innovative flavors to create truly exceptional dining experiences.",
      gradient: "from-yellow-50 to-yellow-100"
    },
    {
      icon: Heart,
      title: "Passionate Service",
      description: "Our dedicated team provides warm, attentive service that anticipates every need, ensuring each guest feels valued and creates lasting memories.",
      gradient: "from-red-50 to-red-100"
    },
    {
      icon: Leaf,
      title: "Sustainable Excellence",
      description: "We partner with local artisans and organic farms, supporting our community while ensuring the freshest, highest-quality ingredients for our seasonal menus.",
      gradient: "from-green-50 to-green-100"
    }
  ];

  const timeline = [
    {
      year: "2010",
      title: "The Beginning",
      description: "Founded by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse opens its doors with a vision to blend traditional Italian flavors with modern culinary innovation"
    },
    {
      year: "2015",
      title: "First Recognition",
      description: "Awarded 'Best New Restaurant' by Metropolitan Food & Wine Magazine"
    },
    {
      year: "2018",
      title: "Michelin Recognition",
      description: "Received our first Michelin star, cementing our place among the world's finest restaurants"
    },
    {
      year: "2020",
      title: "Innovation & Adaptation",
      description: "Pioneered farm-to-table delivery experiences during global challenges while maintaining excellence"
    },
    {
      year: "2022",
      title: "Culinary Excellence Award",
      description: "Recognized for outstanding culinary excellence and commitment to unforgettable dining experiences"
    },
    {
      year: "2023",
      title: "Restaurant of the Year",
      description: "Named 'Restaurant of the Year' and featured in Condé Nast Traveler for exceptional service and locally sourced ingredients"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${restaurantHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-fade-in">
            <div className="text-6xl mb-6">👨‍🍳</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Our Culinary Journey
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 font-light max-w-3xl mx-auto drop-shadow-md">
              A story of passion, innovation, and unwavering commitment to culinary excellence
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-yellow-50 via-primary-100 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🌟</div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Our Mission</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg md:text-xl text-primary-600 max-w-4xl mx-auto leading-relaxed">
              At Café Fausse, we believe that dining is an art form that engages all the senses. Our mission is to create transformative culinary experiences that honor tradition while embracing innovation, fostering connections between people, and celebrating the beauty of exceptional ingredients prepared with passion and precision.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <Card key={index} className={`text-center bg-gradient-to-br ${value.gradient} border-2 border-primary-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-primary-700">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Owners Profile Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-100 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30 z-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vw] h-[60vh] bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Owners Profile</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg md:text-xl text-primary-600 max-w-4xl mx-auto leading-relaxed">
              Meet the visionaries behind Café Fausse, whose passion and leadership shape our story and guest experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Antonio Rossi */}
            <div className="flex flex-col items-center bg-white/90 rounded-3xl shadow-xl border border-primary-100 p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-200 via-primary-100 to-white flex items-center justify-center mb-4 text-4xl text-primary-700 font-bold border-4 border-primary-300 shadow-lg">
                A
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-1 tracking-tight">Chef Antonio Rossi</h3>
              <p className="text-primary-500 font-medium mb-2">Executive Chef & Co-Founder</p>
              <p className="text-gray-700 text-center text-base">Chef Antonio brings over 20 years of culinary expertise, specializing in traditional Italian cuisine with modern innovation. His passion for locally sourced ingredients and commitment to excellence drives our kitchen's success.</p>
            </div>
            {/* Maria Lopez */}
            <div className="flex flex-col items-center bg-white/90 rounded-3xl shadow-xl border border-primary-100 p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-200 via-primary-100 to-white flex items-center justify-center mb-4 text-4xl text-primary-700 font-bold border-4 border-primary-300 shadow-lg">
                M
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-1 tracking-tight">Maria Lopez</h3>
              <p className="text-primary-500 font-medium mb-2">Restaurateur & Co-Founder</p>
              <p className="text-gray-700 text-center text-base">Maria's business acumen and dedication to exceptional service ensure that every guest experiences the perfect blend of hospitality and culinary artistry that defines Café Fausse.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Our Journey Through Time</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to international recognition, discover the milestones that shaped Café Fausse
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-300 hidden md:block"></div>
            
            <div className="space-y-8 md:space-y-12">
              {timeline.map((event, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="w-full md:w-5/12 mb-4 md:mb-0">
                    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-200">
                      <CardHeader>
                        <div className="flex items-center mb-2">
                          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {event.year.slice(-2)}
                          </div>
                          <div className="ml-4">
                            <CardTitle className="text-primary-700 text-lg">{event.title}</CardTitle>
                            <CardDescription className="text-primary-600 font-semibold">{event.year}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Experience Our Story</h2>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
            Join us for an evening where every dish tells our story of passion, tradition, and culinary innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/reservations" className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Reserve Your Table
              </Link>
            </Button>
            <Button className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/menu">
                Explore Our Menu
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;