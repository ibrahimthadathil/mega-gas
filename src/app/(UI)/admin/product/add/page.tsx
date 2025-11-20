"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, ArrowLeft } from "lucide-react";
import ProductDetailsForm from "@/components/product/product-details-form";
import CompositionSection from "@/components/product/composition-section";
import VerificationModal from "@/components/product/verification-modal";
import { toast } from "sonner";
import { addNew_product } from "@/services/client_api-Service/admin/product/product_api";
import { IProduct } from "@/types/types";

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
  is_empty:boolean;
  composition: CompositionItem[];
}

// Mock product list for composition selection
const availableProducts = [
  { id: "prod1", name: "Component A" },
  { id: "prod2", name: "Component B" },
  { id: "prod3", name: "Component C" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState<ProductFormData | null>(null);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
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
  };

  const handleConfirmSubmit = async () => {
    try {
      const data = await addNew_product(formData as IProduct);
      if (data.success) {
        reset();
        setShowVerification(false);
        toast.success("Product Added");
        router.push("/admin/product");
      }
    } catch (error) {
      toast.error((error as Error).message);
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
              availableProducts={availableProducts}
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
            availableProducts={availableProducts}
            onConfirm={handleConfirmSubmit}
            onBack={() => setShowVerification(false)}
          />
        )}
      </div>
    </main>
  );
}
