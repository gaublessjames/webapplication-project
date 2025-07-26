import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, EyeOff } from "lucide-react";
import { GalleryImage } from "@/types/admin";

interface GalleryManagementProps {
  galleryImages: GalleryImage[];
  loading: boolean;
  error: string;
  onAdd: () => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

export default function GalleryManagement({
  galleryImages,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete
}: GalleryManagementProps) {
  // Show loading state only if we're actively loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-slate-600">Loading gallery images...</span>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gallery Images</CardTitle>
          <Button onClick={onAdd} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((img) => (
              <Card key={img.id} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <img 
                    src={img.url} 
                    alt={img.alt} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit(img)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(img)}
                        className="bg-red-500/90 hover:bg-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {!img.is_active && (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-1">{img.alt}</h3>
                  <p className="text-sm text-slate-500 mb-2">{img.category}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Order: {img.display_order}</span>
                    <span>{img.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 