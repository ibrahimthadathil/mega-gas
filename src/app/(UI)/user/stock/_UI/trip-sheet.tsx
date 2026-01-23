// "use client";

// import { useState, useEffect } from "react";
// import { Trash2, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DatePicker } from "@/components/ui/date-picker";
// import { useParams, useRouter } from "next/navigation";
// import { useQueryClient } from "@tanstack/react-query";
// import Link from "next/link";
// import { IProduct, IUser, PlantLoadRecord } from "@/types/types";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Warehouse } from "../../warehouses/page";
// import { toast } from "sonner";
// import {
//   getLoadslipByLoad,
//   unloadSlip,
// } from "@/services/client_api-Service/user/stock/unload_slip_transfer_api";
// import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
// import { get_userByRole } from "@/services/client_api-Service/user/user_api";

// // --- INTERFACES ---
// interface TripLoadRecord {
//   id?: string;
//   to_warehouse_id: string;
//   fullQuantity: number;
//   emptyQuantity: number;
//   trip_type: "oneway" | "two_way";
//   product_id: string;
//   plant_load_line_item_id: string;
//   return_product_id: string | null;
//   return_warehouse_id: string | null;
// }

// export interface TripFormData {
//   date: Date | undefined;
//   sapNumber: string;
//   qty: string;
//   warehouse_id: string;
//   plant_load_register_id?: string;
//   plant_load_line_item_id?: string;
//   tripLoadRecords: TripLoadRecord[];
//   helpers: string[];
// }

// interface UnloadLineItem {
//   plant_load_line_item_id: string;
//   product_name: string;
//   product_id: string;
//   trip_type: "oneway" | "two_way";
//   return_qty: number;
//   return_product_id: string | null;
// }

// export default function TripSheet({ loadSlipId }: { loadSlipId: string }) {
//   const router = useRouter();

//   const { data: unloadRecord, isLoading: isUnloadData } = UseRQ<
//     PlantLoadRecord[]
//   >("plant_load", () => getLoadslipByLoad(loadSlipId));
//   const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<
//     Warehouse[]
//   >("warehouse", getWarehouse);

//   const { data: products, isLoading: isProductLoading } = UseRQ(
//     "products",
//     getAllProducts
//   );

//   const { data: users, isLoading: isUserLoading } = UseRQ("user", () =>
//     get_userByRole("driver")
//   );
//   const [isSubmit, setSubmit] = useState<boolean>(false);

//   // Initialize state with empty values
//   const [formData, setFormData] = useState<TripFormData>({
//     date: new Date(),
//     plant_load_register_id: "",
//     sapNumber: "",
//     qty: "",
//     warehouse_id: "",
//     tripLoadRecords: [],
//     helpers: [],
//   });

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedLineItem, setSelectedLineItem] =
//     useState<UnloadLineItem | null>(null);
//   const [dialogFormData, setDialogFormData] = useState({
//     to_warehouse_id: "",
//     fullQuantity: "",
//     emptyQuantity: "",
//     return_warehouse_id: "",
//   });

//   // Update formData when unloadRecord loads
//   useEffect(() => {
//     if (unloadRecord) {
//       setFormData((prev) => ({
//         ...prev,
//         plant_load_register_id: unloadRecord[0]?.id,
//         sapNumber: unloadRecord[0]?.sap_number || "",
//         qty: unloadRecord[0]?.total_full_qty?.toString() || "",
//         warehouse_id: unloadRecord[0]?.warehouse_id || "",
//       }));
//     }
//   }, [unloadRecord]);

//   const handleDateChange = (date: Date | undefined) => {
//     setFormData({ ...formData, date });
//   };

//   const handleDialogFormChange = (field: string, value: string) => {
//     setDialogFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleLineItemClick = (lineItem: UnloadLineItem) => {
//     setSelectedLineItem(lineItem);
//     let returnProductId = lineItem?.return_product_id;

//     if (lineItem.trip_type === "oneway" && !returnProductId && products) {
//       const matchedProduct = (products as IProduct[]).find(
//         (p: any) => p.id === lineItem.product_id
//       );
//       returnProductId = matchedProduct?.return_product_id || null;
//     }

