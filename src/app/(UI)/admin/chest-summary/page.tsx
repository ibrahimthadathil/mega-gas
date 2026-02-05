"use client";

import CashAdjustmentDialog from "@/components/accounts/denominatio";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  getAllChestSummary,
  makeAdjustment,
} from "@/services/client_api-Service/admin/chest-summary/chest-summary-api";
import { ChestSummary, ChestSummaryFilterForm } from "@/types/chest-summery";
import { useQueryClient } from "@tanstack/react-query";
import { Wallet, Building2, CheckCircle2, ArrowRightLeft } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const denominations = [
  { label: "2000", value: 2000, key: "note_2000_sum" },
  { label: "500", value: 500, key: "note_500_sum" },
  { label: "200", value: 200, key: "note_200_sum" },
  { label: "100", value: 100, key: "note_100_sum" },
  { label: "50", value: 50, key: "note_50_sum" },
  { label: "20", value: 20, key: "note_20_sum" },
  { label: "10", value: 10, key: "note_10_sum" },
  { label: "Coin 5", value: 5, key: "coin_5_sum" },
] as const;

const CashDepositDashboard = () => {
  // -----------------------
  // React Hook Form
  // -----------------------
  const { control, watch } = useForm<ChestSummaryFilterForm>({
    defaultValues: {
      chest: "All",
      status: "All",
    },
  });

  const selectedChest = watch("chest");
  const selectedStatus = watch("status");

  // -----------------------
  // React Query
  // -----------------------
  const { data: summary, isLoading } = UseRQ<ChestSummary[]>(
    ["summary", selectedChest, selectedStatus],
    () =>
      getAllChestSummary({
        chest: selectedChest !== "All" ? selectedChest : undefined,
        status: selectedStatus !== "All" ? selectedStatus : undefined,
      }),
  );
  const queryclient = useQueryClient();
  // -----------------------
  // Derived Dropdowns
  // -----------------------
  const uniqueChests = ["All", "office", "godown"];

  const uniqueStatuses = ["All", "Settled", "Submitted"];
  // -----------------------
  // Client-side Filtering (RESTORED ✅)
  // -----------------------
  const filteredData = useMemo(() => {
    return summary?.filter((item) => {
      const chestMatch =
        selectedChest === "All" || item.chest_name === selectedChest;

      const statusMatch =
        selectedStatus === "All" || item.status === selectedStatus;

      return chestMatch && statusMatch;
    });
  }, [summary, selectedChest, selectedStatus]);

  const handleCashAdjustment = async (data: any) => {
    try {
      const result = await makeAdjustment(data);
      if (result.success) {
        queryclient.invalidateQueries({ queryKey: ["summary"] });
        toast.success(result.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }

    // Handle the submission - send to API, update state, etc.
  };
  // -----------------------
  // Totals
  // -----------------------
  const grandTotalAmount = useMemo(() => {
    return filteredData?.reduce(
      (acc, curr) => acc + parseFloat(curr.total_amount_sum || "0"),
      0,
    );
  }, [filteredData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // -----------------------
  // Loader (NO UI CHANGE)
  // -----------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading cash summary...</p>
        </div>
      </div>
    );
  }

  // -----------------------
  // UI (UNCHANGED)
  // -----------------------
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-indigo-600" />
              Cash Deposit Breakdown
            </h1>
            <p className="text-slate-500 mt-1">
              Generate deposit slips by filtering chest and status.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <CashAdjustmentDialog onSubmit={handleCashAdjustment} />
            {/* Chest */}
            <div className="relative">
              <div className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none">
                <Building2 className="w-4 h-4" />
              </div>
              <Controller
                name="chest"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="pl-9 pr-8 py-2 h-10 w-full sm:w-40 bg-slate-50 border border-slate-200 rounded-md text-sm"
                  >
                    {uniqueChests.map((chest) => (
                      <option key={chest} value={chest}>
                        {chest === "All" ? "All Chests" : chest}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Status */}
            <div className="relative">
              <div className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="pl-9 pr-8 py-2 h-10 w-full sm:w-40 bg-slate-50 border border-slate-200 rounded-md text-sm"
                  >
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "All" ? "All Statuses" : status}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold sticky left-0 bg-slate-50">
                    Denomination
                  </th>

                  {filteredData?.map((item, ind) => (
                    <th key={ind} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-slate-900 font-bold capitalize">
                          {item.chest_name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full mt-1 ${
                            item.status === "Settled"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </th>
                  ))}

                  <th className="px-6 py-4 text-right">Total Qty</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                </tr>
              </thead>

              <tbody>
                {denominations?.map((denom) => {
                  const rowTotalQty = filteredData?.reduce(
                    (acc, item) => acc + (item[denom.key] || 0),
                    0,
                  );

                  let rowTotalAmount = rowTotalQty || 0 * denom.value;
                  return (
                    <tr key={denom.key}>
                      <td className="px-6 py-3 sticky left-0 bg-white">
                        ₹{denom.value}
                      </td>

                      {filteredData?.map((item, ind) => (
                        <td key={ind} className="px-6 py-3 text-center">
                          {item[denom.key] || "-"}
                        </td>
                      ))}

                      <td className="px-6 py-3 text-right">
                        {rowTotalQty || "-"}
                      </td>
                      <td className="px-6 py-3 text-right font-bold">
                        {rowTotalQty
                          ? formatCurrency(rowTotalAmount * denom.value)
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot className="bg-slate-900 text-white">
                <tr>
                  <td className="px-6 py-4 font-bold sticky left-0 bg-slate-900">
                    Grand Total
                  </td>

                  {filteredData?.map((item, ind) => (
                    <td key={ind} className="px-6 py-4 text-center text-xs">
                      {formatCurrency(parseFloat(item.total_amount_sum))}
                    </td>
                  ))}

                  <td className="px-6 py-4 text-right font-bold">
                    {denominations?.reduce((total, denom) => {
                      const rowTotalQty =
                        filteredData?.reduce(
                          (acc, item) => acc + (item[denom?.key] || 0),
                          0,
                        ) || 0;
                      return total + rowTotalQty;
                    }, 0)}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-xl">
                    {formatCurrency(grandTotalAmount as number)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-slate-500">Selected Chests</p>
            <p className="text-lg font-bold capitalize">
              {selectedChest === "All" ? "All Locations" : selectedChest}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-slate-500">Selected Status</p>
            <p className="text-lg font-bold capitalize">
              {selectedStatus === "All" ? "All Statuses" : selectedStatus}
            </p>
          </div>

          <div className="bg-indigo-600 p-4 rounded-xl text-white shadow-md">
            <p className="text-sm text-indigo-200">Net Deposit Amount</p>
            <p className="text-2xl font-bold">
              {formatCurrency(grandTotalAmount as number)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashDepositDashboard;
