// "use client";

// import DataTable from "@/components/data-table";
// import { Button } from "@/components/ui/button";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { formatDate } from "@/lib/utils";
// import {
//   deleteTransferedStockRecord,
//   getTransferedStockSTatus,
// } from "@/services/client_api-Service/user/stock/transfer_api";
// import { StockTransfer } from "@/types/stock";
// import { Ban, Pencil, Trash } from "lucide-react";
// import AlertModal from "@/components/alert-dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { Rootstate } from "@/redux/store";
// import { useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// type ReportResponse = {
//   data: StockTransfer[];
//   count: number;
// };
// export default function Home() {
//   const [filters, setFilters] = useState<{ page: number; limit: number }>({
//     limit: 16,
//     page: 1,
//   });
//   const { data: stocks, isLoading: stockLoading } = UseRQ<ReportResponse>(
//     ["stock", filters.page, filters.limit],
//     () => getTransferedStockSTatus(filters),
//   );

//   const { role } = useSelector((user: Rootstate) => user.user);
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const handleDelete = async (id: string) => {
//     try {
//       const data = await deleteTransferedStockRecord(id);
//       if (data.success) {
//         queryClient.invalidateQueries({ queryKey: ["stock"] });
//         toast.success(data.message);
//       } else toast.warning(data.message);
//     } catch (error) {
//       toast.error((error as Error).message);
//     }
//   };
//   const handleEdit = (rowData: StockTransfer) => {
//     queryClient.setQueryData(["stock-transfer-edit", rowData.id], rowData);
//     router.push(`/user/stock/transfer/${rowData.id}`);
//   };
//   const handlePageChange = (page: number) => {
//     setFilters((prev) => ({
//       ...prev,
//       page,
//     }));
//   };
//   const totalPages = useMemo(() => {
//     const totalCount = stocks?.count ?? 0;
//     const limit = filters.limit ?? 16;

//     return Math.max(1, Math.ceil(totalCount / limit));
//   }, [stocks?.count, filters.limit]);

//   const columns = [
//     {
//       header: "No",
//       render: (_row: StockTransfer, index: number) => (
//         <span className="font-medium">
//           {" "}
//           {(filters.page - 1) * filters.limit + index + 1}
//         </span>
//       ),
//     },
//     {
//       key: "transfer_date",
//       header: "Transfer Date",
//       render: (row: StockTransfer) => formatDate(new Date(row.transfer_date)),
//     },
//     {
//       header: "From Warehouse",
//       render: (row: StockTransfer) => (
//         <span className="font-medium text-blue-500">
//           {row.from_warehouse_name}
//         </span>
//       ),
//     },
//     {
//       header: "To Warehouse",
//       render: (row: StockTransfer) => (
//         <span className="font-medium text-green-500">
//           {row.to_warehouse_name}
//         </span>
//       ),
//     },
//     {
//       header: "Product",
//       render: (row: StockTransfer) => (
//         <div className="flex flex-col">
//           <span className="font-medium">{row.product_name}</span>
//           <span className="text-xs text-muted-foreground">Qty: {row.qty}</span>
//         </div>
//       ),
//     },
//     {
//       header: "Return Qty",
//       render: (row: StockTransfer) => (
//         <span
//           className={`font-semibold ${
//             Number(row.return_qty) > 0
//               ? "text-orange-500"
//               : "text-muted-foreground"
//           }`}
//         >
//           {row.return_qty}
//         </span>
//       ),
//     },
//     {
//       header: "Empty Inclusive",
//       render: (row: StockTransfer) => (
//         <span
//           className={`px-2 py-1 rounded text-xs font-medium ${
//             row.empty_inclusive
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {row.empty_inclusive ? "Yes" : "No"}
//         </span>
//       ),
//     },
//     {
//       header: "Remark",
//       render: (row: StockTransfer) => {
//         const remark = row.remarks;

//         if (!remark || remark.trim() === "") {
//           return <div className="text-muted-foreground text-center">—</div>;
//         }

//         // Split into chunks of 25 characters
//         const formattedRemark = remark.match(/.{1,25}/g)?.join("\n") || remark;

//         return (
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <div className="max-w-[100px] truncate cursor-pointer text-center">
//                   {remark}
//                 </div>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p className="max-w-xs whitespace-pre-wrap">
//                   {formattedRemark}
//                 </p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         );
//       },
//     },
//     {
//       header: "Actions",
//       render: (row: StockTransfer) =>
//         role == "admin" ? (
//           <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
//             <Pencil className="h-4 w-4" />
//           </Button>
//         ) : (
//           <>
//             <Ban className="h-5 w-5 text-red-500" />
//           </>
//         ),
//     },
//     {
//       header: "Delete",
//       render: (row: StockTransfer) =>
//         role == "admin" ? (
//           <AlertModal
//             data={row}
//             contents={[
//               <Trash className="h-5 w-5" />,
//               <>
//                 This action cannot be undone. This will permanently delete this
//                 transfer record.
//               </>,
//             ]}
//             style="hover:bg-destructive hover:text-destructive-foreground p-2"
//             action={() => handleDelete(row.id)}
//           />
//         ) : (
//           <>
//             <Ban className="h-5 w-5 text-red-500 " />
//           </>
//         ),
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
//       {stockLoading ? (
//         <Skeleton className="w-full h-24 bg-zinc-50" />
//       ) : (
//         <DataTable
//           columns={columns}
//           paginationMode="server"
//           currentPage={filters.page}
//           totalPages={totalPages}
//           data={stocks?.data ?? []}
//           onChange={handlePageChange}
//         />
//       )}
//     </main>
//   );
// }
"use client";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { UseRQ } from "@/hooks/useReactQuery";
import { currentDate, formatDate } from "@/lib/utils";
import {
  deleteTransferedStockRecord,
  getTransferedStockSTatus,
} from "@/services/client_api-Service/user/stock/transfer_api";
import { StockTransfer } from "@/types/stock";
import { Ban, Pencil, Trash, X } from "lucide-react";
import AlertModal from "@/components/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Warehouse } from "../warehouses/page";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";

type ReportResponse = {
  data: StockTransfer[];
  count: number;
};

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export default function Home() {
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    dateFilter: string;
    customDateRange: DateRange;
    warehouseId: string;
  }>({
    limit: 16,
    page: 1,
    dateFilter: "all",
    customDateRange: { from: undefined, to: undefined },
    warehouseId: "all",
  });

  // Calculate actual date range based on filter selection
  const getDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filters.dateFilter) {
      case "today":
        return {
          startDate: today.toISOString(),
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
        };
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: yesterday.toISOString(),
          endDate: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
        };
      case "dayBefore":
        const dayBefore = new Date(today);
        dayBefore.setDate(dayBefore.getDate() - 2);
        return {
          startDate: dayBefore.toISOString(),
          endDate: new Date(dayBefore.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
        };
      case "custom":
        return {
          startDate: filters.customDateRange.from?.toISOString(),
          endDate: filters.customDateRange.to
            ? new Date(filters.customDateRange.to.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
            : undefined,
        };
      default:
        return { startDate: undefined, endDate: undefined };
    }
  };
 const { data: warehousesData } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse,
  );

  const { data: stocks, isLoading: stockLoading } = UseRQ<ReportResponse>(
    [
      "stock",
      filters.page,
      filters.limit,
      filters.dateFilter,
      filters.customDateRange,
      filters.warehouseId,
    ],
    () => {
      const dateRange = getDateRange();
      return getTransferedStockSTatus({
        ...filters,
        ...dateRange,
      });
    }
  );

  const { role } = useSelector((user: Rootstate) => user.user);
  const queryClient = useQueryClient();
  const router = useRouter();

  // TODO: Fetch warehouses from your API
  const warehouses = [
    { id: "all", name: "All Warehouses" },
    // Add your warehouse data here
    // { id: "1", name: "Warehouse 1" },
    // { id: "2", name: "Warehouse 2" },
  ];

  const handleDelete = async (id: string) => {
    try {
      const data = await deleteTransferedStockRecord(id);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["stock"] });
        toast.success(data.message);
      } else toast.warning(data.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEdit = (rowData: StockTransfer) => {
    queryClient.setQueryData(["stock-transfer-edit", rowData.id], rowData);
    router.push(`/user/stock/transfer/${rowData.id}`);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleDateFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      dateFilter: value,
      page: 1, // Reset to first page when filter changes
      customDateRange:
        value !== "custom"
          ? { from: undefined, to: undefined }
          : prev.customDateRange,
    }));
  };

  const handleWarehouseChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      warehouseId: value,
      page: 1,
    }));
  };

  const handleCustomDateChange = (range: DateRange) => {
    setFilters((prev) => ({
      ...prev,
      customDateRange: range,
      dateFilter: "custom",
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      limit: 16,
      page: 1,
      dateFilter: "all",
      customDateRange: { from: undefined, to: undefined },
      warehouseId: "all",
    });
  };

  const hasActiveFilters =
    filters.dateFilter !== "all" || filters.warehouseId !== "all";

  const totalPages = useMemo(() => {
    const totalCount = stocks?.count ?? 0;
    const limit = filters.limit ?? 16;
    return Math.max(1, Math.ceil(totalCount / limit));
  }, [stocks?.count, filters.limit]);

  const columns = [
    {
      header: "No",
      render: (_row: StockTransfer, index: number) => (
        <span className="font-medium">
          {(filters.page - 1) * filters.limit + index + 1}
        </span>
      ),
    },
    {
      key: "transfer_date",
      header: "Transfer Date",
      render: (row: StockTransfer) => formatDate(new Date(row.transfer_date)),
    },
    {
      header: "From Warehouse",
      render: (row: StockTransfer) => (
        <span className="font-medium text-blue-500">
          {row.from_warehouse_name}
        </span>
      ),
    },
    {
      header: "To Warehouse",
      render: (row: StockTransfer) => (
        <span className="font-medium text-green-500">
          {row.to_warehouse_name}
        </span>
      ),
    },
    {
      header: "Product",
      render: (row: StockTransfer) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.product_name}</span>
          <span className="text-xs text-muted-foreground">Qty: {row.qty}</span>
        </div>
      ),
    },
    {
      header: "Return Qty",
      render: (row: StockTransfer) => (
        <span
          className={`font-semibold ${
            Number(row.return_qty) > 0
              ? "text-orange-500"
              : "text-muted-foreground"
          }`}
        >
          {row.return_qty}
        </span>
      ),
    },
    {
      header: "Empty Inclusive",
      render: (row: StockTransfer) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.empty_inclusive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.empty_inclusive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Remark",
      render: (row: StockTransfer) => {
        const remark = row.remarks;

        if (!remark || remark.trim() === "") {
          return <div className="text-muted-foreground text-center">—</div>;
        }

        const formattedRemark = remark.match(/.{1,25}/g)?.join("\n") || remark;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[100px] truncate cursor-pointer text-center">
                  {remark}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs whitespace-pre-wrap">
                  {formattedRemark}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      header:'created',
      render:(row:StockTransfer)=>{
        const remark = currentDate(row.created_at)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[100px] truncate cursor-pointer text-center">
                  {remark.slice(0,8)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs whitespace-pre-wrap">
                  {remark}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
    },
    {
      header: "Actions",
      render: (row: StockTransfer) =>
        role == "admin" ? (
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Ban className="h-5 w-5 text-red-500" />
          </>
        ),
    },
    {
      header: "Delete",
      render: (row: StockTransfer) =>
        role == "admin" ? (
          <AlertModal
            data={row}
            contents={[
              <Trash className="h-5 w-5" />,
              <>
                This action cannot be undone. This will permanently delete this
                transfer record.
              </>,
            ]}
            style="hover:bg-destructive hover:text-destructive-foreground p-2"
            action={() => handleDelete(row.id)}
          />
        ) : (
          <>
            <Ban className="h-5 w-5 text-red-500 " />
          </>
        ),
    },
  ];

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-4">Transferred Stock</h1>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Date Filter Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">
              Date Filter
            </label>
            <Select
              value={filters.dateFilter}
              onValueChange={handleDateFilterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="dayBefore">Day Before Yesterday</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range Picker */}
          {filters.dateFilter === "custom" && (
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm font-medium mb-2 block">
                Custom Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.customDateRange.from ? (
                      filters.customDateRange.to ? (
                        <>
                          {format(filters.customDateRange.from, "MMM dd, yyyy")}{" "}
                          - {format(filters.customDateRange.to, "MMM dd, yyyy")}
                        </>
                      ) : (
                        format(filters.customDateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.customDateRange.from,
                      to: filters.customDateRange.to,
                    }}
                    onSelect={(range) =>
                      handleCustomDateChange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Warehouse Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Warehouse</label>
            <Select
              value={filters.warehouseId}
              onValueChange={handleWarehouseChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"all"}>
                  {'All warehouse'}
                </SelectItem>
                {warehousesData?.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse?.id as string}>
                    {warehouse.name}
                  </SelectItem>

                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-10"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      {stockLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable
          columns={columns}
          paginationMode="server"
          currentPage={filters.page}
          totalPages={totalPages}
          data={stocks?.data ?? []}
          onChange={handlePageChange}
        />
      )}
    </main>
  );
}