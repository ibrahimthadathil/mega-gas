"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ProductDetailsForm from "@/components/product/product-details-form";
import CompositionSection from "@/components/product/composition-section";
import VerificationModal from "@/components/product/verification-modal";
import type { ProductFormData } from "@/app/(UI)/admin/product/add/page";
import { IProduct } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  editProduct,
  getEditData,
} from "@/services/client_api-Service/admin/product/product_api";
import Loading from "@/loading";
import { toast } from "sonner";

export default function EditProductPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const productCode = params.id as string;
  const cachedProduct = queryClient.getQueryData([
    "product",
    productCode,
  ]) as string;
  const { data, isLoading } = UseRQ("editProduct", () =>
    getEditData(cachedProduct)
  );

  const availableProducts = queryClient.getQueryData([
    "composite",
    "composite",
  ]) as { id: string; name: string }[];

  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState<ProductFormData | null>();

  const getDefaultValues = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        product_code: "",
        product_name: "",
        product_type: "",
        available_qty: 0,
        sale_price: 0,
        cost_price: 0,
        price_edit_enabled: false,
        visibility: true,
        is_composite: false,
        composition: [],
      };
    }

    const product = data[0] as IProduct;

    const composition =
      product.components?.map((component) => ({
        childProductId: component.child_product_id,
        qty: component.qty,
      })) || [];

    return {
      product_code: product.product_code || "",
      product_name: product.product_name || "",
      product_type: product.product_type || "",
      available_qty: 0,
      sale_price: product.sale_price || 0,
      cost_price: 0,
      price_edit_enabled: product.price_edit_enabled || false,
      visibility: product.visibility ?? true,
      is_composite: product.is_composite || false,
      composition: composition,
    };
  };

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: getDefaultValues(),
  });

  // Reset form when data loads
  useEffect(() => {
    if (data && !isLoading) {
      reset(getDefaultValues());
    }
  }, [data, isLoading]);

  const isComposite = watch("is_composite");

  const onSubmit = (data: ProductFormData) => {
    setFormData(data);
    setShowVerification(true);
  };

  const handleConfirmSubmit = async () => {
    console.log("Updated product:", formData);
    setShowVerification(false);
    try {
      if (cachedProduct) {
        const data = await editProduct(formData, cachedProduct);
        if (data.success) {
          router.push("/admin/product");
          toast.success("Product Updated");
        }
      } else toast.warning("go back to the product page and Try again");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!cachedProduct) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Product not found</p>
              <Link href={"/admin/product"}>
                <Button>Go Back</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={"/admin/product"}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground mt-1">Update product details</p>
          </div>
        </div>

        {/* Form */}
        {isLoading ? (
          <Loading height="h-screen" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Details Section */}
            <ProductDetailsForm control={control} errors={errors} />

            {/* Composition Section - Only visible if is_composite is true */}
            {isComposite && (
              <CompositionSection
                control={control}
                availableProducts={availableProducts || []}
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <Link href={"/admin/product"}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Review & Submit</Button>
            </div>
          </form>
        )}

        {/* Verification Modal */}
        {showVerification && formData && (
          <VerificationModal
            formData={formData}
            availableProducts={availableProducts || []}
            onConfirm={handleConfirmSubmit}
            onBack={() => setShowVerification(false)}
          />
        )}
      </div>
    </main>
  );
}
