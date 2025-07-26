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
import { Award, AwardForm } from "@/types/admin";

interface AwardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  award: Award | null;
  form: AwardForm;
  setForm: (form: AwardForm) => void;
  onSubmit: () => void;
}

export default function AwardModal({
  open,
  onOpenChange,
  award,
  form,
  setForm,
  onSubmit
}: AwardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{award ? 'Edit Award' : 'Add Award'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={form.year}
              onChange={e => setForm({ ...form, year: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex items-center">
            <Checkbox
              name="is_featured"
              checked={form.is_featured}
              onCheckedChange={checked => setForm({ ...form, is_featured: checked as boolean })}
            />
            <span>Featured</span>
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
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              {award ? 'Update' : 'Add'} Award
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 