"use client";

import React, { useState, useEffect } from "react";
import { LedgerTable } from "./ledger-table";
import { LedgerSummary } from "./ledger-summary";
import { Separator } from "@/components/ui/separator";
import {  LedgerFilters } from "./ledger-filter";
import { getLedgerByAccount } from "@/services/client_api-Service/user/accounts/transaction_api";
import { UseRQ } from "@/hooks/useReactQuery";

export function LedgerDashboard() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const isReady = !!selectedAccount && !!selectedMonth && !!selectedYear;

   const { data: ledgerData, isLoading } = UseRQ<any>(
    ["ledger", selectedAccount, selectedMonth, selectedYear],
    () =>
      getLedgerByAccount({
        account: selectedAccount,
        month: Number(selectedMonth),
        year: Number(selectedYear),
      }),
    { enabled: isReady } 
  );



//   return (
//     <div className="max-w-7xl mx-auto space-y-8 pb-12">
//       <header className="space-y-2">
//         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">LedgerLook</h1>
//         <p className="text-slate-500">Track and manage your account transactions seamlessly.</p>
//       </header>

//       <section>
//         <div className="flex items-center gap-2 mb-4">
//           <div className="h-1 w-8 bg-primary rounded-full" />
//           <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Configuration</h2>
//         </div>
//         <LedgerFilters
//           selectedAccount={selectedAccount}
//           setSelectedAccount={setSelectedAccount}
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//           selectedYear={selectedYear}
//           setSelectedYear={setSelectedYear}
//         />
//       </section>

//       <Separator className="bg-slate-200" />

//       <section className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="h-1 w-8 bg-accent rounded-full" />
//             <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Transaction History</h2>
//           </div>
//           <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
//             Showing results for Feb 2026
//           </div>
//         </div>
        
//         <LedgerTable transactions={ledgerData?.transactions} />
        
//         <div className="flex items-center gap-2 mt-8">
//           <div className="h-1 w-8 bg-primary rounded-full" />
//           <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Summary</h2>
//         </div>
//         <LedgerSummary summary={ledgerData?.summary} />
//       </section>
//     </div>
//   );
// }


const transactions = ledgerData?.transactions ?? [];
  const summary = ledgerData?.summary ?? {
    total_received: 0,
    total_paid: 0,
    net_amount: 0,
  };

  const selectedMonthLabel = new Date(0, Number(selectedMonth) - 1).toLocaleString("default", { month: "long" });

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
          {isReady && (
            <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
              Showing results for {selectedMonthLabel} {selectedYear}
            </div>
          )}
        </div>

        {!isReady ? (
          <div className="text-center text-slate-400 py-16 border border-dashed border-slate-200 rounded-xl">
            Please select an account, month, and year to view transactions.
          </div>
        ) : isLoading ? (
          <div className="text-center text-slate-400 py-16">Loading...</div>
        ) : (
          <>
            <LedgerTable transactions={transactions} />
            <div className="flex items-center gap-2 mt-8">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Summary</h2>
            </div>
            <LedgerSummary summary={summary} />
          </>
        )}
      </section>
    </div>
  );
}
