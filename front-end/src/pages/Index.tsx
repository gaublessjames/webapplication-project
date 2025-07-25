import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Users, Clock, MapPin, Search, User, LogOut, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from '@/hooks/useApi';

import HeroBookingForm from "@/components/HeroBookingForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import React, { useState, useEffect } from "react";
import Footer, { NewsletterSignupForm } from "@/components/Footer";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

const Index = () => {
  const { user, loading, signOut, role } = useAuth();
  const [reviewForm, setReviewForm] = useState({ title: "", rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [currentReview, setCurrentReview] = useState(0);
  const [awards, setAwards] = useState([]);
  const [awardsLoading, setAwardsLoading] = useState(true);
  const [awardsError, setAwardsError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const { getMenuCategories } = useApi();

  // API base URL (configurable for dev/prod)
  const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL;

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");
      try {
        const res = await fetch(`${API_BASE_URL}/testimonials`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err: any) {
        setReviewsError(err.message || "Failed to fetch reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [API_BASE_URL]);

  // Refresh reviews after successful submission
  useEffect(() => {
    if (reviewSuccess) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/testimonials`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setReviews(data);
        } catch {}
      })();
    }
  }, [reviewSuccess, API_BASE_URL]);
  
  // Fetch awards from backend
  useEffect(() => {
    const fetchAwards = async () => {
      setAwardsLoading(true);
      setAwardsError("");
      try {
        const res = await fetch(`${API_BASE_URL}/awards`);
        if (!res.ok) throw new Error("Failed to fetch awards");
        const data = await res.json();
        setAwards(data);
      } catch (err: any) {
        setAwardsError(err.message || "Failed to fetch awards");
      } finally {
        setAwardsLoading(false);
      }
    };
    fetchAwards();
  }, [API_BASE_URL]);

  useEffect(() => {
    getMenuCategories()
      .then(data => setCategories(data))
      .catch(e => setCategoriesError(e.message || 'Failed to load categories'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Add review form submit handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reviewForm.title,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        // Show backend validation error if present
        if (data.details && typeof data.details === 'object') {
          const firstField = Object.keys(data.details)[0];
          setReviewError(Array.isArray(data.details[firstField]) ? data.details[firstField][0] : data.details[firstField]);
        } else {
          setReviewError(data.error || "Failed to submit review");
        }
        return;
      }
      setReviewSuccess(true);
      setReviewForm({ title: "", rating: 5, comment: "" });
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Awards block: only show up to 3 featured awards, sorted by display_order, year desc
  const featuredAwards = awards
    .filter((a: any) => a.is_featured)
    .sort((a: any, b: any) => {
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      if (b.year !== a.year) return b.year - a.year;
      return 0;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-foreground">
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

      {/* Booking Bar: Below hero section, not floating */}
      <section className="relative z-30 flex justify-center -mt-16 md:-mt-24 mb-12 select-none touch-manipulation">
        <div className="w-full max-w-3xl bg-white border-2 border-primary-500 shadow-2xl rounded-2xl px-2 py-4 md:px-8 md:py-6 flex flex-col items-center transition-all duration-300 md:scale-100 scale-100 md:rounded-2xl rounded-xl md:mx-0 mx-2">
          <h2 className="text-xl md:text-2xl font-bold text-primary-700 mb-4 text-center w-full">Book Your Table</h2>
          <HeroBookingForm />
        </div>
      </section>

      {/* Popular Cuisines Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-8 text-center drop-shadow-lg">Popular Cuisines</h2>
          {categoriesLoading ? (
            <div className="text-center text-primary-600 py-8">Loading cuisines...</div>
          ) : categoriesError ? (
            <div className="text-center text-red-600 py-8">{categoriesError}</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-primary-400 py-8">No cuisines found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {categories.slice(0, 4).map((cat: any) => (
                <div
                  key={cat.id}
                  className="relative group rounded-3xl bg-gradient-to-br from-primary-100 via-white to-primary-50 shadow-lg p-8 md:p-10 flex flex-col items-center justify-center glass-card border border-white/60 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-20 cursor-pointer"
                  tabIndex={0}
                  aria-label={cat.name}
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full shadow-md">Explore</span>
                  </div>
                  <div className="text-6xl md:text-7xl mb-6 drop-shadow-xl select-none" aria-hidden="true">{cat.icon && cat.icon.trim() ? cat.icon : '🍽️'}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2 drop-shadow-sm">{cat.name}</h3>
                  <p className="text-base md:text-lg text-gray-700 font-medium mb-2 opacity-80">{cat.description}</p>
                  <div className="mt-4 w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-60"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Menu & Story Section - Modern Card Design */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Our Menu Card */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-white via-primary-50 to-primary-100 shadow-xl p-10 flex flex-col items-center justify-center border border-primary-100 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full shadow-md">Explore</span>
              </div>
              <div className="text-6xl md:text-7xl mb-6 drop-shadow-xl select-none" aria-hidden="true">🍽️</div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-3 drop-shadow-sm">Our Menu</h2>
              <p className="text-lg md:text-xl text-gray-700 font-medium mb-6 opacity-90 text-center max-w-md">
                Discover a world of flavor with our curated selection of appetizers, main courses, and desserts—crafted to delight every palate.
              </p>
              <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300">
                <Link to="/menu" className="flex items-center">
                  View Menu
                </Link>
              </Button>
            </div>
            {/* Our Story Card */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-primary-100 via-white to-primary-50 shadow-xl p-10 flex flex-col items-center justify-center border border-primary-100 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full shadow-md">Learn More</span>
              </div>
              <div className="text-6xl md:text-7xl mb-6 drop-shadow-xl select-none" aria-hidden="true">📖</div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-3 drop-shadow-sm">Our Story</h2>
              <p className="text-lg md:text-xl text-gray-700 font-medium mb-6 opacity-90 text-center max-w-md">
                Since 2010, Café Fausse has blended tradition and innovation to create unforgettable dining experiences. Discover our journey and philosophy.
              </p>
              <Button asChild variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg transition-all duration-300">
                <Link to="/about" className="flex items-center">
                  Read Our Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Glassy Redesign */}
      <section className="py-20 bg-neutral-50 relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] h-64 bg-white/60 rounded-full blur-2xl opacity-40 pointer-events-none select-none" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-700 tracking-tight drop-shadow">Why Choose Café Fausse?</h2>
            <div className="w-24 h-1 bg-primary-200 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover what makes us the destination for unforgettable dining experiences.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Award-Winning Excellence",
                description: "Multiple culinary awards and recognition for outstanding service and innovation.",
                icon: "🏆"
              },
              {
                title: "Fresh Local Ingredients",
                description: "Sourced daily from local farms for the highest quality and flavor in every dish.",
                icon: "🌱"
              },
              {
                title: "Exceptional Service",
                description: "Attentive, professional staff dedicated to making your evening truly special.",
                icon: "⭐"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white/80 backdrop-blur-lg border border-primary-100 rounded-3xl shadow-xl p-10 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/95"
                style={{ minHeight: '340px' }}
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 shadow-md mb-6 mt-2 border border-primary-100">
                  <span className="text-5xl md:text-6xl select-none" aria-hidden="true">{feature.icon}</span>
                </div>
                <h3 className="text-2xl md:text-2xl font-bold mb-3 text-primary-700 tracking-tight drop-shadow-sm text-center">{feature.title}</h3>
                <p className="text-gray-700 text-lg font-medium text-center opacity-90 leading-relaxed">{feature.description}</p>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-primary-100 rounded-full opacity-60 group-hover:opacity-90 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">Ready for an Unforgettable Experience?</h2>
          <p className="text-lg md:text-xl text-primary-100 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
            Join us for an evening of exceptional cuisine, elegant ambiance, and impeccable service that will create lasting memories
          </p>
          <Button className="bg-primary-600 hover:bg-primary-700 hover:shadow-xl px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg text-white transition-all duration-300 transform hover:scale-105">
            <Link to="/reservations" className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Awards & Reviews Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-40 z-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vw] h-[60vh] bg-gradient-to-br from-primary-100 via-primary-200 to-primary-50 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1 text-left md:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-2 drop-shadow-lg">Our Awards & What People Say</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mb-4 rounded-full"></div>
              <p className="text-lg md:text-xl text-primary-600 max-w-2xl font-medium opacity-80">Celebrating excellence and sharing the voices of our cherished guests</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 relative">
            {/* Awards Block */}
            <div className="flex flex-col items-center md:items-start bg-white/80 rounded-3xl shadow-2xl p-8 border border-primary-100 glass-card backdrop-blur-lg transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 md:mr-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-3xl md:text-4xl">🏆</span>
                <h3 className="text-2xl font-bold text-primary-700 tracking-tight">Awards</h3>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mb-6 rounded-full opacity-60"></div>
              {awardsLoading ? (
                <div className="text-gray-500 py-4">Loading awards...</div>
              ) : awardsError ? (
                <div className="text-red-600 py-4">{awardsError}</div>
              ) : featuredAwards.length === 0 ? (
                <div className="text-gray-500 py-4">No awards found.</div>
              ) : (
                <ul className="text-primary-700 space-y-4 text-lg font-medium text-left mx-auto max-w-xs">
                  {featuredAwards.map((award, idx) => {
                    let icon = '🏅';
                    if (award.icon) {
                      icon = award.icon;
                    } else if (award.name.includes('Culinary')) {
                      icon = '🏆';
                    } else if (award.name.includes('Restaurant')) {
                      icon = '🥇';
                    } else if (award.name.includes('Fine Dining')) {
                      icon = '🍽️';
                    }
                    return (
                      <li key={award.id || idx} className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        {award.name} <span className="text-primary-400 text-sm ml-auto">{award.category ? `${award.category}, ` : ''}{award.year}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {/* Vertical Divider on Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary-200 via-primary-300 to-primary-100 opacity-60 z-10"></div>
            {/* Customer Reviews Carousel Block */}
            <div className="flex flex-col items-center md:items-start bg-white/80 rounded-3xl shadow-2xl p-8 border border-primary-100 glass-card backdrop-blur-lg transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 md:ml-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-3xl md:text-4xl">💬</span>
                <h3 className="text-2xl font-bold text-primary-700 tracking-tight">Customer Reviews</h3>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mb-6 rounded-full opacity-60"></div>
              {reviewsLoading ? (
                <div className="text-gray-500 py-4">Loading reviews...</div>
              ) : reviewsError ? (
                <div className="text-red-600 py-4">{reviewsError}</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-500 py-4">No reviews yet. Be the first to leave one!</div>
              ) : (
                <div className="relative flex flex-col items-center justify-center min-h-[260px] md:min-h-[300px] w-full h-full">
                  <div className="w-full h-full transition-all duration-300 flex items-center justify-center">
                    {reviews[currentReview] && (
                      <div key={reviews[currentReview].id} className="bg-white/10 backdrop-blur-xl border-2 border-yellow-400/60 rounded-3xl p-10 md:p-12 shadow-2xl animate-fade-in flex flex-col items-center justify-center w-full h-full min-h-[240px] md:min-h-[300px] transition-all duration-300 relative">
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 text-5xl md:text-6xl drop-shadow-lg select-none">“</span>
                        <div className="flex flex-col items-center gap-2 mb-4 w-full">
                          <span className="font-extrabold text-primary-800 text-2xl md:text-3xl text-center w-full tracking-tight drop-shadow">{reviews[currentReview].title}</span>
                          <span className="flex items-center justify-center mt-1">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={`w-6 h-6 md:w-7 md:h-7 ${star <= reviews[currentReview].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={star <= reviews[currentReview].rating ? '#facc15' : 'none'} strokeWidth={2} />
                            ))}
                          </span>
                        </div>
                        <div className="text-gray-800 text-lg md:text-xl italic mb-4 text-center w-full leading-relaxed">{reviews[currentReview].comment}</div>
                        <div className="text-xs text-yellow-700 mt-2 text-center w-full tracking-wide">{reviews[currentReview].created_at ? new Date(reviews[currentReview].created_at).toLocaleDateString() : ''}</div>
                      </div>
                    )}
                  </div>
                  {reviews.length > 1 && (
                    <div className="flex items-center gap-4 mt-6">
                      <button
                        className="p-3 rounded-full bg-primary-200 hover:bg-primary-400 text-primary-700 shadow-md transition-all duration-200 disabled:opacity-40"
                        onClick={() => setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
                        disabled={reviews.length <= 1}
                        aria-label="Previous review"
                      >
                        <ChevronLeft className="w-7 h-7" />
                      </button>
                      <span className="text-primary-600 font-medium text-base md:text-lg">
                        {currentReview + 1} / {reviews.length}
                      </span>
                      <button
                        className="p-3 rounded-full bg-primary-200 hover:bg-primary-400 text-primary-700 shadow-md transition-all duration-200 disabled:opacity-40"
                        onClick={() => setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))}
                        disabled={reviews.length <= 1}
                        aria-label="Next review"
                      >
                        <ChevronRight className="w-7 h-7" />
                      </button>
                    </div>
                  )}
                  <button
                    className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 text-white font-bold text-lg shadow-lg border-0 transition-all duration-300 hover:from-primary-700 hover:to-primary-500 focus:ring-2 focus:ring-primary-400 focus:outline-none"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Add a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-10 w-full max-w-lg relative glass-card backdrop-blur-xl border-0">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-3xl" onClick={() => setShowReviewModal(false)}>&times;</button>
            <h3 className="text-2xl font-bold text-primary-700 mb-4 text-center">Add Your Review</h3>
            {reviewSuccess ? (
              <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">Thank you for your review! It will appear once approved.</div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6 text-left">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Review Title</label>
                  <input
                    type="text"
                    className="w-full border border-primary-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    value={reviewForm.title}
                    onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                        className="focus:outline-none"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 ${star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          fill={star <= reviewForm.rating ? '#facc15' : 'none'}
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-primary-700 font-medium">{reviewForm.rating} / 5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Comment</label>
                  <textarea
                    className="w-full border border-primary-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={3}
                  />
                </div>
                {reviewError && <div className="text-red-600 text-sm mb-2">{reviewError}</div>}
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-300 disabled:opacity-60"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Newsletter Signup Section - Full Red Gradient Row */}
      <section className="w-full bg-gradient-to-r from-red-800 via-primary-600 to-primary-500 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <NewsletterSignupForm />
        </div>
      </section>
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Mobile menu trigger and Sheet for Index page (only on mobile) */}
      <div className="lg:hidden fixed top-4 right-4 z-[9999]">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="text-primary-600 bg-white/90 hover:bg-primary-50 transition-all duration-300 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="5" width="32" height="5" rx="2.5" fill="currentColor" />
                <rect y="13.5" width="32" height="5" rx="2.5" fill="currentColor" />
                <rect y="22" width="32" height="5" rx="2.5" fill="currentColor" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-4/5 max-w-xs">
            <nav className="flex flex-col gap-2 p-6">
              <SheetClose asChild><Link to="/" className="font-semibold px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Home</Link></SheetClose>
              <SheetClose asChild><Link to="/menu" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Menu</Link></SheetClose>
              <SheetClose asChild><Link to="/about" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">About</Link></SheetClose>
              <SheetClose asChild><Link to="/gallery" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Gallery</Link></SheetClose>
              {/* Only show Reservations if NOT signed in */}
              {!user && (
                <SheetClose asChild><Link to="/reservations" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Reservations</Link></SheetClose>
              )}
              {/* Show Dashboard/Admin Dashboard if signed in */}
              {user && (
                role === "admin" ? (
                  <SheetClose asChild><Link to="/admin" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Admin Dashboard</Link></SheetClose>
                ) : (
                  <SheetClose asChild><Link to="/dashboard" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Dashboard</Link></SheetClose>
                )
              )}
              {!user ? (
                <>
                  <SheetClose asChild><Link to="/auth" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Sign In</Link></SheetClose>
                  <SheetClose asChild><Link to="/auth" className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50">Sign Up</Link></SheetClose>
                </>
              ) : (
                <SheetClose asChild>
                  <button onClick={signOut} className="font-medium px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 w-full text-left">Sign Out</button>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Index;