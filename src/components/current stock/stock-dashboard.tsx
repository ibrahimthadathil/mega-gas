"use client";
import { useState, useMemo, Fragment } from "react";
import { CalendarIcon, Warehouse, Check, ChevronDown } from "lucide-react";
import { format, endOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Product, StockTransaction } from "@/types/stock";

export interface Warehouse { id: string; name: string; }

export interface DashboardFilters {
  dateRange: DateRange | undefined;
  warehouseIds: string[];
  productIds: string[];
}

interface StockDashboardProps {
  transactions: StockTransaction[];
  products: Product[];
  warehouses: Warehouse[];
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
   onApplyFilters: () => void;   // ✅ new
  onResetFilters: () => void; 
  isLoading?: boolean;
}

// ── Reusable multi-select popover ─────────────────────────────────────────────
interface MultiSelectProps {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiSelectPopover({ label, items, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    );
  };

  const selectAll = () => onChange([]);
  const isAllSelected = selected.length === 0;

  const triggerLabel =
    isAllSelected
      ? `All ${label}s`
      : selected.length === 1
      ? items.find(i => i.id === selected[0])?.name ?? "1 selected"
      : `${selected.length} ${label}s selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        {/* All option */}
        <div
          className="flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent"
          onClick={selectAll}
        >
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={selectAll}
            id={`${label}-all`}
          />
          <label
            htmlFor={`${label}-all`}
            className="text-sm cursor-pointer select-none w-full"
          >
            All {label}s
          </label>
        </div>

        <div className="my-1 border-t" />

        {/* Individual options */}
        <div className="max-h-60 overflow-y-auto space-y-0.5">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent"
              onClick={() => toggle(item.id)}
            >
              <Checkbox
                checked={selected.includes(item.id)}
                onCheckedChange={() => toggle(item.id)}
                id={`${label}-${item.id}`}
              />
              <label
                htmlFor={`${label}-${item.id}`}
                className="text-sm cursor-pointer select-none w-full truncate"
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}


export function StockDashboard({
  transactions, products, warehouses, filters, onFiltersChange,onApplyFilters, onResetFilters, isLoading,
}: StockDashboardProps) {
  const { dateRange, warehouseIds, productIds } = filters;

  const updateFilter = (patch: Partial<DashboardFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  const handleResetFilters = () =>
    onFiltersChange({ dateRange: undefined, warehouseIds: [], productIds: [] });

  // ── Filtering (updated for array) ──────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (dateRange?.from)
      result = result.filter(t => new Date(t.transaction_date) >= dateRange.from!);
    if (dateRange?.to)
      result = result.filter(t => new Date(t.transaction_date) <= endOfDay(dateRange.to!));

    // empty array = all; otherwise filter to selected IDs
    if (warehouseIds.length > 0)
      result = result.filter(t => warehouseIds.includes(t.warehouse_id));
    if (productIds.length > 0)
      result = result.filter(t => productIds.includes(t.product_id));

    return result.sort((a, b) => {
      const dateComp = new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
      if (dateComp !== 0) return dateComp;
      const whComp = a.warehouse_name.localeCompare(b.warehouse_name);
      if (whComp !== 0) return whComp;
      const pComp = a.product_name.localeCompare(b.product_name);
      if (pComp !== 0) return pComp;
      return a.idx - b.idx;
    });
  }, [transactions, dateRange, warehouseIds, productIds]);

  // groupedTransactions — unchanged
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const date = format(new Date(transaction.transaction_date), "PP");
        const warehouseName = transaction.warehouse_name;
        const productName = transaction.product_name;
        if (!acc[date]) acc[date] = {};
        if (!acc[date][warehouseName]) acc[date][warehouseName] = {};
        if (!acc[date][warehouseName][productName]) acc[date][warehouseName][productName] = [];
        acc[date][warehouseName][productName].push(transaction);
        return acc;
      },
      {} as Record<string, Record<string, Record<string, StockTransaction[]>>>
    );
  }, [filteredTransactions]);

  return (
    <div className="p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Warehouse className="w-6 h-6 text-primary" />
                Stock Transactions
              </CardTitle>
              <CardDescription>Filter and view stock transactions.</CardDescription>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">

              {/* Date Range — unchanged */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>{format(dateRange.from, "LLL dd, y")} – {format(dateRange.to, "LLL dd, y")}</>
                      ) : format(dateRange.from, "LLL dd, y")
                    ) : <span>Pick a date range</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={range => updateFilter({ dateRange: range })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

             <MultiSelectPopover
                label="Warehouse"
                items={warehouses}
                selected={warehouseIds}
                onChange={ids => updateFilter({ warehouseIds: ids })}
              />

              {/* Multi-select Product */}
              <MultiSelectPopover
                label="Product"
                items={products}
                selected={productIds}
                onChange={ids => updateFilter({ productIds: ids })}
              />

              <div className="flex gap-2">
                <Button
                  onClick={onApplyFilters}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Apply"}
                </Button>
                <Button
                  onClick={onResetFilters}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-16">idx</TableHead>
                  <TableHead>Counter Warehouse</TableHead>
                  <TableHead className="text-right">Qty Change</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : Object.keys(groupedTransactions).length > 0 ? (
                  Object.entries(groupedTransactions).map(([date, warehouses]) => (
                    <Fragment key={date}>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={4} className="font-semibold">
                          {date}
                        </TableCell>
                      </TableRow>
                      {Object.entries(warehouses).map(([warehouseName, products]) => (
                        <Fragment key={warehouseName}>
                          <TableRow className="bg-muted/25 hover:bg-muted/25">
                            <TableCell colSpan={4} className="pl-8 font-medium">
                              {warehouseName}
                            </TableCell>
                          </TableRow>
                          {Object.entries(products).map(([productName, transactionsForProduct]) => (
                            <Fragment key={productName}>
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="pl-12 text-sm text-muted-foreground"
                                >
                                  {productName}
                                </TableCell>
                              </TableRow>
                              {transactionsForProduct.map((t,idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="pl-16">{idx+1}</TableCell>
                                  <TableCell>{t.counter_warehouse_name}</TableCell>
                                  <TableCell
                                    className={cn(
                                      "text-right font-mono",
                                      Number(t.qty_change) < 0 && "text-destructive"
                                    )}
                                  >
                                    {Number(t.qty_change).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right font-mono">
                                    {Number(t.cumulative_balance).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      No transactions found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}