import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

const ADMIN_EMAILS = [
  "admin@cafefausse.com"
];

const Header = () => {
  const { user, signOut, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isLoggedIn = Boolean(user && user.email);

  return (
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
                  onClick={signOut}
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

          {/* Mobile menu button and Sheet */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-primary-600 hover:bg-primary-50"
                  aria-label="Open menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary-600">
                      Café Fausse
                    </Link>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-primary-600 hover:bg-primary-50"
                        aria-label="Close menu"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <nav className="flex-1 space-y-4">
                    <SheetClose asChild><Link to="/" className={`font-medium px-4 py-2 rounded-lg ${isActive("/") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Home</Link></SheetClose>
                    <SheetClose asChild><Link to="/menu" className={`font-medium px-4 py-2 rounded-lg ${isActive("/menu") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Menu</Link></SheetClose>
                    <SheetClose asChild><Link to="/about" className={`font-medium px-4 py-2 rounded-lg ${isActive("/about") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>About</Link></SheetClose>
                    <SheetClose asChild><Link to="/gallery" className={`font-medium px-4 py-2 rounded-lg ${isActive("/gallery") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Gallery</Link></SheetClose>
                    <SheetClose asChild><Link to="/reservations" className={`font-medium px-4 py-2 rounded-lg ${isActive("/reservations") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Reservations</Link></SheetClose>
                  </nav>
                  
                  <div className="border-t border-gray-200 pt-4">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                          <span className="text-primary-700 text-sm font-medium">
                            {user.email?.split('@')[0]}
                          </span>
                        </div>
                        <Button
                          onClick={signOut}
                          variant="outline"
                          size="sm"
                          className="w-full border-primary-300 text-primary-600 hover:bg-primary-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button asChild variant="outline" size="sm" className="w-full border-primary-600 text-primary-600 hover:bg-primary-50">
                          <Link to="/auth">
                            <User className="w-4 h-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                          <Link to="/auth">Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 