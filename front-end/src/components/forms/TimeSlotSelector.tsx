import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTimeSlotsForDate } from "@/utils/date";
import { BaseComponentProps } from "@/types/common";

interface TimeSlotSelectorProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  date?: Date;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export default function TimeSlotSelector({
  value,
  onChange,
  date,
  disabled = false,
  placeholder = "Select a time",
  error,
  className = ''
}: TimeSlotSelectorProps) {
  const timeSlots = getTimeSlotsForDate(date);

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((time) => (
            <SelectItem key={time} value={time}>
              {formatTimeForDisplay(time)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
} 