//     setSelectedLineItem({
//       ...lineItem,
//       return_product_id: returnProductId,
//     });

//     setDialogFormData({
//       to_warehouse_id: "",
//       fullQuantity: "",
//       emptyQuantity: "",
//       return_warehouse_id: "",
//     });

//     setDialogOpen(true);
//   };

//   const handleAddTripLoad = () => {
//     if (!dialogFormData.to_warehouse_id || !selectedLineItem) {
//       alert("Please select a vehicle/destination warehouse.");
//       return;
//     }

//     const fullQty = Number.parseInt(dialogFormData.fullQuantity) || 0;
//     const emptyQty = Number.parseInt(dialogFormData.emptyQuantity) || 0;

//     if (fullQty === 0 && emptyQty === 0) {
//       alert("Full quantity or Empty quantity must be greater than zero.");
//       return;
//     }

//     let finalReturnWarehouseId: string | null = null;

//     if (selectedLineItem.trip_type === "two_way") {
//       finalReturnWarehouseId = formData.warehouse_id || null;
//     } else if (selectedLineItem.trip_type === "oneway") {
//       if (emptyQty > 0) {
//         finalReturnWarehouseId = dialogFormData.return_warehouse_id || null;
//         if (!finalReturnWarehouseId) {
//           alert("Please select a Return Warehouse for the empty loads.");
//           return;
//         }
//       }
//     }
//     const newRecord: TripLoadRecord = {
//       plant_load_line_item_id: selectedLineItem.plant_load_line_item_id,
//       trip_type: selectedLineItem.trip_type,
//       product_id: selectedLineItem.product_id,
//       return_product_id: selectedLineItem.return_product_id || null,
//       to_warehouse_id: dialogFormData.to_warehouse_id,
//       fullQuantity: fullQty,
//       emptyQuantity: emptyQty,
//       return_warehouse_id: finalReturnWarehouseId,
//     };

//     setFormData((prev) => ({
//       ...prev,
//       tripLoadRecords: [...prev.tripLoadRecords, newRecord],
//     }));

//     setDialogFormData({
//       to_warehouse_id: "",
//       fullQuantity: "",
//       emptyQuantity: "",
//       return_warehouse_id: "",
//     });
//     setSelectedLineItem(null);
//     setDialogOpen(false);
//   };

//   const handleDeleteTripLoad = (id: string) => {
//     setFormData({
//       ...formData,
//       tripLoadRecords: formData.tripLoadRecords.filter(
//         (record) => record.id !== id
//       ),
//     });
//   };

//   const handleAddHelper = (helper: string) => {
//     if (!formData.helpers.includes(helper)) {
//       setFormData((prev) => ({
//         ...prev,
//         helpers: [...prev.helpers, helper],
//       }));
//     }
//   };

//   const handleRemoveHelper = (helper: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       helpers: prev.helpers.filter((h) => h !== helper),
//     }));
//   };

//   const getHelperName = (id: string): string => {
//     if (!id || !users) return "N/A";
//     return (users as IUser[]).find((u) => u.id === id)?.user_name || id;
//   };

//   const totalEmpty = formData.tripLoadRecords.reduce(
//     (sum, r) => sum + r.emptyQuantity,
//     0
//   );

//   const totalFull = formData.tripLoadRecords.reduce(
//     (sum, r) => sum + r.fullQuantity,
//     0
//   );

//   const getWarehouseName = (id: string | undefined): string => {
//     if (!id || !warehouses) return "N/A";
//     return warehouses.find((w) => w.id === id)?.name || id;
//   };

//   const handleProceed = async () => {
//     try {
//       setSubmit(true);
//       const data = await unloadSlip(formData);
//       if (data.success) {
//         toast.success("Slip created");
//         router.push("/user/stock/load-slip");
//       }
//     } catch (error) {
//       toast.error("error in unload submission");
//     }
//   };

//   // Show loading state for any loading data
//   if (isUnloadData || isWarehouseLoading || isProductLoading || isUserLoading) {
//     return <Skeleton className="h-screen w-full" />;
//   }

