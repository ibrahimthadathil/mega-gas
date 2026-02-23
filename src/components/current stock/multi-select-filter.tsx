
"use client"

import * as React from "react"
import { ChevronsUpDown, Warehouse } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface MultiSelectFilterProps {
  options: { id: string; name: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder: string
  label: string
  icon?: React.ReactNode
}

export function MultiSelectFilter({ options, selected, onChange, placeholder, label, icon }: MultiSelectFilterProps) {
  const toggleOption = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id]
    onChange(newSelected)
  }

  const selectedOptions = options.filter(opt => selected.includes(opt.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 border-dashed flex gap-2 w-full justify-start text-left font-normal"
        >
          {icon || <Warehouse className="h-4 w-4 shrink-0 opacity-50" />}
          {selected.length > 0 ? (
            <div className="flex gap-1 flex-wrap overflow-hidden max-w-[200px] sm:max-w-none">
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selected.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selected.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selected.length} selected
                  </Badge>
                ) : (
                  selectedOptions.map((opt) => (
                    <Badge variant="secondary" key={opt.id} className="rounded-sm px-1 font-normal">
                      {opt.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-3">
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">Select multiple items to filter</p>
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 px-2 py-2 hover:bg-accent rounded-sm cursor-pointer"
                onClick={() => toggleOption(option.id)}
              >
                <Checkbox
                  id={`filter-${option.id}`}
                  checked={selected.includes(option.id)}
                  onCheckedChange={() => toggleOption(option.id)}
                />
                <label
                  htmlFor={`filter-${option.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 truncate"
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        {selected.length > 0 && (
          <>
            <Separator />
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full justify-center text-xs h-8"
                onClick={() => onChange([])}
              >
                Clear selection
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
