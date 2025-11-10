"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"

type StockTransferFormData = {
  product: string
  date: Date | undefined
  from: string
  to: string
  quantity: string
}

const PRODUCTS = ["5kg Cylinder", "10kg Cylinder", "15kg Cylinder", "19kg Cylinder"]

const LOCATION_OPTIONS = ["Office", "Godown", "KL58B2333", "KL58B3444", "KL58B4555"]

export default function StockTransferSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [fromLocation, setFromLocation] = useState<string>("")
  const [toLocation, setToLocation] = useState<string>("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StockTransferFormData>({
    defaultValues: {
      product: "",
      date: undefined,
      from: "",
      to: "",
      quantity: "",
    },
  })

  const onSubmit = (data: StockTransferFormData) => {
    const formData = {
      ...data,
      date: selectedDate,
      from: fromLocation,
      to: toLocation,
    }
    console.log("Form submitted:", formData)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Stock Transfer</CardTitle>
        <CardDescription>Transfer stock between Office, Godown, and Vehicles</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Product & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Product Select */}
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <select
                id="product"
                {...register("product", { required: "Product is required" })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choose a product...</option>
                {PRODUCTS.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
              {errors.product && <p className="text-sm text-destructive">{errors.product.message}</p>}
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>

          {/* Row 2: From & To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* From Section */}
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger id="from">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_OPTIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Section */}
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger id="to">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_OPTIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Transferred Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
              })}
              className="w-full"
            />
            {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full sm:w-auto">
            Record Transfer
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}