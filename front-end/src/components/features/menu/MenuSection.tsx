import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Star, Wine } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  is_vegetarian?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  is_active?: boolean;
}

interface MenuSectionProps {
  name: string;
  icon?: string;
  items: MenuItem[];
  className?: string;
}

export default function MenuSection({
  name,
  icon = '🍽️',
  items,
  className = ""
}: MenuSectionProps) {
  return (
    <div className={`mb-20 ${className}`} id={`menu-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">{name}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {items.map((item) => (
          <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.name}
                </h3>
                <span className="text-xl md:text-2xl font-bold text-primary-600 ml-4">
                  ${item.price?.toFixed(2)}
                </span>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                {item.description}
              </p>
              
              {/* Dietary Badges */}
              <div className="flex flex-wrap gap-2">
                {item.is_vegetarian && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Leaf className="h-3 w-3 mr-1" />
                    Vegetarian
                  </Badge>
                )}
                {item.is_gluten_free && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    <Star className="h-3 w-3 mr-1" />
                    Gluten-Free
                  </Badge>
                )}
                {item.is_spicy && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                    <Wine className="h-3 w-3 mr-1" />
                    Spicy
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 