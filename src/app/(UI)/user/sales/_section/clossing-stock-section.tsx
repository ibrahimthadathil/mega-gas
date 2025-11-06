"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Cylinder } from "lucide-react"
import NumberInput from "@/components/ui/number-input"

interface ClosingStock {
  id: string
  product: string
  quantity: number
}

interface ClosingStockSectionProps {
  closingStock: ClosingStock[]
  onChange: (stock: ClosingStock[]) => void
}

const products = ["5kg Cylinder", "10kg Cylinder", "15kg Cylinder", "19kg Cylinder"]

export default function ClosingStockSection({ closingStock, onChange }: ClosingStockSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    product: "",
    quantity: 0,
  })

  const handleAdd = () => {
    if (formData.product && formData.quantity > 0) {
      const newItem: ClosingStock = {
        id: Date.now().toString(),
        product: formData.product,
        quantity: formData.quantity,
      }
      onChange([...closingStock, newItem])
      setFormData({ product: "", quantity: 0 })
      setIsOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    onChange(closingStock.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Closing Stock</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Closing Stock</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product</label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <NumberInput
                  value={formData.quantity}
                  onChange={(value) => setFormData({ ...formData, quantity: value })}
                  min={0}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Stock
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {closingStock.map((item) => (
            <Card key={item.id} className="p-4 min-w-max">
              <div className="flex flex-col items-center gap-2 w-32">
                <Cylinder className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-center text-foreground">{item.product}</p>
                <p className="text-2xl font-bold text-primary">{item.quantity}</p>
                <Button size="sm" variant="ghost" className="w-full h-6 mt-2" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
