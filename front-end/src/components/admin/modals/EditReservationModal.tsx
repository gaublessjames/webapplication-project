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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reservation, EditForm } from "@/types/admin";

interface EditReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: EditForm | null;
  setEditForm: (form: EditForm | null) => void;
  onSave: () => void;
  loading: boolean;
}

export default function EditReservationModal({
  open,
  onOpenChange,
  editForm,
  setEditForm,
  onSave,
  loading
}: EditReservationModalProps) {
  if (!editForm) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={editForm.date || ''}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={editForm.time || ''}
                onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Party Size</Label>
              <Input
                type="number"
                value={editForm.party_size || editForm.number_of_guests || ''}
                onChange={(e) => setEditForm({ 
                  ...editForm, 
                  party_size: e.target.value,
                  number_of_guests: e.target.value 
                })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editForm.status || ''}
                onValueChange={(value) => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 