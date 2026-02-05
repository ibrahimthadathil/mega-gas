// "use client";

// import DataTable from "@/components/data-table";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import {
//   deleteUnloadSlip,
//   getAllUnloadDetails,
// } from "@/services/client_api-Service/user/unload/unload_api";
// import { PlantLoadUnloadView } from "@/types/unloadSlip";
// import { Ban, Eye, Pencil, Trash } from "lucide-react";
// import AlertModal from "@/components/alert-dialog";
// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";
// import { Rootstate } from "@/redux/store";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

// const page = () => {
//   const { data: unloadedRecord, isLoading } = UseRQ<PlantLoadUnloadView[]>(
//     "unloadRecord",
//     getAllUnloadDetails,
//   );
//   const queryClient = useQueryClient();
//   const { role } = useSelector((user: Rootstate) => user.user);
//   const router = useRouter();
//   const handleDelete = async (id: string, unloaded: boolean) => {
//     try {
//       if (!unloaded) return toast.warning("Not possible until unload");
//       const data = await deleteUnloadSlip(id);
//       if (data.success)
//         queryClient.invalidateQueries({ queryKey: ["unloadRecord"] });
//       toast.success(data.message);
//     } catch (error) {
//       toast.error((error as Error).message);
//     }
//   };

//   const handleEdit = async (id: string) => {
//     router.push(`/user/stock/load-slip/${id}?mode=edit`);
//   };
//   const columns = useMemo(() => {
//     return [
//       {
//         header: "No",
//         render: (_e: PlantLoadUnloadView, i: number) => `TR${i + 1}`,
//       },
//       {
//         header: "Bill Date",
//         render: (row: PlantLoadUnloadView) => <span>{row?.bill_date}</span>,
//       },
//       {
//         header: "Sap Number",
//         render: (row: PlantLoadUnloadView) => <span>{row?.sap_number}</span>,
//       },
//       {
//         header: "Warehouse",
//         render: (row: PlantLoadUnloadView) => (
//           <span>{row?.warehouse.name}</span>
//         ),
//       },
//       {
//         header: "Total QTY",
//         render: (row: PlantLoadUnloadView) => <span>{row?.total_qty}</span>,
//       },
//       {
//         header: "Total Return QTY",
//         render: (row: PlantLoadUnloadView) => (
//           <span>{row?.total_return_qty}</span>
//         ),
//       },
//       {
//         header: "Unload Date",
//         render: (row: PlantLoadUnloadView) => (
//           <span className="text-green-800">
//             {row?.unload_date || "Not unloaded Yet"}
//           </span>
//         ),
//       },
//       {
//         header: "Unload Status",
//         render: (row: PlantLoadUnloadView) => (
//           <Badge
//             variant="outline"
//             className={cn(
//               "text-white bg-red-400",
//               row?.unload_details?.length > 0 && "bg-green-800",
//             )}
//           >
//             {row?.unload_details?.length > 0 ? "Unloaded" : "Not Unloaded"}
//           </Badge>
//         ),
//       },
//       {
//         header: "Unload Details",
//         render: (row: PlantLoadUnloadView) =>
//           row?.unload_details?.length > 0 ? (
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <Eye className="h-4 w-4 mr-2" />
//                   View Details
//                 </Button>
//               </DialogTrigger>
//               <DialogContent
//                 className="max-w-6xl max-h-[80vh] overflow-y-scroll [&>button]:hidden"
//                 aria-describedby={undefined}
//               >
//                 <DialogHeader>
//                   <DialogTitle>Unload Details</DialogTitle>
//                 </DialogHeader>
//                 <div className="mt-4">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>NO</TableHead>
//                         <TableHead>vehicle</TableHead>
//                         <TableHead>Product</TableHead>
//                         <TableHead>QTY</TableHead>
//                         <TableHead>Return Product</TableHead>
//                         <TableHead>Return QTY</TableHead>
//                         <TableHead>Return Warehouse To</TableHead>
//                         <TableHead>Trip Type</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {row?.unload_details?.map((detail, index) => (
//                         <TableRow key={detail.id}>
//                           <TableCell>{index + 1}</TableCell>
//                           <TableCell>{detail.to_warehouse.name}</TableCell>
//                           <TableCell>{detail.product.name}</TableCell>
//                           <TableCell>{detail.qty}</TableCell>
//                           <TableCell>
//                             {detail.return_product?.name || "No return"}
//                           </TableCell>
//                           <TableCell>{detail.return_qty || 0}</TableCell>
//                           <TableCell>
//                             {detail.to_return_warehouse?.name || "-"}
//                           </TableCell>
//                           <TableCell>{detail.trip_type}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           ) : (
//             " - "
//           ),
//       },
//       {
//         header: "Edit",
//         render: (row: PlantLoadUnloadView) => (
//           <Button
//             variant="ghost"
//             onClick={() => handleEdit(row?.plant_load_register_id)}
//           >
//             <Pencil color="skyblue" />
//           </Button>
//         ),
//       },
//       {
//         header: "Delete",
//         render: (row: PlantLoadUnloadView) =>
//           role == "admin" ? (
//             <AlertModal
//               data={row}
//               contents={[
//                 <Trash className="h-5 w-5" />,
//                 <>
//                   This action cannot be undone. This will permanently delete
//                   this transfer record.
//                 </>,
//               ]}
//               style=" p-2"
//               varient="ghost"
//               action={() =>
//                 handleDelete(
//                   row?.plant_load_register_id,
//                   row?.unload_details?.length >= 1,
//                 )
//               }
//             />
//           ) : (
//             <>
//               <Ban className="h-5 w-5 text-red-500 " />
//             </>
//           ),
//       },
//     ];
//   }, [unloadedRecord]);

