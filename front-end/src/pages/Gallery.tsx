import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Award, Star, Camera, Heart, Phone, MapPin, Clock, Calendar, ChefHat, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import { useApi } from '@/hooks/useApi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Gallery = () => {
  const { getGalleryImages } = useApi();
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getGalleryImages()
      .then((data) => {
        setGalleryImages(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        setError('Failed to load gallery images.');
        setGalleryImages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const awards = [
    {
      title: "Michelin Star",
      year: "2018-2024",
      organization: "Michelin Guide",
      description: "Consistently awarded for exceptional culinary excellence and service",
      icon: "⭐"
    },
    {
      title: "World's 50 Best Restaurants",
      year: "2023", 
      organization: "The World's 50 Best",
      description: "Ranked among the globe's finest dining establishments",
      icon: "🌍"
    },
    {
      title: "James Beard Nomination",
      year: "2022",
      organization: "James Beard Foundation",
      description: "Outstanding Restaurant nominee for culinary excellence",
      icon: "🏆"
    },
    {
      title: "Wine Spectator Grand Award",
      year: "2021-2024",
      organization: "Wine Spectator",
      description: "Recognized for exceptional wine program and cellar",
      icon: "🍷"
    }
  ];

  const reviews = [
    {
      quote: "An extraordinary culinary journey that transcends typical fine dining. Every course is a masterpiece.",
      source: "Food & Wine Magazine",
      rating: 5,
      reviewer: "James Patterson, Food Critic"
    },
    {
      quote: "Café Fausse represents the pinnacle of gastronomic achievement. Absolutely flawless execution.",
      source: "Michelin Guide",
      rating: 5,
      reviewer: "Sarah Chen, Inspector"
    },
    {
      quote: "The perfect harmony of innovation and tradition. This is destination dining at its finest.",
      source: "Condé Nast Traveler",
      rating: 5,
      reviewer: "Michael Torres, Editor"
    },
    {
      quote: "An unforgettable experience that engages all senses. The attention to detail is remarkable.",
      source: "The New York Times",
      rating: 5,
      reviewer: "Emma Rodriguez, Critic"
    }
  ];

  // Categories from images
  const categories = [
    "All",
    ...Array.from(new Set(galleryImages.map(img => img.category).filter(Boolean)))
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredImages = selectedCategory === "All"
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);

  // Lightbox navigation handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxIndex(-1), 200);
  };
  const gotoPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  }, [filteredImages.length]);
  const gotoNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  }, [filteredImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") gotoPrev();
      if (e.key === "ArrowRight") gotoNext();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, gotoPrev, gotoNext]);

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
            <div className="text-6xl mb-6">📸</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Visual Stories
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 font-light max-w-3xl mx-auto drop-shadow-md">
              Experience the artistry, elegance, and passion that defines every moment at Café Fausse
            </p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 px-4 bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 ${
                  selectedCategory === category 
                    ? "bg-primary-600 text-white shadow-lg hover:bg-primary-700" 
                    : "border-primary-300 text-primary-600 hover:bg-primary-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 md:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-primary-600 py-12 text-xl">Loading gallery...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-12 text-xl">{error}</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center text-primary-400 py-12 text-xl">No images available.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, idx) => (
                <Card
                  key={image.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary-200"
                  onClick={() => openLightbox(idx)}
                  tabIndex={0}
                  aria-label={`View ${image.alt}`}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") openLightbox(idx); }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <Badge className="absolute top-3 right-3 bg-primary-600/90 text-white border-0 shadow-lg">
                      {image.category}
                    </Badge>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-gray-800 font-medium truncate">{image.alt}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {/* Lightbox Modal */}
          {lightboxOpen && lightboxIndex >= 0 && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <button
                className="absolute top-6 right-8 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 z-20"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X className="w-7 h-7" />
              </button>
              <button
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 z-20"
                onClick={gotoPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <div className="relative max-w-3xl w-full mx-4 md:mx-0">
                <img
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].alt}
                  className="w-full h-auto max-h-[80vh] rounded-xl shadow-2xl border-4 border-white object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                  <h3 className="text-white font-semibold text-lg mb-2">{filteredImages[lightboxIndex].alt}</h3>
                  <Badge className="bg-primary-600 text-white border-0">
                    {filteredImages[lightboxIndex].category}
                  </Badge>
                </div>
              </div>
              <button
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 z-20"
                onClick={gotoNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Create Your Own Story</h2>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
            Experience the artistry, taste the excellence, and become part of our visual legacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/reservations" className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Experience
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

export default Gallery;