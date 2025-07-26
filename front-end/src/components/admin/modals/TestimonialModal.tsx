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
import { Testimonial, TestimonialForm } from "@/types/admin";

interface TestimonialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  form: TestimonialForm;
  setForm: (form: TestimonialForm) => void;
  onSubmit: () => void;
}

export default function TestimonialModal({
  open,
  onOpenChange,
  testimonial,
  form,
  setForm,
  onSubmit
}: TestimonialModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              name="comment"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={form.customer_name}
              onChange={e => setForm({ ...form, customer_name: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex items-center">
            <Checkbox
              name="is_approved"
              checked={form.is_approved}
              onCheckedChange={checked => setForm({ ...form, is_approved: checked as boolean })}
            />
            <span>Approved</span>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              {testimonial ? 'Update' : 'Add'} Testimonial
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 