"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onDateChange: (dateRange: DateRange | undefined) => void;
  onExport: () => void;
}

export function Header({ onDateChange, onExport }: HeaderProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const { toast } = useToast();

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
    
    if (selectedDate?.from && selectedDate?.to) {
      toast({
        title: "Date range updated",
        description: `Data filtered from ${format(selectedDate.from, "PPP")} to ${format(selectedDate.to, "PPP")}`,
      });
    }
  };

  const handleExport = () => {
    onExport();
    toast({
      title: "Data exported",
      description: "Dashboard data has been exported as CSV",
    });
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 border-b bg-card">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-foreground mr-4">Analytics Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}