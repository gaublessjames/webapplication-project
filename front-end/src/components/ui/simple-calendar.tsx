import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

const SimpleCalendar = ({ selected, onSelect, disabled, className }: SimpleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const isDisabled = (date: Date | null) => {
    if (!date) return true;
    return disabled ? disabled(date) : false;
  };

  return (
    <div className={cn("p-4 bg-white border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => date && !isDisabled(date) && onSelect?.(date)}
            disabled={!date || isDisabled(date)}
            className={cn(
              "h-9 w-9 text-sm rounded-md transition-colors",
              "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
              {
                "text-gray-400 cursor-not-allowed": !date || isDisabled(date),
                "bg-primary-600 text-white hover:bg-primary-700": isSelected(date),
                "bg-gray-100 font-semibold": isToday(date) && !isSelected(date),
                "text-gray-900": date && !isDisabled(date) && !isSelected(date) && !isToday(date),
              }
            )}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SimpleCalendar;