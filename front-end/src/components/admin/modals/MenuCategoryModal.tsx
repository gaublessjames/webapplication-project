import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuCategory, MenuCategoryForm } from "@/types/admin";

interface MenuCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategory | null;
  form: MenuCategoryForm;
  setForm: (form: MenuCategoryForm) => void;
  onSubmit: () => void;
}

export default function MenuCategoryModal({
  open,
  onOpenChange,
  category,
  form,
  setForm,
  onSubmit
}: MenuCategoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Category Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                  className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g., Utensils, Wine, Coffee"
                  className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={e => setForm({ ...form, display_order: Number(e.target.value) })}
                  placeholder="0"
                  className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="space-y-2 flex items-center">
                <Checkbox
                  name="is_active"
                  checked={form.is_active}
                  onCheckedChange={checked => setForm({ ...form, is_active: checked as boolean })}
                />
                <span>Active</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-4 justify-end mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              {category ? 'Update' : 'Add'} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 