//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <h1 className="text-3xl font-semibold mb-2">Unload slip History</h1>
//       {isLoading ? (
//         <Skeleton className="w-full h-24 bg-zinc-50" />
//       ) : (
//         <DataTable
//           columns={columns}
//           itemsPerPage={10}
//           data={unloadedRecord ?? []}
//         />
//       )}
//     </main>
//   );
// };

// export default page;


// "use client";

// import DataTable from "@/components/data-table";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import {
//   deleteUnloadSlip,
//   getAllUnloadDetails,
// } from "@/services/client_api-Service/user/unload/unload_api";
// import { PlantLoadUnloadView, UnloadFilters } from "@/types/unloadSlip";
// import { Ban, Eye, Pencil, Trash, Filter, X } from "lucide-react";
// import AlertModal from "@/components/alert-dialog";
// import React, { useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { Rootstate } from "@/redux/store";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Card, CardContent } from "@/components/ui/card";

// const UnloadSlipPage = () => {
//   const [filters, setFilters] = useState<UnloadFilters>({
//     limit: 10,
//     page: 1,
//     warehouseId: undefined,
//     billDateFrom: undefined,
//     billDateTo: undefined,
//     unloadDateFrom: undefined,
//     unloadDateTo: undefined,
//   });

//   const [showFilters, setShowFilters] = useState(false);

//   const { data: unloadedRecord, isLoading } = UseRQ<{
//     data: PlantLoadUnloadView[];
//     limit: number;
//     page: number;
//     total: number;
//     totalPage: number;
//   }>(["unloadRecord",filters], () => getAllUnloadDetails(filters));
//   console.log(unloadedRecord,'222');
  
//   const queryClient = useQueryClient();
//   const { role } = useSelector((user: Rootstate) => user.user);
//   const router = useRouter();

//   // Get unique warehouses for filter dropdown
//   const warehouses = useMemo(() => {
//     if (!unloadedRecord?.data) return [];
//     const uniqueWarehouses = Array.from(
//       new Set(
//         unloadedRecord.data.map((item) => JSON.stringify(item.warehouse))
//       )
//     ).map((item) => JSON.parse(item));
//     return uniqueWarehouses;
//   }, [unloadedRecord]);

//   const handlePageChange = (page: number) => {
//     setFilters((prev) => ({
//       ...prev,
//       page,
//     }));
//   };

//   const handleFilterChange = (key: keyof UnloadFilters, value: any) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//       page: 1, // Reset to first page when filtering
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       limit: 16,
//       page: 1,
//       warehouseId: undefined,
//       billDateFrom: undefined,
//       billDateTo: undefined,
//       unloadDateFrom: undefined,
//       unloadDateTo: undefined,
//     });
//   };

//   const hasActiveFilters = useMemo(() => {
//     return !!(
//       filters.warehouseId ||
//       filters.billDateFrom ||
//       filters.billDateTo ||
//       filters.unloadDateFrom ||
//       filters.unloadDateTo
//     );
//   }, [filters]);

