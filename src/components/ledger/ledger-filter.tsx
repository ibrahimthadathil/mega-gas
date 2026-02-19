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
import { getAllAccountsParty } from "@/services/client_api-Service/user/accounts/accounts_api";
import { Account } from "@/app/(UI)/user/accounts/page";
import { UseRQ } from "@/hooks/useReactQuery";





export const YEARS = [2024, 2025, 2026];

 const MONTHS = [
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
  const { data: ACCOUNTS, isLoading: accountsLoading } = UseRQ<Account[]>(
      "accounts",
      getAllAccountsParty
    );
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
                {ACCOUNTS?.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id as string}>
                    {acc.account_name}
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