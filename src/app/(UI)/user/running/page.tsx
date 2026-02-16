// "use client";
// import { StockDashboard } from "@/components/current stock/stock-dashboard";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getRunning_balance } from "@/services/client_api-Service/user/current-stock/current-stock-api";
// import { Product, StockTransaction, Warehouse } from "@/types/stock";

// function getUniqueProducts(transactions: StockTransaction[]): Product[] {
//   const products = new Map<string, string>();
//   for (const t of transactions) {
//     if (t.product_id && t.product_name && !products.has(t.product_id)) {
//       products.set(t.product_id, t.product_name);
//     }
//   }
//   return Array.from(products.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
// }

// function getUniqueWarehouses(transactions: StockTransaction[]): Warehouse[] {
//   const warehouses = new Map<string, string>();
//   for (const t of transactions) {
//     if (t.warehouse_id && t.warehouse_name && !warehouses.has(t.warehouse_id)) {
//       warehouses.set(t.warehouse_id, t.warehouse_name);
//     }
//   }
//   return Array.from(warehouses.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
// }

// export default function Home() {
//     const {data:transactions,isLoading} = UseRQ<StockTransaction[]>('running',getRunning_balance)
// //   const transactions = stockData as StockTransaction[];
//   const uniqueProducts = getUniqueProducts(transactions??[]);
//   const uniqueWarehouses = getUniqueWarehouses(transactions??[]);

//   return (
//     <main className="min-h-screen w-full bg-background">
//       <header className="border-b bg-card">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <h1 className="text-xl font-bold tracking-tight text-foreground">
//             StockSnapshot
//           </h1>
//         </div>
//       </header>
//       <StockDashboard transactions={transactions??[]} products={uniqueProducts} warehouses={uniqueWarehouses} />
//     </main>
//   );
// }
"use client";
import { StockDashboard } from "@/components/current stock/stock-dashboard";
import { UseRQ } from "@/hooks/useReactQuery";
import { getRunning_balance } from "@/services/client_api-Service/user/current-stock/current-stock-api";
import { Product, StockTransaction, Warehouse } from "@/types/stock";
import { useState } from "react";
import { subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

function getUniqueProducts(transactions: StockTransaction[]): Product[] {
  const products = new Map<string, string>();
  for (const t of transactions) {
    if (t.product_id && t.product_name && !products.has(t.product_id)) {
      products.set(t.product_id, t.product_name);
    }
  }
  return Array.from(products.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}

function getUniqueWarehouses(transactions: StockTransaction[]): Warehouse[] {
  const warehouses = new Map<string, string>();
  for (const t of transactions) {
    if (t.warehouse_id && t.warehouse_name && !warehouses.has(t.warehouse_id)) {
      warehouses.set(t.warehouse_id, t.warehouse_name);
    }
  }
  return Array.from(warehouses.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 2), // Last 3 days (today + 2 days back)
    to: new Date(),
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  // Build filter object for API call
  const apiFilter = {
    startDate: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined,
    endDate: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined,
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    productId: selectedProduct !== 'all' ? selectedProduct : undefined,
  };

  const { data: response, isLoading } = UseRQ< StockTransaction[]>(
    ['running', apiFilter], // Include filter in query key for proper caching
    () => getRunning_balance(apiFilter)
  );
console.log(response);

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
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        isLoading={isLoading}
      />
    </main>
  );
}