//   const handleDelete = async (id: string, unloaded: boolean) => {
//     try {
//       if (!unloaded) return toast.warning("Not possible until unload");
//       const data = await deleteUnloadSlip(id);
//       if (data.success)
//         queryClient.invalidateQueries({ queryKey: ["unloadRecord"] });
//       toast.success(data.message);
//     } catch (error) {
//       toast.error((error as Error).message);
//     }
//   };

//   const handleEdit = async (id: string, unloaded: boolean) => {
//     if (!unloaded) {
//       toast.warning("Not possible before unload");
//       return;
//     } else router.push(`/user/stock/load-slip/${id}?mode=edit`);
//   };

//   const columns = useMemo(() => {
//     return [
//       {
//         header: "No",
//         render: (_e: PlantLoadUnloadView, i: number) =>
//           `${((filters as any)?.page - 1) * (filters as any)?.limit + i + 1}`,
//       },
//       {
//         header: "Bill Date",
//         render: (row: PlantLoadUnloadView) => (
//           <span className="text-sm">{row?.bill_date}</span>
//         ),
//       },
//       {
//         header: "SAP Number",
//         render: (row: PlantLoadUnloadView) => (
//           <span className="font-medium text-sm">{row?.sap_number}</span>
//         ),
//       },
//       {
//         header: "Warehouse",
//         render: (row: PlantLoadUnloadView) => (
//           <span className="text-sm">{row?.warehouse.name}</span>
//         ),
//       },
//       {
//         header: "Total QTY",
//         render: (row: PlantLoadUnloadView) => (
//           <span className="font-semibold text-sm">{row?.total_qty}</span>
//         ),
//       },
//       {
//         header: "Total Return QTY",
//         render: (row: PlantLoadUnloadView) => (
//           <span className="font-semibold text-sm">{row?.total_return_qty}</span>
//         ),
//       },
//       {
//         header: "Unloading Staff",
//         render: (row: PlantLoadUnloadView) => (
//           <div className="text-sm">
//             {row?.unloading_staff && row.unloading_staff.length > 0 ? (
//               <div className="flex flex-wrap gap-1">
//                 {row.unloading_staff.map((staff) => (
//                   <Badge
//                     key={staff.id}
//                     variant="secondary"
//                     className="text-xs"
//                   >
//                     {staff.name}
//                   </Badge>
//                 ))}
//               </div>
//             ) : (
//               <span className="text-muted-foreground">-</span>
//             )}
//           </div>
//         ),
//       },
//       {
//         header: "Unload Date",
//         render: (row: PlantLoadUnloadView) => (
//           <span
//             className={cn(
//               "text-sm",
//               row?.unload_date ? "text-green-700 font-medium" : "text-gray-500"
//             )}
//           >
//             {row?.unload_date || "Not unloaded"}
//           </span>
//         ),
//       },
//       {
//         header: "Status",
//         render: (row: PlantLoadUnloadView) => (
//           <Badge
//             variant="outline"
//             className={cn(
//               "text-white bg-red-500 border-red-600",
//               row?.unload_details?.length > 0 &&
//                 "bg-green-600 border-green-700"
//             )}
//           >
//             {row?.unload_details?.length > 0 ? "Unloaded" : "Pending"}
//           </Badge>
//         ),
//       },
//       {
//         header: "Details",
//         render: (row: PlantLoadUnloadView) =>
//           row?.unload_details?.length > 0 ? (
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <Eye className="h-4 w-4 mr-2" />
//                   View
//                 </Button>
//               </DialogTrigger>
//               <DialogContent
//                 className="max-w-6xl max-h-[80vh] overflow-y-auto [&>button]:hidden"
//                 aria-describedby={undefined}
//               >
//                 <DialogHeader>
//                   <DialogTitle className="text-xl font-semibold">
//                     Unload Details - {row.sap_number}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <div className="mt-4">
//                   <div className="rounded-lg border bg-card">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-muted/50">
//                           <TableHead className="font-semibold">No</TableHead>
//                           <TableHead className="font-semibold">
//                             To Warehouse
//                           </TableHead>
//                           <TableHead className="font-semibold">
//                             Product
//                           </TableHead>
//                           <TableHead className="font-semibold">QTY</TableHead>
//                           <TableHead className="font-semibold">
//                             Return Product
//                           </TableHead>
//                           <TableHead className="font-semibold">
//                             Return QTY
//                           </TableHead>
//                           <TableHead className="font-semibold">
//                             Return To
//                           </TableHead>
//                           <TableHead className="font-semibold">
//                             Trip Type
//                           </TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {row?.unload_details?.map((detail, index) => (
//                           <TableRow key={detail.id} className="hover:bg-muted/30">
//                             <TableCell className="font-medium">
//                               {index + 1}
//                             </TableCell>
//                             <TableCell>{detail.to_warehouse.name}</TableCell>
//                             <TableCell>{detail.product.name}</TableCell>
//                             <TableCell className="font-semibold">
//                               {detail.qty}
//                             </TableCell>
//                             <TableCell>
//                               {detail.return_product?.name || (
//                                 <span className="text-muted-foreground">
//                                   No return
//                                 </span>
//                               )}
//                             </TableCell>
//                             <TableCell className="font-semibold">
//                               {detail.return_qty || 0}
//                             </TableCell>
//                             <TableCell>
//                               {detail.to_return_warehouse?.name || "-"}
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="secondary">
//                                 {detail.trip_type}
//                               </Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           ) : (
//             <span className="text-muted-foreground text-sm">-</span>
//           ),
//       },
//       {
//         header: "Actions",
//         render: (row: PlantLoadUnloadView) => (
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() =>
//                 handleEdit(
//                   row?.plant_load_register_id,
//                   row?.unload_details?.length >= 1
//                 )
//               }
//             >
//               <Pencil className="h-4 w-4 text-blue-600" />
//             </Button>
//             {role === "admin" ? (
//               <AlertModal
//                 data={row}
//                 contents={[
//                   <Trash className="h-4 w-4" key="icon" />,
//                   <span key="message">
//                     This action cannot be undone. This will permanently delete
//                     this transfer record.
//                   </span>,
//                 ]}
//                 style="p-2"
//                 varient="ghost"
//                 action={() =>
//                   handleDelete(
//                     row?.plant_load_register_id,
//                     row?.unload_details?.length >= 1
//                   )
//                 }
//               />
//             ) : (
//               <Ban className="h-4 w-4 text-red-500" />
//             )}
//           </div>
//         ),
//       },
//     ];
//   }, [filters, role]);

