// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { deletePurchasedRecord, getPlantLoadRegister } from "@/services/client_api-Service/user/purchase/purchase_api";
// import { PlantLoadRecord } from "@/types/types";
// import AlertModal from "@/components/alert-dialog";
// import { useQueryClient } from "@tanstack/react-query";
// import { ChevronDown, Pencil, Trash } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useSelector } from "react-redux";
// import { Rootstate } from "@/redux/store";

// export default function PlantLoadPage() {
//   const { data, isLoading } = UseRQ<PlantLoadRecord[]>(
//     "register",
//     getPlantLoadRegister
//   );
//   const queryClient = useQueryClient()
//   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
//   const router = useRouter();
//   const {role} = useSelector((state:Rootstate)=>state.user)
//   const toggleExpanded = (id: string) => {
//     setExpandedIds((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };
//   const handleUnload = (Record: PlantLoadRecord) => {
//     router.push(`/user/stock/load-slip/${Record?.id}`);
//   };

//   const deleteLoad = async (id: string) => {
//     try {
//       const data = await deletePurchasedRecord(id)
//       if(data.success){
//         queryClient.invalidateQueries({queryKey:['register']})
//         toast.success(data.message)
//       }else toast.warning(data.message)
//     } catch (error) {
//       toast.error((error as Error).message);
//     }
//   };

//   const handleEdit = (data:PlantLoadRecord)=>{
    
//     queryClient.setQueryData(['newLoad',data.id],data)
//     router.push(`/user/purchase/plant-load?id=${data.id}`)
//   }

//   return (
//     <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
//       {/* Header */}
//       <div className="space-y-2">
//         <h1 className="text-3xl md:text-4xl font-bold text-foreground">
//           Plant Load Records
//         </h1>
//         <p className="text-muted-foreground">
//           View and manage all plant load entries
//         </p>
//       </div>

//       {/* Records List */}
//       <div className="space-y-3">
//         <p className="text-sm font-medium text-muted-foreground">
//           Total Records({data ? data.length : 0})
//         </p>
//         <div className="space-y-3">
//           {isLoading ? (
//             <Skeleton />
//           ) : (
//             data?.map((record) => {
//               const isExpanded = expandedIds.has(record?.id);
//               return (
//                 <Card key={record?.id} className="bg-card w-full">
//                   <CardContent className="pt-2">
//                     <div className="space-y-4">
//                       {/* Record Header */}

