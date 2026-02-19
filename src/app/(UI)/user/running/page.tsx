// "use client";
// import { StockDashboard } from "@/components/current stock/stock-dashboard";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getRunning_balance } from "@/services/client_api-Service/user/current-stock/current-stock-api";
// import { Product, StockTransaction } from "@/types/stock";

// function getUniqueProducts(transactions: StockTransaction[]): Product[] {
//   const products = new Map<string, string>();
//   for (const t of transactions) {
//     if (t.product_id && t.product_name && !products.has(t.product_id)) {
//       products.set(t.product_id, t.product_name);
//     }
//   }
//   return Array.from(products.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
// }

// function getUniqueWarehouses(transactions: StockTransaction[]): any[] {
//   const warehouses = new Map<string, string>();
//   for (const t of transactions) {
//     if (t.warehouse_id && t.warehouse_name && !warehouses.has(t.warehouse_id)) {
//       warehouses.set(t.warehouse_id, t.warehouse_name);
//     }
//   }
//   return Array.from(warehouses.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
// }

// export default function Home() {
//   //   const apiFilter = {
// //     // startDate: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined,
// //     // endDate: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined,
// //     // warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
// //     // productId: selectedProduct !== 'all' ? selectedProduct : undefined,
// //     startDate: dateRange?.from ? moment(dateRange.from).format("YYYY-MM-DD") : undefined,
// //   endDate: dateRange?.to ? moment(dateRange.to).format("YYYY-MM-DD") : undefined,
// //   warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
// //   productId: selectedProduct !== 'all' ? selectedProduct : undefined,
// //   };

//     const { data: response, isLoading } = UseRQ< StockTransaction[]>(
//       ['running', {}], // Include filter in query key for proper caching
//       () => getRunning_balance({})
//     );
//     console.log(response);

//   const transactions = response?? [];
//   const uniqueProducts = getUniqueProducts(transactions);
//   const uniqueWarehouses = getUniqueWarehouses(transactions);
//   return (
//     <main className="min-h-screen w-full bg-background">
//       <header className="border-b bg-card">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <h1 className="text-xl font-bold tracking-tight text-foreground">
//             StockSnapshot
//           </h1>
//         </div>
//       </header>
//       <StockDashboard transactions={transactions} products={uniqueProducts} warehouses={uniqueWarehouses} />
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { format, subDays, startOfDay } from "date-fns";
import {
  StockDashboard,
  DashboardFilters,
} from "@/components/current stock/stock-dashboard";
import { UseRQ } from "@/hooks/useReactQuery";
import { getRunning_balance } from "@/services/client_api-Service/user/current-stock/current-stock-api";
import { Product, StockTransaction } from "@/types/stock";

function getUniqueProducts(transactions: StockTransaction[]): Product[] {
  const products = new Map<string, string>();
  for (const t of transactions) {
    if (t.product_id && t.product_name && !products.has(t.product_id)) {
      products.set(t.product_id, t.product_name);
    }
  }
  return Array.from(products.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getUniqueWarehouses(transactions: StockTransaction[]): any[] {
  const warehouses = new Map<string, string>();
  for (const t of transactions) {
    if (t.warehouse_id && t.warehouse_name && !warehouses.has(t.warehouse_id)) {
      warehouses.set(t.warehouse_id, t.warehouse_name);
    }
  }
  return Array.from(warehouses.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function Home() {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      from: startOfDay(subDays(new Date(), 3)), // 3 days ago at 00:00
      to: new Date(), // today right now
    },
    warehouseId: "all",
    productId: "all",
  });

  // Derive API-ready params from filter state
  const apiFilter = {
    startDate: filters.dateRange?.from
      ? format(filters.dateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: filters.dateRange?.to
      ? format(filters.dateRange.to, "yyyy-MM-dd")
      : undefined,
    warehouseId:
      filters.warehouseId !== "all" ? filters.warehouseId : undefined,
    productId: filters.productId !== "all" ? filters.productId : undefined,
  };

  const { data: response, isLoading } = UseRQ<StockTransaction[]>(
    ["running", apiFilter], // cache key changes → refetch automatically
    () => getRunning_balance(apiFilter),
  );

  const transactions = response ?? [];
  const uniqueProducts = getUniqueProducts(transactions);
  const uniqueWarehouses = getUniqueWarehouses(transactions);

  return (
    <main className="min-h-screen w-full bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            StockSnapshot
          </h1>
        </div>
      </header>
      <StockDashboard
        transactions={transactions}
        products={uniqueProducts}
        warehouses={uniqueWarehouses}
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      />
    </main>
  );
}