//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-3xl font-semibold">Unload Slip History</h1>
//           <div className="flex items-center gap-2">
//             {hasActiveFilters && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={clearFilters}
//                 className="gap-2"
//               >
//                 <X className="h-4 w-4" />
//                 Clear Filters
//               </Button>
//             )}
//             <Popover open={showFilters} onOpenChange={setShowFilters}>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="gap-2">
//                   <Filter className="h-4 w-4" />
//                   Filters
//                   {hasActiveFilters && (
//                     <Badge variant="secondary" className="ml-1 px-1.5">
//                       Active
//                     </Badge>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-80" align="end">
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <h4 className="font-medium text-sm">Filter Options</h4>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="warehouse">Warehouse</Label>
//                     <Select
//                       value={filters.warehouseId || "all"}
//                       onValueChange={(value) =>
//                         handleFilterChange(
//                           "warehouseId",
//                           value === "all" ? undefined : value
//                         )
//                       }
//                     >
//                       <SelectTrigger id="warehouse">
//                         <SelectValue placeholder="All Warehouses" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Warehouses</SelectItem>
//                         {warehouses.map((wh) => (
//                           <SelectItem key={wh.id} value={wh.id}>
//                             {wh.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Bill Date Range</Label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <Label htmlFor="billDateFrom" className="text-xs">
//                           From
//                         </Label>
//                         <Input
//                           id="billDateFrom"
//                           type="date"
//                           value={filters.billDateFrom || ""}
//                           onChange={(e) =>
//                             handleFilterChange("billDateFrom", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="billDateTo" className="text-xs">
//                           To
//                         </Label>
//                         <Input
//                           id="billDateTo"
//                           type="date"
//                           value={filters.billDateTo || ""}
//                           onChange={(e) =>
//                             handleFilterChange("billDateTo", e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Unload Date Range</Label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <Label htmlFor="unloadDateFrom" className="text-xs">
//                           From
//                         </Label>
//                         <Input
//                           id="unloadDateFrom"
//                           type="date"
//                           value={filters.unloadDateFrom || ""}
//                           onChange={(e) =>
//                             handleFilterChange(
//                               "unloadDateFrom",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="unloadDateTo" className="text-xs">
//                           To
//                         </Label>
//                         <Input
//                           id="unloadDateTo"
//                           type="date"
//                           value={filters.unloadDateTo || ""}
//                           onChange={(e) =>
//                             handleFilterChange("unloadDateTo", e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-2 pt-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={clearFilters}
//                       className="flex-1"
//                     >
//                       Clear
//                     </Button>
//                     <Button
//                       size="sm"
//                       onClick={() => setShowFilters(false)}
//                       className="flex-1"
//                     >
//                       Apply
//                     </Button>
//                   </div>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>

