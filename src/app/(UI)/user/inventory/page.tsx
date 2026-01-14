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
  warehouseNames?: string[];
  productNames?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

const page = () => {
  // Default filters with "14 FULL" product
  const [filters, setFilters] = useState<InventoryFilters>({
    page: 1,
    limit: 10,
    // Default product
  });

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("14 FULL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch warehouses
  const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<
    Warehouse[]
  >("warehouse", getWarehouse);

  // Fetch inventory with filters
  const { data: inventoryLevel, isLoading } = UseRQ<
    [[TransferedInventory[], { id: string; product_name: string }[]],success:boolean,count:number]
  >(["inventoryLevel", filters], () => getDashboardData(filters), {
    enabled: true,
  });
  console.log(inventoryLevel);

  // Define columns
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

    // Warehouse filter
    if (selectedWarehouse) {
      const warehouse = warehouses?.find((w) => w.id === selectedWarehouse);
      if (warehouse) {
        newFilters.warehouseNames = [warehouse.name];
      }
    }

    // Product filter
    if (selectedProduct) {
      newFilters.productNames = [selectedProduct];
    }

    // Date range filter
    if (startDate) {
      newFilters.startDate = startDate;
    }
    if (endDate) {
      newFilters.endDate = endDate;
    }

    setFilters(newFilters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSelectedWarehouse("");
    setSelectedProduct("14 FULL"); // Reset to default
    setStartDate("");
    setEndDate("");
    setFilters({
      page: 1,
      limit: 10,
      productNames: ["14 FULL"], // Reset to default
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product Filter */}
          <div className="space-y-2">
            <Label htmlFor="product">Filter by Product</Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={isLoading}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {inventoryLevel?.[0][1]?.map((product) => (
                  <SelectItem key={product.id} value={product.product_name}>
                    {product.product_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          {/* Start Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Filter Actions */}
          <div className=" flex items-end gap-2 md:col-span-2 lg:col-span-1">
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
        {(selectedWarehouse || selectedProduct || startDate || endDate) && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Active filters:{" "}
              {selectedProduct && (
                <span className="font-medium">Product: {selectedProduct}</span>
              )}
              {selectedProduct &&
                (selectedWarehouse || startDate || endDate) &&
                " | "}
              {selectedWarehouse && warehouses && (
                <span className="font-medium">
                  Warehouse:{" "}
                  {warehouses.find((w) => w.id === selectedWarehouse)?.name}
                </span>
              )}
              {selectedWarehouse && (startDate || endDate) && " | "}
              {startDate && (
                <span className="font-medium">From: {startDate}</span>
              )}
              {startDate && endDate && " "}
              {endDate && <span className="font-medium">To: {endDate}</span>}
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
          data={inventoryLevel?.[0][0] ?? []}
          onChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default page;
