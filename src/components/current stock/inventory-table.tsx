
"use client"

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Group, InventoryItem } from '@/types/inventory';
import { Badge } from '../ui/badge';

interface InventoryTableProps {
  data: InventoryItem[];
  warehouseGroups: Group[];
  productGroups: Group[];
}

export function InventoryTable({ data, warehouseGroups, productGroups }: InventoryTableProps) {
  const warehouses = useMemo(() => Array.from(new Set(data.map(d => d.warehouse_name))), [data]);
  const products = useMemo(() => Array.from(new Set(data.map(d => d.product_name))), [data]);

  const pivoted = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    data.forEach(item => {
      if (!map[item.warehouse_name]) map[item.warehouse_name] = {};
      map[item.warehouse_name][item.product_name] = parseFloat(item.qty);
    });
    return map;
  }, [data]);

  const productGroupMap = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    const ungrouped: string[] = [...products];

    productGroups.forEach(pg => {
      const members = pg.memberIds.filter(id => products.includes(id));
      if (members.length > 0) {
        grouped[pg.name] = members;
        members.forEach(mId => {
          const idx = ungrouped.indexOf(mId);
          if (idx > -1) ungrouped.splice(idx, 1);
        });
      }
    });

    if (ungrouped.length > 0) grouped["Others"] = ungrouped;
    return grouped;
  }, [products, productGroups]);

  const warehouseGroupMap = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    const ungrouped: string[] = [...warehouses];

    warehouseGroups.forEach(wg => {
      const members = wg.memberIds.filter(id => warehouses.includes(id));
      if (members.length > 0) {
        grouped[wg.name] = members;
        members.forEach(mId => {
          const idx = ungrouped.indexOf(mId);
          if (idx > -1) ungrouped.splice(idx, 1);
        });
      }
    });

    if (ungrouped.length > 0) grouped["Unassigned"] = ungrouped;
    return grouped;
  }, [warehouses, warehouseGroups]);

  const getQty = (w: string, p: string) => pivoted[w]?.[p] || 0;

  const colGrandTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;

    products.forEach(p => {
      totals[p] = warehouses.reduce((sum, w) => sum + getQty(w, p), 0);
    });

    Object.entries(productGroupMap).forEach(([pgName, pgProducts]) => {
      totals[pgName] = pgProducts.reduce((sum, p) => sum + (totals[p] || 0), 0);
      grandTotal += totals[pgName];
    });

    totals["__grand_total__"] = grandTotal;
    return totals;
  }, [warehouses, products, productGroupMap, pivoted]);

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm animate-fade-in text-[11px] md:text-sm">
      <div className="overflow-x-auto max-h-[75vh]">
        <Table className="relative border-collapse">
          <TableHeader className="bg-muted">
            <TableRow className="border-b-2 h-auto">
              <TableHead className="w-[120px] md:w-[180px] font-bold bg-muted sticky top-0 left-0 z-50 border-r px-2 py-1.5 h-auto">
                Warehouse
              </TableHead>
              {Object.entries(productGroupMap).map(([groupName, groupProducts]) => (
                <React.Fragment key={groupName}>
                  {groupProducts.map(pName => (
                    <TableHead key={pName} className="text-center font-semibold min-w-[70px] md:min-w-[90px] border-r px-1 py-1 h-auto text-[10px] md:text-xs sticky top-0 bg-muted z-30">
                      {pName}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold bg-accent/10 border-r text-primary min-w-[70px] md:min-w-[90px] px-1 py-1 h-auto text-[10px] md:text-xs sticky top-0 z-30">
                    {groupName} Sub
                  </TableHead>
                </React.Fragment>
              ))}
              <TableHead className="text-center font-bold bg-primary text-primary-foreground min-w-[80px] md:min-w-[100px] px-2 py-1.5 h-auto sticky top-0 z-30">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(warehouseGroupMap).map(([groupName, groupWarehouses]) => {
              const groupRows = groupWarehouses.map(wName => {
                let rowGrandTotal = 0;
                const rowCells = Object.entries(productGroupMap).map(([pgName, pgProducts]) => {
                  const subtotal = pgProducts.reduce((sum, pName) => sum + getQty(wName, pName), 0);
                  rowGrandTotal += subtotal;
                  return { pgName, subtotal, cells: pgProducts.map(pName => getQty(wName, pName)) };
                });
                return { wName, rowCells, rowGrandTotal };
              });

              const groupGrandTotal = groupRows.reduce((sum, row) => sum + row.rowGrandTotal, 0);

              return (
                <React.Fragment key={groupName}>
                  <TableRow className="bg-primary/5 hover:bg-primary/5 border-b-0 h-auto">
                    <TableCell colSpan={99} className="py-1 px-2 font-bold text-amber-600  text-[9px] md:text-[10px] uppercase tracking-wider h-auto">
                      {groupName}
                    </TableCell>
                  </TableRow>

                  {groupRows.map((row) => (
                    <TableRow key={row.wName} className="hover:bg-accent/5 group transition-colors h-auto border-b">
                      <TableCell className="font-medium sticky left-0 bg-background  border-r shadow-[1px_0_3px_rgba(0,0,0,0.05)] px-2 py-1 h-auto truncate">
                        {row.wName}
                      </TableCell>
                      {row.rowCells.map((pgData) => (
                        <React.Fragment key={pgData.pgName}>
                          {pgData.cells.map((qty, i) => (
                            <TableCell key={i} className={cn("text-center border-r tabular-nums px-1 py-1 h-auto", qty < 0 ? "text-destructive font-medium" : qty > 0 ? "text-emerald-600 font-medium" : "text-muted-foreground opacity-40")}>
                              {qty === 0 ? '-' : qty}
                            </TableCell>
                          ))}
                          <TableCell className="text-center text-blue-800 font-semibold bg-accent/5 border-r tabular-nums px-1 py-1 h-auto">
                            {pgData.subtotal}
                          </TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell className="text-center font-bold bg-primary/5 tabular-nums px-2 py-1 h-auto">
                        {row.rowGrandTotal}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow className="bg-primary/10 border-y-2 border-primary/20 font-bold h-auto">
                    <TableCell className="sticky left-0 bg-slate-50 z-20 border-r shadow-[1px_0_3px_rgba(0,0,0,0.1)] px-2 py-1 h-auto text-[10px]">
                      {groupName} Total
                    </TableCell>
                    {Object.entries(productGroupMap).map(([pgName, pgProducts]) => (
                      <React.Fragment key={pgName}>
                        {pgProducts.map((pName, i) => (
                          <TableCell key={i} className="text-center border-r tabular-nums px-1 py-1 h-auto">
                            {groupWarehouses.reduce((sum, w) => sum + getQty(w, pName), 0)}
                          </TableCell>
                        ))}
                        <TableCell className="text-center bg-accent/20 border-r tabular-nums text-primary px-1 py-1 h-auto">
                          {groupWarehouses.reduce((sum, wName) => {
                            return sum + pgProducts.reduce((pSum, pName) => pSum + getQty(wName, pName), 0);
                          }, 0)}
                        </TableCell>
                      </React.Fragment>
                    ))}
                    <TableCell className="text-center bg-primary/20 tabular-nums px-2 py-1 h-auto">
                      {groupGrandTotal}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}

            <TableRow className="bg-primary text-primary-foreground hover:bg-zinc-600 font-bold border-t-2 border-primary/50 h-auto sticky bottom-0 z-30">
              <TableCell className="sticky left-0 bg-primary z-40 shadow-[2px_0_6px_rgba(0,0,0,0.3)] px-2 py-2 h-auto text-[10px] md:text-xs">
                GRAND TOTAL
              </TableCell>
              {Object.entries(productGroupMap).map(([pgName, pgProducts]) => (
                <React.Fragment key={pgName}>
                  {pgProducts.map(pName => (
                    <TableCell key={pName} className="text-center  border-r border-primary-foreground/20 tabular-nums px-1 py-2 h-auto">
                      {colGrandTotals[pName]}
                    </TableCell>
                  ))}
                  <TableCell className="text-center bg-primary-foreground/10 border-r border-primary-foreground/20 tabular-nums px-1 py-2 h-auto">
                    {colGrandTotals[pgName]}
                  </TableCell>
                </React.Fragment>
              ))}
              <TableCell className="text-center  bg-primary-foreground/20 tabular-nums text-xs md:text-sm px-2 py-2 h-auto shadow-[inset_-2px_0_5px_rgba(0,0,0,0.2)]">
                {colGrandTotals["__grand_total__"]} 
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="p-2 bg-muted/10 text-[9px] text-muted-foreground italic md:text-[10px] text-center">
        * Tip: Scroll horizontally to view more products and subtotals.
      </div>
    </div>
  );
}
