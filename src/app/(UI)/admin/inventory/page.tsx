"use client";

import DataTable from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import { getInventoryDetails } from "@/services/client_api-Service/admin/inventory/inventory_api";
import React, { useMemo } from "react";

interface InventoryItem {
  tx_date: string;
  product_id: string;
  product_code: string;
  product_name: string;
  warehouse_id: string;
  warehouse_name: string;
  net_qty_change: number;
  cumulative_qty: number;
}

interface PivotRow {
  tx_date: string;
  warehouse_id: string;
  warehouse_name: string;
  products: Record<string, number>;
}

const Page = () => {
  const { data: Inventory, isLoading: inventoryLoading } = UseRQ<
    InventoryItem[]
  >("inventory", getInventoryDetails);

  console.log("Inventory Data:", Inventory);

  // Transform data into pivot format
  const pivotData = useMemo(() => {
    if (!Inventory || !Array.isArray(Inventory)) return [];

    // Group by date and warehouse_id
    const grouped = Inventory.reduce((acc: Record<string, PivotRow>, item) => {
      const date = item.tx_date || "No Date";
      const key = `${date}_${item.warehouse_id}`;

      if (!acc[key]) {
        acc[key] = {
          tx_date: date,
          warehouse_id: item.warehouse_id,
          warehouse_name: item.warehouse_name,
          products: {},
        };
      }

      // Use cumulative_qty for the product quantity
      acc[key].products[item.product_name] = item.cumulative_qty;

      return acc;
    }, {});

    return Object.values(grouped);
  }, [Inventory]);

  // Get unique product names for dynamic columns
  const productNames = useMemo(() => {
    if (!Inventory || !Array.isArray(Inventory)) return [];

    const names = new Set<string>();
    Inventory.forEach((item) => {
      names.add(item.product_name);
    });

    return Array.from(names).sort();
  }, [Inventory]);

  // Build dynamic columns
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "No",
        render: (_e: any, i: number) => `${i + 1}`,
      },
      {
        key: "tx_date",
        header: "Date",
        render: (row: PivotRow) => {
          // Format date nicely
          try {
            const date = new Date(row.tx_date);
            return date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          } catch {
            return row.tx_date || "No Date";
          }
        },
      },
      {
        key: "warehouse_name",
        header: "Warehouse Name",
        render: (row: PivotRow) => row?.warehouse_name || "-",
      },
    ];

    // Add dynamic product columns
    const productColumns = productNames.map((productName) => ({
      key: productName,
      header: productName,
      render: (row: PivotRow) => {
        const qty = row?.products?.[productName];
        return qty !== undefined ? qty.toString() : "-";
      },
    }));

    return [...baseColumns, ...productColumns];
  }, [productNames]);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">Inventory Stock</h1>
      {inventoryLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable columns={columns} itemsPerPage={10} data={pivotData ?? []} />
      )}
    </main>
  );
};

export default Page;
