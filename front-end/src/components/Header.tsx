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
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${
                isActive('/') 
                  ? 'text-white bg-primary-600' 
                  : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive('/menu')
                  ? 'text-white bg-primary-600'
                  : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Menu
            </Link>
            <Link 
              to="/about" 
              className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive('/about')
                  ? 'text-white bg-primary-600'
                  : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              About
            </Link>
            <Link 
              to="/gallery" 
              className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive('/gallery')
                  ? 'text-white bg-primary-600'
                  : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Gallery
            </Link>
            {/* Show Reservations only if NOT logged in */}
            {!isLoggedIn && (
              <Link 
                to="/reservations" 
                className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/reservations')
                    ? 'text-white bg-primary-600'
                    : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                Reservations
              </Link>
            )}
            {/* Show Dashboard/Admin Dashboard if logged in */}
            {isLoggedIn && (
              role === 'admin' ? (
                <Link
                  to="/admin"
                  className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/admin')
                      ? 'text-white bg-primary-600'
                      : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link 
                  to="/dashboard" 
                  className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'text-white bg-primary-600'
                      : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  Dashboard
                </Link>
              )
            )}
            {/* Always show user info and Sign Out for logged-in users */}
            {isLoggedIn && (
              <>
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
              </>
            )}
            </div>

          {/* Mobile menu button and Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="text-primary-600 hover:bg-primary-50 transition-all duration-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Open menu"
                >
                  <span role="img" aria-label="brain" className="text-2xl">🧠</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-4/5 max-w-xs">
                {/* Custom close button for mobile UX */}
                <SheetClose asChild>
                  <button
                    className="absolute top-4 right-4 text-primary-600 hover:text-primary-800 focus:outline-none"
                    aria-label="Close menu"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </SheetClose>
                <nav className="flex flex-col gap-2 p-6">
                  <SheetClose asChild><Link to="/" className={`font-semibold px-4 py-2 rounded-lg ${isActive("/") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Home</Link></SheetClose>
                  <SheetClose asChild><Link to="/menu" className={`font-medium px-4 py-2 rounded-lg ${isActive("/menu") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Menu</Link></SheetClose>
                  <SheetClose asChild><Link to="/about" className={`font-medium px-4 py-2 rounded-lg ${isActive("/about") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>About</Link></SheetClose>
                  <SheetClose asChild><Link to="/gallery" className={`font-medium px-4 py-2 rounded-lg ${isActive("/gallery") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Gallery</Link></SheetClose>
                  {!user && (
                    <SheetClose asChild><Link to="/reservations" className={`font-medium px-4 py-2 rounded-lg ${isActive("/reservations") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Reservations</Link></SheetClose>
                  )}
                  {user && (
                    role === "admin" ? (
                      <SheetClose asChild><Link to="/admin" className={`font-medium px-4 py-2 rounded-lg ${isActive("/admin") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Admin Dashboard</Link></SheetClose>
                    ) : (
                      <SheetClose asChild><Link to="/dashboard" className={`font-medium px-4 py-2 rounded-lg ${isActive("/dashboard") ? "bg-primary-600 text-white" : "text-primary-600 hover:bg-primary-50"}`}>Dashboard</Link></SheetClose>
                    )
                  )}
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full border border-primary-200">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                        <span className="text-primary-700 text-sm font-medium">{user.email?.split("@")[0]}</span>
                      </div>
                      <SheetClose asChild>
                        <Button onClick={signOut} variant="outline" size="sm" className="border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400 transition-all duration-300 mt-2 w-full">
                          <LogOut className="w-4 h-4 mr-2" />Sign Out
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <SheetClose asChild>
                        <Button asChild variant="outline" size="sm" className="border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300 font-medium">
                          <Link to="/auth"><User className="w-4 h-4 mr-2" />Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild size="sm" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                          <Link to="/auth">Sign Up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;