
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateClosingStock, captureCanvas, formatDate, formatINR, OpeningStockItem, ReportProduct, SaleItemForStock } from "@/lib/helper/reportSlip";
import { DeliveryReportData } from "@/types/deliverySlip";
import { ChevronDown, Download, Loader2, Share2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";





// ─── Pure helpers (defined once, never recreated) ────────────────────────────

function filterOpeningStock(stock: OpeningStockItem[]): OpeningStockItem[] {
  return stock.filter(
    (p) => !p.tags?.includes("DC") && !p.tags?.includes("service"),
  );
}

const NOTE_LABEL_MAP: Record<string, string> = {
  coin_5: "₹5 Coin",
  note_10: "₹10",
  note_20: "₹20",
  note_50: "₹50",
  note_100: "₹100",
  note_200: "₹200",
  note_500: "₹500",
  note_2000: "₹2000",
};

function noteLabel(key: string) {
  return NOTE_LABEL_MAP[key] ?? key;
}


// ─── Shared sub-components ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: 8, marginTop: 0 }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px dashed #e4e4e7", margin: "10px 0" }} />;
}

function Row({ label, value, valueColor = "#18181b", sub }: {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
      <span style={{ color: "#71717a", fontSize: 13, flexShrink: 0, paddingRight: 8 }}>{label}</span>
      <span style={{ textAlign: "right" }}>
        <span style={{ fontSize: 13, display: "block", color: valueColor, fontWeight: 600 }}>{value}</span>
        {sub && (
          <span style={{ fontSize: 11, color: "#a1a1aa", display: "block", wordBreak: "break-all" }}>{sub}</span>
        )}
      </span>
    </div>
  );
}

function DeductRow({ label, sub, amount, type }: {
  label: string;
  sub?: string;
  amount: number;
  type: "add" | "deduct";
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
      <span style={{ fontSize: 13, color: "#52525b", flex: 1, paddingRight: 8 }}>
        {label}
        {sub && <span style={{ display: "block", fontSize: 11, color: "#a1a1aa", wordBreak: "break-all" }}>{sub}</span>}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: type === "deduct" ? "#dc2626" : "#16a34a", flexShrink: 0 }}>
        {type === "deduct" ? "−" : "+"}₹{formatINR(amount)}
      </span>
    </div>
  );
}

// Pill extracted so StockGrid re-renders don't recreate it inline
function StockPill({ item }: {
  item: { product_id: string; product_name: string; qty: number; tags?: string[] };
}) {
  return (
    <div style={{ border: "1px solid #e4e4e7", borderRadius: 8, padding: "6px 10px", minWidth: 72, textAlign: "center", backgroundColor: "#f9fafb" }}>
      <p style={{ fontSize: 11, color: "#52525b", margin: "0 0 3px 0", lineHeight: 1.3 }}>{item.product_name}</p>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#18181b", margin: 0 }}>{item.qty}</p>
    </div>
  );
}

