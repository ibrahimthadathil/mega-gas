// "use client";

// import { useForm } from "react-hook-form";
// import { Trash2, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { DatePicker } from "@/components/ui/date-picker";
// import { useMemo, useState } from "react";
// import { UseRQ } from "@/hooks/useReactQuery";
// import {
//   addPurchaseRegister,
//   getPurchaseCredentials,
// } from "@/services/client_api-Service/user/purchase/purchase_api";
// import { Warehouse } from "../../warehouses/page";
// import { MaterializedProduct, PlantLoadFormData, PlantLoadRecord } from "@/types/types";
// import Loading from "@/loading";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";

// export interface Product {
//   id: string;
//   productData: MaterializedProduct;
//   tripType: "oneway" | "two_way";
//   quantity: number;
// }

// type ResponseData = [product: MaterializedProduct[], warehouses: Warehouse[]];

// interface DialogFormData {
//   product: string;
//   tripType: "oneway" | "two_way";
//   quantity: string;
//   return_product_id?: string;
// }

// export default function PlantLoadSection({recordId}:{recordId?:string}) {
//   const { data, isLoading } = UseRQ("credential", getPurchaseCredentials);
//   const queryClient = useQueryClient()
//    const editData = useMemo(() => {
//     if (!recordId) return null;
//     return queryClient.getQueryData<PlantLoadRecord>([
//       "newLoad",
//       recordId,
//     ]);
//   }, [recordId, queryClient]);
//   const {
//     register: registerMain,
//     watch: watchMain,
//     setValue: setValueMain,
//     reset: resetMain,
//   } = useForm<PlantLoadFormData>({
//     defaultValues: {
//       invoiceNumber: "",
//       sapNumber: "",
//       date: undefined,
//       warehouse: "",
//     },
//   });
//   const {
//     register: registerDialog,
//     watch: watchDialog,
//     handleSubmit: handleSubmitDialog,
//     reset: resetDialog,
//     setValue: setValueDialog,
//   } = useForm<DialogFormData>({
//     defaultValues: {
//       product: "",
//       tripType: "oneway",
//       quantity: "",
//       return_product_id: "",
//     },
//   });

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);

//   const handleAddProduct = (datas: DialogFormData) => {
//     if (!datas.product || !datas.quantity) {
//       toast.error("Please select a product and enter quantity");
//       return;
//     }

//     const selectedProduct = (data as ResponseData)?.[0]?.find(
//       (p: MaterializedProduct) => p.id === datas.product
//     );

//     if (!selectedProduct) {
//       toast.error("Product not found");
//       return;
//     }

//     const newProduct: Product = {
//       id: Date.now().toString(),
//       productData: selectedProduct,
//       tripType: datas.tripType,
//       quantity: Number.parseInt(datas.quantity),
//     };

//     setProducts([...products, newProduct]);
//     resetDialog();
//     setIsDialogOpen(false);
//   };

//   const handleProceed = async () => {
//     const formData = watchMain();
//     // Validate required fields
//     if (!formData.invoiceNumber) {
//       toast.error("Please enter TAX Invoice Number");
//       return;
//     }

//     if (!formData.sapNumber) {
//       toast.error("Please enter SAP Number");
//       return;
//     }

//     if (!formData.date) {
//       toast.error("Please select a date");
//       return;
//     }

//     if (!formData.warehouse) {
//       toast.error("Please select a warehouse");
//       return;
//     }

//     if (products.length === 0) {
//       toast.error("Please add at least one product");
//       return;
//     }

//     const purchaseData = {
//       invoiceNumber: formData.invoiceNumber,
//       sapNumber: formData.sapNumber,
//       date: formData.date,
//       warehouse: formData.warehouse,
//       products: products.map((p) => ({
//         ...p.productData,
//         tripType: p.tripType,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const result = await addPurchaseRegister(purchaseData);
//       if (result.success) {
//         resetMain();
//         resetDialog();
//         setProducts([]);
//         toast.success("Purchase Registered");
//       }
//     } catch (error) {
//       console.log(error);

//       toast.error((error as Error).message + "error in add purchase");
//     }
//   };

//   const handleDeleteProduct = (id: string) => {
//     setProducts(products.filter((product) => product.id !== id));
//   };

//   const handleDateChange = (date: Date | undefined) => {
//     setValueMain("date", date, { shouldValidate: true });
//   };

//   const isProceedDisabled = products.length === 0;

//   return (
//     <div className="w-full max-w-6xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="space-y-2">
//         <h1 className="text-3xl md:text-4xl font-bold text-foreground">
//           Plant Load
//         </h1>
//       </div>

