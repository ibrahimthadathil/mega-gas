"use client";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { UseRQ } from "@/hooks/useReactQuery";
import { formatDate } from "@/lib/utils";
import {
  deleteTransferedStockRecord,
  getTransferedStockSTatus,
} from "@/services/client_api-Service/user/stock/transfer_api";
import { StockTransfer } from "@/types/stock";
import { Ban, Pencil, Trash } from "lucide-react";
import AlertModal from "@/components/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ReportResponse = {
  data: StockTransfer[];
  count: number;
};
export default function Home() {
  const [filters, setFilters] = useState<{ page: number; limit: number }>({
    limit: 16,
    page: 1,
  });
  const { data: stocks, isLoading: stockLoading } = UseRQ<ReportResponse>(
    ["stock", filters.page, filters.limit],
    () => getTransferedStockSTatus(filters),
  );
  console.log(stocks);

  const { role } = useSelector((user: Rootstate) => user.user);
  const queryClieny = useQueryClient();
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const data = await deleteTransferedStockRecord(id);
      if (data.success) {
        queryClieny.invalidateQueries({ queryKey: ["stock"] });
        toast.success(data.message);
      } else toast.warning(data.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  // const handleEdit = (data: StockTransfer) => {
  //   // Navigate to transfer page with edit mode and stock data
  //   router.push(`/user/stock/transfer?mode=edit&id=${data.id}`);
  // };
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };
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
          {" "}
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

    // Split into chunks of 25 characters
    const formattedRemark = remark.match(/.{1,25}/g)?.join("\n") || remark;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[100px] truncate cursor-pointer text-left">
              {remark}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs whitespace-pre-wrap">{formattedRemark}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
},
    {
      header: "Actions",
      render: (row: StockTransfer) =>
        role == "admin" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert("Not implemented")}
          >
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
      <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
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