//                       <div className="flex items-center justify-between w-full">
//                         <div className="flex-1 space-y-2">
//                           <div className="flex items-center gap-2">
//                             <Badge variant="secondary">
//                               <h2 className="text-lg">
//                                 {record?.warehouse_name}
//                               </h2>
//                             </Badge>
//                           </div>
//                           <div className="grid grid-cols-1 ps-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
//                             <div>
//                               SAP:{" "}
//                               <span className="font-medium text-foreground">
//                                 {record?.sap_number}
//                               </span>
//                             </div>
//                             <div>
//                               Date:{" "}
//                               <span className="font-medium text-foreground">
//                                 {record?.bill_date}
//                               </span>
//                             </div>
//                             <div>
//                               Total Qty:{" "}
//                               <span className="font-medium text-foreground">
//                                 {record?.total_full_qty}
//                               </span>
//                             </div>
//                             <div>
//                               Balance:{" "}
//                               <span className="font-medium text-foreground">
//                                 {record?.balance}
//                               </span>
//                             </div>
//                             <div>
//                               <span
//                                 className={`font-medium text-foreground ${
//                                   record?.is_unloaded
//                                     ? "text-muted-foreground"
//                                     : "text-white"
//                                 }`}
//                               >
//                                 <Button
//                                   onClick={() => handleUnload(record)}
//                                   disabled={record?.is_unloaded||role==="plant_driver"}
//                                   className={`${
//                                     record?.is_unloaded
//                                       ? "bg-red-600"
//                                       : "bg-black"
//                                   }`}
//                                 >
//                                   {record?.is_unloaded ? "Settled" : "Unload"}
//                                 </Button>
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         {!record.is_unloaded &&role==="admin"&& (
//                           <>
//                             <Button variant="ghost" onClick={()=>handleEdit(record)}>
//                               <Pencil color="skyblue" />
//                             </Button>
//                             <AlertModal
//                               data={record}
//                               contents={[
//                                 <>
//                                   <Trash className="h-5 w-5" color="red" />
//                                 </>,
//                                 <>
//                                   This action cannot be undone. This will
//                                   permanently delete{" "}
//                                   <span className="font-semibold text-orange-400">
//                                     {record?.sap_number || "This Product"}
//                                   </span>
//                                   's account and remove their data from our
//                                   servers.
//                                 </>,
//                               ]}
//                               action={() => deleteLoad(record.id)}
//                             />
//                           </>
//                         )}
//                         <ChevronDown
//                           onClick={() => toggleExpanded(record?.id)}
//                           className={`w-5 h-5 text-muted-foreground transition-transform hover:cursor-pointer ${
//                             isExpanded ? "rotate-180" : ""
//                           }`}
//                         />
//                       </div>

//                       {/* Expandable Line Items */}
//                       {isExpanded && (
//                         <div className="border-t border-border pt-4 space-y-2">
//                           <p className="text-sm font-medium text-muted-foreground mb-3">
//                             Line Items ({record?.line_items?.length})
//                           </p>
//                           <div className="space-y-2">
//                             {record?.line_items.map((item, idx) => (
//                               <div
//                                 key={idx}
//                                 className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm"
//                               >
//                                 <div className="flex-1">
//                                   <p className="font-medium text-foreground">
//                                     {item.product_name}
//                                   </p>
//                                   <p className="text-xs text-muted-foreground capitalize">
//                                     Trip:{" "}
//                                     {item.trip_type === "oneway"
//                                       ? "One Way"
//                                       : "Two Way"}
//                                   </p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="font-semibold text-foreground">
//                                     {item.qty} units
//                                   </p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {/* Additional Stats */}
//                           <div className="border-t border-border mt-4 pt-3 grid grid-cols-3 gap-2 text-sm">
//                             <div className="text-center">
//                               <p className="text-muted-foreground">Unloaded</p>
//                               <p className="font-semibold text-foreground">
//                                 {record?.unloaded_qty}
//                               </p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-muted-foreground">Return</p>
//                               <p className="font-semibold text-foreground">
//                                 {record?.total_return_qty}
//                               </p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-muted-foreground">Balance</p>
//                               <p className="font-semibold text-foreground">
//                                 {record?.balance}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  deletePurchasedRecord,
  getPlantLoadRegister,
} from "@/services/client_api-Service/user/purchase/purchase_api";
import { PlantLoadRecord } from "@/types/types";
import AlertModal from "@/components/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Pencil,
  Trash,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterParams {
  startDate?: string;
  endDate?: string;
  warehouse?: string;
  isUnloaded?: string;
  page?: number;
  limit?: number;
}

export default function PlantLoadPage() {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 10,
  });
  const [tempFilters, setTempFilters] = useState<FilterParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { data: response, isLoading } = UseRQ<{
    data: PlantLoadRecord[];
    total: number;
    page: number;
    totalPages: number;
  }>(["register", filters], () => getPlantLoadRegister(filters));
