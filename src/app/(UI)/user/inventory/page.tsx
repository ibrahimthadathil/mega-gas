// "use client";
// import DataTable from "@/components/data-table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getDashboardData } from "@/services/client_api-Service/user/dashboard/dashboar-api";
// import React, { useMemo } from "react";
// import { Warehouse } from "../warehouses/page";
// import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
// import { formatDate } from "@/lib/utils";
// import { TransferedInventory } from "@/types/inventory";

// const page = () => {
//   const { data: inventoryLevel, isLoading } = UseRQ<TransferedInventory[]>(
//     "inventoryLevel",
//     getDashboardData
//   );
//   const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<
//     Warehouse[]
//   >("warehouse", getWarehouse);
//   const Columns = useMemo(
//     () => [
//       {
//         header: "Transaction Date",
//         render: (row: TransferedInventory) =>
//           formatDate(new Date(row.transaction_date)),
//       },
//     ],
//     [inventoryLevel]
//   );
//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <h1 className="text-3xl font-semibold mb-2">Inventory Level Stock</h1>
//       {isLoading ? (
//         <Skeleton className="w-full h-24 bg-zinc-50" />
//       ) : (
//         <DataTable
//           columns={Columns}
//           itemsPerPage={10}
//           data={inventoryLevel ?? []}
//         />
//       )}
//     </main>
//   );
// };

// export default page;


"use client";
import DataTable from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import { getDashboardData } from "@/services/client_api-Service/user/dashboard/dashboar-api";
import React, { useMemo, useState } from "react";
import { Warehouse } from "../warehouses/page";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { formatDate } from "@/lib/utils";
import { TransferedInventory } from "@/types/inventory";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type InventoryFilters = {
  warehouseIds?: string[];
  warehouseNames?: string[];
  date?: string;
  page?: number;
  limit?: number;
};

const page = () => {
  const [filters, setFilters] = useState<InventoryFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch warehouses
  const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<Warehouse[]>("warehouse", getWarehouse);

  // Fetch inventory with filters
  const { data: inventoryLevel, isLoading } = UseRQ<TransferedInventory[]>(
    ["inventoryLevel", filters],
    () => getDashboardData(filters),
    {
      enabled: true,
    }
  );

  // Define columns - only display named items
  const Columns = useMemo(
    () => [
      {
        header: "Transaction Date",
        render: (row: TransferedInventory) =>
          formatDate(new Date(row.transaction_date)),
      },
      {
        header: "Product Name",
        render: (row: TransferedInventory) => row.product_name,
      },
      {
        header: "Product Code",
        render: (row: TransferedInventory) => row.product_code,
      },
      {
        header: "Quantity",
        render: (row: TransferedInventory) => row.qty,
      },
      {
        header: "From Warehouse",
        render: (row: TransferedInventory) => row.from_warehouse_name,
      },
      {
        header: "To Warehouse",
        render: (row: TransferedInventory) => row.to_warehouse_name,
      },
      {
        header: "Source Type",
        render: (row: TransferedInventory) => row.source_form_type,
      },
    ],
    []
  );

  // Handle filter application
  const handleApplyFilters = () => {
    const newFilters: InventoryFilters = {
      page: 1,
      limit: filters.limit,
    };

    if (selectedWarehouse) {
      const warehouse = warehouses?.find((w) => w.id === selectedWarehouse);
      if (warehouse) {
        newFilters.warehouseIds = [warehouse.id!];
        newFilters.warehouseNames = [warehouse.name];
      }
    }

    if (selectedDate) {
      newFilters.date = selectedDate;
    }

    setFilters(newFilters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSelectedWarehouse("");
    setSelectedDate("");
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-6">Inventory Level Stock</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Warehouse Filter */}
          <div className="space-y-2">
            <Label htmlFor="warehouse">Filter by Warehouse</Label>
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
              disabled={isWarehouseLoading}
            >
              <SelectTrigger id="warehouse">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses?.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id!}>
                    {warehouse.name} ({warehouse.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="date">Filter by Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Filter Actions */}
          <div className=" flex items-end gap-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedWarehouse || selectedDate) && (
          <div className="pt-2  border-t">
            <p className="text-sm text-muted-foreground">
              Active filters:{" "}
              {selectedWarehouse && warehouses && (
                <span className="font-medium">
                  Warehouse:{" "}
                  {warehouses.find((w) => w.id === selectedWarehouse)?.name}
                </span>
              )}
              {selectedWarehouse && selectedDate && " | "}
              {selectedDate && (
                <span className="font-medium">Date: {selectedDate}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Data Table */}
      {isLoading ? (
        <Skeleton className="w-full h-96 bg-zinc-50" />
      ) : (
        <DataTable
          columns={Columns}
          itemsPerPage={filters.limit ?? 10}
          data={inventoryLevel ?? []}
          onChange={handlePageChange}
          // currentPage={filters.page ?? 1}
        />
      )}
    </main>
  );
};

export default page;