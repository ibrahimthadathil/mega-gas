"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { UseRQ } from "@/hooks/useReactQuery";
import { Warehouse } from "../../../warehouses/page";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
import { IProduct } from "@/types/types";
import { toast } from "sonner";
import { transferStock } from "@/services/client_api-Service/user/stock/unload_slip_transfer_api";
import { useRouter } from "next/navigation";
import { StockTransferFormData } from "@/lib/schema/stock";
import { StockTransfer } from "@/types/stock";
import { EditTransferedStockRecord } from "@/services/client_api-Service/user/stock/transfer_api";

interface StockTransferSectionProps {
  initialData?: StockTransfer;
}

export default function StockTransferSection({
  initialData,
}: StockTransferSectionProps) {
  const { data: warehouses, isLoading: warehouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse,
  );
  const { data: products, isLoading: productLoading } = UseRQ(
    "products",
    getAllProducts,
  );
  const [isSubmit, setSubmit] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialData?.product_name ?? "");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StockTransferFormData>({
    defaultValues: {
      id: initialData?.id ?? "",
      product: initialData?.product_id ?? "",
      date: initialData?.transfer_date
        ? new Date(initialData?.transfer_date)
        : new Date(),
      from: initialData?.from_warehouse_id ?? "",
      to: initialData?.to_warehouse_id ?? "",
      quantity: String(initialData?.qty) ?? "",
      remarks: initialData?.remarks ?? "",
      withEmpty: initialData?.empty_inclusive ?? false,
      return_product_id: initialData?.return_product_id ?? "",
    },
  });

  const handleProductSelect = (id: string) => {
    const selectedProduct = (products as IProduct[])?.find((p) => p.id === id);
    setValue("product", id);
    setValue("return_product_id", selectedProduct?.return_product_id || "");
    setSearchTerm(selectedProduct?.product_name || "");
    setShowDropdown(false);
  };

  const filteredProducts = searchTerm
    ? (products as IProduct[])
        ?.filter(
          (product) =>
            !product?.tags?.includes("service") &&
            !product?.tags?.includes("DC") &&
            product.product_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
        .slice(0, 10)
    : [];

  const onSubmit = async (data: StockTransferFormData) => {
    try {
      if (data.withEmpty && !data.return_product_id) {
        toast.warning("re-select the product");
        return;
      }
      setSubmit(true);
      const result = initialData
        ? await EditTransferedStockRecord(initialData.id, data)
        : await transferStock(data);

      if (result.success) {
        toast.success(
          initialData
            ? "Stock transfer updated successfully"
            : "Stock transferred successfully",
        );
        router.push("/user/stock");
      }
    } catch (error) {
      toast.error(
        initialData
          ? "Error updating stock transfer"
          : "Error in stock transfer",
      );
    } finally {
      setSubmit(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Stock Transfer" : "New Stock Transfer"}
        </CardTitle>
        {initialData && (
          <CardDescription>Update the stock transfer details</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product">Select Product *</Label>
              <Controller
                name="product"
                control={control}
                rules={{ required: "Product is required" }}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      placeholder={
                        productLoading
                          ? "Loading products..."
                          : "Search products..."
                      }
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => searchTerm && setShowDropdown(true)}
                      disabled={productLoading}
                    />
                    <InputGroupAddon>
                      <Search className="h-4 w-4" />
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              {showDropdown && filteredProducts?.length > 0 && (
                <div className="mt-1 max-h-48 overflow-y-auto border border-input rounded-md bg-background shadow-lg z-50">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product.id)}
                      className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors"
                    >
                      {product.product_name}
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && showDropdown && filteredProducts?.length === 0 && (
                <div className="mt-1 px-3 py-2 border border-input rounded-md bg-background text-sm text-muted-foreground">
                  No products found
                </div>
              )}
              {errors.product && (
                <p className="text-sm text-destructive">
                  {errors.product.message}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    date={field.value}
                    onDateChange={(date) => field.onChange(date)}
                  />
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* From / To warehouses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From Warehouse *</Label>
              <Controller
                name="from"
                control={control}
                rules={{ required: "From warehouse is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {errors.from && (
                <p className="text-sm text-destructive">
                  {errors.from.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>To Warehouse *</Label>
              <Controller
                name="to"
                control={control}
                rules={{ required: "To warehouse is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {errors.to && (
                <p className="text-sm text-destructive">{errors.to.message}</p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Transferred Quantity *</Label>
            <Controller
              name="quantity"
              control={control}
              rules={{
                required: "Quantity is required",
                validate: (value) => {
                  const num = parseFloat(value);
                  return num > 0 || "Quantity must be greater than 0";
                },
              }}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  {...field}
                  min="0.01"
                  step="0.01"
                />
              )}
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
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              )}
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <Controller
              name="withEmpty"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="withEmpty"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="withEmpty">With Empty</Label>
          </div>

          {/* Hidden Return Product Field */}
          <Controller
            name="return_product_id"
            control={control}
            render={({ field }) => (
              <input type="hidden" {...field} value={field.value || ""} />
            )}
          />

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/user/stock")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmit}>
              {isSubmit
                ? "Processing..."
                : initialData
                  ? "Update Transfer"
                  : "Record Transfer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
