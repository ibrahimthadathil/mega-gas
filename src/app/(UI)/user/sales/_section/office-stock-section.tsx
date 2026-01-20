"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import NumberInput from "@/components/ui/number-input"

interface OfficeStock {
  id: string
  product: string
  quantity: number
}

interface OfficeStockSectionProps {
  stock: OfficeStock[]
  onChange: (stock: OfficeStock[]) => void
}

const products = ["5kg Cylinder", "10kg Cylinder", "15kg Cylinder", "19kg Cylinder"]

export default function OfficeStockSection({ stock, onChange }: OfficeStockSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    product: "",
    quantity: 0,
  })

  const handleAdd = () => {
    if (formData.product && formData.quantity > 0) {
      const newItem: OfficeStock = {
        id: Date.now().toString(),
        product: formData.product,
        quantity: formData.quantity,
      }
      onChange([...stock, newItem])
      setFormData({ product: "", quantity: 0 })
      setIsOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    onChange(stock.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Office Stock</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Add Office Stock</DialogTitle>
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

      {stock.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground text-sm">No office stock added yet</p>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3">
            {stock.map((item) => (
              <Card key={item.id} className="p-4 min-w-max w-56">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.product}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-lg font-bold text-primary">{item.quantity}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