//         {hasActiveFilters && (
//           <Card className="bg-muted/50">
//             <CardContent className="p-3">
//               <div className="flex flex-wrap gap-2 items-center text-sm">
//                 <span className="font-medium">Active Filters:</span>
//                 {filters.warehouseId && (
//                   <Badge variant="secondary">
//                     Warehouse:{" "}
//                     {
//                       warehouses.find((w) => w.id === filters.warehouseId)
//                         ?.name
//                     }
//                   </Badge>
//                 )}
//                 {filters.billDateFrom && (
//                   <Badge variant="secondary">
//                     Bill From: {filters.billDateFrom}
//                   </Badge>
//                 )}
//                 {filters.billDateTo && (
//                   <Badge variant="secondary">
//                     Bill To: {filters.billDateTo}
//                   </Badge>
//                 )}
//                 {filters.unloadDateFrom && (
//                   <Badge variant="secondary">
//                     Unload From: {filters.unloadDateFrom}
//                   </Badge>
//                 )}
//                 {filters.unloadDateTo && (
//                   <Badge variant="secondary">
//                     Unload To: {filters.unloadDateTo}
//                   </Badge>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {isLoading ? (
//         <Skeleton className="w-full h-96 bg-zinc-50" />
//       ) : (
//         <div className="rounded-lg border bg-card shadow-sm">
//           <DataTable
//             columns={columns}
//             paginationMode="server"
//             currentPage={unloadedRecord?.page}
//             totalPages={unloadedRecord?.totalPage}
//             onChange={handlePageChange}
//             data={unloadedRecord?.data ?? []}
//           />
//         </div>
//       )}
//     </main>
//   );
// };

// export default UnloadSlipPage;



"use client";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  deleteUnloadSlip,
  getAllUnloadDetails,
} from "@/services/client_api-Service/user/unload/unload_api";
import { PlantLoadUnloadView, UnloadFilters } from "@/types/unloadSlip";
import { Ban, Eye, Pencil, Trash, Filter, X } from "lucide-react";
import AlertModal from "@/components/alert-dialog";
import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";

interface UnloadSlipFormData {
  page: number;
  limit: number;
  warehouseId: string;
  billDateFrom: string;
  billDateTo: string;
  unloadDateFrom: string;
  unloadDateTo: string;
}

