import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Heart, Star } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  alt_text?: string;
  alt?: string;
  is_featured?: boolean;
  is_local?: boolean;
}

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
  selectedCategory?: string;
  className?: string;
}

export default function GalleryGrid({
  images,
  onImageClick,
  selectedCategory = "All",
  className = ""
}: GalleryGridProps) {
  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (filteredImages.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          No images found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {filteredImages.map((image, index) => (
        <Card
          key={image.id}
          className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          onClick={() => onImageClick(index)}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={image.url}
              alt={image.alt || image.alt_text || image.title || "Gallery image"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Click to view</p>
              </div>
            </div>

            {/* Local Image Badge */}
            {image.is_local && (
              <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}

            {/* Featured Badge (for non-local images) */}
            {image.is_featured && !image.is_local && (
              <Badge className="absolute top-2 right-2 bg-primary-600 text-white">
                <Heart className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}

            {/* Category Badge */}
            {image.category && (
              <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 text-gray-800">
                {image.category}
              </Badge>
            )}
          </div>

          {(image.title || image.description) && (
            <CardContent className="p-4">
              {image.title && (
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {image.title}
                </h3>
              )}
              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {image.description}
                </p>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
} 