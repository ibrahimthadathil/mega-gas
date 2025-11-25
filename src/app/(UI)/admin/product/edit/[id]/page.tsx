'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import ProductDetailsForm from '@/components/product/product-details-form'
import CompositionSection from '@/components/product/composition-section'
import VerificationModal from '@/components/product/verification-modal'
import type { ProductFormData } from '@/app/(UI)/admin/product/add/page'
import { IProduct } from '@/types/types'

// Mock product data - replace with API call
const mockProducts: Record<string,IProduct> = {
  '1': {
    id: '1',
    product_code: 'PROD-001',
    product_name: 'Laptop',
    product_type: 'Electronics',
    sale_price: 1200,
    is_empty:false,
    cost_price: 800,
    available_qty: 15,
    is_composite: false,
    visibility: true,
    price_edit_enabled: true,
    composition: [],
  },
  '2': {
    id: '2',
    product_code: 'PROD-002',
    product_name: 'Bundle Kit',
    product_type: 'Bundle',
    sale_price: 500,
    cost_price: 300,
    available_qty: 8,
    is_composite: true,
    is_empty:true,
    visibility: true,
    price_edit_enabled: false,
    composition: [
      { childProductId: 'prod1', qty: 2 },
      { childProductId: 'prod2', qty: 1 },
    ],
  },
}

// Mock product list for composition selection
const availableProducts = [
  { id: 'prod1', name: 'Component A' },
  { id: 'prod2', name: 'Component B' },
  { id: 'prod3', name: 'Component C' },
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [showVerification, setShowVerification] = useState(false)
  const [formData, setFormData] = useState<ProductFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const product = mockProducts[productId]

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    
  } = useForm<ProductFormData>({
    defaultValues: product
      ? {
          product_code: product.product_code,
          product_name: product.product_name,
          product_type: product.product_type,
          available_qty: product.available_qty,
          sale_price: product.sale_price,
          cost_price: product.cost_price,
          price_edit_enabled: product.price_edit_enabled,
          visibility: product.visibility,
          is_composite: product.is_composite,
          composition: product.composition || [],
        }
      : {
          product_code: '',
          product_name: '',
          product_type: '',
          available_qty: 0,
          sale_price: 0,
          cost_price: 0,
          price_edit_enabled: false,
          visibility: true,
          is_composite: false,
          composition: [],
        },
  })

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const isComposite = watch('is_composite')

  const onSubmit = (data: ProductFormData) => {
    setFormData(data)
    setShowVerification(true)
  }

  const handleConfirmSubmit = () => {
    // Submit to API
    console.log('Updated product:', formData)
    setShowVerification(false)
    router.push('/product')
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">Loading...</CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Product not found</p>
              <Button onClick={handleBack}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground mt-1">Update product details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Details Section */}
          <ProductDetailsForm control={control} errors={errors} />

          {/* Composition Section - Only visible if is_composite is true */}
          {isComposite && (
            <CompositionSection control={control} availableProducts={availableProducts} />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button type="submit">Review & Submit</Button>
          </div>
        </form>

        {/* Verification Modal */}
        {showVerification && formData && (
          <VerificationModal
            formData={formData}
            availableProducts={availableProducts}
            onConfirm={handleConfirmSubmit}
            onBack={() => setShowVerification(false)}
          />
        )}
      </div>
    </main>
  )
}
