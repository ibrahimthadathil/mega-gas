"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { ACCOUNTS, MONTHS, YEARS } from "@/lib/ledger-data"
import { Card, CardContent } from "@/components/ui/card";






export const ACCOUNTS = [
  { id: 'acc-01', name: 'Main Business Account' },
  { id: 'acc-02', name: 'Secondary Savings' },
  { id: 'acc-03', name: 'Petty Cash' },
];

export const YEARS = [2024, 2025, 2026];

export const MONTHS = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const LEDGER_PAYLOAD = {
  "get_account_ledger_monthly": {
    "transactions": [
      {
        "date": "2026-02-02",
        "remark": "CASH RCVD 2/2",
        "amount_received": 0,
        "amount_paid": 60000,
        "running_balance": -60000
      },
      {
        "date": "2026-02-03",
        "remark": null,
        "amount_received": 60000,
        "amount_paid": 0,
        "running_balance": 0
      },
      {
        "date": "2026-02-03",
        "remark": "SET OFF",
        "amount_received": 0,
        "amount_paid": 80000,
        "running_balance": -80000
      },
      {
        "date": "2026-02-03",
        "remark": null,
        "amount_received": 80000,
        "amount_paid": 0,
        "running_balance": 0
      },
      {
        "date": "2026-02-04",
        "remark": "4/2",
        "amount_received": 29000,
        "amount_paid": 0,
        "running_balance": 29000
      },
      {
        "date": "2026-02-06",
        "remark": "49500 but 300 short",
        "amount_received": 49200,
        "amount_paid": 0,
        "running_balance": 78200
      },
      {
        "date": "2026-02-06",
        "remark": "4/2/26",
        "amount_received": 18000,
        "amount_paid": 0,
        "running_balance": 96200
      },
      {
        "date": "2026-02-06",
        "remark": null,
        "amount_received": 43500,
        "amount_paid": 0,
        "running_balance": 139700
      },
      {
        "date": "2026-02-06",
        "remark": "sales slip Transaction",
        "amount_received": 0,
        "amount_paid": 43500,
        "running_balance": 96200
      },
      {
        "date": "2026-02-07",
        "remark": null,
        "amount_received": 38000,
        "amount_paid": 0,
        "running_balance": 134200
      },
      {
        "date": "2026-02-09",
        "remark": null,
        "amount_received": 88150,
        "amount_paid": 0,
        "running_balance": 222350
      },
      {
        "date": "2026-02-11",
        "remark": "10/2",
        "amount_received": 47000,
        "amount_paid": 0,
        "running_balance": 269350
      },
      {
        "date": "2026-02-11",
        "remark": "11/2",
        "amount_received": 57500,
        "amount_paid": 0,
        "running_balance": 326850
      },
      {
        "date": "2026-02-14",
        "remark": "10 short (55990 as per bill)",
        "amount_received": 55890,
        "amount_paid": 0,
        "running_balance": 382740
      },
      {
        "date": "2026-02-16",
        "remark": null,
        "amount_received": 35000,
        "amount_paid": 0,
        "running_balance": 417740
      },
      {
        "date": "2026-02-17",
        "remark": "kunhippa",
        "amount_received": 33450,
        "amount_paid": 0,
        "running_balance": 451190
      }
    ],
    "summary": {
      "total_received": 634690,
      "total_paid": 183500,
      "net_amount": 451190
    }
  }
};



//////////////////////////////////////////////////////////////
interface LedgerFiltersProps {
  selectedAccount: string;
  setSelectedAccount: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
}

export function LedgerFilters({
  selectedAccount,
  setSelectedAccount,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: LedgerFiltersProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Select Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-100">
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNTS.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-100">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-100">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}