"use client";

import { useState, useMemo, Fragment } from "react";
import { CalendarIcon, Warehouse } from "lucide-react";
import { format, endOfDay, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, StockTransaction } from "@/types/stock";

interface StockDashboardProps {
  transactions: StockTransaction[];
  products: Product[];
  warehouses: any[];
}

export function StockDashboard({ transactions, products, warehouses }: StockDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 3),
    to: new Date(),
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("4195e948-9f1c-4931-aa85-68a08497e227");

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (dateRange?.from) {
      result = result.filter(t => new Date(t.transaction_date) >= dateRange.from!);
    }
    if (dateRange?.to) {
      result = result.filter(t => new Date(t.transaction_date) <= endOfDay(dateRange.to!));
    }
    if (selectedWarehouse !== 'all') {
      result = result.filter(t => t.warehouse_id === selectedWarehouse);
    }
    if (selectedProduct !== 'all') {
      result = result.filter(t => t.product_id === selectedProduct);
    }
    return result.sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime() || a.idx - b.idx);

  }, [transactions, dateRange, selectedWarehouse, selectedProduct]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const date = format(new Date(transaction.transaction_date), "PP");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, StockTransaction[]>);
  }, [filteredTransactions]);

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedWarehouse("all");
    setSelectedProduct("all");
  };
  
  return (
    <div className="p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Warehouse className="w-6 h-6 text-primary"/>
                    Stock Transactions
                </CardTitle>
                <CardDescription>
                    Filter and view stock transactions.
                </CardDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Warehouses</SelectItem>
                          {warehouses.map(w => (
                              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>

                   <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>

                  <Button onClick={handleResetFilters} variant="outline" className="w-full lg:w-auto">
                    Reset Filters
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>idx</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Counter Warehouse</TableHead>
                    <TableHead className="text-right">Qty Change</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(groupedTransactions).length > 0 ? (
                    Object.entries(groupedTransactions).map(([date, transactionsForDate]) => (
                      <Fragment key={date}>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell colSpan={6} className="font-semibold">
                            {date}
                          </TableCell>
                        </TableRow>
                        {transactionsForDate.map((t) => (
                          <TableRow key={t.idx}>
                            <TableCell>{t.idx}</TableCell>
                            <TableCell>{t.warehouse_name}</TableCell>
                            <TableCell className="font-medium">{t.product_name}</TableCell>
                            <TableCell>{t.counter_warehouse_name}</TableCell>
                            <TableCell className={cn("text-right font-mono", Number(t.qty_change) < 0 && "text-destructive")}>{Number(t.qty_change).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono">{Number(t.cumulative_balance).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))
                  ) : (
                      <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
