import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useApi } from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MenuHero, MenuSection } from '@/components/features/menu';
import { LoadingSpinner } from '@/components/shared';

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
      <MenuHero />

      {/* Menu Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex-1">
        {menuLoading ? (
          <div className="text-center py-8">
            <LoadingSpinner text="Loading menu..." />
          </div>
        ) : menuError ? (
          <div className="text-center text-red-600 py-8">{menuError}</div>
        ) : menuSections.length === 0 ? (
          <div className="text-center text-primary-400 py-8">No menu items found.</div>
        ) : (
          menuSections.map((section, sectionIndex) => (
            <MenuSection
              key={sectionIndex}
              name={section.name}
              icon={section.icon}
              items={section.items || []}
            />
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