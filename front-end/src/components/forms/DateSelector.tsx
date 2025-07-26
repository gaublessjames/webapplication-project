import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getMinDate, getMaxDate } from "@/utils/date";
import { BaseComponentProps } from "@/types/common";

interface DateSelectorProps extends BaseComponentProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

export default function DateSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Pick a date",
  error,
  minDate,
  maxDate,
  className = ''
}: DateSelectorProps) {
  const minSelectableDate = minDate || getMinDate();
  const maxSelectableDate = maxDate || getMaxDate();

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => {
              return date < minSelectableDate || date > maxSelectableDate;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
} 