import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">We use cookies</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies to enhance your browsing experience and provide personalized content. 
              By continuing to use our site, you consent to our use of cookies. 
              <Link to="/policies" className="text-primary-600 hover:text-primary-700 underline ml-1">
                Learn more
              </Link>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={rejectCookies}
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Decline
          </Button>
          <Button
            onClick={acceptCookies}
            size="sm"
            className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white"
          >
            Accept All
          </Button>
          <Button
            onClick={rejectCookies}
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;