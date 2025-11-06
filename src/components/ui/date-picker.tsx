import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface DatePickerSectionProps { 
  date: Date | undefined ;onChange: (date: Date | undefined) => void };

export default function DatePickerSection({ date, onChange }:DatePickerSectionProps) {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-3">Select Date</h2>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
