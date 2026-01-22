// "use client";

// import { UseRQ } from "@/hooks/useReactQuery";
// import { getDailyReportByUser } from "@/services/client_api-Service/user/sales/delivery_api";
// import AlertModal from "@/components/alert-dialog";
// import { SalesSlipPayload } from "@/types/dailyReport";
// import DataTable from "@/components/data-table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useMemo } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Eye, IndianRupee, Pencil, Trash } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { deleteDailyReport, getAllDeliveryReport } from "@/services/client_api-Service/admin/sales/sales_admin_api";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// const Home = () => {
//   const { data: report, isLoading } = UseRQ<SalesSlipPayload[]>(
//     "reports",
//     getAllDeliveryReport
//   );
//   const queryQlient = useQueryClient();
//   const route = useRouter()
//   const handleDelete = async (id: string) => {
//     const data = await deleteDailyReport(id);
//     if (data.success) {
//       queryQlient.invalidateQueries({ queryKey: ["reports"] });
//       toast.success(data.message);
//     } else toast.warning(data.message)
//   };
//   const handleEdit = (id:String)=>{
//     route.push(`/user/sales/delivery?id=${id}`)
//   }
//   const columns = useMemo(() => {
//     return [
//       {
//         header: "Date",
//         render: (row: SalesSlipPayload) => <span>{row.date}</span>,
//       },
//       {
//         header: "Total sales",
//         render: (row: SalesSlipPayload) => (
//           <div className="font-semibold text-md text-orange-900 ">
//             <IndianRupee className="inline h-4 w-4" />
//             {row.total_sales_amount}
//           </div>
//         ),
//       },
//       {
//         header: " Online ( UPI + Online )",
//         render: (row: SalesSlipPayload) => (
//           <span>
//             {row.total_upi_amount} + {row.total_online_amount} ={" "}
//             {row.total_upi_amount + Number(row.total_online_amount)}
//           </span>
//         ),
//       },
//       {
//         header: " Cash",
//         render: (row: SalesSlipPayload) => (
//           <span className="font-semibold text-md text-emerald-600 ">
//             <IndianRupee className="inline h-4 w-4" />
//             {row.total_cash_amount}
//           </span>
//         ),
//       },

//       {
//         header: "cash status",
//         render: (row: SalesSlipPayload) => (
//           <Badge
//             variant="outline"
//             className={`${
//               row.chest_name == "office" ? "text-green-700" : "text-orange-900"
//             }`}
//           >
//             {row.chest_name}
//           </Badge>
//         ),
//       },
//       {
//         header: "View",
//         render: (row: SalesSlipPayload) => (
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="secondary" size="sm">
//                 <Eye className="h-4 w-4 mr-2" />
//                 View Details
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-scroll [&>button]:hidden" aria-describedby={undefined}>
//               <DialogHeader>
//                 <DialogTitle>Unload Details</DialogTitle>
//               </DialogHeader>
//               <div className="mt-4">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>NO</TableHead>
//                       <TableHead>Product</TableHead>
//                       <TableHead>Price</TableHead>
//                       <TableHead>QTY</TableHead>
//                       <TableHead>Total Amt</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {row.sale_items.map((detail, index) => (
//                       <TableRow key={detail.sales_line_item_id}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{detail.product_name}</TableCell>
//                         <TableCell>
//                           <IndianRupee className="inline h-3 w-3" />
//                           {detail.rate}
//                         </TableCell>
//                         <TableCell>{detail.qty}</TableCell>
//                         <TableCell className="text-green-800 font-semibold">
//                           <IndianRupee className="inline h-3 w-3" />
//                           {detail.total}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </DialogContent>
//           </Dialog>
//         ),
//       },
//       {
//         header :'Created By',
//         render : (row:SalesSlipPayload)=>(<p>{row?.created_by_name}</p>)
//       },
//       {
//         header: "Status",
//         render: (row: SalesSlipPayload) => {
//           const status = row.status?.toLowerCase() || "";
//           const isSubmitted =
//             status.includes("submit") || status === "submitted";

