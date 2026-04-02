"use client";
import { useState, useMemo } from "react";
import {
  CalendarDays,
  Warehouse,
  PackageCheck,
  ReceiptText,
  Users,
  IndianRupee,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { purchaseReport } from "@/services/client_api-Service/user/purchase/purchase_api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface LineItem {
  qty: number;
  product_name: string;
  return_qty: number;
  return_product_name: string;
}

interface StaffAmount {
  user_id: string;
  user_name: string;
  amount: number;
}

interface Bill {
  id: string;
  sap_number: string;
  bill_date: string;
  tax_invoice_number: string;
  unloading_date: string;
  warehouse_name: string;
  total_full_qty: string;
  line_items: LineItem[];
  per_user_amount: StaffAmount[] | null;
}

type ViewMode = "day" | "month";

const BADGE_PALETTE = [
  "border-sky-300 text-sky-700 bg-sky-50",
  "border-emerald-300 text-emerald-700 bg-emerald-50",
  "border-violet-300 text-violet-700 bg-violet-50",
  "border-rose-300 text-rose-700 bg-rose-50",
  "border-amber-300 text-amber-700 bg-amber-50",
  "border-teal-300 text-teal-700 bg-teal-50",
  "border-orange-300 text-orange-700 bg-orange-50",
  "border-pink-300 text-pink-700 bg-pink-50",
];

