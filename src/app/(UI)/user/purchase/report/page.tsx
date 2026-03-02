"use client";
import { useState, useMemo, useEffect } from "react";
import { CalendarDays, Warehouse, PackageCheck, ReceiptText, Users, IndianRupee, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  tax_invoice_number: string;
  unloading_date: string;
  warehouse_name: string;
  total_full_qty: string;
  line_items: LineItem[];
  per_user_amount: StaffAmount[] | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PRODUCT_ORDER = ["19 FULL", "14 FULL", "5 BLUE FULL"] as const;

const PRODUCT_BADGE: Record<string, string> = {
  "19 FULL":     "border-sky-300 text-sky-700 bg-sky-50",
  "14 FULL":     "border-emerald-300 text-emerald-700 bg-emerald-50",
  "5 BLUE FULL": "border-violet-300 text-violet-700 bg-violet-50",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function toDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // "YYYY-MM-DD"
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function parseBills(raw: any[]): Bill[] {
  return (raw ?? []).map((d) => ({
    ...d,
    line_items: typeof d.line_items === "string" ? JSON.parse(d.line_items) : d.line_items,
    per_user_amount:
      typeof d.per_user_amount === "string" ? JSON.parse(d.per_user_amount) : d.per_user_amount,
  }));
}

function totalPayout(bill: Bill): number {
  return bill.per_user_amount?.reduce((sum, u) => sum + Number(u.amount), 0) ?? 0;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function UnloadingDashboard() {
  const today = useMemo(() => new Date(), []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calOpen, setCalOpen] = useState(false);
  const [warehouse, setWarehouse] = useState("ALL");

  const dateKey = toDateKey(selectedDate);

  // ── Fetch data from API — re-fetches when date or warehouse changes ──────────
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["purchase-report", dateKey, warehouse],
    queryFn: () => purchaseReport({ date: dateKey, warehouse }),
  });

  const bills: Bill[] = useMemo(
    () => parseBills(apiResponse?.data ?? []),
    [apiResponse]
  );

  // All unique warehouses from the current result set (for the dropdown)
  // On initial load (ALL selected), this populates from today's data
  const allWarehouses = useMemo(
    () => [...new Set(bills.map((b) => b.warehouse_name))].sort(),
    [bills]
  );

  // Products present in the bills (respecting preferred order)
  const activeProducts = useMemo(() => {
    const found = new Set(bills.flatMap((b) => b.line_items.map((l) => l.product_name)));
    return PRODUCT_ORDER.filter((p) => found.has(p));
  }, [bills]);

  // Staff names present in the bills
  const activeStaff = useMemo(() => {
    const names = new Set(bills.flatMap((b) => b.per_user_amount?.map((u) => u.user_name) ?? []));
    return [...names].sort();
  }, [bills]);

  // Group bills by warehouse for rendering
  const grouped = useMemo(() => {
    const map: Record<string, Bill[]> = {};
    bills.forEach((b) => {
      (map[b.warehouse_name] ??= []).push(b);
    });
    return map;
  }, [bills]);

  // Summary totals
  const summary = useMemo(() => ({
    bills: bills.length,
    qty: bills.reduce((s, b) => s + Number(b.total_full_qty), 0),
    warehouses: Object.keys(grouped).length,
    payout: bills.reduce((s, b) => s + totalPayout(b), 0),
  }), [bills, grouped]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap'); * { font-family: 'IBM Plex Sans', sans-serif; } .mono { font-family: 'IBM Plex Mono', monospace; }`}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Unloading Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Daily delivery & unloading operations tracker</p>
      </div>

      {/* Filters */}
      <Card className="mb-5 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-5">

            {/* Date picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <CalendarDays size={12} /> Unloading Date
              </label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-between text-slate-700 font-medium">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-slate-400" />
                      {formatDate(selectedDate)}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { if (d) { setSelectedDate(d); setCalOpen(false); } }}
                    // No disabled dates — user can freely pick any date
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Warehouse filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Warehouse size={12} /> Warehouse
              </label>
              <Select value={warehouse} onValueChange={(val) => setWarehouse(val)}>
                <SelectTrigger className="w-48 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Warehouse size={14} className="text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Warehouses</SelectItem>
                  {allWarehouses.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
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
            { label: "Total Bills",  value: summary.bills,                         icon: <ReceiptText size={16} className="text-slate-400" />,   color: "text-slate-700" },
            { label: "Total Qty",    value: summary.qty.toLocaleString(),           icon: <PackageCheck size={16} className="text-emerald-400" />, color: "text-emerald-700" },
            { label: "Warehouses",   value: summary.warehouses,                    icon: <Warehouse size={16} className="text-sky-400" />,        color: "text-sky-700" },
            { label: "Total Payout", value: `₹${summary.payout.toLocaleString()}`, icon: <IndianRupee size={16} className="text-amber-400" />,    color: "text-amber-700" },
          ].map((s) => (
            <Card key={s.label} className="shadow-sm">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center gap-1.5 mb-1">{s.icon}<p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{s.label}</p></div>
                <p className={`text-2xl font-bold mono ${s.color}`}>{s.value}</p>
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
            Bills for {formatDate(selectedDate)}
            {warehouse !== "ALL" && <span className="text-slate-400 font-normal">— {warehouse}</span>}
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
              <p className="text-sm font-medium">No records for this selection</p>
              <p className="text-xs">Pick a different date or warehouse</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1"><Warehouse size={12} /> Warehouse / SAP</div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1"><ReceiptText size={12} /> Invoice</div>
                  </TableHead>
                  {activeProducts.map((p) => (
                    <TableHead key={p} className={`text-xs font-semibold uppercase tracking-wide ${PRODUCT_BADGE[p].split(" ").find(c => c.startsWith("text-"))}`}>
                      <div className="flex items-center gap-1"><PackageCheck size={12} />{p}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Qty</TableHead>
                  {activeStaff.map((s) => (
                    <TableHead key={s} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <div className="flex items-center gap-1"><Users size={12} />{s}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                    <div className="flex items-center gap-1"><IndianRupee size={12} /> Payout</div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Object.entries(grouped).map(([wh, whBills]) => (
                  <>
                    <TableRow key={`group-${wh}`} className="bg-slate-100 hover:bg-slate-100 border-t-2 border-slate-200">
                      <TableCell colSpan={2 + activeProducts.length + activeStaff.length + 2} className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <Warehouse size={13} className="text-slate-500" />
                          <span className="text-xs font-semibold text-slate-700">{wh}</span>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">{whBills.length} bill{whBills.length > 1 ? "s" : ""}</Badge>
                        </div>
                      </TableCell>
                    </TableRow>

                    {whBills.map((bill) => (
                      <TableRow key={bill.id} className="hover:bg-slate-50/80">
                        <TableCell className="mono text-xs font-medium text-sky-700 pl-8">{bill.sap_number}</TableCell>
                        <TableCell className="text-xs text-slate-500 mono">{bill.tax_invoice_number}</TableCell>

                        {activeProducts.map((p) => {
                          const li = bill.line_items.find((l) => l.product_name === p);
                          return (
                            <TableCell key={p}>
                              {li
                                ? <Badge variant="outline" className={`${PRODUCT_BADGE[p]} mono text-xs`}>{li.qty}</Badge>
                                : <span className="text-slate-200">—</span>}
                            </TableCell>
                          );
                        })}

                        <TableCell className="mono text-sm font-semibold text-slate-700">{bill.total_full_qty}</TableCell>

                        {activeStaff.map((s) => {
                          const entry = bill.per_user_amount?.find((u) => u.user_name === s);
                          return (
                            <TableCell key={s} className="mono text-sm text-amber-600">
                              {entry ? `₹${Number(entry.amount).toLocaleString()}` : <span className="text-slate-200">—</span>}
                            </TableCell>
                          );
                        })}

                        <TableCell className="mono text-sm font-semibold text-amber-700">
                          {totalPayout(bill) > 0 ? `₹${totalPayout(bill).toLocaleString()}` : <span className="text-slate-300">—</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}