//           return (
//             <Badge
//               variant={isSubmitted ? "outline" : "default"}
//               className={`
//                 ${
//                   isSubmitted
//                     ? "border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400"
//                     : "bg-green-600 hover:bg-green-700 text-white"
//                 }
//                 font-medium px-3 py-1
//               `}
//             >
//               {row.status || "Pending"}
//             </Badge>
//           );
//         },
//       },
//       {
//         header: "remark",
//         render: (row: SalesSlipPayload) => {
//           const remark = row.remark;

//           if (!remark || remark.trim() === "") {
//             return <div className="text-muted-foreground text-center">—</div>;
//           }

//           return (
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <div className="max-w-[100px] truncate cursor-pointer text-left">
//                     {remark}
//                   </div>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p className="max-w-xs whitespace-pre-wrap">{remark}</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           );
//         },
//       },
//       {
//         header: "Edit",
//         render: (row: SalesSlipPayload) => (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => handleEdit(row.sales_slip_id)}
//           >
//             <Pencil className="h-4 w-4" />
//           </Button>
//         ),
//       },
//       {
//         header: "Delete",
//         render: (row: SalesSlipPayload) => (
//           <AlertModal
//             data={row}
//             contents={[
//               <Trash className="h-5 w-5" />,
//               <>
//                 This action cannot be undone. This will permanently delete this
//                 transfer record.
//               </>,
//             ]}
//             style=" hover:text-destructive-foreground p-2"
//             action={() => handleDelete(row.sales_slip_id)}
//           />
//         ),
//       },
//     ];
//   }, [report]);
//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <h1 className="text-3xl font-semibold mb-2">Daily Sales Report Stock</h1>
//       {isLoading ? (
//         <Skeleton className="w-full h-24 bg-zinc-50" />
//       ) : (
//         <DataTable columns={columns} itemsPerPage={10} data={report ?? []} />
//       )}
//     </main>
//   );
// };
// export default Home;

"use client";

import { UseRQ } from "@/hooks/useReactQuery";
import AlertModal from "@/components/alert-dialog";
import { SalesSlipPayload } from "@/types/dailyReport";
import DataTable from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, IndianRupee, Pencil, Trash, Filter, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  deleteDailyReport,
  getAllDeliveryReport,
} from "@/services/client_api-Service/admin/sales/sales_admin_api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  dayFilter?: string;
  status?: string;
  users?: string;
  chest?: string;
}