//   // Show error state if unloadRecord not found
//   if (!unloadRecord) {
//     return (
//       <main className="min-h-screen bg-background p-6">
//         <div className="max-w-4xl mx-auto">
//           <Card>
//             <CardContent className="pt-6 text-center">
//               <p className="text-muted-foreground mb-4">
//                 Unload items not found
//               </p>
//               <Link href={"/user/purchase"}>
//                 <Button>Go Back</Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   // Main render
//   return (
//     <div className="w-full max-w-2xl mx-auto space-y-6">
//       {/* Section 1: Trip Details Header */}
//       <div className="bg-card border border-border rounded-lg p-6">
//         <h2 className="text-lg font-semibold mb-4">🚚 Trip Details</h2>

//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <Label htmlFor="date" className="text-sm font-medium mb-1 block">
//               Date
//             </Label>
//             <DatePicker date={formData.date} onDateChange={handleDateChange} />
//           </div>

//           <div className="flex-1">
//             <Label className="text-sm font-medium mb-1 block">
//               Origin Warehouse
//             </Label>
//             <Input
//               value={unloadRecord[0]?.warehouse_name || ""}
//               disabled
//               className="bg-muted"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1">
//             <Label htmlFor="sap" className="text-sm font-medium mb-1 block">
//               SAP Number
//             </Label>
//             <Input
//               id="sap"
//               value={formData.sapNumber}
//               disabled
//               className="bg-muted"
//             />
//           </div>
//           <div className="flex-1">
//             <Label
//               htmlFor="cylinders"
//               className="text-sm font-medium mb-1 block"
//             >
//               Total Full Quantity (From SAP)
//             </Label>
//             <Input
//               id="cylinders"
//               value={formData.qty}
//               disabled
//               className="bg-muted"
//             />
//           </div>
//         </div>
//       </div>

//       <hr />

//       {/* Section 2: Trip Load Details */}
//       <div className="bg-card border border-border rounded-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">📦 Trip Load Details</h2>
//           <p className="text-sm text-muted-foreground">
//             Click on a product card to add load details
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//           {unloadRecord[0]?.line_items?.map((lineItem: any) => {
//             return (
//               <Card
//                 key={lineItem.line_item_id}
//                 className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
//                 onClick={() => handleLineItemClick(lineItem)}
//               >
//                 <div className="space-y-2">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Product</p>
//                     <p className="font-medium text-sm truncate">
//                       {lineItem.product_name}
//                     </p>
//                     <p>Qty : {lineItem.qty}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`px-2 py-1 rounded text-xs font-medium ${
//                         lineItem.trip_type === "two_way"
//                           ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
//                           : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100"
//                       }`}
//                     >
//                       {lineItem.trip_type === "two_way" ? "Two Way" : "One Way"}
//                     </div>
//                     {lineItem.return_qty > 0 && (
//                       <p className="text-xs text-muted-foreground">
//                         Max Return: {lineItem.return_qty}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Dialog for Adding Load Details */}
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>
//                 Add Load Details for {selectedLineItem?.product_name}
//               </DialogTitle>
//               <DialogDescription>
//                 Enter the destination and quantity for this product.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="load-vehicle">
//                   Destination Vehicle/Warehouse (to_warehouse_id)
//                 </Label>
//                 <Select
//                   value={dialogFormData.to_warehouse_id}
//                   onValueChange={(value) =>
//                     handleDialogFormChange("to_warehouse_id", value)
//                   }
//                 >
//                   <SelectTrigger id="load-vehicle">
//                     <SelectValue placeholder="Select vehicle/warehouse..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {(warehouses as Warehouse[])?.map((warehouse) => (
//                       <SelectItem
//                         key={warehouse.id}
//                         value={warehouse.id as string}
//                       >
//                         {warehouse.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="grid gap-2">
//                   <Label htmlFor="load-full">Full Quantity</Label>
//                   <Input
//                     id="load-full"
//                     type="number"
//                     placeholder="Quantity"
//                     value={dialogFormData.fullQuantity}
//                     onChange={(e) =>
//                       handleDialogFormChange("fullQuantity", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="load-empty">Empty Quantity</Label>
//                   <Input
//                     id="load-empty"
//                     type="number"
//                     placeholder="Quantity"
//                     value={dialogFormData.emptyQuantity}
//                     onChange={(e) =>
//                       handleDialogFormChange("emptyQuantity", e.target.value)
//                     }
//                   />
//                   <Input
//                     type="hidden"
//                     disabled
//                     value={selectedLineItem?.return_product_id || ""}
//                   />
//                 </div>
//               </div>

