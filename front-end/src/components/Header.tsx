import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

const Header = () => {
  const { user, signOut, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isLoggedIn = Boolean(user && user.email);

  // Improved signout handler
  const handleSignOut = async () => {
    try {
      console.log('🔄 Signing out...', { user: user?.email, role });
      
      // Close mobile menu first
      setMobileMenuOpen(false);
      
      // Check if user is actually logged in
      if (!user) {
        console.log('⚠️ No user to sign out');
        return;
      }
      
      await signOut();
      console.log('✅ Sign out completed');
      
    } catch (error) {
      console.error('❌ Error during sign out:', error);
    }
  };

  // Navigation items
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/about", label: "About" },
    { path: "/gallery", label: "Gallery" },
    { path: "/reservations", label: "Reservations" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-all duration-300 transform hover:scale-105"
          >
            Café Fausse
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Desktop Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full border border-primary-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="text-primary-700 text-sm font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300"
                >
                  <Link to={role === 'admin' ? '/admin' : '/dashboard'}>
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={handleSignOut}
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
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300 font-medium"
                >
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              
              {/* Mobile Menu Content */}
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md border-l border-gray-200">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <Link 
                      to="/" 
                      className="text-2xl font-bold text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Café Fausse
                    </Link>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        aria-label="Close menu"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.path}>
                        <Link
                          to={item.path}
                          className={`block font-medium px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive(item.path)
                              ? "bg-primary-600 text-white shadow-md"
                              : "text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  
                  {/* Auth Section */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    {isLoggedIn ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <p className="text-primary-700 font-medium text-sm">
                              {user.email?.split('@')[0]}
                            </p>
                            <p className="text-primary-500 text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* Dashboard Button */}
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300"
                        >
                          <Link 
                            to={role === 'admin' ? '/admin' : '/dashboard'} 
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </Button>
                        
                        {/* Sign Out Button */}
                        <Button
                          onClick={handleSignOut}
                          variant="outline"
                          size="sm"
                          className="w-full border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400 transition-all duration-300"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 transition-all duration-300 font-medium"
                        >
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                            <User className="w-4 h-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                        <Button 
                          asChild 
                          size="sm" 
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                        >
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                            Sign Up
                          </Link>
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