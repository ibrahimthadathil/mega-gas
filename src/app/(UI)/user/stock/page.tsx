"use client";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { UseRQ } from "@/hooks/useReactQuery";
import { formatDate } from "@/lib/utils";
import { getTransferedStockSTatus } from "@/services/client_api-Service/user/stock/transfer_api";
import { StockTransfer } from "@/types/stock";
import { Pencil, Trash } from "lucide-react";
import AlertModal from "@/components/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stocks, isLoading: stockLoading } = UseRQ<StockTransfer[]>(
    "stock",
    getTransferedStockSTatus
  );
  const handleDelete = (id: string) => {};
  const handleEdit = (data: StockTransfer) => {};
  const columns = [
    {
      header: "No",
      render: (_e: StockTransfer, i: number) => `TR${i + 1}`,
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
      header: "Remarks",
      render: (row: StockTransfer) => (
        <span className="text-muted-foreground">{row.remarks || "-"}</span>
      ),
    },
    {
      header: "Actions",
      render: (row: StockTransfer) => (
        <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
    {
      header: "Delete",
      render: (row: StockTransfer) => (
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
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
      {stockLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable columns={columns} itemsPerPage={10} data={stocks ?? []} />
      )}
    </main>
  );
}