//               {selectedLineItem?.trip_type === "oneway" && (
//                 <div className="grid gap-2">
//                   <Label htmlFor="return-warehouse">
//                     Return Warehouse (If returning empty loads)
//                     {Number.parseInt(dialogFormData.emptyQuantity || "0") >
//                       0 && <span className="text-red-500 ml-1">*</span>}
//                   </Label>
//                   <Select
//                     value={dialogFormData.return_warehouse_id}
//                     onValueChange={(value) =>
//                       handleDialogFormChange("return_warehouse_id", value)
//                     }
//                     disabled={
//                       !dialogFormData.emptyQuantity ||
//                       Number.parseInt(dialogFormData.emptyQuantity) === 0
//                     }
//                   >
//                     <SelectTrigger id="return-warehouse">
//                       <SelectValue placeholder="Select return warehouse..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {(warehouses as Warehouse[])?.map((warehouse) => (
//                         <SelectItem
//                           key={warehouse.id}
//                           value={warehouse.id as string}
//                         >
//                           {warehouse.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}

//               {selectedLineItem?.trip_type === "two_way" &&
//                 selectedLineItem?.return_qty > 0 && (
//                   <div className="grid gap-2 text-sm text-muted-foreground">
//                     <p className="font-medium">Return Warehouse (Auto-Set)</p>
//                     <p className="text-green-500">
//                       {getWarehouseName(formData.warehouse_id)} (Origin)
//                     </p>
//                   </div>
//                 )}
//             </div>

//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setDialogOpen(false);
//                   setSelectedLineItem(null);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleAddTripLoad}>Add Load</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {formData.tripLoadRecords.length > 0 ? (
//           <>
//             <div className="border-t pt-4 mt-4">
//               <h3 className="text-sm font-semibold mb-3">Added Loads</h3>
//               <div className="overflow-x-auto flex gap-2 snap-x mb-4 pb-2">
//                 {formData.tripLoadRecords.map((record) => (
//                   <Card
//                     key={record.id}
//                     className="flex-shrink-0 min-w-[220px] p-3 relative"
//                   >
//                     <button
//                       onClick={() => handleDeleteTripLoad(record.id as string)}
//                       className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                     <div className="space-y-1.5">
//                       <div>
//                         <p className="text-xs text-muted-foreground">
//                           Destination (to_warehouse_id)
//                         </p>
//                         <p className="font-medium text-xs">
//                           {getWarehouseName(record.to_warehouse_id)}
//                         </p>
//                       </div>

//                       {record.return_warehouse_id && (
//                         <div>
//                           <p className="text-xs text-muted-foreground">
//                             Return Warehouse
//                           </p>
//                           <p className="font-medium text-xs text-blue-500">
//                             {getWarehouseName(record.return_warehouse_id)}
//                           </p>
//                         </div>
//                       )}

//                       <div className="flex gap-2 text-xs pt-1">
//                         {record.fullQuantity > 0 && (
//                           <div className="flex-1 bg-green-100 dark:bg-green-900 rounded px-2 py-1">
//                             <p className="text-muted-foreground text-xs">
//                               Full
//                             </p>
//                             <p className="font-semibold text-green-700 dark:text-green-100">
//                               {record.fullQuantity}
//                             </p>
//                           </div>
//                         )}
//                         {record.emptyQuantity > 0 && (
//                           <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded px-2 py-1">
//                             <p className="text-muted-foreground text-xs">
//                               Empty
//                             </p>
//                             <p className="font-semibold text-blue-700 dark:text-blue-100">
//                               {record.emptyQuantity}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             <div className="flex gap-6 text-sm bg-muted/30 rounded p-3">
//               <div>
//                 <p className="text-muted-foreground">Total Full Loaded:</p>
//                 <p className="font-semibold text-lg text-green-600">
//                   {totalFull}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Total Empty Returned:</p>
//                 <p className="font-semibold text-lg text-blue-600">
//                   {totalEmpty}
//                 </p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <p className="text-sm text-muted-foreground italic">
//             No load details added yet. Click on a product card above to start.
//           </p>
//         )}
//       </div>

