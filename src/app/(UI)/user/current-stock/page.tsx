// "use client";

// import DataTable from "@/components/data-table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { Rootstate } from "@/redux/store";
// import { getInventoryDetails } from "@/services/client_api-Service/admin/inventory/inventory_api";
// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";

// interface InventoryItem {
//   tx_date: string;
//   product_id: string;
//   product_code: string;
//   product_name: string;
//   warehouse_id: string;
//   warehouse_name: string;
//   net_qty_change: number;
//   cumulative_qty: number;
//   tags: string[];
// }

// interface PivotRow {
//   warehouse_id: string;
//   warehouse_name: string;
//   products: Record<string, number>;
// }

// const Page = () => {
//   const { data: Inventory, isLoading: inventoryLoading } = UseRQ<
//     InventoryItem[]
//   >("inventory", getInventoryDetails);
//   const { warehouseid } = useSelector((state: Rootstate) => state.user);
  
//   // Transform data into pivot format - Group by warehouse only
//   const pivotData = useMemo(() => {
//     if (!Inventory || !Array.isArray(Inventory)) return [];

//     // Group by warehouse_id and sum up quantities for each product
//     const grouped = Inventory.reduce((acc: Record<string, PivotRow>, item) => {
//       const key = item.warehouse_id;

//       if (!acc[key]) {
//         acc[key] = {
//           warehouse_id: item.warehouse_id,
//           warehouse_name: item.warehouse_name,
//           products: {},
//         };
//       }

//       // Sum up net_qty_change for each product in the warehouse
//       const currentQty = acc[key].products[item.product_name] || 0;
//       acc[key].products[item.product_name] = currentQty + item.net_qty_change;

//       return acc;
//     }, {});

//     return Object.values(grouped);
//   }, [Inventory]);

//   // Get unique product names for dynamic columns
//   const productNames = useMemo(() => {
//     if (!Inventory || !Array.isArray(Inventory)) return [];

//     const names = new Set<string>();
//     Inventory.filter(
//       (product) =>
//         !product.tags.includes("service") && !product.tags.includes("DC"),
//     ).forEach((item) => {
//       names.add(item.product_name);
//     });

//     return Array.from(names).sort();
//   }, [Inventory]);

//   // Build dynamic columns
//   const columns = useMemo(() => {
//     const baseColumns = [
//       {
//         header: "No",
//         render: (_e: any, i: number) => `${i + 1}`,
//       },
//       {
//         key: "warehouse_name",
//         header: "Warehouse Name",
//         render: (row: PivotRow) => row?.warehouse_name || "-",
//       },
//     ];

//     // Add dynamic product columns
//     const productColumns = productNames.map((productName) => ({
//       key: productName,
//       header: productName,
//       render: (row: PivotRow) => {
//         const qty = row?.products?.[productName];
//         return qty !== undefined ? qty.toString() : "0";
//       },
//     }));

//     return [...baseColumns, ...productColumns];
//   }, [productNames]);
//   const getRowClassName = (row: PivotRow) => {
//     return row.warehouse_id === warehouseid
//       ? "bg-lime-200  hover:bg-green-200"
//       : "";
//   };
//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <h1 className="text-3xl font-semibold mb-2">Warehouse Inventory Stock</h1>
//       {inventoryLoading ? (
//         <Skeleton className="w-full h-24 bg-zinc-50" />
//       ) : (
//         <DataTable
//           rowClassName={getRowClassName}
//           columns={columns}
//           itemsPerPage={13}
//           data={pivotData ?? []}
//         />
//       )}
//     </main>
//   );
// };

// export default Page;
"use client";

import DataTable from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import { Rootstate } from "@/redux/store";
import { getInventoryDetails } from "@/services/client_api-Service/admin/inventory/inventory_api";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

interface InventoryItem {
  idx: number;
  warehouse_id: string;
  product_id: string;
  warehouse_name: string;
  product_name: string;
  tags: string[];
  qty: string;
  is_empty: boolean;
}

interface PivotRow {
  warehouse_id: string;
  warehouse_name: string;
  products: Record<string, number>;
}

const Page = () => {
  const { data: Inventory, isLoading: inventoryLoading } = UseRQ
    <InventoryItem[]
  >("inventory", getInventoryDetails);
  const { warehouseid } = useSelector((state: Rootstate) => state.user);

  // Transform data into pivot format - Group by warehouse
  const pivotData = useMemo(() => {
    if (!Inventory || !Array.isArray(Inventory)) return [];

    const grouped = Inventory.reduce((acc: Record<string, PivotRow>, item) => {
      // Filter out service and DC tagged items
      if (item.tags.includes("service") || item.tags.includes("DC")) {
        return acc;
      }

      const key = item.warehouse_id;

      if (!acc[key]) {
        acc[key] = {
          warehouse_id: item.warehouse_id,
          warehouse_name: item.warehouse_name,
          products: {},
        };
      }

      // Store the quantity (convert string to number)
      acc[key].products[item.product_name] = parseInt(item.qty, 10);

      return acc;
    }, {});

    return Object.values(grouped);
  }, [Inventory]);

  // Get unique product names for dynamic columns (excluding service and DC)
  const productNames = useMemo(() => {
    if (!Inventory || !Array.isArray(Inventory)) return [];

    const names = new Set<string>();
    Inventory.filter(
      (product) =>
        !product.tags.includes("service") && !product.tags.includes("DC")
    ).forEach((item) => {
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
        return qty !== undefined ? qty.toString() : "0";
      },
    }));

    return [...baseColumns, ...productColumns];
  }, [productNames]);

  const getRowClassName = (row: PivotRow) => {
    return row.warehouse_id === warehouseid
      ? "bg-lime-200 hover:bg-green-200"
      : "";
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">
        Warehouse Inventory Stock
      </h1>
      {inventoryLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable
          rowClassName={getRowClassName}
          columns={columns}
          itemsPerPage={13}
          data={pivotData ?? []}
        />
      )}
    </main>
  );
};

export default Page;