//       {/* First Row: Invoice, SAP, Date */}
//       <Card className="bg-card">
//         {isLoading ? (
//           <Loading height="h-full" />
//         ) : (
//           <CardContent className="pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="invoice" className="text-sm font-medium">
//                   TAX Invoice Number
//                 </Label>
//                 <Input
//                   id="invoice"
//                   placeholder="Enter invoice number"
//                   {...registerMain("invoiceNumber")}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="sap" className="text-sm font-medium">
//                   SAP Number
//                 </Label>
//                 <Input
//                   id="sap"
//                   placeholder="Enter SAP number"
//                   {...registerMain("sapNumber")}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="date" className="text-sm font-medium">
//                   Date
//                 </Label>
//                 <DatePicker
//                   date={watchMain("date")}
//                   onDateChange={handleDateChange}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="warehouse" className="text-sm font-medium">
//                   Warehouse
//                 </Label>
//                 <Select
//                   value={watchMain("warehouse")}
//                   onValueChange={(value) => setValueMain("warehouse", value)}
//                 >
//                   <SelectTrigger id="warehouse">
//                     <SelectValue placeholder="Select warehouse" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {(data as ResponseData)?.[1]?.map((option: Warehouse) => (
//                       <SelectItem key={option.id} value={option?.id as string}>
//                         {option.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardContent>
//         )}
//       </Card>

//       {/* Add Button */}
//       <div className="flex justify-end">
//         <Button
//           onClick={() => setIsDialogOpen(true)}
//           className="gap-2"
//           size="lg"
//           disabled={isLoading}
//         >
//           <Plus className="w-5 h-5" />
//           Add
//         </Button>
//       </div>

//       {/* Add Product Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="w-full max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Product Load</DialogTitle>
//             <DialogDescription>
//               Select product details to add to plant load.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             {/* Product Dropdown */}
//             <div className="space-y-2">
//               <Label htmlFor="product" className="text-sm font-medium">
//                 Product Name
//               </Label>
//               <Select
//                 value={watchDialog("product")}
//                 onValueChange={(value) => setValueDialog("product", value)}
//               >
//                 <SelectTrigger id="product">
//                   <SelectValue placeholder="Select a product" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {(data as ResponseData)?.[0]?.map((option) => (
//                     <SelectItem key={option.id} value={option.id}>
//                       {option.product_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Trip Type Radio Group */}
//             <div className="space-y-3">
//               <Label className="text-sm font-medium">Trip Type</Label>
//               <RadioGroup
//                 value={watchDialog("tripType")}
//                 onValueChange={(value: "oneway" | "two_way") =>
//                   setValueDialog("tripType", value)
//                 }
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="oneway" id="oneway" />
//                   <Label
//                     htmlFor="oneway"
//                     className="font-normal cursor-pointer"
//                   >
//                     One Way
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="two_way" id="two_way" />
//                   <Label
//                     htmlFor="two_way"
//                     className="font-normal cursor-pointer"
//                   >
//                     Two Way
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             {/* Quantity Input */}
//             <div className="space-y-2">
//               <Label htmlFor="quantity" className="text-sm font-medium">
//                 Quantity
//               </Label>
//               <Input
//                 id="quantity"
//                 type="number"
//                 placeholder="Enter quantity"
//                 {...registerDialog("quantity")}
//                 min="1"
//                 className="w-full"
//               />
//               <Input type="hidden" {...registerDialog("return_product_id")} />
//             </div>

//             {/* Dialog Add Button */}
//             <Button
//               onClick={handleSubmitDialog(handleAddProduct)}
//               disabled={!watchDialog("product") || !watchDialog("quantity")}
//               className="w-full"
//               size="lg"
//             >
//               Add
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Product Cards */}
//       {products.length > 0 && (
//         <div className="space-y-3">
//           <p className="text-sm font-medium text-muted-foreground">
//             Added Items ({products.length})
//           </p>
//           <div className="overflow-x-auto pb-2">
//             <div className="flex gap-3 min-w-max">
//               {products.map((product) => (
//                 <Card key={product.id} className="bg-card flex-shrink-0 w-64">
//                   <CardContent className="pt-4 pb-4 px-4">
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-start">
//                         <div className="space-y-2 flex-1">
//                           <p className="font-semibold text-foreground">
//                             {product.productData.product_name}
//                           </p>
//                           <div className="text-sm text-muted-foreground space-y-1">
//                             <p>
//                               Code:{" "}
//                               <span className="font-medium">
//                                 {product.productData.product_code}
//                               </span>
//                             </p>
//                             <p>
//                               Trip Type:{" "}
//                               <span className="capitalize font-medium">
//                                 {product.tripType === "oneway"
//                                   ? "One Way"
//                                   : "Two Way"}
//                               </span>
//                             </p>
//                             <p>
//                               Quantity:{" "}
//                               <span className="font-medium">
//                                 {product.quantity}
//                               </span>
//                             </p>
//                             {product.productData.is_composite && (
//                               <p>
//                                 Composite:{" "}
//                                 <span className="font-medium">
//                                   {product.productData.components?.length || 0}{" "}
//                                   components
//                                 </span>
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleDeleteProduct(product.id)}
//                           className="ml-2 p-1 hover:bg-muted rounded transition-colors"
//                           aria-label="Delete product"
//                         >
//                           <Trash2 className="w-4 h-4 text-destructive" />
//                         </button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Proceed Button */}
//       <Button
//         onClick={handleProceed}
//         disabled={isProceedDisabled}
//         size="lg"
//         className="w-full md:w-full"
//       >
//         Proceed
//       </Button>
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useMemo, useState, useEffect } from "react";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  addPurchaseRegister,
  getPurchaseCredentials,
  editPurchase,
} from "@/services/client_api-Service/user/purchase/purchase_api";
import { Warehouse } from "../../warehouses/page";
import {
  MaterializedProduct,
  PlantLoadFormData,
  PlantLoadRecord,
} from "@/types/types";
import Loading from "@/loading";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";