console.log(response);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { role } = useSelector((state: Rootstate) => state.user);

  const data = response?.data || [];
  const totalRecords = response?.total || 0;
  const currentPage = response?.page || 1;
  const totalPages = response?.totalPages || 1;

  // Extract unique warehouses from data
  const warehouses = useMemo(() => {
    if (!data) return [];
    const unique = [...new Set(data.map((r) => r.warehouse_name))].filter(
      Boolean
    );
    return unique;
  }, [data]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleUnload = (Record: PlantLoadRecord) => {
    router.push(`/user/stock/load-slip/${Record?.id}`);
  };

  const deleteLoad = async (id: string) => {
    try {
      const data = await deletePurchasedRecord(id);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["register"] });
        toast.success(data.message);
      } else toast.warning(data.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEdit = (data: PlantLoadRecord) => {
    queryClient.setQueryData(["newLoad", data.id], data);
    router.push(`/user/purchase/plant-load?id=${data.id}`);
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters, page: 1, limit: filters.limit });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.startDate || filters.endDate) count++;
    if (filters.warehouse) count++;
    if (filters.isUnloaded) count++;
    return count;
  }, [filters]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Plant Load Records
          </h1>
          <p className="text-muted-foreground">
            View and manage all plant load entries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="icon" onClick={handleClearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <input
                  type="date"
                  id="startDate"
                  value={tempFilters.startDate || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <input
                  type="date"
                  id="endDate"
                  value={tempFilters.endDate || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Warehouse Filter */}
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select
                  value={tempFilters.warehouse || "all"}
                  onValueChange={(value) =>
                    setTempFilters((prev) => ({ 
                      ...prev, 
                      warehouse: value === "all" ? undefined : value 
                    }))
                  }
                >
                  <SelectTrigger id="warehouse">
                    <SelectValue placeholder="All warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All warehouses</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unload Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="isUnloaded">Status</Label>
                <Select
                  value={tempFilters.isUnloaded || "all"}
                  onValueChange={(value) =>
                    setTempFilters((prev) => ({ 
                      ...prev, 
                      isUnloaded: value === "all" ? undefined : value 
                    }))
                  }
                >
                  <SelectTrigger id="isUnloaded">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="true">Settled</SelectItem>
                    <SelectItem value="false">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setTempFilters({})}
              >
                Clear
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      <div className="space-y-3 h-[30rem] max-h-[30rem] overflow-y-scroll">
        <p className="text-sm font-medium text-muted-foreground">
          Total Records: {totalRecords} | Showing: {data?.length || 0}
        </p>
        <div className="space-y-3">
          {isLoading ? (
            <Skeleton className="w-full h-24" />
          ) : data?.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No records found for the selected filters
                </p>
              </CardContent>
            </Card>
          ) : (
            data?.map((record) => {
              const isExpanded = expandedIds.has(record?.id);
              return (
                <Card key={record?.id} className="bg-card w-full">
                  <CardContent className="pt-2">
                    <div className="space-y-4">
                      {/* Record Header */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <h2 className="text-lg">
                                {record?.warehouse_name}
                              </h2>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 ps-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                            <div>
                              SAP:{" "}
                              <span className="font-medium text-foreground">
                                {record?.sap_number}
                              </span>
                            </div>
                            <div>
                              Date:{" "}
                              <span className="font-medium text-foreground">
                                {record?.bill_date}
                              </span>
                            </div>
                            <div>
                              Total Qty:{" "}
                              <span className="font-medium text-foreground">
                                {record?.total_full_qty}
                              </span>
                            </div>
                            <div>
                              Balance:{" "}
                              <span className="font-medium text-foreground">
                                {record?.balance}
                              </span>
                            </div>
                            <div>
                              <span
                                className={`font-medium text-foreground ${
                                  record?.is_unloaded
                                    ? "text-muted-foreground"
                                    : "text-white"
                                }`}
                              >
                                <Button
                                  onClick={() => handleUnload(record)}
                                  disabled={
                                    record?.is_unloaded ||
                                    role === "plant_driver"
                                  }
                                  className={`${
                                    record?.is_unloaded
                                      ? "bg-red-600"
                                      : "bg-black"
                                  }`}
                                >
                                  {record?.is_unloaded ? "Settled" : "Unload"}
                                </Button>
                              </span>
                            </div>
                          </div>
                        </div>
                        {!record.is_unloaded && role === "admin" && (
                          <>
                            <Button
                              variant="ghost"
                              onClick={() => handleEdit(record)}
                            >
                              <Pencil color="skyblue" />
                            </Button>
                            <AlertModal
                              data={record}
                              contents={[
                                <Trash
                                  className="h-5 w-5"
                                  color="red"
                                  key="icon"
                                />,
                                <span key="text">
                                  This action cannot be undone. This will
                                  permanently delete{" "}
                                  <span className="font-semibold text-orange-400">
                                    {record?.sap_number || "This Product"}
                                  </span>
                                  's account and remove their data from our
                                  servers.
                                </span>,
                              ]}
                              action={() => deleteLoad(record.id)}
                            />
                          </>
                        )}
                        <ChevronDown
                          onClick={() => toggleExpanded(record?.id)}
                          className={`w-5 h-5 text-muted-foreground transition-transform hover:cursor-pointer ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Expandable Line Items */}
                      {isExpanded && (
                        <div className="border-t border-border pt-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3">
                            Line Items ({record?.line_items?.length})
                          </p>
                          <div className="space-y-2">
                            {record?.line_items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">
                                    {item.product_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    Trip:{" "}
                                    {item.trip_type === "oneway"
                                      ? "One Way"
                                      : "Two Way"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-foreground">
                                    {item.qty} units
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Additional Stats */}
                          <div className="border-t border-border mt-4 pt-3 grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <p className="text-muted-foreground">Unloaded</p>
                              <p className="font-semibold text-foreground">
                                {record?.unloaded_qty}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">Return</p>
                              <p className="font-semibold text-foreground">
                                {record?.total_return_qty}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">Balance</p>
                              <p className="font-semibold text-foreground">
                                {record?.balance}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}