//       <hr />

//       {/* Section 3: Helpers */}
//       <div className="bg-card border border-border rounded-lg p-6">
//         <h2 className="text-lg font-semibold mb-4">👷 Helpers</h2>

//         <div className="mb-4">
//           <Label
//             htmlFor="helpers-select"
//             className="text-sm font-medium mb-2 block"
//           >
//             Select Helper
//           </Label>
//           <Select onValueChange={handleAddHelper}>
//             <SelectTrigger id="helpers-select">
//               <SelectValue placeholder="Choose a helper..." />
//             </SelectTrigger>
//             <SelectContent>
//               {(users as IUser[])?.map((helper) => (
//                 <SelectItem
//                   key={helper.phone}
//                   value={helper.id as string}
//                   disabled={formData.helpers.includes(helper.id as string)}
//                 >
//                   {helper.user_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {formData.helpers.length > 0 ? (
//           <div className="flex flex-wrap gap-2">
//             {formData.helpers.map((helper) => (
//               <div
//                 key={helper}
//                 className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium"
//               >
//                 {getHelperName(helper)}
//                 <button
//                   onClick={() => handleRemoveHelper(helper)}
//                   className="ml-1 hover:opacity-70"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-muted-foreground italic">
//             No helpers added yet.
//           </p>
//         )}
//       </div>

//       {/* Submit Button */}
//       <Button
//         disabled={isSubmit}
//         onClick={handleProceed}
//         className="w-full"
//         size="lg"
//       >
//         Proceed
//       </Button>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IProduct, IUser, PlantLoadRecord } from "@/types/types";
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Warehouse } from "../../warehouses/page";
import { toast } from "sonner";
import {
  getLoadslipByLoad,
  unloadSlip,
} from "@/services/client_api-Service/user/stock/unload_slip_transfer_api";
import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
import { get_userByRole } from "@/services/client_api-Service/user/user_api";

// --- INTERFACES ---
interface TripLoadRecord {
  id: string; // Changed to required
  to_warehouse_id: string;
  fullQuantity: number;
  emptyQuantity: number;
  trip_type: "oneway" | "two_way";
  product_id: string;
  plant_load_line_item_id: string;
  return_product_id: string | null;
  return_warehouse_id: string | null;
}

export interface TripFormData {
  date: Date | undefined;
  sapNumber: string;
  qty: string;
  warehouse_id: string;
  plant_load_register_id?: string;
  plant_load_line_item_id?: string;
  tripLoadRecords: TripLoadRecord[];
  helpers: string[];
}

interface UnloadLineItem {
  plant_load_line_item_id: string;
  product_name: string;
  product_id: string;
  trip_type: "oneway" | "two_way";
  return_qty: number;
  return_product_id: string | null;
}