export interface Product {
  id: string;
  productData: MaterializedProduct;
  tripType: "oneway" | "two_way";
  quantity: number;
}

type ResponseData = [product: MaterializedProduct[], warehouses: Warehouse[]];

interface DialogFormData {
  product: string;
  tripType: "oneway" | "two_way";
  quantity: string;
  return_product_id?: string;
}

export default function PlantLoadSection({ recordId }: { recordId?: string }) {
  const { data, isLoading } = UseRQ("credential", getPurchaseCredentials);
  const {warehouseid} = useSelector((state:Rootstate)=>state.user)
  const queryClient = useQueryClient();
  const router = useRouter()
  const editData = useMemo(() => {
    if (!recordId) return null;
    return queryClient.getQueryData<PlantLoadRecord>(["newLoad", recordId]);
  }, [recordId, queryClient]);

  const isEditMode = !!recordId && !!editData;

  const {
    register: registerMain,
    watch: watchMain,
    setValue: setValueMain,
    reset: resetMain,
  } = useForm<PlantLoadFormData>({
    defaultValues: {
      invoiceNumber: "",
      sapNumber: "",
      date: new Date(),
      warehouse: warehouseid??"",
    },
  });

  const {
    register: registerDialog,
    watch: watchDialog,
    handleSubmit: handleSubmitDialog,
    reset: resetDialog,
    setValue: setValueDialog,
  } = useForm<DialogFormData>({
    defaultValues: {
      product: "",
      tripType: "oneway",
      quantity: "",
      return_product_id: "",
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmit,setIsSubmit] = useState<boolean>(false)
  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && editData && data) {
      setValueMain("invoiceNumber", editData.tax_invoice_number);
      setValueMain("sapNumber", editData.sap_number);
      setValueMain("date", new Date(editData.bill_date));
      setValueMain("warehouse", editData.warehouse_id);

      // Map line items to products
      const mappedProducts: Product[] = editData.line_items.map(
        (item, index) => {
          const productData = (data as ResponseData)?.[0]?.find(
            (p: MaterializedProduct) => p.id === (item as any).product_id
          );

          return {
            id: (item as any).plant_load_line_item_id || `edit-${index}`,
            productData:
              productData ||
              ({
                id: (item as any).product_id,
                product_name: item.product_name,
                product_code: "",
                is_composite: false,
              } as MaterializedProduct),
            tripType: item.trip_type as "oneway" | "two_way",
            quantity: item.qty,
          };
        }
      );

      setProducts(mappedProducts);
    }
  }, [isEditMode, editData, data, setValueMain]);

  const handleAddProduct = (datas: DialogFormData) => {
    if (!datas.product || !datas.quantity) {
      toast.error("Please select a product and enter quantity");
      return;
    }

    const selectedProduct = (data as ResponseData)?.[0]?.find(
      (p: MaterializedProduct) => p.id === datas.product
    );

    if (!selectedProduct) {
      toast.error("Product not found");
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      productData: selectedProduct,
      tripType: datas.tripType,
      quantity: Number.parseInt(datas.quantity),
    };

    setProducts([...products, newProduct]);
    resetDialog();
    setIsDialogOpen(false);
  };

  const handleProceed = async () => {
    const formData = watchMain();
    setIsSubmit(true)
    if (!formData.invoiceNumber) {
      toast.error("Please enter TAX Invoice Number");
      return;
    }

    if (!formData.sapNumber) {
      toast.error("Please enter SAP Number");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    if (!formData.warehouse) {
      toast.error("Please select a warehouse");
      return;
    }

    if (products.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    const purchaseData = {
      invoiceNumber: formData.invoiceNumber,
      sapNumber: formData.sapNumber,
      date: formData.date,
      warehouse: formData.warehouse,
      products: products.map((p) => ({
        ...p.productData,
        tripType: p.tripType,
        quantity: p.quantity,
      })),
    };

    try {
      let result;
      if (isEditMode) {
        result = await editPurchase(recordId!, purchaseData);
        router.push('/user/purchase')
      } else {
        result = await addPurchaseRegister(purchaseData);
      }

      if (result.success) {
        if (!isEditMode) {
          resetMain();
          resetDialog();
          setProducts([]);
        }
        toast.success(
          isEditMode ? "Purchase Updated Successfully" : "Purchase Registered"
        );

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["newLoad", recordId] });
      }
      setIsSubmit(false)
    } catch (error) {
      toast.error(
        (error as Error).message +
          " error in " +
          (isEditMode ? "update" : "add") +
          " purchase"
      );
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleDateChange = (date: Date | undefined) => {
    setValueMain("date", date, { shouldValidate: true });
  };

  const isProceedDisabled = products.length === 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {isEditMode ? "Edit Plant Load" : "Plant Load"}
        </h1>
      </div>

      {/* First Row: Invoice, SAP, Date */}
      <Card className="bg-card">
        {isLoading ? (
          <Loading height="h-full" />
        ) : (
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice" className="text-sm font-medium">
                  TAX Invoice Number
                </Label>
                <Input
                  id="invoice"
                  placeholder="Enter invoice number"
                  {...registerMain("invoiceNumber")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sap" className="text-sm font-medium">
                  SAP Number
                </Label>
                <Input
                  id="sap"
                  placeholder="Enter SAP number"
                  {...registerMain("sapNumber")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <DatePicker
                  date={watchMain("date")}
                  onDateChange={handleDateChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse" className="text-sm font-medium">
                  Warehouse
                </Label>
                <Select
                  value={watchMain("warehouse")}
                  onValueChange={(value) => setValueMain("warehouse", value)}
                >
                  <SelectTrigger id="warehouse">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {(data as ResponseData)?.[1]?.map((option: Warehouse) => (
                      <SelectItem key={option.id} value={option?.id as string}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
          size="lg"
          disabled={isLoading}
        >
          <Plus className="w-5 h-5" />
          Add
        </Button>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product Load</DialogTitle>
            <DialogDescription>
              Select product details to add to plant load.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">
                Product Name
              </Label>
              <Select
                value={watchDialog("product")}
                onValueChange={(value) => setValueDialog("product", value)}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {(data as ResponseData)?.[0]?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trip Type Radio Group */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Trip Type</Label>
              <RadioGroup
                value={watchDialog("tripType")}
                onValueChange={(value: "oneway" | "two_way") =>
                  setValueDialog("tripType", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oneway" id="oneway" />
                  <Label
                    htmlFor="oneway"
                    className="font-normal cursor-pointer"
                  >
                    One Way
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="two_way" id="two_way" />
                  <Label
                    htmlFor="two_way"
                    className="font-normal cursor-pointer"
                  >
                    Two Way
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                {...registerDialog("quantity")}
                min="1"
                className="w-full"
              />
              <Input type="hidden" {...registerDialog("return_product_id")} />
            </div>

            {/* Dialog Add Button */}
            <Button
              onClick={handleSubmitDialog(handleAddProduct)}
              disabled={!watchDialog("product") || !watchDialog("quantity")}
              className="w-full"
              size="lg"
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Cards */}
      {products.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Added Items ({products.length})
          </p>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {products.map((product) => (
                <Card key={product.id} className="bg-card flex-shrink-0 w-64">
                  <CardContent className="pt-4 pb-4 px-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <p className="font-semibold text-foreground">
                            {product.productData.product_name}
                          </p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              Code:{" "}
                              <span className="font-medium">
                                {product.productData.product_code}
                              </span>
                            </p>
                            <p>
                              Trip Type:{" "}
                              <span className="capitalize font-medium">
                                {product.tripType === "oneway"
                                  ? "One Way"
                                  : "Two Way"}
                              </span>
                            </p>
                            <p>
                              Quantity:{" "}
                              <span className="font-medium">
                                {product.quantity}
                              </span>
                            </p>
                            {product.productData.is_composite && (
                              <p>
                                Composite:{" "}
                                <span className="font-medium">
                                  {product.productData.components?.length || 0}{" "}
                                  components
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="ml-2 p-1 hover:bg-muted rounded transition-colors"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <Button
        onClick={handleProceed}
        disabled={isProceedDisabled || isSubmit}
        size="lg"
        className="w-full md:w-full"
      >
        {isEditMode ? "Update" : "Proceed"}
      </Button>
    </div>
  );
}