const Home = () => {
  const [filters, setFilters] = useState<FilterParams>({});
  const [tempFilters, setTempFilters] = useState<FilterParams>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: report, isLoading } = UseRQ<SalesSlipPayload[]>(
    ["reports", filters],
    () => getAllDeliveryReport(filters),
  );
  const queryClient = useQueryClient();
  const router = useRouter();

  const warehouses = useMemo(() => {
    if (!report) return [];
    return Array.from(
      new Map(
        report.map((r) => [
          r.created_by,
          { id: r.created_by, name: r.created_by_name },
        ]),
      ).values(),
    );
  }, [report]);

  const handleDelete = async (id: string) => {
    const data = await deleteDailyReport(id);
    if (data.success) {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success(data.message);
    } else toast.warning(data.message);
  };

  const handleEdit = (id: string) => {
    router.push(`/user/sales/delivery?id=${id}`);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
  };

  const handleDayFilterChange = (value: string) => {
    const today = new Date();
    let startDate = "";
    let endDate = "";

    switch (value) {
      case "today":
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = endDate = yesterday.toISOString().split("T")[0];
        break;
      case "day_before":
        const dayBefore = new Date(today);
        dayBefore.setDate(dayBefore.getDate() - 2);
        startDate = endDate = dayBefore.toISOString().split("T")[0];
        break;
      default:
        break;
    }

    setTempFilters((prev) => ({
      ...prev,
      dayFilter: value,
      startDate,
      endDate,
    }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const columns = useMemo(() => {
    return [
      {
        header: "Date",
        render: (row: SalesSlipPayload) => <span>{row.date}</span>,
      },
      {
        header: "Total sales",
        render: (row: SalesSlipPayload) => (
          <div className="font-semibold text-md text-orange-900">
            <IndianRupee className="inline h-4 w-4" />
            {row.total_sales_amount}
          </div>
        ),
      },
      {
        header: "Online (UPI + Online)",
        render: (row: SalesSlipPayload) => (
          <span>
            {row.total_upi_amount} + {row.total_online_amount} ={" "}
            {row.total_upi_amount + Number(row.total_online_amount)}
          </span>
        ),
      },
      {
        header: "Cash",
        render: (row: SalesSlipPayload) => (
          <span className="font-semibold text-md text-emerald-600">
            <IndianRupee className="inline h-4 w-4" />
            {row.total_cash_amount}
          </span>
        ),
      },
      {
        header: "Cash Status",
        render: (row: SalesSlipPayload) => (
          <Badge
            variant="outline"
            className={`${
              row.chest_name == "office" ? "text-green-700" : "text-orange-900"
            }`}
          >
            {row.chest_name}
          </Badge>
        ),
      },
      {
        header: "View",
        render: (row: SalesSlipPayload) => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-6xl max-h-[80vh] overflow-y-scroll [&>button]:hidden"
              aria-describedby={undefined}
            >
              <DialogHeader>
                <DialogTitle>Unload Details</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NO</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>QTY</TableHead>
                      <TableHead>Total Amt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {row.sale_items.map((detail, index) => (
                      <TableRow key={detail.sales_line_item_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{detail.product_name}</TableCell>
                        <TableCell>
                          <IndianRupee className="inline h-3 w-3" />
                          {detail.rate}
                        </TableCell>
                        <TableCell>{detail.qty}</TableCell>
                        <TableCell className="text-green-800 font-semibold">
                          <IndianRupee className="inline h-3 w-3" />
                          {detail.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        header: "Created By",
        render: (row: SalesSlipPayload) => <p>{row?.created_by_name}</p>,
      },
      {
        header: "Status",
        render: (row: SalesSlipPayload) => {
          const status = row.status?.toLowerCase() || "";
          const isSubmitted =
            status.includes("submit") || status === "submitted";

          return (
            <Badge
              variant={isSubmitted ? "outline" : "default"}
              className={`
                ${
                  isSubmitted
                    ? "border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }
                font-medium px-3 py-1
              `}
            >
              {row.status || "Pending"}
            </Badge>
          );
        },
      },
      {
        header: "Remark",
        render: (row: SalesSlipPayload) => {
          const remark = row.remark;

          if (!remark || remark.trim() === "") {
            return <div className="text-muted-foreground text-center">—</div>;
          }

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[100px] truncate cursor-pointer text-left">
                    {remark}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs whitespace-pre-wrap">{remark}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        header: "Edit",
        render: (row: SalesSlipPayload) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.sales_slip_id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ),
      },
      {
        header: "Delete",
        render: (row: SalesSlipPayload) => (
          <AlertModal
            data={row}
            contents={[
              <Trash className="h-5 w-5" key="icon" />,
              <span key="text">
                This action cannot be undone. This will permanently delete this
                transfer record.
              </span>,
            ]}
            style=" hover:text-destructive-foreground p-2"
            action={() => handleDelete(row.sales_slip_id)}
          />
        ),
      },
    ];
  }, [report]);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Daily Sales Report Stock
        </h1>
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

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Day Filter */}
              <div className="space-y-2">
                <Label htmlFor="dayFilter">Quick Date</Label>
                <Select
                  value={tempFilters.dayFilter || ""}
                  onValueChange={handleDayFilterChange}
                >
                  <SelectTrigger id="dayFilter">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="day_before">Day Before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                      dayFilter: "",
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
                      dayFilter: "",
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={tempFilters.status || ""}
                  onValueChange={(value) =>
                    setTempFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Filter */}
              <div className="space-y-2">
                <Label htmlFor="users">Users</Label>
                <Select
                  value={tempFilters.users || ""}
                  onValueChange={(value) =>
                    setTempFilters((prev) => ({ ...prev, users: value }))
                  }
                >
                  <SelectTrigger id="users">
                    <SelectValue placeholder="Select users" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Chest Filter */}
              <div className="space-y-2">
                <Label htmlFor="chest">Chest</Label>

                <Select
                  value={tempFilters.chest || ""}
                  onValueChange={(value) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      chest: value as "office" | "godown",
                    }))
                  }
                >
                  <SelectTrigger id="chest">
                    <SelectValue placeholder="Select chest" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="godown">Godown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setTempFilters({})}>
                Clear
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable columns={columns} itemsPerPage={10} data={report ?? []} />
      )}
    </main>
  );
};

export default Home;
