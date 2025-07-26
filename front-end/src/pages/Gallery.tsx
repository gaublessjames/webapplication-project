import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Award, Star, Camera, Heart, Phone, MapPin, Clock, Calendar, ChefHat, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import { useApi } from '@/hooks/useApi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GalleryGrid, GalleryFilter } from '@/components/features/gallery';
import { LoadingSpinner } from '@/components/shared';

// Import local gallery assets
import galleryCafeInterior from "@/assets/gallery-cafe-interior.webp";
import galleryRibeyeSteak from "@/assets/gallery-ribeye-steak.webp";
import gallerySpecialEvent from "@/assets/gallery-special-event.webp";

const Gallery = () => {
  const { getGalleryImages } = useApi();
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local gallery images that always display first
  const localGalleryImages = [
    {
      id: "local-cafe-interior",
      url: galleryCafeInterior,
      alt: "Elegant Café Fausse Interior",
      title: "Café Fausse Interior",
      description: "Our elegant dining room with warm lighting and sophisticated ambiance",
      category: "interior",
      is_featured: true,
      is_local: true
    },
    {
      id: "local-ribeye-steak",
      url: galleryRibeyeSteak,
      alt: "Premium Ribeye Steak",
      title: "Premium Ribeye Steak",
      description: "Perfectly cooked ribeye steak with our signature herb butter",
      category: "food",
      is_featured: true,
      is_local: true
    },
    {
      id: "local-special-event",
      url: gallerySpecialEvent,
      alt: "Special Event Setup",
      title: "Special Event Setup",
      description: "Private dining and special event arrangements for memorable occasions",
      category: "events",
      is_featured: true,
      is_local: true
    }
  ];

  useEffect(() => {
    setLoading(true);
    getGalleryImages()
      .then((data) => {
        // Combine local images first, then database images
        const dbImages = Array.isArray(data) ? data : [];
        const combinedImages = [...localGalleryImages, ...dbImages];
        setGalleryImages(combinedImages);
      })
      .catch((e) => {
        setError('Failed to load gallery images.');
        // Even if database fails, show local images
        setGalleryImages(localGalleryImages);
      })
      .finally(() => setLoading(false));
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const awards = [
    {
      title: "Culinary Excellence Award",
      year: "2022",
      organization: "Culinary Institute",
      description: "Recognized for outstanding culinary excellence and commitment to unforgettable dining experiences",
      icon: "🏆"
    },
    {
      title: "Restaurant of the Year",
      year: "2023", 
      organization: "Food & Wine Magazine",
      description: "Named 'Restaurant of the Year' for exceptional service and locally sourced ingredients",
      icon: "🥇"
    },
    {
      title: "Best Fine Dining Experience",
      year: "2023",
      organization: "Foodie Magazine",
      description: "Awarded for providing the best fine dining experience in the region",
      icon: "⭐"
    }
  ];

  const reviews = [
    {
      quote: "Exceptional ambiance and unforgettable flavors.",
      source: "Gourmet Review",
      rating: 5,
      reviewer: "Gourmet Review"
    },
    {
      quote: "A must-visit restaurant for food enthusiasts.",
      source: "The Daily Bite",
      rating: 5,
      reviewer: "The Daily Bite"
    }
  ];

  // Categories from images (including local images)
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
          <GalleryFilter
            images={galleryImages}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 md:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner text="Loading gallery..." />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-12 text-xl">{error}</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center text-primary-400 py-12 text-xl">No images available.</div>
          ) : (
            <GalleryGrid
              images={filteredImages}
              onImageClick={openLightbox}
              selectedCategory={selectedCategory}
            />
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
                  alt={filteredImages[lightboxIndex].alt || filteredImages[lightboxIndex].alt_text}
                  className="w-full h-auto max-h-[80vh] rounded-xl shadow-2xl border-4 border-white object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {filteredImages[lightboxIndex].alt || filteredImages[lightboxIndex].alt_text}
                  </h3>
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

      {/* Awards Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-yellow-50 via-primary-100 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Our Awards</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recognition for our commitment to culinary excellence and exceptional dining experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-primary-200">
                <div className="text-4xl mb-4">{award.icon}</div>
                <h3 className="text-xl font-bold text-primary-700 mb-2">{award.title}</h3>
                <p className="text-primary-600 font-medium mb-2">{award.organization} - {award.year}</p>
                <p className="text-gray-600 text-sm">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Customer Reviews</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              What our valued guests have to say about their dining experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-primary-200">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "{review.quote}"
                </blockquote>
                <div className="text-sm text-primary-600 font-medium">
                  — {review.reviewer}
                </div>
              </div>
            ))}
          </div>
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