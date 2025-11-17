'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductFormData } from '@/app/(UI)/admin/product/add/page'

interface VerificationModalProps {
  formData: ProductFormData
  availableProducts: Array<{ id: string; name: string }>
  onConfirm: () => void
  onBack: () => void
}

export default function VerificationModal({
  formData,
  availableProducts,
  onConfirm,
  onBack,
}: VerificationModalProps) {
  const getProductName = (productId: string) => {
    return availableProducts.find((p) => p.id === productId)?.name || productId
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Review & Confirm</CardTitle>
          <CardDescription>Are you sure all details are correct?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Details Summary */}
          <div>
            <h3 className="font-semibold mb-4">Product Details</h3>
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-medium">{formData.product_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{formData.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{formData.product_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Qty</p>
                  <p className="font-medium">{formData.available_qty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sale Price</p>
                  <p className="font-medium">${formData.sale_price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost Price</p>
                  <p className="font-medium">${formData.cost_price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Edit Enabled</p>
                  <Badge variant={formData.price_edit_enabled ? 'default' : 'secondary'}>
                    {formData.price_edit_enabled ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <Badge variant={formData.visibility ? 'default' : 'secondary'}>
                    {formData.visibility ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
              </div>
              {formData.is_composite && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge>Composite Product</Badge>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Composition Summary - Only if composite */}
          {formData.is_composite && formData.composition.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Product Composition</h3>
              <div className="space-y-2">
                {formData.composition.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded">
                    <span className="font-medium">{getProductName(item.childProductId)}</span>
                    <span className="text-sm text-muted-foreground">Qty: {item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              ✓ Review your information carefully. Once submitted, the product will be added to your inventory.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onBack}>
              Back / Edit
            </Button>
            <Button onClick={onConfirm}>Confirm Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
