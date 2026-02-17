"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

interface Summary {
  total_received: number;
  total_paid: number;
  net_amount: number;
}

interface LedgerSummaryProps {
  summary: Summary;
}

export function LedgerSummary({ summary }: LedgerSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Total Received</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary.total_received)}
            </h3>
            <p className="text-sm text-muted-foreground">Cash inflows this period</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-rose-600 uppercase tracking-wider">Total Paid</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary.total_paid)}
            </h3>
            <p className="text-sm text-muted-foreground">Cash outflows this period</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden group hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/30 text-white rounded-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Net Balance</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">
              {formatCurrency(summary.net_amount)}
            </h3>
            <p className="text-sm text-indigo-100/80">Running account total</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}