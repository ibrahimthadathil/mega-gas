"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface Transaction {
  date: string;
  remark: string | null;
  amount_received: number;
  amount_paid: number;
  running_balance: number;
}

interface LedgerTableProps {
  transactions: Transaction[];
}

export function LedgerTable({ transactions }: LedgerTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <Card className="shadow-sm border-none overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Remark</TableHead>
              <TableHead className="text-right font-semibold text-emerald-600">Received</TableHead>
              <TableHead className="text-right font-semibold text-rose-600">Paid</TableHead>
              <TableHead className="text-right font-semibold">Running Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No transactions found for the selected period.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">
                    {format(new Date(tx.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.remark || <span className="text-slate-300 italic">No remark</span>}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-medium">
                    {tx.amount_received > 0 ? formatCurrency(tx.amount_received) : "-"}
                  </TableCell>
                  <TableCell className="text-right text-rose-600 font-medium">
                    {tx.amount_paid > 0 ? formatCurrency(tx.amount_paid) : "-"}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${tx.running_balance >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
                    {formatCurrency(tx.running_balance)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}