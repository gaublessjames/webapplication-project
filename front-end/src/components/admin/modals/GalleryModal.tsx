import { useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { GalleryImage, GalleryForm } from "@/types/admin";

interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: GalleryImage | null;
  form: GalleryForm;
  setForm: (form: GalleryForm | ((prev: GalleryForm) => GalleryForm)) => void;
  onSubmit: () => void;
}

export default function GalleryModal({
  open,
  onOpenChange,
  image,
  form,
  setForm,
  onSubmit
}: GalleryModalProps) {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setForm((prev: GalleryForm) => ({ ...prev, url: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setForm((prev: GalleryForm) => ({ ...prev, url: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFormChange = (e: { target: { name: string; value: string; type: string; checked: boolean } }) => {
    const { name, value, type, checked } = e.target;
    setForm((f: GalleryForm) => ({ ...f, [name]: type === 'checkbox' ? checked : value } as GalleryForm));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {image ? 'Edit Gallery Image' : 'Add Gallery Image'}
          </DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL to add it to the gallery.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
          {/* Upload Method Toggle */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={uploadMethod === 'url' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('url')}
              className="flex-1"
            >
              Image URL
            </Button>
            <Button
              type="button"
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('file')}
              className="flex-1"
            >
              File Upload
            </Button>
          </div>

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                required
              />
              {form.url && (
                <div className="mt-2">
                  <Label>Preview</Label>
                  <img 
                    src={form.url} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <div className="mt-2">
                  <Label>Selected File</Label>
                  <p className="text-sm text-slate-600">{selectedFile.name}</p>
                  <img 
                    src={form.url} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border mt-2"
                  />
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                name="alt"
                value={form.alt}
                onChange={handleFormChange}
                placeholder="Description of the image"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={form.category}
                onChange={handleFormChange}
                placeholder="e.g., Food, Interior, Events"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={form.display_order}
                onChange={handleFormChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Checkbox
                  name="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => 
                    setForm((prev: GalleryForm) => ({ ...prev, is_active: checked as boolean }))
                  }
                />
                <span>Active</span>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              {image ? 'Update' : 'Add'} Image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 