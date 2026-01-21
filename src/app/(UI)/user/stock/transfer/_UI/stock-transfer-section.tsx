// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { DatePicker } from "@/components/ui/date-picker";
// import { Checkbox } from "@/components/ui/checkbox";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { Warehouse } from "../../../warehouses/page";
// import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
// import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
// import { IProduct } from "@/types/types";
// import { toast } from "sonner";
// import { transferStock } from "@/services/client_api-Service/user/stock/unload_slip_transfer_api";
// import { useRouter } from "next/navigation";

// export type StockTransferFormData = {
//   product: string;
//   date: Date | undefined;
//   from: string;
//   to: string;
//   quantity: string;
//   remarks: string;
//   withEmpty: boolean;
//   return_product_id: string | null;
// };

// export default function StockTransferSection() {
//   const { data: warehouses, isLoading: warehouseLoading } = UseRQ<Warehouse[]>(
//     "warehouse",
//     getWarehouse,
//   );
//   const { data: products, isLoading: productLoading } = UseRQ(
//     "products",
//     getAllProducts,
//   );
//   const [isSubmit, setSubmit] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
//   const [fromLocation, setFromLocation] = useState<string>("");
//   const [toLocation, setToLocation] = useState<string>("");
//   const route = useRouter();
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<StockTransferFormData>({
//     defaultValues: {
//       return_product_id: null,
//       withEmpty: false,
//     },
//   });

//   const handleProductSelect = (id: string) => {
//     const selectedProduct = (products as IProduct[])?.find((p) => p.id === id);

//     setValue("return_product_id", selectedProduct?.return_product_id ?? null, {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//   };

//   const onSubmit = async (data: StockTransferFormData) => {
//     const formData = {
//       ...data,
//       date: selectedDate,
//       from: fromLocation,
//       to: toLocation,
//     };
//     try {
//       setSubmit(true);
//       const data = await transferStock(formData);
//       if (data.success) {
//         toast.success("stock transfered");
//         setSubmit(false);
//         route.push("/user/stock");
//       }
//     } catch (error) {
//       setSubmit(false);
//       toast.error("error in expense");
//     }
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Record Stock Transfer</CardTitle>
//         <CardDescription>
//           Transfer stock between Office, Godown, and Vehicles
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {/* Product Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="product">Select Product</Label>
//               <select
//                 id="product"
//                 {...register("product", { required: "Product is required" })}
//                 onChange={(e) => handleProductSelect(e.target.value)}
//                 className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//               >
//                 <option value="">
//                   {productLoading
//                     ? "Loading Products..."
//                     : "Choose a product..."}
//                 </option>

//                 {!productLoading &&
//                   (products as IProduct[])?.map((product) => (
//                     <option value={product.id} key={product.id}>
//                       {product.product_name}
//                     </option>
//                   ))}
//               </select>
//               {errors.product && (
//                 <p className="text-sm text-destructive">
//                   {errors.product.message}
//                 </p>
//               )}

//               {/* Hidden Return Product Field */}
//               <input type="hidden" {...register("return_product_id")} />
//             </div>

//             {/* Date Picker */}
//             <div className="space-y-2">
//               <Label>Date</Label>
//               <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
//             </div>
//           </div>

//           {/* From / To warehouses */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div className="space-y-2">
//               <Label>From</Label>
//               <Select value={fromLocation} onValueChange={setFromLocation}>
//                 <SelectTrigger>
//                   <SelectValue
//                     placeholder={
//                       warehouseLoading ? "Loading..." : "Select location"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {!warehouseLoading &&
//                     warehouses?.map((location) => (
//                       <SelectItem
//                         key={location.id}
//                         value={location.id as string}
//                       >
//                         {location.name}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>To</Label>
//               <Select value={toLocation} onValueChange={setToLocation}>
//                 <SelectTrigger>
//                   <SelectValue
//                     placeholder={
//                       warehouseLoading ? "Loading..." : "Select location"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {!warehouseLoading &&
//                     warehouses?.map((location) => (
//                       <SelectItem
//                         key={location.id}
//                         value={location.id as string}
//                       >
//                         {location.name}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Quantity */}
//           <div className="space-y-2">
//             <Label>Transferred Quantity</Label>
//             <Input
//               type="number"
//               placeholder="Enter quantity"
//               {...register("quantity", {
//                 required: "Quantity is required",
//                 min: { value: 1, message: "Must be at least 1" },
//               })}
//             />
//             {errors.quantity && (
//               <p className="text-sm text-destructive">
//                 {errors.quantity.message}
//               </p>
//             )}
//           </div>

//           {/* Remarks */}
//           <div className="space-y-2">
//             <Label>Remarks (Optional)</Label>
//             <textarea
//               {...register("remarks")}
//               className="w-full px-3 py-2 border border-input rounded-md bg-background"
//               rows={3}
//             />
//           </div>

//           {/* Checkbox */}
//           <div className="flex items-center gap-2">
//             <Checkbox
//               id="withEmpty"
//               checked={watch("withEmpty")}
//               onCheckedChange={(value) => setValue("withEmpty", !!value)}
//             />

//             <Label htmlFor="withEmpty">With Empty</Label>
//           </div>

//           {/* Submit */}
//           <Button type="submit" disabled={isSubmit}>
//             Record Transfer
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

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

export default function StockTransferSection() {
  const { data: warehouses, isLoading: warehouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse,
  );
  const { data: products, isLoading: productLoading } = UseRQ(
    "products",
    getAllProducts,
  );
  const [isSubmit, setSubmit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const route = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockTransferFormData>({
    defaultValues: {
      product: "",
      date: new Date(),
      from: "",
      to: "",
      quantity: "",
      remarks: "",
      withEmpty: false,
      return_product_id: "",
    },
  });

  const handleProductSelect = (id: string) => {
    const selectedProduct = (products as IProduct[])?.find((p) => p.id === id);
    setValue("product", id);
    setValue("return_product_id", selectedProduct?.return_product_id || "");
    setSearchTerm(selectedProduct?.product_name || "");
    setShowDropdown(false); // Hide dropdown after selection
  };

  // Filter products based on search term (memoized)
  const filteredProducts = searchTerm
    ? (products as IProduct[])
        ?.filter(
          (product) =>
            !product?.tags?.includes("service") &&
            !product?.tags?.includes("DC"),
        )
        ?.filter((product) =>
          product.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 10) // Limit to 10 results for performance
    : [];

  const onSubmit = async (data: StockTransferFormData) => {
    try {
      setSubmit(true);
      const result = await transferStock(data);
      if (result.success) {
        toast.success("Stock transferred successfully");
        route.push("/user/stock");
      }
    } catch (error) {
      toast.error("Error in stock transfer");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <Card className="w-full">
      {/* <CardHeader>
        <CardTitle>Record Stock Transfer</CardTitle>
        <CardDescription>
          Transfer stock between Office, Godown, and Vehicles
        </CardDescription>
      </CardHeader> */}
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Product Selection with Search */}
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
              {showDropdown &&
                filteredProducts &&
                filteredProducts.length > 0 && (
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
                validate: {
                  positive: (value) => {
                    const num = parseFloat(value);
                    return num > 0 || "Quantity must be greater than 0";
                  },
                  notNegative: (value) => {
                    const num = parseFloat(value);
                    return num >= 0 || "Quantity cannot be negative";
                  },
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
          <Button type="submit" disabled={isSubmit}>
            {isSubmit ? "Processing..." : "Record Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
