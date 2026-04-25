
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UseRQ } from "@/hooks/useReactQuery";
import { getAccountSummary } from "@/services/client_api-Service/user/accounts/transaction_api";
import { Skeleton } from "../ui/skeleton";

interface AccountSummary {
  idx: number;
  account_id: string;
  account_name: string;
  total_amount_received: string;
  total_amount_paid: string;
  net_amount: string;
}

export function AccountSummaryTable() {
  const { data: summaries, isLoading } = UseRQ<AccountSummary[]>(
    "summary",
    getAccountSummary,
  );

  const [search, setSearch] = useState("");

  const filtered = summaries?.filter((s) =>
    s.account_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card className="shadow-sm border-none overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by account name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] font-semibold text-slate-500">
                Idx
              </TableHead>
              <TableHead className="font-semibold">Account Name</TableHead>
              <TableHead className="text-right font-semibold text-emerald-600">
                Total Received
              </TableHead>
              <TableHead className="text-right font-semibold text-rose-600">
                Total Paid
              </TableHead>
              <TableHead className="text-right font-semibold">
                Net Balance
              </TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {filtered?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {search
                      ? `No results found for "${search}".`
                      : "No account summaries available."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered?.map((summary) => (
                  <TableRow
                    key={summary.account_id}
                    className="hover:bg-slate-50/50"
                  >
                    <TableCell className="text-slate-400 font-mono text-xs">
                      {summary.idx}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {summary.account_name}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">
                      {summary.total_amount_received}
                    </TableCell>
                    <TableCell className="text-right text-rose-600 font-medium">
                      {summary.total_amount_paid}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${parseFloat(summary.net_amount) >= 0 ? "text-slate-900" : "text-rose-700"}`}
                    >
                      {summary.net_amount}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}