"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import ProductDetailsForm from "@/components/product/product-details-form";
import CompositionSection from "@/components/product/composition-section";
import VerificationModal from "@/components/product/verification-modal";
import { toast } from "sonner";
import {
  addNew_product,
  getAllProducts,
} from "@/services/client_api-Service/admin/product/product_api";
import { IProduct } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { UseRQ } from "@/hooks/useReactQuery";
import { AxiosError } from "axios";

export interface CompositionItem {
  childProductId: string;
  qty: number;
}

export interface ProductFormData {
  product_code: string;
  product_name: string;
  product_type: string;
  available_qty: number;
  sale_price: number;
  cost_price: number;
  price_edit_enabled: boolean;
  visibility: boolean;
  is_composite: boolean;
  is_empty: boolean;
  composition: CompositionItem[];
}

export default function AddProductPage() {
  const { data, isLoading } = UseRQ("products", getAllProducts);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState<ProductFormData | null>(null);

  const compositeProduct = useMemo(() => {
    if (!data) return [];
    return (data as IProduct[])
      .filter((product) => !product.is_composite)
      .map((product) => ({ id: product.id, name: product.product_name }));
  }, [data]);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
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
    },
  });

  const isComposite = watch("is_composite");

 const onSubmit = (data: ProductFormData) => {
    setFormData(data);
    setShowVerification(true);
  }

  const handleConfirmSubmit = async () => {
    try {
      const data = await addNew_product(formData as IProduct);
      if (data.success) {
        // reset();
        // setShowVerification(false);
        toast.success("Product Added");
        router.push("/admin/product");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    } catch (error) {
      ((error as AxiosError).response?.data as Record<string, string>).message;
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Product</h1>
            <p className="text-muted-foreground mt-1">
              Create a new product in your inventory
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Details Section */}
          <ProductDetailsForm control={control} errors={errors} />

          {/* Composition Section - Only visible if is_composite is true */}
          {isComposite && (
            <CompositionSection
              control={control}
              availableProducts={compositeProduct}
              loading={isLoading}
            />
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
            availableProducts={compositeProduct}
            onConfirm={handleConfirmSubmit}
            onBack={() => setShowVerification(false)}
          />
        )}
      </div>
    </main>
  );
}
