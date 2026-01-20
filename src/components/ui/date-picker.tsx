

"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  allowFutureDates?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  allowFutureDates = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            !date && "text-muted-foreground"
          }`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (!d) {
              onDateChange(undefined);
              return;
            }

            // ✅ LOCAL DATE ONLY (no time, no timezone shift)
            const localDate = new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate()
            );

            onDateChange(localDate);
          }}
          disabled={(d) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (allowFutureDates) {
              return d < new Date("1900-01-01");
            }

            return d > today || d < new Date("1900-01-01");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
