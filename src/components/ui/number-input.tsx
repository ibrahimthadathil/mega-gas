"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string,
  // disabled:boolean
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  placeholder,
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value) || 0
    const clampedValue = Math.max(min, Math.min(max, newValue))
    onChange(clampedValue)
  }

  return (
    <div className="flex items-center gap-2 border border-input rounded-md bg-background">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8 p-0 flex-shrink-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-center outline-none text-sm font-medium px-2"
        style={{
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8 p-0 flex-shrink-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
