"use client";

import React, { useState, useEffect } from "react";
import { LedgerTable } from "./ledger-table";
import { LedgerSummary } from "./ledger-summary";
import { Separator } from "@/components/ui/separator";
import { LEDGER_PAYLOAD, LedgerFilters } from "./ledger-filter";

export function LedgerDashboard() {
  const [selectedAccount, setSelectedAccount] = useState("acc-01");
  const [selectedMonth, setSelectedMonth] = useState("2");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [data, setData] = useState(LEDGER_PAYLOAD.get_account_ledger_monthly);

  // In a real app, you would fetch data here when filters change
  useEffect(() => {
    // Simulate data refresh or empty state if filters change to something other than the mock data provided
    if (selectedMonth === "2" && selectedYear === "2026") {
      setData(LEDGER_PAYLOAD.get_account_ledger_monthly);
    } else {
      setData({
        transactions: [],
        summary: {
          total_received: 0,
          total_paid: 0,
          net_amount: 0,
        },
      });
    }
  }, [selectedAccount, selectedMonth, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">LedgerLook</h1>
        <p className="text-slate-500">Track and manage your account transactions seamlessly.</p>
      </header>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-primary rounded-full" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Configuration</h2>
        </div>
        <LedgerFilters
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </section>

      <Separator className="bg-slate-200" />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-accent rounded-full" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Transaction History</h2>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
            Showing results for Feb 2026
          </div>
        </div>
        
        <LedgerTable transactions={data.transactions} />
        
        <div className="flex items-center gap-2 mt-8">
          <div className="h-1 w-8 bg-primary rounded-full" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Summary</h2>
        </div>
        <LedgerSummary summary={data.summary} />
      </section>
    </div>
  );
}