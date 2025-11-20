"use client";

import { Controller, type FieldErrors, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { ProductFormData } from "@/app/(UI)/admin/product/add/page";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductDetailsFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

const productTypes = ["Electronics", "Clothing", "Food", "Bundle", "Other"];
const presetProductNames = [
  "Laptop",
  "Desktop Computer",
  "Smartphone",
  "Tablet",
  "Headphones",
  "Monitor",
  "Keyboard",
  "Mouse",
  "USB Cable",
  "Power Bank",
];

export default function ProductDetailsForm({
  control,
  errors,
}: ProductDetailsFormProps) {
  const [openProductName, setOpenProductName] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Code */}
          <div className="space-y-2">
            <Label htmlFor="product_code">Product Code</Label>
            <Input
              id="product_code"
              placeholder="e.g., PROD-001"
              value={"P1"}
              className={errors.product_code ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Controller
              name="product_name"
              control={control}
              rules={{ required: "Product name is required" }}
              render={({ field }) => (
                <Popover
                  open={openProductName}
                  onOpenChange={setOpenProductName}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductName}
                      className={cn(
                        "w-full justify-between",
                        errors.product_name ? "border-destructive" : ""
                      )}
                    >
                      {field.value || "Select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                    align="start"
                  >
                    {" "}
                    <Command>
                      <CommandInput placeholder="Search product..." />
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {presetProductNames.map((product) => (
                            <CommandItem
                              key={product}
                              value={product}
                              onSelect={(currentValue: string) => {
                                field.onChange(
                                  currentValue === field.value
                                    ? ""
                                    : currentValue
                                );
                                setOpenProductName(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === product
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.product_name && (
              <p className="text-sm text-destructive">
                {errors.product_name.message}
              </p>
            )}
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product_type">Product Type</Label>
            <Controller
              name="product_type"
              control={control}
              rules={{ required: "Product type is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="product_type"
                    className={errors.product_type ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.product_type && (
              <p className="text-sm text-destructive">
                {errors.product_type.message}
              </p>
            )}
          </div>

          {/* Available Quantity */}
          <div className="space-y-2">
            <Label htmlFor="available_qty">Available Quantity</Label>
            <Controller
              name="available_qty"
              control={control}
              rules={{
                required: "Quantity is required",
                min: { value: 0, message: "Quantity must be positive" },
              }}
              render={({ field }) => (
                <Input
                  id="available_qty"
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value) || 0)
                  }
                  className={errors.available_qty ? "border-destructive" : ""}
                />
              )}
            />
            {errors.available_qty && (
              <p className="text-sm text-destructive">
                {errors.available_qty.message}
              </p>
            )}
          </div>

          {/* Sale Price */}
          <div className="space-y-2">
            <Label htmlFor="sale_price">Sale Price</Label>
            <Controller
              name="sale_price"
              control={control}
              rules={{
                required: "Sale price is required",
                min: { value: 0, message: "Price must be positive" },
              }}
              render={({ field }) => (
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseFloat(e.target.value) || 0)
                  }
                  className={errors.sale_price ? "border-destructive" : ""}
                />
              )}
            />
            {errors.sale_price && (
              <p className="text-sm text-destructive">
                {errors.sale_price.message}
              </p>
            )}
          </div>

          {/* Cost Price */}
          <div className="space-y-2">
            <Label htmlFor="cost_price">Cost Price</Label>
            <Controller
              name="cost_price"
              control={control}
              rules={{
                required: "Cost price is required",
                min: { value: 0, message: "Price must be positive" },
              }}
              render={({ field }) => (
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseFloat(e.target.value) || 0)
                  }
                  className={errors.cost_price ? "border-destructive" : ""}
                />
              )}
            />
            {errors.cost_price && (
              <p className="text-sm text-destructive">
                {errors.cost_price.message}
              </p>
            )}
          </div>

          {/* Price Edit Enabled */}
          <div className="flex items-center space-x-2 pt-6">
            <Controller
              name="price_edit_enabled"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="price_edit_enabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="price_edit_enabled"
                    className="cursor-pointer font-normal"
                  >
                    Price Edit Enabled
                  </Label>
                </>
              )}
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center space-x-2 pt-6">
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="visibility"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="visibility"
                    className="cursor-pointer font-normal"
                  >
                    Visibility
                  </Label>
                </>
              )}
            />
          </div>

          {/* Is Composite */}
          <div className="flex items-center space-x-2 pt-6">
            <Controller
              name="is_composite"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="is_composite"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="is_composite"
                    className="cursor-pointer font-normal"
                  >
                    Is Composite
                  </Label>
                </>
              )}
            />
          </div>

          {/* Empty Checkbox Field */}
          <div className="flex items-center space-x-2 pt-6">
            <Controller
              name="is_empty"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="empty"
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="empty" className="cursor-pointer font-normal">
                    Empty
                  </Label>
                </>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
