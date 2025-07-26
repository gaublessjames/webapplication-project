import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import restaurantHero from "@/assets/restaurant-hero.jpg";

interface HeroSectionProps {
  onSignOut: () => Promise<void>;
}

export default function HeroSection({ onSignOut }: HeroSectionProps) {
  const { user } = useAuth();

  return (
    <>
      {/* Navigation - Enhanced Design */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 relative z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-all duration-300 transform hover:scale-105">
              Café Fausse
            </Link>
            
            {/* Desktop Navigation - Updated Colors */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-white font-semibold bg-primary-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                Home
              </Link>
              <Link to="/menu" className="text-primary-600 hover:text-primary-700 transition-all duration-300 font-medium hover:bg-primary-50 px-3 py-2 rounded-lg">
                Menu
              </Link>
              <Link to="/about" className="text-primary-600 hover:text-primary-700 transition-all duration-300 font-medium hover:bg-primary-50 px-3 py-2 rounded-lg">
                About
              </Link>
              <Link to="/gallery" className="text-primary-600 hover:text-primary-700 transition-all duration-300 font-medium hover:bg-primary-50 px-3 py-2 rounded-lg">
                Gallery
              </Link>
              <Link to="/reservations" className="text-primary-600 hover:text-primary-700 transition-all duration-300 font-medium hover:bg-primary-50 px-3 py-2 rounded-lg">
                Reservations
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full border border-primary-200">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-primary-700 text-sm font-medium">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    onClick={onSignOut}
                    variant="outline"
                    size="sm"
                    className="border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button asChild variant="outline" size="sm" className="border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300 font-medium">
                    <Link to="/auth">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    <Link to="/auth">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean Visual Focus */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${restaurantHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center justify-center">
            {/* Centered Welcome Content */}
            <div className="text-center text-white animate-fade-in max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
                Instant online bookings
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 text-white/95 font-light drop-shadow-md">
                Explore exceptional dining experiences at Café Fausse
              </p>
              {/* Category Buttons */}
              <div className="animate-fade-in">
                <p className="text-white/90 mb-4 md:mb-6 text-base md:text-lg font-medium drop-shadow-sm">Browse featured categories:</p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
                  <Button variant="outline" className="border-2 border-primary-500 text-primary-100 hover:bg-primary-500 hover:text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/10">
                    <Link to="/menu">Restaurant Specials</Link>
                  </Button>
                  <Button variant="outline" className="border-2 border-primary-500 text-primary-100 hover:bg-primary-500 hover:text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/10">
                    <Link to="/about">About Our Story</Link>
                  </Button>
                  <Button variant="outline" className="border-2 border-primary-500 text-primary-100 hover:bg-primary-500 hover:text-white rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/10">
                    <Link to="/gallery">Photo Gallery</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 