const UnloadSlipPage = () => {
  const { control, watch, setValue, reset } = useForm<UnloadSlipFormData>({
    defaultValues: {
      page: 1,
      limit: 10,
      warehouseId: "",
      billDateFrom: "",
      billDateTo: "",
      unloadDateFrom: "",
      unloadDateTo: "",
    },
  });

  const formValues = watch();

  // Convert form values to API filters
  const apiFilters = useMemo<UnloadFilters>(() => {
    return {
      page: formValues.page,
      limit: formValues.limit,
      warehouseId: formValues.warehouseId || undefined,
      billDateFrom: formValues.billDateFrom || undefined,
      billDateTo: formValues.billDateTo || undefined,
      unloadDateFrom: formValues.unloadDateFrom || undefined,
      unloadDateTo: formValues.unloadDateTo || undefined,
    };
  }, [formValues]);

  const { data: unloadedRecord, isLoading, refetch } = UseRQ<{
    data: PlantLoadUnloadView[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  }>(
    ["unloadRecord", apiFilters],
    () => getAllUnloadDetails(apiFilters),
  
  );

  console.log("Unloaded Record:", unloadedRecord);
  console.log("Current Filters:", apiFilters);

  const queryClient = useQueryClient();
  const { role } = useSelector((user: Rootstate) => user.user);
  const router = useRouter();

  // Get unique warehouses for filter dropdown
  const warehouses = useMemo(() => {
    if (!unloadedRecord?.data) return [];
    const uniqueWarehouses = Array.from(
      new Set(
        unloadedRecord.data.map((item) => JSON.stringify(item.warehouse))
      )
    ).map((item) => JSON.parse(item));
    return uniqueWarehouses;
  }, [unloadedRecord]);

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    setValue("page", page);
  };

  const handleFilterChange = (key: keyof UnloadSlipFormData, value: any) => {
    console.log(`Filter ${key} changed to:`, value);
    setValue(key, value);
    // Reset to first page when any filter changes (except page and limit)
    if (key !== "page" && key !== "limit") {
      setValue("page", 1);
    }
  };

  const clearFilters = () => {
    reset({
      page: 1,
      limit: 10,
      warehouseId: "",
      billDateFrom: "",
      billDateTo: "",
      unloadDateFrom: "",
      unloadDateTo: "",
    });
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      formValues.warehouseId ||
      formValues.billDateFrom ||
      formValues.billDateTo ||
      formValues.unloadDateFrom ||
      formValues.unloadDateTo
    );
  }, [formValues]);

  const handleDelete = async (id: string, unloaded: boolean) => {
    try {
      if (!unloaded) return toast.warning("Not possible until unload");
      const data = await deleteUnloadSlip(id);
      if (data.success) {
        await queryClient.invalidateQueries({ queryKey: ["unloadRecord"] });
        toast.success(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEdit = async (id: string, unloaded: boolean) => {
    if (!unloaded) {
      toast.warning("Not possible before unload");
      return;
    }
    router.push(`/user/stock/load-slip/${id}?mode=edit`);
  };

  const columns = useMemo(() => {
    return [
      {
        header: "No",
        render: (_e: PlantLoadUnloadView, i: number) => {
          const rowNumber =
            (formValues.page - 1) * formValues.limit + i + 1;
          return <span className="font-medium">{rowNumber}</span>;
        },
      },
      {
        header: "Bill Date",
        render: (row: PlantLoadUnloadView) => (
          <span className="text-sm">{row?.bill_date}</span>
        ),
      },
      {
        header: "SAP Number",
        render: (row: PlantLoadUnloadView) => (
          <span className="font-medium text-sm">{row?.sap_number}</span>
        ),
      },
      {
        header: "Warehouse",
        render: (row: PlantLoadUnloadView) => (
          <span className="text-sm">{row?.warehouse.name}</span>
        ),
      },
      {
        header: "Total QTY",
        render: (row: PlantLoadUnloadView) => (
          <span className="font-semibold text-sm">{row?.total_qty}</span>
        ),
      },
      {
        header: "Total Return QTY",
        render: (row: PlantLoadUnloadView) => (
          <span className="font-semibold text-sm">
            {row?.total_return_qty}
          </span>
        ),
      },
      {
        header: "Unloading Staff",
        render: (row: PlantLoadUnloadView) => (
          <div className="text-sm">
            {row?.unloading_staff && row.unloading_staff.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {row.unloading_staff.map((staff) => (
                  <Badge key={staff.id} variant="secondary" className="text-xs">
                    {staff.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        ),
      },
      {
        header: "Unload Date",
        render: (row: PlantLoadUnloadView) => (
          <span
            className={cn(
              "text-sm",
              row?.unload_date
                ? "text-green-700 font-medium"
                : "text-gray-500"
            )}
          >
            {row?.unload_date || "Not unloaded"}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row: PlantLoadUnloadView) => (
          <Badge
            variant="outline"
            className={cn(
              "text-white bg-red-500 border-red-600",
              row?.unload_details?.length > 0 &&
                "bg-green-600 border-green-700"
            )}
          >
            {row?.unload_details?.length > 0 ? "Unloaded" : "Pending"}
          </Badge>
        ),
      },
      {
        header: "Details",
        render: (row: PlantLoadUnloadView) =>
          row?.unload_details?.length > 0 ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-6xl max-h-[80vh] overflow-y-auto [&>button]:hidden"
                aria-describedby={undefined}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Unload Details - {row.sap_number}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="rounded-lg border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">No</TableHead>
                          <TableHead className="font-semibold">
                            To Warehouse
                          </TableHead>
                          <TableHead className="font-semibold">
                            Product
                          </TableHead>
                          <TableHead className="font-semibold">QTY</TableHead>
                          <TableHead className="font-semibold">
                            Return Product
                          </TableHead>
                          <TableHead className="font-semibold">
                            Return QTY
                          </TableHead>
                          <TableHead className="font-semibold">
                            Return To
                          </TableHead>
                          <TableHead className="font-semibold">
                            Trip Type
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {row?.unload_details?.map((detail, index) => (
                          <TableRow
                            key={detail.id}
                            className="hover:bg-muted/30"
                          >
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>{detail.to_warehouse.name}</TableCell>
                            <TableCell>{detail.product.name}</TableCell>
                            <TableCell className="font-semibold">
                              {detail.qty}
                            </TableCell>
                            <TableCell>
                              {detail.return_product?.name || (
                                <span className="text-muted-foreground">
                                  No return
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {detail.return_qty || 0}
                            </TableCell>
                            <TableCell>
                              {detail.to_return_warehouse?.name || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {detail.trip_type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          ),
      },
      {
        header: "Actions",
        render: (row: PlantLoadUnloadView) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleEdit(
                  row?.plant_load_register_id,
                  row?.unload_details?.length >= 1
                )
              }
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
            {role === "admin" ? (
              <AlertModal
                data={row}
                contents={[
                  <Trash className="h-4 w-4" key="icon" />,
                  <span key="message">
                    This action cannot be undone. This will permanently delete
                    this transfer record.
                  </span>,
                ]}
                style="p-2"
                varient="ghost"
                action={() =>
                  handleDelete(
                    row?.plant_load_register_id,
                    row?.unload_details?.length >= 1
                  )
                }
              />
            ) : (
              <Ban className="h-4 w-4 text-red-500" />
            )}
          </div>
        ),
      },
    ];
  }, [formValues, role]);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">Unload Slip History</h1>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 px-1.5">
                      Active
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Filter Options</h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Controller
                      name="warehouseId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || "all"}
                          onValueChange={(value) =>
                            handleFilterChange(
                              "warehouseId",
                              value === "all" ? "" : value
                            )
                          }
                        >
                          <SelectTrigger id="warehouse">
                            <SelectValue placeholder="All Warehouses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Warehouses</SelectItem>
                            {warehouses.map((wh) => (
                              <SelectItem key={wh.id} value={wh.id}>
                                {wh.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bill Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="billDateFrom" className="text-xs">
                          From
                        </Label>
                        <Controller
                          name="billDateFrom"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="billDateFrom"
                              type="date"
                              {...field}
                              onChange={(e) =>
                                handleFilterChange(
                                  "billDateFrom",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billDateTo" className="text-xs">
                          To
                        </Label>
                        <Controller
                          name="billDateTo"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="billDateTo"
                              type="date"
                              {...field}
                              onChange={(e) =>
                                handleFilterChange("billDateTo", e.target.value)
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Unload Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="unloadDateFrom" className="text-xs">
                          From
                        </Label>
                        <Controller
                          name="unloadDateFrom"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="unloadDateFrom"
                              type="date"
                              {...field}
                              onChange={(e) =>
                                handleFilterChange(
                                  "unloadDateFrom",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unloadDateTo" className="text-xs">
                          To
                        </Label>
                        <Controller
                          name="unloadDateTo"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="unloadDateTo"
                              type="date"
                              {...field}
                              onChange={(e) =>
                                handleFilterChange(
                                  "unloadDateTo",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="flex-1"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {hasActiveFilters && (
          <Card className="bg-muted/50">
            <CardContent className="p-3">
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="font-medium">Active Filters:</span>
                {formValues.warehouseId && (
                  <Badge variant="secondary">
                    Warehouse:{" "}
                    {
                      warehouses.find((w) => w.id === formValues.warehouseId)
                        ?.name
                    }
                  </Badge>
                )}
                {formValues.billDateFrom && (
                  <Badge variant="secondary">
                    Bill From: {formValues.billDateFrom}
                  </Badge>
                )}
                {formValues.billDateTo && (
                  <Badge variant="secondary">
                    Bill To: {formValues.billDateTo}
                  </Badge>
                )}
                {formValues.unloadDateFrom && (
                  <Badge variant="secondary">
                    Unload From: {formValues.unloadDateFrom}
                  </Badge>
                )}
                {formValues.unloadDateTo && (
                  <Badge variant="secondary">
                    Unload To: {formValues.unloadDateTo}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-96 bg-zinc-50" />
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable
            columns={columns}
            paginationMode="server"
            currentPage={unloadedRecord?.page || 1}
            totalPages={unloadedRecord?.totalPages || 0}
            onChange={handlePageChange}
            data={unloadedRecord?.data ?? []}
          />
        </div>
      )}
    </main>
  );
};

export default UnloadSlipPage;