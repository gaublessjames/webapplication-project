import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChefHat, Users, Calendar, Phone, MapPin, Clock, Star, Wine, Leaf } from "lucide-react";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import { useApi } from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Menu = () => {
  const [menuSections, setMenuSections] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const { getMenuWithItems } = useApi();

  useEffect(() => {
    getMenuWithItems()
      .then(data => setMenuSections(data))
      .catch(e => setMenuError(e.message || 'Failed to load menu'))
      .finally(() => setMenuLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
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
            <div className="text-6xl mb-6">🍽️</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Culinary Excellence
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 font-light max-w-3xl mx-auto drop-shadow-md">
              Discover our chef's artfully crafted dishes, featuring premium ingredients and innovative techniques
            </p>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex-1">
        {menuLoading ? (
          <div className="text-center text-primary-600 py-8">Loading menu...</div>
        ) : menuError ? (
          <div className="text-center text-red-600 py-8">{menuError}</div>
        ) : menuSections.length === 0 ? (
          <div className="text-center text-primary-400 py-8">No menu items found.</div>
        ) : (
          menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-20" id={`menu-${section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}> 
              <div className="text-center mb-12">
                <div className="text-5xl mb-4">{section.icon || '🍽️'}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">{section.name}</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto rounded-full"></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {(section.items || []).map((item: any, itemIndex: number) => (
                  <Card key={itemIndex} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-xl md:text-2xl font-bold text-primary-600 ml-4">
                          ${item.price?.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-2 text-sm md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reservation CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Experience Excellence?</h2>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
            Book your table now and embark on a culinary journey that will create lasting memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/reservations" className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Make a Reservation
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Menu;