"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface DatePickerSectionProps {
  date: Date | undefined
  onChange: (date: Date | undefined) => void
}

export default function DatePickerSection({ date, onChange }: DatePickerSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-3">Select Date</h2>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => setOpen(!open)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onChange(selectedDate)
              setOpen(false) // ✅ close popover after selecting date
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
