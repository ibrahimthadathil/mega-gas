
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
import { useMemo, useState } from "react";
import { SalesReportDialog } from "./saleReport";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Warehouse } from "@/types/stock";
import { get_userByRole } from "@/services/client_api-Service/user/user_api";

// ── Stable fallbacks — defined once at module level so their references
//    never change between renders, preserving memoization in SalesReportDialog
const EMPTY_WAREHOUSES: Warehouse[] = [];
const EMPTY_USERS: any[] = [];
const EMPTY_STOCK: any[] = [];
const EMPTY_PRODUCTS: any[] = [];

// ── Stable fetcher for drivers — defined outside the component so it's not
//    recreated on every render, preventing React Query cache mismatches
const fetchDrivers = () => get_userByRole("driver");

export function ShareReportButton({ salesSlipId }: { salesSlipId: string }) {
  const [open, setOpen] = useState(false);

  const { data: warehouse } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse,
    {
      enabled: open,           // don't fetch until dialog opens
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24,
    },
  );

  const { data: users } = UseRQ<any>(
    ["users", "driver"],       // scoped key — won't collide with other roles
    fetchDrivers,              // stable reference — no new function each render
    {
      enabled: open,           // don't fetch until dialog opens
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24,
    },
  );

  const {
    data: reportData,
    isLoading,
    isFetching,
  } = UseRQ<{ data: DeliveryReportData; currentStock: any; products: any }>(
    ["slipreport", salesSlipId],
    () => getDeliveryReport(salesSlipId),
    {
      enabled: open,
      staleTime: 1000 * 60 * 5, // treat report as fresh for 5 min — avoids
      gcTime: 1000 * 60 * 30,   // refetch on every dialog reopen
    },
  );

  // Stable resolved values — only change when the actual data changes,
  // not on every render due to ?? [] producing a new array reference
  const warehouses = warehouse ?? EMPTY_WAREHOUSES;
  const resolvedUsers = users ?? EMPTY_USERS;
  const openingStock = reportData?.currentStock ?? EMPTY_STOCK;
  const products = reportData?.products ?? EMPTY_PRODUCTS;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* No onClick needed — onOpenChange on Dialog handles open/close */}
      <DialogTrigger asChild>
        <Share className="w-5 h-5 cursor-pointer text-zinc-500 hover:text-zinc-900 transition-colors" />
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
          warehouses={warehouses}
          users={resolvedUsers}
          salesSlipId={salesSlipId}
          reportData={reportData?.data}
          openingStock={openingStock}
          products={products}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </DialogContent>
    </Dialog>
  );
}