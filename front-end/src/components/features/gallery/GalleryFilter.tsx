import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryImage {
  id: string;
  category?: string;
}

interface GalleryFilterProps {
  images: GalleryImage[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export default function GalleryFilter({
  images,
  selectedCategory,
  onCategoryChange,
  className = ""
}: GalleryFilterProps) {
  // Get unique categories from images
  const categories = [
    "All",
    ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))
  ];

  return (
    <div className={`flex flex-wrap gap-3 justify-center mb-8 ${className}`}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`rounded-full transition-all duration-300 ${
            selectedCategory === category
              ? "bg-primary-600 text-white shadow-lg"
              : "hover:bg-primary-50 hover:border-primary-300"
          }`}
        >
          {category}
          {category !== "All" && (
            <Badge variant="secondary" className="ml-2 bg-primary-100 text-primary-800">
              {images.filter(img => img.category === category).length}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
} 