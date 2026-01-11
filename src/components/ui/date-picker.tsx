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
          onSelect={(d) =>
            onDateChange(
              d
                ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                : undefined
            )
          }
          disabled={(date) => {
            if (allowFutureDates) {
              return date < new Date("1900-01-01");
            } else {
              return date > new Date() || date < new Date("1900-01-01");
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
