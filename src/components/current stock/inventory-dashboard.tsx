"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Layers,
  RefreshCcw,
  BarChart3,
  Tags,
  Filter,
  SlidersHorizontal,
  WarehouseIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { GroupManager } from "./group-manager";
import { InventoryTable } from "./inventory-table";
import { MultiSelectFilter } from "./multi-select-filter";
import { Group, InventoryItem } from "@/types/inventory";
import {
  DEFAULT_PRODUCT_GROUPS,
  DEFAULT_WAREHOUSE_GROUPS,
} from "@/types/inventory-temp-file";
import { UseRQ } from "@/hooks/useReactQuery";
import { getDashboardData } from "@/services/client_api-Service/user/dashboard/dashboar-api";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Warehouse } from "@/app/(UI)/user/warehouses/page";
import { getInventoryDetails } from "@/services/client_api-Service/user/current-stock/current-stock-api";

// Warehouses to HIDE by default - these will be CHECKED
const DEFAULT_HIDDEN_WAREHOUSES = [
  "Opening stock",
  "Outward Sales -DND",
  "Chelari plant - DND",
  "ibr_test"
];

export function InventoryDashboard() {
  const { data: INITIAL_DATA, isLoading } = UseRQ<InventoryItem[]>(
    "current-stock",
    getInventoryDetails,
  );
  const { data: uniqueWarehouses, isLoading: isWarehouseLoading } = UseRQ<Warehouse[]>("warehouse", getWarehouse);
  
  // Transform warehouse data to match MultiSelectFilter format
  const warehouseOptions = useMemo(
    () =>
      uniqueWarehouses?.map((warehouse) => ({
        id: warehouse.name,
        name: warehouse.name,
      })) || [],
    [uniqueWarehouses]
  );

  // Calculate default hidden warehouses (checked by default)
  const defaultHiddenWarehouses = useMemo(
    () =>
      warehouseOptions
        .map(w => w.name)
        .filter(name => DEFAULT_HIDDEN_WAREHOUSES.includes(name)),
    [warehouseOptions]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenWarehouses, setHiddenWarehouses] = useState<string[] | null>(null); // null = use defaults
  const [selectedWarehouseGroups, setSelectedWarehouseGroups] = useState<string[]>([]);
  const [selectedProductGroups, setSelectedProductGroups] = useState<string[]>([]);
  const [warehouseGroups, setWarehouseGroups] = useState<Group[]>(DEFAULT_WAREHOUSE_GROUPS);
  const [productGroups, setProductGroups] = useState<Group[]>(DEFAULT_PRODUCT_GROUPS);

  // Active hidden warehouses - use default only if null (not touched yet)
  const activeHiddenWarehouses = hiddenWarehouses === null ? defaultHiddenWarehouses : hiddenWarehouses;

  const uniqueProducts = useMemo(
    () =>
      Array.from(new Set(INITIAL_DATA?.map((d) => d.product_name)))?.map(
        (name) => ({ id: name, name }),
      ),
    [INITIAL_DATA]
  );

  const warehouseGroupOptions = useMemo(
    () => warehouseGroups.map((g) => ({ id: g.id, name: g.name })),
    [warehouseGroups],
  );

  const productGroupOptions = useMemo(
    () => productGroups.map((g) => ({ id: g.id, name: g.name })),
    [productGroups],
  );

  const filteredData = useMemo(() => {
    return INITIAL_DATA?.filter((item) => {
      const matchesSearch =
        item.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase());

      // REVERSED LOGIC: Hide warehouses that are CHECKED
      const isNotHidden = !activeHiddenWarehouses.includes(item.warehouse_name);

      const matchesWarehouseGroup =
        selectedWarehouseGroups.length === 0 ||
        warehouseGroups
          .filter((g) => selectedWarehouseGroups.includes(g.id))
          .some((g) => g.memberIds.includes(item.warehouse_name));

      const matchesProductGroup =
        selectedProductGroups.length === 0 ||
        productGroups
          .filter((g) => selectedProductGroups.includes(g.id))
          .some((g) => g.memberIds.includes(item.product_name));

      return (
        matchesSearch &&
        isNotHidden &&
        matchesWarehouseGroup &&
        matchesProductGroup
      );
    });
  }, [
    INITIAL_DATA,
    searchTerm,
    activeHiddenWarehouses,
    selectedWarehouseGroups,
    selectedProductGroups,
    warehouseGroups,
    productGroups,
  ]);

  const handleReset = () => {
    setSearchTerm("");
    setHiddenWarehouses(null); // Reset to null to use defaults again
    setSelectedWarehouseGroups([]);
    setSelectedProductGroups([]);
    setWarehouseGroups(DEFAULT_WAREHOUSE_GROUPS);
    setProductGroups(DEFAULT_PRODUCT_GROUPS);
  };

  const activeFiltersCount =
    activeHiddenWarehouses.length +
    selectedWarehouseGroups.length +
    selectedProductGroups.length;

  return (
    <div className="flex flex-col min-h-screen bg-background p-2 md:p-6 space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <BarChart3 className="h-6 w-6 md:h-7 md:w-7" />
            Current Stock
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full md:max-w-2xl lg:max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-10 bg-card text-sm shadow-sm ring-offset-background focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 gap-2 relative shadow-sm hover:bg-accent/5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline font-semibold">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold border-2 border-background">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  Controls
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Apply filters and manage your warehouse or product groupings.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Filters
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="h-7 text-[10px] gap-1 px-2"
                    >
                      <RefreshCcw className="h-3 w-3" />
                      Reset
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium ml-1 text-muted-foreground">
                        Hide Warehouses
                      </label>
                      <MultiSelectFilter
                        options={warehouseOptions}
                        selected={activeHiddenWarehouses}
                        onChange={setHiddenWarehouses}
                        placeholder="None Hidden"
                        label="Hide Warehouses (check to hide)"
                        icon={
                          <WarehouseIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium ml-1 text-muted-foreground">
                        By Warehouse Group
                      </label>
                      <MultiSelectFilter
                        options={warehouseGroupOptions}
                        selected={selectedWarehouseGroups}
                        onChange={setSelectedWarehouseGroups}
                        placeholder="All Warehouse Groups"
                        label="Filter by Warehouse Groups"
                        icon={
                          <Layers className="h-3.5 w-3.5 shrink-0 opacity-50" />
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium ml-1 text-muted-foreground">
                        By Product Group
                      </label>
                      <MultiSelectFilter
                        options={productGroupOptions}
                        selected={selectedProductGroups}
                        onChange={setSelectedProductGroups}
                        placeholder="All Product Groups"
                        label="Filter by Product Groups"
                        icon={
                          <Tags className="h-3.5 w-3.5 shrink-0 opacity-50" />
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Group Management
                  </h3>
                  <div className="flex flex-col gap-2">
                    <GroupManager
                      type="Warehouse"
                      groups={warehouseGroups}
                      availableItems={warehouseOptions}
                      onGroupsUpdate={setWarehouseGroups}
                    />
                    <GroupManager
                      type="Product"
                      groups={productGroups}
                      availableItems={uniqueProducts}
                      onGroupsUpdate={setProductGroups}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {!isLoading && (
        <div className="flex flex-col">
          <InventoryTable
            data={filteredData ?? []}
            warehouseGroups={warehouseGroups}
            productGroups={productGroups}
          />
        </div>
      )}
    </div>
  );
}