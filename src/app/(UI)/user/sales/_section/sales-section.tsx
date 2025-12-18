// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Plus, Trash2 } from "lucide-react"
// import NumberInput from "@/components/ui/number-input"
// import { UseRQ } from "@/hooks/useReactQuery"
// import { GetAllDeliverableProducts } from "@/services/client_api-Service/user/sales/delivery_api"
// import { IProduct } from "@/types/types"

// interface Sale {
//   id: string
//   product: string
//   rate: number
//   quantity: number
//   deliveryFeeIncluded: boolean
//   deliveryCharge?: number
// }

// interface SalesSectionProps {
//   sales: Sale[]
//   onChange: (sales: Sale[]) => void
// }

// const products = ["5kg Cylinder", "10kg Cylinder", "15kg Cylinder", "19kg Cylinder"]
// const rates: Record<string, number> = {
//   "5kg Cylinder": 400,
//   "10kg Cylinder": 750,
//   "15kg Cylinder": 1100,
//   "19kg Cylinder": 1350,
// }

// const DELIVERY_ADDON = 31.5

// export default function SalesSection({ sales, onChange }: SalesSectionProps) {
//   const {data:ListProduct,isLoading:ProductLoading} = UseRQ<IProduct>('products',GetAllDeliverableProducts)
//   console.log(ListProduct);
  
//   const [isOpen, setIsOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     product: "",
//     rate: 0,
//     quantity: 0,
//     deliveryFeeIncluded: false,
//     deliveryCharge: DELIVERY_ADDON,
//   })

//   const handleProductChange = (product: string) => {
//     setFormData({
//       ...formData,
//       product,
//       rate: rates[product] || 0,
//     })
//   }

//   const handleAdd = () => {
//     if (formData.product && formData.rate && formData.quantity > 0) {
//       const newSale: Sale = {
//         id: Date.now().toString(),
//         product: formData.product,
//         rate: formData.rate,
//         quantity: formData.quantity,
//         deliveryFeeIncluded: formData.deliveryFeeIncluded,
//         deliveryCharge: formData.deliveryCharge,
//       }
//       onChange([...sales, newSale])
//       setFormData({
//         product: "",
//         rate: 0,
//         quantity: 0,
//         deliveryFeeIncluded: false,
//         deliveryCharge: DELIVERY_ADDON,
//       })
//       setIsOpen(false)
//     }
//   }

//   const handleDelete = (id: string) => {
//     onChange(sales.filter((sale) => sale.id !== id))
//   }

//   const calculateSaleTotal = (sale: Sale) => {
//     const baseAmount = sale.rate * sale.quantity
//     const deliveryAmount = sale.deliveryFeeIncluded ? (sale.deliveryCharge || 0) * sale.quantity : 0
//     return baseAmount + deliveryAmount
//   }

//   const groupedSales = products
//     .map((product) => {
//       const items = sales.filter((s) => s.product === product)
//       return {
//         product,
//         items,
//         totalQty: items.reduce((sum, s) => sum + s.quantity, 0),
//         totalPrice: items.reduce((sum, s) => sum + calculateSaleTotal(s), 0),
//       }
//     })
//     .filter((group) => group.items.length > 0)