function StockGrid({ items, label }: {
  items: { product_id: string; product_name: string; qty: number; tags?: string[] }[];
  label: string;
}) {
  const [showAll, setShowAll] = useState(false);

  // Memoize partition so it only recomputes when items change
  const { primaryItems, hiddenItems, visibleItems } = useMemo(() => {
    const primary = items.filter((i) => i.tags?.includes("full"));
    const hidden = items.filter((i) => !i.tags?.includes("full"));
    return {
      primaryItems: primary,
      hiddenItems: hidden,
      visibleItems: showAll ? items : primary.length > 0 ? primary : items,
    };
  }, [items, showAll]);

  const toggle = useCallback(() => setShowAll((p) => !p), []);

  if (items.length === 0) return null;

  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
        {visibleItems.map((item) => (
          <StockPill key={item.product_id} item={item} />
        ))}
      </div>
      {hiddenItems.length > 0 && (
        <button
          onClick={toggle}
          style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 11, color: "#6366f1", background: "none", border: "none", padding: "2px 0 6px", cursor: "pointer" }}
        >
          <ChevronDown style={{ width: 12, height: 12, transition: "transform 0.2s", transform: showAll ? "rotate(180deg)" : "rotate(0deg)" }} />
          {showAll ? "Show less" : `+${hiddenItems.length} more`}
        </button>
      )}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function SalesReportDialog({
  salesSlipId,
  reportData,
  isLoading,
  isFetching,
  warehouses,
  users,
  openingStock = [],
  products = [],
}: {
  warehouses: { id: string; name: string }[];
  users: { id: string; user_name: string }[];
  salesSlipId: string;
  reportData?: DeliveryReportData;
  isLoading: boolean;
  isFetching: boolean;
  openingStock?: OpeningStockItem[];
  products?: ReportProduct[];
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  // ── Derived maps — only rebuild when source arrays change ────────────────
  const warehouseMap = useMemo(
    () => Object.fromEntries(warehouses.map((w) => [w.id, w.name])),
    [warehouses],
  );

  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.user_name])),
    [users],
  );

  // Single productMap shared by both closing-stock calc and sales-item display
  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products],
  );

  const filteredOpeningStock = useMemo(
    () => filterOpeningStock(openingStock),
    [openingStock],
  );

  const salesForStock = useMemo<SaleItemForStock[]>(
    () =>
      (reportData?.sales_items ?? []).map((item) => ({
        productId: item.product_id ?? item.line_item_id,
        productName: (item as any).product_name ?? "",
        quantity: item.qty,
        isComposite: !!(item.components && item.components.length > 0),
        components: item.components?.map((c) => ({
          qty: c.qty,
          child_product_id: c.child_product_id,
        })),
      })),
    [reportData?.sales_items],
  );

  const closingStock = useMemo(
    () => calculateClosingStock(filteredOpeningStock, salesForStock, productMap),
    [filteredOpeningStock, salesForStock, productMap],
  );

  // ── Cash denominations ───────────────────────────────────────────────────
  const { noteEntries, denomTotal } = useMemo(() => {
    const entries = Object.entries(reportData?.cash_chest.notes ?? {}).filter(
      ([, v]) => v > 0,
    );
    const total = entries.reduce((acc, [key, qty]) => {
      const val = parseInt(key.replace("note_", "").replace("coin_", ""));
      return acc + val * qty;
    }, 0);
    return { noteEntries: entries, denomTotal: total };
  }, [reportData?.cash_chest.notes]);

  // ── UPI / online flags ───────────────────────────────────────────────────
  const { upiPayments, showUpiAggregate, onlinePayments, showOnlineAggregate } =
    useMemo(() => {
      const upi: { id: string; upi_id?: string; amount: number }[] =
        (reportData as any)?.upi_payments ?? [];
      const online: { id: string; consumer_no?: string; amount: number }[] =
        (reportData as any)?.online_payments ?? [];
      return {
        upiPayments: upi,
        showUpiAggregate: upi.length === 0 && (reportData?.totals.total_upi_amount ?? 0) > 0,
        onlinePayments: online,
        showOnlineAggregate: online.length === 0 && (reportData?.totals.total_online_amount ?? 0) > 0,
      };
    }, [reportData]);

  // ── Date & display strings — stable as long as reportData doesn't change ─
  const { dateFormatted, day, warehouseName, deliveryBoyNames } = useMemo(() => {
    if (!reportData) return { dateFormatted: "", day: "", warehouseName: "", deliveryBoyNames: "" };
    const { formatted, day } = formatDate(reportData.sales_slip.date);
    return {
      dateFormatted: formatted,
      day,
      warehouseName: warehouseMap[reportData.sales_slip.warehouse_id] ?? reportData.sales_slip.warehouse_id,
      deliveryBoyNames: (reportData.delivery_boys ?? [])
        .map((id) => userMap[id] ?? "staff")
        .join(", "),
    };
  }, [reportData, warehouseMap, userMap]);

  // ── Stable action handlers ───────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!reportRef.current) return;
    setSharing(true);
    try {
      const canvas = await captureCanvas(reportRef.current);
      const link = document.createElement("a");
      link.download = `sales-report-${salesSlipId.slice(0, 8)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setSharing(false);
    }
  }, [salesSlipId]);

  const handleShare = useCallback(async () => {
    if (!reportRef.current) return;
    setSharing(true);
    try {
      const canvas = await captureCanvas(reportRef.current);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "sales-report.png", { type: "image/png" });
        try {
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: "Sales Report" });
          } else {
            window.open(`https://wa.me/?text=${encodeURIComponent("Sales Report")}`, "_blank");
          }
        } finally {
          setSharing(false);
        }
      }, "image/png");
    } catch (e) {
      console.error("Share failed", e);
      setSharing(false);
    }
  }, []); // no deps — uses only ref + stable setSharing

  // ── Early returns (after all hooks) ─────────────────────────────────────
  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col gap-3 p-6">
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-6 w-full" />)}
      </div>
    );
  }

  if (!reportData) {
    return <p className="p-6 text-muted-foreground text-sm">No report data found.</p>;
  }

  const d = reportData;
  const totalUpi = d.totals.total_upi_amount;
  const totalOnline = d.totals.total_online_amount;
  const totalSales = d.totals.total_sales_amount;

  return (
    <div className="flex flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex gap-2 justify-end px-1">
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={sharing} className="gap-2">
          {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download
        </Button>
        <Button size="sm" onClick={handleShare} disabled={sharing} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          Share
        </Button>
      </div>

      {/* Printable Report */}
      <div
        ref={reportRef}
        style={{ backgroundColor: "#ffffff", color: "#18181b", borderRadius: 12, border: "1px solid #e4e4e7", overflow: "hidden", minWidth: 320, maxWidth: 480, margin: "0 auto", width: "100%" }}
      >
        {/* Header */}
        <div style={{ backgroundColor: "#18181b", color: "#fff", padding: "16px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#a1a1aa", marginBottom: 4, marginTop: 0 }}>Sales Report</p>
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{dateFormatted}</p>
          <p style={{ fontSize: 13, color: "#d4d4d8", marginTop: 2, marginBottom: 0 }}>{day}</p>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <Row label="Warehouse" value={warehouseName} />
          <Row label="Delivery Boys" value={deliveryBoyNames || "—"} />

          <Divider />

          <StockGrid items={filteredOpeningStock} label="Opening Stock" />
          {filteredOpeningStock.length > 0 && <Divider />}

          {/* Sales Items */}
          <SectionLabel>Sales Items</SectionLabel>
          {d.sales_items?.map((item) => {
            const productName =
              (item as any).product_name ||
              productMap[item.product_id]?.product_name ||
              item.line_item_id ||
              "—";
            return (
              <div key={item?.line_item_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#3f3f46", flex: 1, paddingRight: 8 }}>
                  {productName}
                  <span style={{ fontSize: 11, color: "#a1a1aa", display: "block" }}>
                    {item.qty} × ₹{formatINR(item.rate ?? item.total / item.qty)}
                  </span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", flexShrink: 0 }}>
                  ₹{formatINR(item.total)}
                </span>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #d4d4d8", paddingTop: 8, marginTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Total Sales</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>₹{formatINR(totalSales)}</span>
          </div>

          <Divider />

          <StockGrid items={closingStock} label="Closing Stock" />
          {closingStock.length > 0 && <Divider />}

          {/* Deductions */}
          <SectionLabel>Deductions</SectionLabel>

          {d.expenses.map((exp) => (
            <DeductRow key={exp.id} label={`Expense — ${exp.expenses_type}`} amount={exp.amount} type="deduct" />
          ))}

          {d.transactions.map((tx) => (
            <DeductRow
              key={tx.account_id}
              label={`Transaction (${tx.remark})`}
              amount={Math.abs(tx.amount_paid) > 0 ? tx.amount_paid : tx.amount_received}
              type={Math.abs(tx.amount_paid) > 0 ? "deduct" : "add"}
            />
          ))}

          {upiPayments.map((upi, ind) => (
            <DeductRow key={ind} label="UPI Payment" sub={upi.upi_id ? `ID: ${upi.upi_id}` : undefined} amount={upi.amount} type="deduct" />
          ))}
          {showUpiAggregate && <DeductRow label="UPI Payment" amount={totalUpi} type="deduct" />}

          {onlinePayments.map((op, ind) => (
            <DeductRow key={ind} label="Online Payment" sub={op.consumer_no ? `Ref: ${op.consumer_no}` : undefined} amount={op.amount} type="deduct" />
          ))}
          {showOnlineAggregate && <DeductRow label="Online Payment" amount={totalOnline} type="deduct" />}

          <Divider />

          {/* Cash Denomination */}
          <SectionLabel>Cash Denomination</SectionLabel>
          {noteEntries.map(([key, qty]) => {
            const faceVal = parseInt(key.replace("note_", "").replace("coin_", ""));
            return (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, color: "#52525b" }}>{noteLabel(key)} × {qty}</span>
                <span style={{ fontSize: 13, color: "#52525b", flexShrink: 0 }}>₹{formatINR(faceVal * qty)}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #d4d4d8", paddingTop: 6, marginTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Denomination Total</span>
            <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>₹{formatINR(denomTotal)}</span>
          </div>

          <Divider />

          <Row
            label="Chest Location"
            value={d.cash_chest.chest_name?.toUpperCase() ?? "—"}
            valueColor={d.cash_chest.chest_name === "office" ? "#16a34a" : "#ea580c"}
          />
          <Row
            label="Slip Status"
            value={d.sales_slip.status ?? "—"}
            valueColor={d.sales_slip.status?.toLowerCase().includes("submit") ? "#ea580c" : "#16a34a"}
          />

          <Divider />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#18181b" }}>Cash to Pay / Deposit</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#16a34a", flexShrink: 0 }}>₹{formatINR(denomTotal)}</span>
          </div>

          {d.sales_slip.remark && (
            <p style={{ fontSize: 11, color: "#a1a1aa", marginTop: 10, marginBottom: 0 }}>
              Remark: {d.sales_slip.remark}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#f4f4f5", textAlign: "center", padding: "8px 20px", fontSize: 10, color: "#a1a1aa", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Generated · {new Date().toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}