function getBadgeClass(index: number): string {
  return BADGE_PALETTE[index % BADGE_PALETTE.length];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function toDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function parseBills(raw: any[]): Bill[] {
  return (raw ?? []).map((d) => ({
    ...d,
    line_items:
      typeof d.line_items === "string"
        ? JSON.parse(d.line_items)
        : d.line_items,
    per_user_amount:
      typeof d.per_user_amount === "string"
        ? JSON.parse(d.per_user_amount)
        : d.per_user_amount,
  }));
}

function totalPayout(bill: Bill): number {
  return (
    bill.per_user_amount?.reduce((sum, u) => sum + Number(u.amount), 0) ?? 0
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function UnloadingDashboard() {
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);

  // ── View mode: day (range) or month ─────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>("day");

  // ── Day/range state — default: today → today ─────────────────────────────────
  const [fromDate, setFromDate] = useState<Date>(today);
  const [toDate, setToDate] = useState<Date>(today);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // ── Month state ──────────────────────────────────────────────────────────────
  const [selectedMonth, setSelectedMonth] = useState<number>(
    today.getMonth() + 1,
  ); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  // ── Shared ───────────────────────────────────────────────────────────────────
  const [warehouse, setWarehouse] = useState("ALL");

  // ── Build query params based on mode ─────────────────────────────────────────
  const queryParams = useMemo(() => {
    if (viewMode === "month") {
      return { warehouse, month: selectedMonth, year: selectedYear };
    }
    return {
      warehouse,
      from: toDateKey(fromDate),
      to: toDateKey(toDate),
    };
  }, [viewMode, warehouse, fromDate, toDate, selectedMonth, selectedYear]);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["purchase-report", queryParams],
    queryFn: () => purchaseReport(queryParams),
  });

  const bills: Bill[] = useMemo(
    () => parseBills(apiResponse?.data ?? []),
    [apiResponse],
  );

  const allWarehouses = useMemo(
    () => [...new Set(bills.map((b) => b.warehouse_name))].sort(),
    [bills],
  );

  const activeProducts = useMemo(() => {
  const found = new Set(bills.flatMap((b) => b.line_items.map((l) => l.product_name)));
  return [...found].sort();
}, [bills]);
const productBadgeClass = useMemo(() => {
  const map: Record<string, string> = {};
  activeProducts.forEach((p, i) => { map[p] = getBadgeClass(i); });
  return map;
}, [activeProducts]);
  const activeStaff = useMemo(() => {
    const names = new Set(
      bills.flatMap((b) => b.per_user_amount?.map((u) => u.user_name) ?? []),
    );
    return [...names].sort();
  }, [bills]);

  const grouped = useMemo(() => {
    const map: Record<string, Bill[]> = {};
    bills.forEach((b) => {
      (map[b.warehouse_name] ??= []).push(b);
    });
    return map;
  }, [bills]);

  const summary = useMemo(
    () => ({
      bills: bills.length,
      qty: bills.reduce((s, b) => s + Number(b.total_full_qty), 0),
      warehouses: Object.keys(grouped).length,
      payout: bills.reduce((s, b) => s + totalPayout(b), 0),
    }),
    [bills, grouped],
  );

  // ── Grand totals for the footer row ──────────────────────────────────────────
  const grandTotals = useMemo(() => {
    const productTotals: Record<string, number> = {};
    activeProducts.forEach((p) => {
    productTotals[p] = bills.reduce((sum, b) => {
      // BEFORE: const li = b.line_items.find((l) => l.product_name === p);
      // AFTER:
      const qty = b.line_items
        .filter((l) => l.product_name === p)
        .reduce((s, l) => s + Number(l.qty), 0);
      return sum + qty;
    }, 0);
  });

    const staffTotals: Record<string, number> = {};
    activeStaff.forEach((s) => {
      staffTotals[s] = bills.reduce((sum, b) => {
        const entry = b.per_user_amount?.find((u) => u.user_name === s);
        return sum + (entry ? Number(entry.amount) : 0);
      }, 0);
    });

    return {
      qty: summary.qty,
      payout: summary.payout,
      productTotals,
      staffTotals,
    };
  }, [bills, activeProducts, activeStaff, summary]);

  // ── Year options (current year ± 5) ──────────────────────────────────────────
  const yearOptions = useMemo(() => {
    const y = today.getFullYear();
    return Array.from({ length: 6 }, (_, i) => y - 2 + i);
  }, [today]);

  // ── Label for table header ────────────────────────────────────────────────────
  const rangeLabel = useMemo(() => {
    if (viewMode === "month")
      return `${MONTHS[selectedMonth - 1]} ${selectedYear}`;
    const from = formatDate(fromDate);
    const to = formatDate(toDate);
    return from === to ? from : `${from} — ${to}`;
  }, [viewMode, fromDate, toDate, selectedMonth, selectedYear]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap'); * { font-family: 'IBM Plex Sans', sans-serif; } .mono { font-family: 'IBM Plex Mono', monospace; }`}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Unloading Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Daily delivery & unloading operations tracker
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-5 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-5">
            {/* View mode toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                View By
              </label>
              <div className="flex rounded-md border border-slate-200 overflow-hidden h-9">
                {(["day", "month"] as ViewMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-4 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      viewMode === m
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Day mode: from → to range */}
            {viewMode === "day" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> From
                  </label>
                  <Popover open={fromOpen} onOpenChange={setFromOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-44 justify-between text-slate-700 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-slate-400" />
                          {formatDate(fromDate)}
                        </span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={(d) => {
                          if (d) {
                            setFromDate(d);
                            // if from > to, snap to to = from
                            if (d > toDate) setToDate(d);
                            setFromOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> To
                  </label>
                  <Popover open={toOpen} onOpenChange={setToOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-44 justify-between text-slate-700 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-slate-400" />
                          {formatDate(toDate)}
                        </span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={(d) => {
                          if (d) {
                            setToDate(d);
                            if (d < fromDate) setFromDate(d);
                            setToOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {/* Month mode: month + year dropdowns */}
            {viewMode === "month" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Month
                  </label>
                  <Select
                    value={String(selectedMonth)}
                    onValueChange={(v) => setSelectedMonth(Number(v))}
                  >
                    <SelectTrigger className="w-36 text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m, i) => (
                        <SelectItem key={m} value={String(i + 1)}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays size={12} /> Year
                  </label>
                  <Select
                    value={String(selectedYear)}
                    onValueChange={(v) => setSelectedYear(Number(v))}
                  >
                    <SelectTrigger className="w-28 text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Warehouse filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Warehouse size={12} /> Warehouse
              </label>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger className="w-48 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Warehouse size={14} className="text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Warehouses</SelectItem>
                  {allWarehouses.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      {!isLoading && bills.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Total Bills",
              value: summary.bills,
              icon: <ReceiptText size={16} className="text-slate-400" />,
              color: "text-slate-700",
            },
            {
              label: "Total Qty",
              value: summary.qty.toLocaleString(),
              icon: <PackageCheck size={16} className="text-emerald-400" />,
              color: "text-emerald-700",
            },
            {
              label: "Warehouses",
              value: summary.warehouses,
              icon: <Warehouse size={16} className="text-sky-400" />,
              color: "text-sky-700",
            },
            {
              label: "Total Payout",
              value: `₹${summary.payout.toLocaleString()}`,
              icon: <IndianRupee size={16} className="text-amber-400" />,
              color: "text-amber-700",
            },
          ].map((s) => (
            <Card key={s.label} className="shadow-sm">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
                <p className={`text-2xl font-bold mono ${s.color}`}>
                  {s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 border-b bg-white">
          <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <CalendarDays size={14} />
            Bills for {rangeLabel}
            {warehouse !== "ALL" && (
              <span className="text-slate-400 font-normal">— {warehouse}</span>
            )}
          </CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
              <p className="text-sm font-medium">Loading records…</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <PackageCheck size={36} className="opacity-30" />
              <p className="text-sm font-medium">
                No records for this selection
              </p>
              <p className="text-xs">
                Pick a different date range or warehouse
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} /> Bill Date
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <Warehouse size={12} /> Warehouse / SAP
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <ReceiptText size={12} /> Invoice
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} /> Unload Date
                    </div>
                  </TableHead>
                  {activeProducts.map((p) => (
                    <TableHead key={p} className={`text-xs font-semibold uppercase tracking-wide ${productBadgeClass[p].split(" ").find(c => c.startsWith("text-"))}`}>

                      <div className="flex items-center gap-1">
                        <PackageCheck size={12} />
                        {p}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Total Qty
                  </TableHead>
                  {activeStaff.map((s) => (
                    <TableHead
                      key={s}
                      className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
                    >
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        {s}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <IndianRupee size={12} /> Payout
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Object.entries(grouped).map(([wh, whBills]) => (
                  <>
                    {/* Warehouse group header */}
                    <TableRow
                      key={`group-${wh}`}
                      className="bg-slate-100 hover:bg-slate-100 border-t-2 border-slate-200"
                    >
                      <TableCell
                       
                        colSpan={
                          4 + activeProducts.length + activeStaff.length + 2
                        }
                        className="py-2 px-4"
                      >
                        <div className="flex items-center gap-2">
                          <Warehouse size={13} className="text-slate-500" />
                          <span className="text-xs font-semibold text-slate-700">
                            {wh}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0 h-4"
                          >
                            {whBills.length} bill{whBills.length > 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Bill rows */}
                    {whBills.map((bill) => (
                      <TableRow key={bill.id} className="hover:bg-slate-50/80">
                        <TableCell className="font-semibold text-xs text-red-400">
                          {bill.bill_date}
                        </TableCell>
                        <TableCell className="mono text-xs font-medium text-sky-700 pl-8">
                          {bill.sap_number}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 mono">
                          {bill.tax_invoice_number}
                        </TableCell>
                        <TableCell className="mono text-xs text-slate-500">
                          {bill.unloading_date ?? (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>

                        {/* {activeProducts.map((p) => {
                          const li = bill.line_items.find(
                            (l) => l.product_name === p,
                          );
                          return (
                            <TableCell key={p}>
                              {li ? (
                                <Badge variant="outline" className={`${productBadgeClass[p]} mono text-xs`}>{li.qty}</Badge>

                              ) : (
                                <span className="text-slate-200">—</span>
                              )}
                            </TableCell>
                          );
                        })} */}
                        {activeProducts.map((p) => {
  const totalQty = bill.line_items
    .filter((l) => l.product_name === p)
    .reduce((sum, l) => sum + Number(l.qty), 0);

  return (
    <TableCell key={p}>
      {totalQty > 0
        ? <Badge variant="outline" className={`${productBadgeClass[p]} mono text-xs`}>{totalQty}</Badge>
        : <span className="text-slate-200">—</span>}
    </TableCell>
  );
})}

                        <TableCell className="mono text-sm font-semibold text-slate-700">
                          {bill.total_full_qty}
                        </TableCell>

                        {activeStaff.map((s) => {
                          const entry = bill.per_user_amount?.find(
                            (u) => u.user_name === s,
                          );
                          return (
                            <TableCell
                              key={s}
                              className="mono text-sm text-amber-600"
                            >
                              {entry ? (
                                `₹${Number(entry.amount).toLocaleString()}`
                              ) : (
                                <span className="text-slate-200">—</span>
                              )}
                            </TableCell>
                          );
                        })}

                        <TableCell className="mono text-sm font-semibold text-amber-700">
                          {totalPayout(bill) > 0 ? (
                            `₹${totalPayout(bill).toLocaleString()}`
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}

                {/* ── Grand Total footer row ── */}
                <TableRow className="bg-slate-800 hover:bg-slate-800 border-t-2 border-slate-600 sticky bottom-0">
                  <TableCell className="py-3 px-4 text-xs font-bold text-white uppercase tracking-wide">
                    Grand Total
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 mono">
                    {summary.bills} bill{summary.bills !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell /> {/* bill date — no total */}
                  <TableCell /> {/* unload date — no total */}
                  {activeProducts.map((p) => (
                    <TableCell
                      key={p}
                      className="mono text-sm font-bold text-white"
                    >
                      {grandTotals.productTotals[p] > 0 ? (
                        grandTotals.productTotals[p].toLocaleString()
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="mono text-sm font-bold text-emerald-300">
                    {grandTotals.qty.toLocaleString()}
                  </TableCell>
                  {activeStaff.map((s) => (
                    <TableCell
                      key={s}
                      className="mono text-sm font-bold text-amber-300"
                    >
                      {grandTotals.staffTotals[s] > 0 ? (
                        `₹${grandTotals.staffTotals[s].toLocaleString()}`
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="mono text-sm font-bold text-amber-300">
                    ₹{grandTotals.payout.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