//   const previewTotal = formData.rate * formData.quantity
//   const deliveryAddition = formData.deliveryFeeIncluded ? formData.deliveryCharge * formData.quantity : 0
//   const previewGrandTotal = previewTotal + deliveryAddition

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-foreground">Sale</h2>
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//           <DialogTrigger asChild>
//             <Button size="sm" variant="outline" className="gap-1 bg-transparent">
//               <Plus className="h-4 w-4" />
//               Add
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add Sale</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium">Product</label>
//                 <Select value={formData.product} onValueChange={handleProductChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select product" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {products.map((product) => (
//                       <SelectItem key={product} value={product}>
//                         {product}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Rate (₹)</label>
//                 <div className="p-3 bg-muted rounded text-sm font-medium">{formData.rate || "Select a product"}</div>
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Quantity</label>
//                 <NumberInput
//                   value={formData.quantity}
//                   onChange={(value) => setFormData({ ...formData, quantity: value })}
//                   min={0}
//                   placeholder="0"
//                 />
//               </div>
//               <div className="space-y-2 p-3 bg-muted rounded">
//                 <div className="flex items-center gap-2">
//                   <Checkbox
//                     id="delivery-fee"
//                     checked={formData.deliveryFeeIncluded}
//                     onCheckedChange={(checked) => setFormData({ ...formData, deliveryFeeIncluded: checked as boolean })}
//                   />
//                   <label htmlFor="delivery-fee" className="text-sm font-medium cursor-pointer">
//                     Delivery Fee Included (₹{DELIVERY_ADDON} add on)
//                   </label>
//                 </div>
//                 {formData.deliveryFeeIncluded && (
//                   <div>
//                     <label className="text-xs text-muted-foreground">Delivery Charge per Unit</label>
//                     <NumberInput
//                       value={formData.deliveryCharge}
//                       onChange={(value) => setFormData({ ...formData, deliveryCharge: value })}
//                       min={0}
//                       placeholder={DELIVERY_ADDON.toString()}
//                     />
//                   </div>
//                 )}
//               </div>
//               <div className="p-3 bg-primary/10 rounded">
//                 <p className="text-xs text-muted-foreground">Total</p>
//                 <p className="text-2xl font-bold text-primary mt-1">₹{previewGrandTotal.toLocaleString()}</p>
//               </div>
//               <Button onClick={handleAdd} className="w-full">
//                 Add Sale
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {groupedSales.length === 0 ? (
//         <Card className="p-6 text-center">
//           <p className="text-muted-foreground text-sm">No sales added yet</p>
//         </Card>
//       ) : (
//         <div className="space-y-2">
//           {groupedSales.map((group) => (
//             <Card key={group.product} className="p-4">
//               <div className="flex items-start justify-between mb-3">
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{group.product}</p>
//                   <p className="text-xs text-muted-foreground mt-1">Qty: {group.totalQty}</p>
//                 </div>
//                 <p className="text-xl font-bold text-primary">₹{group.totalPrice.toLocaleString()}</p>
//               </div>
//               <div className="space-y-1 border-t pt-3">
//                 {group.items.map((sale) => (
//                   <div key={sale.id} className="flex items-center justify-between text-xs">
//                     <span className="text-muted-foreground">
//                       {sale.quantity}x ₹{sale.rate}{" "}
//                       {sale.deliveryFeeIncluded && `(+₹${sale.deliveryCharge}x${sale.quantity} delivery)`}
//                     </span>
//                     <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleDelete(sale.id)}>
//                       <Trash2 className="h-3 w-3 text-destructive" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import NumberInput from "@/components/ui/number-input"

interface IProduct {
  id: string
  name: string
  price: number
  is_edit: boolean
}

interface Sale {
  id: string
  productId: string
  productName: string
  rate: number
  quantity: number
}

interface SalesSectionProps {
  sales: Sale[]
  onChange: (sales: Sale[]) => void
}

/* ✅ Dummy product data */
const PRODUCTS: IProduct[] = [
  { id: "1", name: "5kg Cylinder", price: 400, is_edit: true },
  { id: "2", name: "10kg Cylinder", price: 750, is_edit: false },
  { id: "3", name: "15kg Cylinder", price: 1100, is_edit: false },
  { id: "4", name: "19kg Cylinder", price: 1350, is_edit: false },
]

export default function SalesSection({ sales, onChange }: SalesSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)

  const [formData, setFormData] = useState({
    productId: "",
    rate: 0,
    quantity: 0,
  })

  const handleProductChange = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId) || null
    setSelectedProduct(product)

    setFormData({
      productId,
      rate: product?.price || 0,
      quantity: 0,
    })
  }

  const handleAdd = () => {
    if (!selectedProduct || formData.quantity <= 0) return

    const newSale: Sale = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      rate: formData.rate,
      quantity: formData.quantity,
    }

    onChange([...sales, newSale])

    setFormData({ productId: "", rate: 0, quantity: 0 })
    setSelectedProduct(null)
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    onChange(sales.filter((sale) => sale.id !== id))
  }

  const groupedSales = PRODUCTS.map((product) => {
    const items = sales.filter((s) => s.productId === product.id)
    return {
      product,
      items,
      totalQty: items.reduce((sum, s) => sum + s.quantity, 0),
      totalPrice: items.reduce((sum, s) => sum + s.rate * s.quantity, 0),
    }
  }).filter((group) => group.items.length > 0)

  const previewTotal = formData.rate * formData.quantity

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Sale</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sale</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Product */}
              <div>
                <label className="text-sm font-medium">Product</label>
                <Select value={formData.productId} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rate */}
              <div>
                <label className="text-sm font-medium">Rate (₹)</label>
                <NumberInput
                  value={formData.rate}
                  onChange={(value) => setFormData({ ...formData, rate: value })}
                  min={0}
                  // disabled={selectedProduct ? !selectedProduct.is_edit : true }
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <NumberInput
                  value={formData.quantity}
                  onChange={(value) => setFormData({ ...formData, quantity: value })}
                  min={0}
                  placeholder="0"
                />
              </div>

              {/* Total */}
              <div className="p-3 bg-primary/10 rounded">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  ₹{previewTotal.toLocaleString()}
                </p>
              </div>

              <Button onClick={handleAdd} className="w-full">
                Add Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groupedSales.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground text-sm">No sales added yet</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {groupedSales.map((group) => (
            <Card key={group.product.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{group.product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Qty: {group.totalQty}</p>
                </div>
                <p className="text-xl font-bold text-primary">
                  ₹{group.totalPrice.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1 border-t pt-3">
                {group.items.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {sale.quantity}x ₹{sale.rate}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDelete(sale.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

