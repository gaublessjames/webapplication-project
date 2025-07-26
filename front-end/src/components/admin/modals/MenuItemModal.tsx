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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuItem, MenuItemForm, MenuCategory } from "@/types/admin";

interface MenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  form: MenuItemForm;
  setForm: (form: MenuItemForm) => void;
  categories: MenuCategory[];
  onSubmit: () => void;
}

export default function MenuItemModal({
  open,
  onOpenChange,
  item,
  form,
  setForm,
  categories,
  onSubmit
}: MenuItemModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Menu Item Details</h3>
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  required
                  className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(value) => setForm({ ...form, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-center">
                <Checkbox
                  name="is_vegetarian"
                  checked={form.is_vegetarian}
                  onCheckedChange={checked => setForm({ ...form, is_vegetarian: checked as boolean })}
                />
                <span>Vegetarian</span>
              </div>
              <div className="space-y-2 flex items-center">
                <Checkbox
                  name="is_gluten_free"
                  checked={form.is_gluten_free}
                  onCheckedChange={checked => setForm({ ...form, is_gluten_free: checked as boolean })}
                />
                <span>Gluten-Free</span>
              </div>
              <div className="space-y-2 flex items-center">
                <Checkbox
                  name="is_spicy"
                  checked={form.is_spicy}
                  onCheckedChange={checked => setForm({ ...form, is_spicy: checked as boolean })}
                />
                <span>Spicy</span>
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
              {item ? 'Update' : 'Add'} Menu Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 