// Helper function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function TripSheet({ loadSlipId }: { loadSlipId: string }) {
  const router = useRouter();

  const { data: unloadRecord, isLoading: isUnloadData } = UseRQ<PlantLoadRecord[]>(
    "plant_load",
    () => getLoadslipByLoad(loadSlipId)
  );
  const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse
  );
  const { data: products, isLoading: isProductLoading } = UseRQ("products", getAllProducts);
  const { data: users, isLoading: isUserLoading } = UseRQ("user", () =>
    get_userByRole("driver")
  );

  const [isSubmit, setSubmit] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    date: new Date(),
    plant_load_register_id: "",
    sapNumber: "",
    qty: "",
    warehouse_id: "",
    tripLoadRecords: [],
    helpers: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<UnloadLineItem | null>(null);
  const [dialogFormData, setDialogFormData] = useState({
    to_warehouse_id: "",
    fullQuantity: "",
    emptyQuantity: "",
    return_warehouse_id: "",
  });

  // Update formData when unloadRecord loads
  useEffect(() => {
    if (unloadRecord?.[0]) {
      setFormData((prev) => ({
        ...prev,
        plant_load_register_id: unloadRecord[0].id,
        sapNumber: unloadRecord[0].sap_number || "",
        qty: unloadRecord[0].total_full_qty?.toString() || "",
        warehouse_id: unloadRecord[0].warehouse_id || "",
      }));
    }
  }, [unloadRecord]);

  // Memoized warehouse lookup
  const warehouseMap = useMemo(() => {
    if (!warehouses) return new Map();
    return new Map(warehouses.map((w) => [w.id, w.name]));
  }, [warehouses]);

  // Memoized user lookup
  const userMap = useMemo(() => {
    if (!users) return new Map();
    return new Map((users as IUser[]).map((u) => [u.id, u.user_name]));
  }, [users]);

  const getWarehouseName = (id: string | undefined): string => {
    if (!id) return "N/A";
    return warehouseMap.get(id) || id;
  };

  const getHelperName = (id: string): string => {
    if (!id) return "N/A";
    return userMap.get(id) || id;
  };

  const handleDialogFormChange = (field: string, value: string) => {
    setDialogFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineItemClick = (lineItem: UnloadLineItem) => {
    let returnProductId = lineItem?.return_product_id;

    if (lineItem.trip_type === "oneway" && !returnProductId && products) {
      const matchedProduct = (products as IProduct[]).find(
        (p: any) => p.id === lineItem.product_id
      );
      returnProductId = matchedProduct?.return_product_id || null;
    }

    setSelectedLineItem({
      ...lineItem,
      return_product_id: returnProductId,
    });

    setDialogFormData({
      to_warehouse_id: "",
      fullQuantity: "",
      emptyQuantity: "",
      return_warehouse_id: "",
    });

    setDialogOpen(true);
  };

  const handleAddTripLoad = () => {
    if (!dialogFormData.to_warehouse_id || !selectedLineItem) {
      toast.error("Please select a vehicle/destination warehouse.");
      return;
    }

    const fullQty = Number.parseInt(dialogFormData.fullQuantity) || 0;
    const emptyQty = Number.parseInt(dialogFormData.emptyQuantity) || 0;

    if (fullQty === 0 && emptyQty === 0) {
      toast.error("Full quantity or Empty quantity must be greater than zero.");
      return;
    }

    let finalReturnWarehouseId: string | null = null;

    if (selectedLineItem.trip_type === "two_way") {
      finalReturnWarehouseId = formData.warehouse_id || null;
    } else if (selectedLineItem.trip_type === "oneway" && emptyQty > 0) {
      finalReturnWarehouseId = dialogFormData.return_warehouse_id || null;
      if (!finalReturnWarehouseId) {
        toast.error("Please select a Return Warehouse for the empty loads.");
        return;
      }
    }

    const newRecord: TripLoadRecord = {
      id: generateId(), // FIX: Generate unique ID
      plant_load_line_item_id: selectedLineItem.plant_load_line_item_id,
      trip_type: selectedLineItem.trip_type,
      product_id: selectedLineItem.product_id,
      return_product_id: selectedLineItem.return_product_id || null,
      to_warehouse_id: dialogFormData.to_warehouse_id,
      fullQuantity: fullQty,
      emptyQuantity: emptyQty,
      return_warehouse_id: finalReturnWarehouseId,
    };

    setFormData((prev) => ({
      ...prev,
      tripLoadRecords: [...prev.tripLoadRecords, newRecord],
    }));

    setDialogFormData({
      to_warehouse_id: "",
      fullQuantity: "",
      emptyQuantity: "",
      return_warehouse_id: "",
    });
    setSelectedLineItem(null);
    setDialogOpen(false);
  };

  const handleDeleteTripLoad = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tripLoadRecords: prev.tripLoadRecords.filter((record) => record.id !== id),
    }));
  };

  const handleAddHelper = (helper: string) => {
    if (!formData.helpers.includes(helper)) {
      setFormData((prev) => ({
        ...prev,
        helpers: [...prev.helpers, helper],
      }));
    }
  };

  const handleRemoveHelper = (helper: string) => {
    setFormData((prev) => ({
      ...prev,
      helpers: prev.helpers.filter((h) => h !== helper),
    }));
  };

  // Memoized totals
  const { totalEmpty, totalFull } = useMemo(() => {
    const totalEmpty = formData.tripLoadRecords.reduce((sum, r) => sum + r.emptyQuantity, 0);
    const totalFull = formData.tripLoadRecords.reduce((sum, r) => sum + r.fullQuantity, 0);
    return { totalEmpty, totalFull };
  }, [formData.tripLoadRecords]);

  const handleProceed = async () => {
    try {
      setSubmit(true);
      const data = await unloadSlip(formData);
      if (data.success) {
        toast.success("Slip created");
        router.push("/user/stock/load-slip");
      }
    } catch (error) {
      toast.error("Error in unload submission");
    } finally {
      setSubmit(false);
    }
  };

  const isLoading = isUnloadData || isWarehouseLoading || isProductLoading || isUserLoading;

  if (isLoading) {
    return <Skeleton className="h-screen w-full" />;
  }

  if (!unloadRecord || unloadRecord.length === 0) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Unload items not found</p>
              <Link href="/user/purchase">
                <Button>Go Back</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const currentRecord = unloadRecord[0];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Section 1: Trip Details Header */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">🚚 Trip Details</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="date" className="text-sm font-medium mb-1 block">
              Date
            </Label>
            <DatePicker
              date={formData.date}
              onDateChange={(date) => setFormData({ ...formData, date })}
            />
          </div>

          <div className="flex-1">
            <Label className="text-sm font-medium mb-1 block">Origin Warehouse</Label>
            <Input value={currentRecord.warehouse_name || ""} disabled className="bg-muted" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="sap" className="text-sm font-medium mb-1 block">
              SAP Number
            </Label>
            <Input id="sap" value={formData.sapNumber} disabled className="bg-muted" />
          </div>
          <div className="flex-1">
            <Label htmlFor="cylinders" className="text-sm font-medium mb-1 block">
              Total Full Quantity (From SAP)
            </Label>
            <Input id="cylinders" value={formData.qty} disabled className="bg-muted" />
          </div>
        </div>
      </Card>

      {/* Section 2: Trip Load Details */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📦 Trip Load Details</h2>
          <p className="text-sm text-muted-foreground">Click on a product card to add load details</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {currentRecord.line_items?.map((lineItem: any) => (
            <Card
              key={lineItem.line_item_id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleLineItemClick(lineItem)}
            >
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="font-medium text-sm truncate">{lineItem.product_name}</p>
                  <p className="text-sm">Qty: {lineItem.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      lineItem.trip_type === "two_way"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                        : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100"
                    }`}
                  >
                    {lineItem.trip_type === "two_way" ? "Two Way" : "One Way"}
                  </div>
                  {lineItem.return_qty > 0 && (
                    <p className="text-xs text-muted-foreground">Max Return: {lineItem.return_qty}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dialog for Adding Load Details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Load Details for {selectedLineItem?.product_name}</DialogTitle>
              <DialogDescription>
                Enter the destination and quantity for this product.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="load-vehicle">Destination Vehicle/Warehouse</Label>
                <Select
                  value={dialogFormData.to_warehouse_id}
                  onValueChange={(value) => handleDialogFormChange("to_warehouse_id", value)}
                >
                  <SelectTrigger id="load-vehicle">
                    <SelectValue placeholder="Select vehicle/warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses?.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id as string}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="load-full">Full Quantity</Label>
                  <Input
                    id="load-full"
                    type="number"
                    placeholder="0"
                    value={dialogFormData.fullQuantity}
                    onChange={(e) => handleDialogFormChange("fullQuantity", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="load-empty">Empty Quantity</Label>
                  <Input
                    id="load-empty"
                    type="number"
                    placeholder="0"
                    value={dialogFormData.emptyQuantity}
                    onChange={(e) => handleDialogFormChange("emptyQuantity", e.target.value)}
                  />
                </div>
              </div>

              {selectedLineItem?.trip_type === "oneway" && (
                <div className="grid gap-2">
                  <Label htmlFor="return-warehouse">
                    Return Warehouse (If returning empty loads)
                    {Number.parseInt(dialogFormData.emptyQuantity || "0") > 0 && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  <Select
                    value={dialogFormData.return_warehouse_id}
                    onValueChange={(value) => handleDialogFormChange("return_warehouse_id", value)}
                    disabled={
                      !dialogFormData.emptyQuantity ||
                      Number.parseInt(dialogFormData.emptyQuantity) === 0
                    }
                  >
                    <SelectTrigger id="return-warehouse">
                      <SelectValue placeholder="Select return warehouse..." />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses?.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id as string}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedLineItem?.trip_type === "two_way" && selectedLineItem?.return_qty > 0 && (
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p className="font-medium">Return Warehouse (Auto-Set)</p>
                  <p className="text-green-500">{getWarehouseName(formData.warehouse_id)} (Origin)</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setSelectedLineItem(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTripLoad}>Add Load</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {formData.tripLoadRecords.length > 0 ? (
          <>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Added Loads</h3>
              <div className="overflow-x-auto flex gap-2 snap-x mb-4 pb-2">
                {formData.tripLoadRecords.map((record) => (
                  <Card key={record.id} className="flex-shrink-0 min-w-[220px] p-3 relative">
                    <button
                      onClick={() => handleDeleteTripLoad(record.id)}
                      className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                      aria-label="Delete load"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="space-y-1.5">
                      <div>
                        <p className="text-xs text-muted-foreground">Destination</p>
                        <p className="font-medium text-xs">{getWarehouseName(record.to_warehouse_id)}</p>
                      </div>

                      {record.return_warehouse_id && (
                        <div>
                          <p className="text-xs text-muted-foreground">Return Warehouse</p>
                          <p className="font-medium text-xs text-blue-500">
                            {getWarehouseName(record.return_warehouse_id)}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 text-xs pt-1">
                        {record.fullQuantity > 0 && (
                          <div className="flex-1 bg-green-100 dark:bg-green-900 rounded px-2 py-1">
                            <p className="text-muted-foreground text-xs">Full</p>
                            <p className="font-semibold text-green-700 dark:text-green-100">
                              {record.fullQuantity}
                            </p>
                          </div>
                        )}
                        {record.emptyQuantity > 0 && (
                          <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded px-2 py-1">
                            <p className="text-muted-foreground text-xs">Empty</p>
                            <p className="font-semibold text-blue-700 dark:text-blue-100">
                              {record.emptyQuantity}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-6 text-sm bg-muted/30 rounded p-3">
              <div>
                <p className="text-muted-foreground">Total Full Loaded:</p>
                <p className="font-semibold text-lg text-green-600">{totalFull}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Empty Returned:</p>
                <p className="font-semibold text-lg text-blue-600">{totalEmpty}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No load details added yet. Click on a product card above to start.
          </p>
        )}
      </Card>

      {/* Section 3: Helpers */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">👷 Helpers</h2>

        <div className="mb-4">
          <Label htmlFor="helpers-select" className="text-sm font-medium mb-2 block">
            Select Helper
          </Label>
          <Select onValueChange={handleAddHelper}>
            <SelectTrigger id="helpers-select">
              <SelectValue placeholder="Choose a helper..." />
            </SelectTrigger>
            <SelectContent>
              {(users as IUser[])?.map((helper) => (
                <SelectItem
                  key={helper.id}
                  value={helper.id as string}
                  disabled={formData.helpers.includes(helper.id as string)}
                >
                  {helper.user_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.helpers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.helpers.map((helper) => (
              <div
                key={helper}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium"
              >
                {getHelperName(helper)}
                <button onClick={() => handleRemoveHelper(helper)} className="ml-1 hover:opacity-70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No helpers added yet.</p>
        )}
      </Card>

      {/* Submit Button */}
      <Button disabled={isSubmit} onClick={handleProceed} className="w-full" size="lg">
        {isSubmit ? "Processing..." : "Proceed"}
      </Button>
    </div>
  );
}