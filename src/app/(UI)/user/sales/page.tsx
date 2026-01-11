"use client";

import { UseRQ } from "@/hooks/useReactQuery";
import { getDailyReportByUser } from "@/services/client_api-Service/user/sales/delivery_api";
import { SalesSlipPayload } from "@/types/dailyReport";
import DataTable from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, IndianRupee } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: report, isLoading } = UseRQ<SalesSlipPayload[]>(
    "reports",
    getDailyReportByUser
  );
  const columns = useMemo(() => {
    return [
      {
        header: "Date",
        render: (row: SalesSlipPayload) => <span>{row.date}</span>,
      },
      {
        header: "Total sales",
        render: (row: SalesSlipPayload) => (
          <div className="font-semibold text-md text-orange-900 ">
            <IndianRupee className="inline h-4 w-4" />
            {row.total_sales_amount}
          </div>
        ),
      },
      {
        header: " Online ( UPI + Online )",
        render: (row: SalesSlipPayload) => (
          <span>
            {row.total_upi_amount} + {row.total_online_amount} ={" "}
            {row.total_upi_amount + Number(row.total_online_amount)}
          </span>
        ),
      },
      {
        header: " Cash",
        render: (row: SalesSlipPayload) => (
          <span className="font-semibold text-md text-emerald-600 ">
            <IndianRupee className="inline h-4 w-4" />
            {row.total_cash_amount}
          </span>
        ),
      },

      {
        header: "cash status",
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
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-scroll [&>button]:hidden">
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
        header: "remark",
        render: (row: SalesSlipPayload) => (
          <span>{row.remark ? row.remark : "-"}</span>
        ),
      },
    ];
  }, [report]);
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
      {isLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable columns={columns} itemsPerPage={10} data={report ?? []} />
      )}
    </main>
  );
}
