"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { UseRQ } from "@/hooks/useReactQuery";
import { Warehouse } from "../../../warehouses/page";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
import { IProduct } from "@/types/types";
import { toast } from "sonner";
import { transferStock } from "@/services/client_api-Service/user/stock/unload_slip_transfer_api";

export type StockTransferFormData = {
  product: string;
  date: Date | undefined;
  from: string;
  to: string;
  quantity: string;
  remarks: string;
  withEmpty: boolean;
  return_product_id: string | null;
};

export default function StockTransferSection() {
  const { data: warehouses, isLoading: warehouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse
  );
  const { data: products, isLoading: productLoading } = UseRQ(
    "products",
    getAllProducts
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockTransferFormData>({
    defaultValues: {
      return_product_id: null,
      withEmpty:false
    },
  });

  const handleProductSelect = (id: string) => {
    const selectedProduct = (products as IProduct[])?.find((p) => p.id === id);

    setValue("return_product_id", selectedProduct?.return_product_id ?? null, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async(data: StockTransferFormData) => {
    const formData = {
      ...data,
      date: selectedDate,
      from: fromLocation,
      to: toLocation,
    };
    try {
      const data = await transferStock(formData)
      if(data.success){
        toast.success('stock transfered')
      }
    } catch (error) {
      toast.error('error in expense')
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Stock Transfer</CardTitle>
        <CardDescription>
          Transfer stock between Office, Godown, and Vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <select
                id="product"
                {...register("product", { required: "Product is required" })}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">
                  {productLoading
                    ? "Loading Products..."
                    : "Choose a product..."}
                </option>

                {!productLoading &&
                  (products as IProduct[])?.map((product) => (
                    <option value={product.id} key={product.id}>
                      {product.product_name}
                    </option>
                  ))}
              </select>
              {errors.product && (
                <p className="text-sm text-destructive">
                  {errors.product.message}
                </p>
              )}

              {/* Hidden Return Product Field */}
              <input type="hidden" {...register("return_product_id")} />
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>

          {/* From / To warehouses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      warehouseLoading ? "Loading..." : "Select location"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!warehouseLoading &&
                    warehouses?.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id as string}
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      warehouseLoading ? "Loading..." : "Select location"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!warehouseLoading &&
                    warehouses?.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id as string}
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Transferred Quantity</Label>
            <Input
              type="number"
              placeholder="Enter quantity"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label>Remarks (Optional)</Label>
            <textarea
              {...register("remarks")}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              rows={3}
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="withEmpty"
              checked={watch("withEmpty")}
              onCheckedChange={(value) => setValue("withEmpty", !!value)}
            />

            <Label htmlFor="withEmpty">With Empty</Label>
          </div>

          {/* Submit */}
          <Button type="submit">Record Transfer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
