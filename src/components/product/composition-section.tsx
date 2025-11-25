'use client'

import { Controller, Control, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import { ProductFormData } from '@/app/(UI)/admin/product/add/page'

interface CompositionSectionProps {
  control: Control<ProductFormData>
  availableProducts: Array<{ id: string; name: string }>
  loading?:boolean;
}

export default function CompositionSection({
  control,
  availableProducts,
  
}: CompositionSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'composition',
  })

  const handleAddRow = () => {
    append({ childProductId: '', qty: 1 })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Composition</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Composition Row
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No composition items added yet. Click "Add Composition Row" to add items.
            </p>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row gap-3 items-end p-4 border rounded-lg bg-card"
              >
                {/* Child Product Select */}
                <div className="flex-1 space-y-2 w-full md:w-auto">
                  <Label htmlFor={`composition.${index}.childProductId`}>Child Product</Label>
                  <Controller
                    name={`composition.${index}.childProductId`}
                    control={control}
                    rules={{ required: 'Product is required' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={`composition.${index}.childProductId`}>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Quantity */}
                <div className="flex-1 space-y-2 w-full md:w-auto md:flex-none md:min-w-24">
                  <Label htmlFor={`composition.${index}.qty`}>Quantity</Label>
                  <Controller
                    name={`composition.${index}.qty`}
                    control={control}
                    rules={{
                      required: 'Quantity is required',
                    }}
                    render={({ field }) => (
                      <Input
                        id={`composition.${index}.qty`}
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    )}
                  />
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full md:w-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
