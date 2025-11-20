'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit } from 'lucide-react'
import { IProduct } from '@/types/types'



// Mock product data - replace with API call
const mockProducts: IProduct[] = [
  {
    id: '1',
    product_code: 'PROD-001',
    product_name: 'Laptop',
    product_type: 'Electronics',
    sale_price: 1200,
    cost_price: 800,
    available_qty: 15,
    is_composite: false,
    visibility: true,
    price_edit_enabled: true,
  },
  {
    id: '2',
    product_code: 'PROD-002',
    product_name: 'Bundle Kit',
    product_type: 'Bundle',
    sale_price: 500,
    cost_price: 300,
    available_qty: 8,
    is_composite: true,
    visibility: true,
    price_edit_enabled: false,
  },
]

export default function ProductListPage() {
  const [products] = useState<IProduct[]>(mockProducts)

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product inventory</p>
          </div>
          <Link href="/admin/product/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                    <CardDescription className="text-sm">{product.product_code}</CardDescription>
                  </div>
                  {product.is_composite && (
                    <Badge variant="outline" className="whitespace-nowrap">
                      Composite
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{product.product_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sale Price:</span>
                    <span className="font-medium">${product.sale_price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost Price:</span>
                    <span className="font-medium">${product.cost_price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">{product.available_qty} units</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Visibility:</span>
                      <Badge variant={product.visibility ? 'default' : 'secondary'}>
                        {product.visibility ? 'Visible' : 'Hidden'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Link href={`/product/edit/${product.id}`} className="mt-4 w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No products found</p>
              <Link href="/product/add">
                <Button>Create First Product</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
