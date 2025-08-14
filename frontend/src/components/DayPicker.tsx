import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayPickerProps {
  firstDate: Date;
  lastDate: Date;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DayPicker({ firstDate, lastDate, selectedDate, onDateChange }: DayPickerProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      timeZone: 'America/Los_Angeles'
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-4 px-6 bg-gradient-card rounded-xl border shadow-soft">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeDate(-1)}
        disabled={selectedDate <= firstDate}
        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-lg font-semibold text-foreground min-w-[120px] text-center">
        {formatDate(selectedDate)}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeDate(1)}
        disabled={selectedDate >= lastDate}
        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}