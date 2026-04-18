"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseRQ } from "@/hooks/useReactQuery";
import { getDeliveryReport } from "@/services/client_api-Service/user/sales/delivery_api";
import { DeliveryReportData } from "@/types/deliverySlip";
import { Share, Share2 } from "lucide-react";
import { useState } from "react";
import { SalesReportDialog } from "./saleReport";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Warehouse } from "@/types/stock";
import { get_userByRole } from "@/services/client_api-Service/user/user_api";

export function ShareReportButton({ salesSlipId }: { salesSlipId: string }) {
  const [open, setOpen] = useState(false);
  const { data: warehouse, isLoading: warehouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse,
    {
      staleTime: Infinity, // ✅ never refetch unless manually
      gcTime: 1000 * 60 * 60 * 24, // (React Query v5) cache for 24h
    },
  );
  const {
    data: reportData,
    isLoading,
    isFetching,
  } = UseRQ<{ data: DeliveryReportData; currentStock: any; products: any }>(
    ["slipreport", salesSlipId],
    () => getDeliveryReport(salesSlipId),
    { enabled: open },
  );
  console.log(reportData);
  
  const { data: users, isLoading: usersLoading } = UseRQ<any>(
    "user",
    () => get_userByRole("driver"),
    {
      staleTime: Infinity, // ✅ never refetch unless manually
      gcTime: 1000 * 60 * 60 * 24, // (React Query v5) cache for 24h
    },
  );
  console.log(users);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Share
          className="w-5 h-5 cursor-pointer text-zinc-500 hover:text-zinc-900 transition-colors"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Sales Report
          </DialogTitle>
        </DialogHeader>
        <SalesReportDialog
          warehouses={warehouse ?? []}
          users={users ?? []}
          salesSlipId={salesSlipId}
          reportData={reportData?.data}
          openingStock={reportData?.currentStock} // same array you pass to OldStockSection
          products={reportData?.products}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </DialogContent>
    </Dialog>
  );
}
