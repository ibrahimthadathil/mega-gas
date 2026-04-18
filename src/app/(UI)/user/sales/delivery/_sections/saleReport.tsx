// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { DeliveryReportData } from "@/types/deliverySlip";
// import { ChevronDown, Download, Loader2, Share2 } from "lucide-react";
// import { useCallback, useRef, useState } from "react";

// // ─── Stock-related types ─────────────────────────────────────────────────────
// interface OpeningStockItem {
//   product_id: string;
//   product_name: string;
//   qty: number;
//   tags: string[];
// }

// interface ReportProduct {
//   id: string;
//   product_name: string;
//   tags: string[];
// }

// interface SaleItemForStock {
//   productId: string;
//   productName: string;
//   quantity: number;
//   isComposite: boolean;
//   components?: Array<{ qty: number; child_product_id: string }> | null;
// }

// interface ClosingStockEntry {
//   product_id: string;
//   product_name: string;
//   qty: number;
//   tags: string[];
// }

// // ─── Mirrors OldStockSection filter: exclude DC & service tags ───────────────
// function filterOpeningStock(stock: OpeningStockItem[]): OpeningStockItem[] {
//   return stock.filter(
//     (p) => !p.tags?.includes("DC") && !p.tags?.includes("service"),
//   );
// }

// // ─── Mirrors calculateClosingStock from ClosingStockSection exactly ──────────
// // - Composite sales deduct their components; simple sales deduct the product itself
// // - Products with no name fall back to the products master (same as original)
// // - Only items tagged "clossing_stock" (preserves original typo) are included
// // - Zero-qty rows are excluded
// function calculateClosingStock(
//   openingStock: OpeningStockItem[],
//   salesData: SaleItemForStock[],
//   products: ReportProduct[],
// ): ClosingStockEntry[] {
//   const stockMap: Record<string, { qty: number; product_name: string }> = {};

//   // A. Seed from opening stock
//   openingStock.forEach((item) => {
//     stockMap[item.product_id] = {
//       qty: (stockMap[item.product_id]?.qty ?? 0) + item.qty,
//       product_name: item.product_name,
//     };
//   });

//   // B. Deduct sales
//   salesData.forEach((sale) => {
//     if (sale.isComposite && sale.components) {
//       sale.components.forEach((comp) => {
//         const deduction = sale.quantity * comp.qty;
//         if (!stockMap[comp.child_product_id]) {
//           stockMap[comp.child_product_id] = { qty: 0, product_name: "" };
//         }
//         stockMap[comp.child_product_id].qty -= deduction;
//       });
//     } else {
//       if (!stockMap[sale.productId]) {
//         stockMap[sale.productId] = { qty: 0, product_name: sale.productName };
//       }
//       stockMap[sale.productId].qty -= sale.quantity;
//     }
//   });

//   // C. Filter by "clossing_stock" tag; resolve missing names from master
//   const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

//   return Object.entries(stockMap)
//     .map(([id, { qty }]) => {
//       const product = productMap[id];
//       if (!product?.tags?.includes("clossing_stock")) return null;
//       return {
//         product_id: id,
//         product_name: product.product_name || stockMap[id].product_name || id,
//         qty,
//         tags: product.tags ?? [],
//       };
//     })
//     .filter((x): x is ClosingStockEntry => x !== null && x.qty !== 0);
// }

// // ─── Date formatter ──────────────────────────────────────────────────────────
// function formatDate(dateStr: string) {
//   const d = new Date(dateStr);
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   return {
//     formatted: d.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }),
//     day: days[d.getDay()],
//   };
// }

// function formatINR(amount: number) {
//   return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0 }).format(
//     amount,
//   );
// }

// // ─── Shared sub-components (inline styles only — Tailwind is unsafe in html2canvas) ──

// function SectionLabel({ children }: { children: string }) {
//   return (
//     <p
//       style={{
//         fontSize: 10,
//         textTransform: "uppercase",
//         letterSpacing: "0.1em",
//         color: "#a1a1aa",
//         marginBottom: 8,
//         marginTop: 0,
//       }}
//     >
//       {children}
//     </p>
//   );
// }

// function Divider() {
//   return <div style={{ borderTop: "1px dashed #e4e4e7", margin: "10px 0" }} />;
// }

// function Row({
//   label,
//   value,
//   valueColor = "#18181b",
//   sub,
// }: {
//   label: string;
//   value: string;
//   valueColor?: string;
//   sub?: string;
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         marginBottom: 4,
//       }}
//     >
//       <span
//         style={{
//           color: "#71717a",
//           fontSize: 13,
//           flexShrink: 0,
//           paddingRight: 8,
//         }}
//       >
//         {label}
//       </span>
//       <span style={{ textAlign: "right" }}>
//         <span
//           style={{
//             fontSize: 13,
//             display: "block",
//             color: valueColor,
//             fontWeight: 600,
//           }}
//         >
//           {value}
//         </span>
//         {sub && (
//           <span
//             style={{
//               fontSize: 11,
//               color: "#a1a1aa",
//               display: "block",
//               wordBreak: "break-all",
//             }}
//           >
//             {sub}
//           </span>
//         )}
//       </span>
//     </div>
//   );
// }

// function DeductRow({
//   label,
//   sub,
//   amount,
//   type,
// }: {
//   label: string;
//   sub?: string;
//   amount: number;
//   type: "add" | "deduct";
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         marginBottom: 4,
//       }}
//     >
//       <span
//         style={{ fontSize: 13, color: "#52525b", flex: 1, paddingRight: 8 }}
//       >
//         {label}
//         {sub && (
//           <span
//             style={{
//               display: "block",
//               fontSize: 11,
//               color: "#a1a1aa",
//               wordBreak: "break-all",
//             }}
//           >
//             {sub}
//           </span>
//         )}
//       </span>
//       <span
//         style={{
//           fontSize: 13,
//           fontWeight: 600,
//           color: type === "deduct" ? "#dc2626" : "#16a34a",
//           flexShrink: 0,
//         }}
//       >
//         {type === "deduct" ? "−" : "+"}₹{formatINR(amount)}
//       </span>
//     </div>
//   );
// }

// // ─── Compact stock pill grid ─────────────────────────────────────────────────
// // Shows "full"-tagged items by default; rest hidden behind a toggle.
// function StockGrid({
//   items,
//   label,
// }: {
//   items: {
//     product_id: string;
//     product_name: string;
//     qty: number;
//     tags?: string[];
//   }[];
//   label: string;
// }) {
//   const [showAll, setShowAll] = useState(false);
//   if (items.length === 0) return null;

//   const primaryItems = items.filter((i) => i.tags?.includes("full"));
//   const hiddenItems = items.filter((i) => !i.tags?.includes("full"));
//   const visibleItems = showAll
//     ? items
//     : primaryItems.length > 0
//       ? primaryItems
//       : items;

//   const StockPill = ({ item }: { item: (typeof items)[0] }) => (
//     <div
//       style={{
//         border: "1px solid #e4e4e7",
//         borderRadius: 8,
//         padding: "6px 10px",
//         minWidth: 72,
//         textAlign: "center",
//         backgroundColor: "#f9fafb",
//       }}
//     >
//       <p
//         style={{
//           fontSize: 11,
//           color: "#52525b",
//           margin: "0 0 3px 0",
//           lineHeight: 1.3,
//         }}
//       >
//         {item.product_name}
//       </p>
//       <p style={{ fontSize: 17, fontWeight: 700, color: "#18181b", margin: 0 }}>
//         {item.qty}
//       </p>
//     </div>
//   );

//   return (
//     <>
//       <SectionLabel>{label}</SectionLabel>
//       <div
//         style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}
//       >
//         {visibleItems.map((item) => (
//           <StockPill key={item.product_id} item={item} />
//         ))}
//       </div>
//       {hiddenItems.length > 0 && (
//         <button
//           onClick={() => setShowAll((p) => !p)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//             fontSize: 11,
//             color: "#6366f1",
//             background: "none",
//             border: "none",
//             padding: "2px 0 6px",
//             cursor: "pointer",
//           }}
//         >
//           <ChevronDown
//             style={{
//               width: 12,
//               height: 12,
//               transition: "transform 0.2s",
//               transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
//             }}
//           />
//           {showAll ? "Show less" : `+${hiddenItems.length} more`}
//         </button>
//       )}
//     </>
//   );
// }

// function noteLabel(key: string) {
//   const map: Record<string, string> = {
//     coin_5: "₹5 Coin",
//     note_10: "₹10",
//     note_20: "₹20",
//     note_50: "₹50",
//     note_100: "₹100",
//     note_200: "₹200",
//     note_500: "₹500",
//     note_2000: "₹2000",
//   };
//   return map[key] ?? key;
// }

// // ─── html2canvas capture ─────────────────────────────────────────────────────
// async function captureCanvas(el: HTMLElement) {
//   const html2canvas = (await import("html2canvas")).default;
//   return html2canvas(el, {
//     backgroundColor: "#ffffff",
//     scale: 2,
//     useCORS: true,
//     onclone: (doc) => {
//       doc.querySelectorAll("*").forEach((node) => {
//         const s = window.getComputedStyle(node);
//         if (s.color.includes("lab") || s.backgroundColor.includes("lab")) {
//           (node as HTMLElement).style.color = "#000";
//           (node as HTMLElement).style.backgroundColor = "#fff";
//         }
//       });
//     },
//   });
// }

// // ─── Main component ──────────────────────────────────────────────────────────
// export function SalesReportDialog({
//   salesSlipId,
//   reportData,
//   isLoading,
//   isFetching,
//   warehouses,
//   users,
//   openingStock = [],
//   products = [],
// }: {
//   warehouses: { id: string; name: string }[];
//   users: { id: string; user_name: string }[];
//   salesSlipId: string;
//   reportData?: DeliveryReportData;
//   isLoading: boolean;
//   isFetching: boolean;
//   /** Same openingStock array you pass to OldStockSection */
//   openingStock?: OpeningStockItem[];
//   /** Full products master — same array you pass to ClosingStockSection */
//   products?: ReportProduct[];
// }) {
//   const reportRef = useRef<HTMLDivElement>(null);
//   const [sharing, setSharing] = useState(false);
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
//     {},
//   );
//   const toggleItem = useCallback((id: string) => {
//     setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
//   }, []);

//   const handleDownload = useCallback(async () => {
//     if (!reportRef.current) return;
//     setSharing(true);
//     try {
//       const canvas = await captureCanvas(reportRef.current);
//       const link = document.createElement("a");
//       link.download = `sales-report-${salesSlipId.slice(0, 8)}.png`;
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     } catch (e) {
//       console.error("Download failed", e);
//     } finally {
//       setSharing(false);
//     }
//   }, [salesSlipId]);

//   const handleShare = useCallback(async () => {
//     if (!reportRef.current) return;
//     setSharing(true);
//     try {
//       const canvas = await captureCanvas(reportRef.current);
//       canvas.toBlob(async (blob) => {
//         if (!blob) return;
//         const file = new File([blob], "sales-report.png", {
//           type: "image/png",
//         });
//         if (navigator.canShare?.({ files: [file] })) {
//           await navigator.share({ files: [file], title: "Sales Report" });
//         } else {
//           window.open(
//             `https://wa.me/?text=${encodeURIComponent("Sales Report")}`,
//             "_blank",
//           );
//         }
//         setSharing(false);
//       }, "image/png");
//     } catch (e) {
//       console.error("Share failed", e);
//       setSharing(false);
//     }
//   }, []);

//   if (isLoading || isFetching) {
//     return (
//       <div className="flex flex-col gap-3 p-6">
//         {[...Array(6)].map((_, i) => (
//           <Skeleton key={i} className="h-6 w-full" />
//         ))}
//       </div>
//     );
//   }

//   if (!reportData) {
//     return (
//       <p className="p-6 text-muted-foreground text-sm">No report data found.</p>
//     );
//   }

//   const d = reportData;
//   const { formatted: dateFormatted, day } = formatDate(d.sales_slip.date);

//   const warehouseName =
//     warehouses.find((w) => w.id === d.sales_slip.warehouse_id)?.name ||
//     d.sales_slip.warehouse_id;

//   const deliveryBoyNames = d.delivery_boys
//     ?.map((id) => users.find((u) => u.id === id)?.user_name || "staff")
//     .join(", ");

//   // ── Opening stock (same filter as OldStockSection) ───────────────────────
//   const filteredOpeningStock = filterOpeningStock(openingStock);

//   // ── Closing stock (same logic as ClosingStockSection) ────────────────────
//   // Map reportData.sales_items → SaleItemForStock shape
//   const salesForStock: SaleItemForStock[] = (d.sales_items ?? []).map(
//     (item) => ({
//       productId: item.product_id ?? item.line_item_id,
//       productName: (item as any).product_name ?? "",
//       quantity: item.qty,
//       isComposite: !!(item.components && item.components.length > 0),
//       components: item.components?.map((c) => ({
//         qty: c.qty,
//         child_product_id: c.child_product_id,
//       })),
//     }),
//   );

//   const closingStock = calculateClosingStock(
//     filteredOpeningStock,
//     salesForStock,
//     products,
//   );

//   // ── Cash denominations ───────────────────────────────────────────────────
//   const noteEntries = Object.entries(d.cash_chest.notes).filter(
//     ([, v]) => v > 0,
//   );
//   const denomTotal = noteEntries.reduce((acc, [key, qty]) => {
//     const val = parseInt(key.replace("note_", "").replace("coin_", ""));
//     return acc + val * qty;
//   }, 0);

//   // ── Totals ───────────────────────────────────────────────────────────────
//   const totalUpi = d.totals.total_upi_amount;
//   const totalOnline = d.totals.total_online_amount;
//   const totalSales = d.totals.total_sales_amount;

//   // ── UPI payments (per-QR upi_id support) ────────────────────────────────
//   const upiPayments: { id: string; upi_id?: string; amount: number }[] =
//     (d as any).upi_payments ?? [];
//   const showUpiAggregate = upiPayments.length === 0 && totalUpi > 0;

//   // ── Online payments (with payment reference) ─────────────────────────────
//   const onlinePayments: { id: string; payment_id?: string; amount: number }[] =
//     (d as any).online_payments ?? [];
//   const showOnlineAggregate = onlinePayments.length === 0 && totalOnline > 0;

//   return (
//     <div className="flex flex-col gap-4">
//       {/* Action Buttons */}
//       <div className="flex gap-2 justify-end px-1">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleDownload}
//           disabled={sharing}
//           className="gap-2"
//         >
//           {sharing ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Download className="h-4 w-4" />
//           )}
//           Download
//         </Button>
//         <Button
//           size="sm"
//           onClick={handleShare}
//           disabled={sharing}
//           className="gap-2 bg-green-600 hover:bg-green-700 text-white"
//         >
//           {sharing ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Share2 className="h-4 w-4" />
//           )}
//           Share
//         </Button>
//       </div>

//       {/* Printable Report — inline styles only so html2canvas captures correctly */}
//       <div
//         ref={reportRef}
//         style={{
//           backgroundColor: "#ffffff",
//           color: "#18181b",
//           borderRadius: 12,
//           border: "1px solid #e4e4e7",
//           overflow: "hidden",
//           fontFamily: "'Courier New', Courier, monospace",
//           minWidth: 320,
//           maxWidth: 480,
//           margin: "0 auto",
//           width: "100%",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             backgroundColor: "#18181b",
//             color: "#fff",
//             padding: "16px 20px",
//             textAlign: "center",
//           }}
//         >
//           <p
//             style={{
//               fontSize: 10,
//               textTransform: "uppercase",
//               letterSpacing: "0.15em",
//               color: "#a1a1aa",
//               marginBottom: 4,
//               marginTop: 0,
//             }}
//           >
//             Sales Report
//           </p>
//           <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
//             {dateFormatted}
//           </p>
//           <p
//             style={{
//               fontSize: 13,
//               color: "#d4d4d8",
//               marginTop: 2,
//               marginBottom: 0,
//             }}
//           >
//             {day}
//           </p>
//         </div>

//         <div style={{ padding: "16px 20px" }}>
//           {/* Info */}
//           <Row label="Warehouse" value={warehouseName} />
//           <Row label="Delivery Boys" value={deliveryBoyNames || "—"} />

//           <Divider />

//           {/* Opening Stock */}
//           <StockGrid items={filteredOpeningStock} label="Opening Stock" />
//           {filteredOpeningStock.length > 0 && <Divider />}

//           {/* Sales Items */}
//           <SectionLabel>Sales Items</SectionLabel>
//           {d.sales_items?.map((item,ind) => {
//             const itemId = item?.line_item_id;
//             const isExpanded = !!expandedItems[itemId];
//             const positiveComponents = item?.components?.filter(
//               (c) => c.qty > 0,
//             );
//             const hasComponents = !!(
//               positiveComponents && positiveComponents.length > 0
//             );
//             // Main label: product_name for composites (e.g. "14 FULL"), fallback to component list
//             const mainLabel = (item as any).product_name
//               ? (item as any).product_name
//               : hasComponents
//                 ? positiveComponents!
//                     .map((c) => `${c.child_product_name} (${c.qty})`)
//                     .join(" + ")
//                 : "—";
//             return (
//               <div key={ind} style={{ marginBottom: 8 }}>
//                 {/* Main row: product name + amount */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 13,
//                       color: "#3f3f46",
//                       flex: 1,
//                       paddingRight: 8,
//                     }}
//                   >
//                     <span style={{ fontWeight: 600 }}>{mainLabel}</span>
//                     <span
//                       style={{
//                         fontSize: 11,
//                         color: "#a1a1aa",
//                         display: "block",
//                       }}
//                     >
//                       Total: {item.qty} units
//                     </span>
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 700,
//                       color: "#16a34a",
//                       flexShrink: 0,
//                     }}
//                   >
//                     ₹{formatINR(item.total)}
//                   </span>
//                 </div>
//                 {/* View more / less toggle — only shown when there are components */}
//                 {hasComponents && (
//                   <button
//                     onClick={() => toggleItem(itemId)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       fontSize: 11,
//                       color: "#6366f1",
//                       background: "none",
//                       border: "none",
//                       padding: "2px 0",
//                       cursor: "pointer",
//                       marginTop: 2,
//                     }}
//                   >
//                     <ChevronDown
//                       style={{
//                         width: 12,
//                         height: 12,
//                         transition: "transform 0.2s",
//                         transform: isExpanded
//                           ? "rotate(180deg)"
//                           : "rotate(0deg)",
//                       }}
//                     />
//                     {isExpanded ? "Hide details" : "View more"}
//                   </button>
//                 )}
//                 {/* Expanded component breakdown */}
//                 {isExpanded && hasComponents && (
//                   <div
//                     style={{
//                       marginTop: 4,
//                       paddingLeft: 8,
//                       borderLeft: "2px solid #e4e4e7",
//                     }}
//                   >
//                     {positiveComponents!.map((c, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           fontSize: 12,
//                           color: "#71717a",
//                           marginBottom: 2,
//                         }}
//                       >
//                         <span>{c.child_product_name}</span>
//                         <span style={{ flexShrink: 0 }}>× {c.qty}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               borderTop: "1px dashed #d4d4d8",
//               paddingTop: 8,
//               marginTop: 4,
//             }}
//           >
//             <span style={{ fontSize: 13, fontWeight: 700 }}>Total Sales</span>
//             <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
//               ₹{formatINR(totalSales)}
//             </span>
//           </div>

//           <Divider />

//           {/* Closing Stock */}
//           <StockGrid items={closingStock} label="Closing Stock" />
//           {closingStock.length > 0 && <Divider />}

//           {/* Deductions */}
//           <SectionLabel>Deductions</SectionLabel>

//           {d.expenses.map((exp,ind) => (
//             <DeductRow
//               key={ind}
//               label={`Expense — ${exp.expenses_type}`}
//               amount={exp.amount}
//               type="deduct"
//             />
//           ))}

//           {d.transactions.map((tx,ind) => (
//             <DeductRow
//               key={ind}
//               label={`Transaction (${tx.type})`}
//               amount={tx.amount}
//               type={tx.type === "received" ? "add" : "deduct"}
//             />
//           ))}

//           {/* UPI — one row per QR / upi_id */}
//           {upiPayments.map((upi,ind) => (
//             <DeductRow
//               key={ind}
//               label="UPI Payment"
//               sub={upi.upi_id ? `ID: ${upi.upi_id}` : undefined}
//               amount={upi.amount}
//               type="deduct"
//             />
//           ))}
//           {showUpiAggregate && (
//             <DeductRow label="UPI Payment" amount={totalUpi} type="deduct" />
//           )}

//           {/* Online — one row per payment reference */}
//           {onlinePayments.map((op,ind) => (
//             <DeductRow
//               key={ind}
//               label="Online Payment"
//               sub={op.payment_id ? `Ref: ${op.payment_id}` : undefined}
//               amount={op.amount}
//               type="deduct"
//             />
//           ))}
//           {showOnlineAggregate && (
//             <DeductRow
//               label="Online Payment"
//               amount={totalOnline}
//               type="deduct"
//             />
//           )}

//           <Divider />

//           {/* Cash Denomination */}
//           <SectionLabel>Cash Denomination</SectionLabel>
//           {noteEntries.map(([key, qty],) => {
//             const faceVal = parseInt(
//               key.replace("note_", "").replace("coin_", ""),
//             );
//             return (
//               <div
//                 key={key}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: 3,
//                 }}
//               >
//                 <span style={{ fontSize: 13, color: "#52525b" }}>
//                   {noteLabel(key)} × {qty}
//                 </span>
//                 <span style={{ fontSize: 13, color: "#52525b", flexShrink: 0 }}>
//                   ₹{formatINR(faceVal * qty)}
//                 </span>
//               </div>
//             );
//           })}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               borderTop: "1px dashed #d4d4d8",
//               paddingTop: 6,
//               marginTop: 4,
//             }}
//           >
//             <span style={{ fontSize: 13, fontWeight: 600 }}>
//               Denomination Total
//             </span>
//             <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
//               ₹{formatINR(denomTotal)}
//             </span>
//           </div>

//           <Divider />

//           {/* Chest & Slip Status */}
//           <Row
//             label="Chest Location"
//             value={d.cash_chest.chest_name?.toUpperCase() ?? "—"}
//             valueColor={
//               d.cash_chest.chest_name === "office" ? "#16a34a" : "#ea580c"
//             }
//           />
//           <Row
//             label="Slip Status"
//             value={d.sales_slip.status ?? "—"}
//             valueColor={
//               d.sales_slip.status?.toLowerCase().includes("submit")
//                 ? "#ea580c"
//                 : "#16a34a"
//             }
//           />

//           <Divider />

//           {/* Cash to Pay */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginTop: 4,
//             }}
//           >
//             <span style={{ fontSize: 14, fontWeight: 700, color: "#18181b" }}>
//               Cash to Pay / Deposit
//             </span>
//             <span
//               style={{
//                 fontSize: 22,
//                 fontWeight: 800,
//                 color: "#16a34a",
//                 flexShrink: 0,
//               }}
//             >
//               ₹{formatINR(denomTotal)}
//             </span>
//           </div>

//           {d.sales_slip.remark && (
//             <p
//               style={{
//                 fontSize: 11,
//                 color: "#a1a1aa",
//                 marginTop: 10,
//                 marginBottom: 0,
//               }}
//             >
//               Remark: {d.sales_slip.remark}
//             </p>
//           )}
//         </div>

//         {/* Footer */}
//         <div
//           style={{
//             backgroundColor: "#f4f4f5",
//             textAlign: "center",
//             padding: "8px 20px",
//             fontSize: 10,
//             color: "#a1a1aa",
//             letterSpacing: "0.1em",
//             textTransform: "uppercase",
//           }}
//         >
//           Generated · {new Date().toLocaleString("en-IN")}
//         </div>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeliveryReportData } from "@/types/deliverySlip";
import { ChevronDown, Download, Loader2, Share2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ─── Stock-related types ─────────────────────────────────────────────────────
interface OpeningStockItem {
  product_id: string;
  product_name: string;
  qty: number;
  tags: string[];
}

interface ReportProduct {
  id: string;
  product_name: string;
  tags: string[];
}

interface SaleItemForStock {
  productId: string;
  productName: string;
  quantity: number;
  isComposite: boolean;
  components?: Array<{ qty: number; child_product_id: string }> | null;
}

interface ClosingStockEntry {
  product_id: string;
  product_name: string;
  qty: number;
  tags: string[];
}

// ─── Mirrors OldStockSection filter: exclude DC & service tags ───────────────
function filterOpeningStock(stock: OpeningStockItem[]): OpeningStockItem[] {
  return stock.filter(
    (p) => !p.tags?.includes("DC") && !p.tags?.includes("service"),
  );
}

// ─── Mirrors calculateClosingStock from ClosingStockSection exactly ──────────
// - Composite sales deduct their components; simple sales deduct the product itself
// - Products with no name fall back to the products master (same as original)
// - Only items tagged "clossing_stock" (preserves original typo) are included
// - Zero-qty rows are excluded
function calculateClosingStock(
  openingStock: OpeningStockItem[],
  salesData: SaleItemForStock[],
  products: ReportProduct[],
): ClosingStockEntry[] {
  const stockMap: Record<string, { qty: number; product_name: string }> = {};

  // A. Seed from opening stock
  openingStock.forEach((item) => {
    stockMap[item.product_id] = {
      qty: (stockMap[item.product_id]?.qty ?? 0) + item.qty,
      product_name: item.product_name,
    };
  });
  // B. Deduct sales
  salesData.forEach((sale) => {
    if (sale.isComposite && sale.components) {
      sale.components.forEach((comp) => {
        const deduction = sale.quantity * comp.qty;
        if (!stockMap[comp.child_product_id]) {
          stockMap[comp.child_product_id] = { qty: 0, product_name: "" };
        }
        stockMap[comp.child_product_id].qty -= deduction;
      });
    } else {
      if (!stockMap[sale.productId]) {
        stockMap[sale.productId] = { qty: 0, product_name: sale.productName };
      }
      stockMap[sale.productId].qty -= sale.quantity;
    }
  });

  // C. Filter by "clossing_stock" tag; resolve missing names from master
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  return Object.entries(stockMap)
    .map(([id, { qty }]) => {
      const product = productMap[id];
      if (!product?.tags?.includes("clossing_stock")) return null;
      return {
        product_id: id,
        product_name: product.product_name || stockMap[id].product_name || id,
        qty,
        tags: product.tags ?? [],
      };
    })
    .filter((x): x is ClosingStockEntry => x !== null && x.qty !== 0);
}

// ─── Date formatter ──────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return {
    formatted: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    day: days[d.getDay()],
  };
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0 }).format(
    amount,
  );
}

// ─── Shared sub-components (inline styles only — Tailwind is unsafe in html2canvas) ──

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#a1a1aa",
        marginBottom: 8,
        marginTop: 0,
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px dashed #e4e4e7", margin: "10px 0" }} />;
}

function Row({
  label,
  value,
  valueColor = "#18181b",
  sub,
}: {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
      }}
    >
      <span
        style={{
          color: "#71717a",
          fontSize: 13,
          flexShrink: 0,
          paddingRight: 8,
        }}
      >
        {label}
      </span>
      <span style={{ textAlign: "right" }}>
        <span
          style={{
            fontSize: 13,
            display: "block",
            color: valueColor,
            fontWeight: 600,
          }}
        >
          {value}
        </span>
        {sub && (
          <span
            style={{
              fontSize: 11,
              color: "#a1a1aa",
              display: "block",
              wordBreak: "break-all",
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}

function DeductRow({
  label,
  sub,
  amount,
  type,
}: {
  label: string;
  sub?: string;
  amount: number;
  type: "add" | "deduct";
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
      }}
    >
      <span
        style={{ fontSize: 13, color: "#52525b", flex: 1, paddingRight: 8 }}
      >
        {label}
        {sub && (
          <span
            style={{
              display: "block",
              fontSize: 11,
              color: "#a1a1aa",
              wordBreak: "break-all",
            }}
          >
            {sub}
          </span>
        )}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: type === "deduct" ? "#dc2626" : "#16a34a",
          flexShrink: 0,
        }}
      >
        {type === "deduct" ? "−" : "+"}₹{formatINR(amount)}
      </span>
    </div>
  );
}

// ─── Compact stock pill grid ─────────────────────────────────────────────────
// Shows "full"-tagged items by default; rest hidden behind a toggle.
function StockGrid({
  items,
  label,
}: {
  items: {
    product_id: string;
    product_name: string;
    qty: number;
    tags?: string[];
  }[];
  label: string;
}) {
  const [showAll, setShowAll] = useState(false);
  if (items.length === 0) return null;

  const primaryItems = items.filter((i) => i.tags?.includes("full"));
  const hiddenItems = items.filter((i) => !i.tags?.includes("full"));
  const visibleItems = showAll
    ? items
    : primaryItems.length > 0
      ? primaryItems
      : items;

  const StockPill = ({ item }: { item: (typeof items)[0] }) => (
    <div
      style={{
        border: "1px solid #e4e4e7",
        borderRadius: 8,
        padding: "6px 10px",
        minWidth: 72,
        textAlign: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "#52525b",
          margin: "0 0 3px 0",
          lineHeight: 1.3,
        }}
      >
        {item.product_name}
      </p>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#18181b", margin: 0 }}>
        {item.qty}
      </p>
    </div>
  );

  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}
      >
        {visibleItems.map((item) => (
          <StockPill key={item.product_id} item={item} />
        ))}
      </div>
      {hiddenItems.length > 0 && (
        <button
          onClick={() => setShowAll((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 11,
            color: "#6366f1",
            background: "none",
            border: "none",
            padding: "2px 0 6px",
            cursor: "pointer",
          }}
        >
          <ChevronDown
            style={{
              width: 12,
              height: 12,
              transition: "transform 0.2s",
              transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
          {showAll ? "Show less" : `+${hiddenItems.length} more`}
        </button>
      )}
    </>
  );
}

function noteLabel(key: string) {
  const map: Record<string, string> = {
    coin_5: "₹5 Coin",
    note_10: "₹10",
    note_20: "₹20",
    note_50: "₹50",
    note_100: "₹100",
    note_200: "₹200",
    note_500: "₹500",
    note_2000: "₹2000",
  };
  return map[key] ?? key;
}

// ─── html2canvas capture ─────────────────────────────────────────────────────
async function captureCanvas(el: HTMLElement) {
  const html2canvas = (await import("html2canvas")).default;
  return html2canvas(el, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    onclone: (doc) => {
      doc.querySelectorAll("*").forEach((node) => {
        const s = window.getComputedStyle(node);
        if (s.color.includes("lab") || s.backgroundColor.includes("lab")) {
          (node as HTMLElement).style.color = "#000";
          (node as HTMLElement).style.backgroundColor = "#fff";
        }
      });
    },
  });
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
  /** Same openingStock array you pass to OldStockSection */
  openingStock?: OpeningStockItem[];
  /** Full products master — same array you pass to ClosingStockSection */
  products?: ReportProduct[];
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

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
        const file = new File([blob], "sales-report.png", {
          type: "image/png",
        });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "Sales Report" });
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent("Sales Report")}`,
            "_blank",
          );
        }
        setSharing(false);
      }, "image/png");
    } catch (e) {
      console.error("Share failed", e);
      setSharing(false);
    }
  }, []);

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col gap-3 p-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (!reportData) {
    return (
      <p className="p-6 text-muted-foreground text-sm">No report data found.</p>
    );
  }

  const d = reportData;
  const { formatted: dateFormatted, day } = formatDate(d.sales_slip.date);

  const warehouseName =
    warehouses.find((w) => w.id === d.sales_slip.warehouse_id)?.name ||
    d.sales_slip.warehouse_id;

  const deliveryBoyNames = d.delivery_boys
    ?.map((id) => users.find((u) => u.id === id)?.user_name || "staff")
    .join(", ");

  // ── Opening stock (same filter as OldStockSection) ───────────────────────
  const filteredOpeningStock = filterOpeningStock(openingStock);

  // ── Closing stock (same logic as ClosingStockSection) ────────────────────
  // Map reportData.sales_items → SaleItemForStock shape
  const salesForStock: SaleItemForStock[] = (d.sales_items ?? []).map(
    (item) => ({
      productId: item.product_id ?? item.line_item_id,
      productName: (item as any).product_name ?? "",
      quantity: item.qty,
      isComposite: !!(item.components && item.components.length > 0),
      components: item.components?.map((c) => ({
        qty: c.qty,
        child_product_id: c.child_product_id,
      })),
    }),
  );

  const closingStock = calculateClosingStock(
    filteredOpeningStock,
    salesForStock,
    products,
  );

  // ── Cash denominations ───────────────────────────────────────────────────
  const noteEntries = Object.entries(d.cash_chest.notes).filter(
    ([, v]) => v > 0,
  );
  const denomTotal = noteEntries.reduce((acc, [key, qty]) => {
    const val = parseInt(key.replace("note_", "").replace("coin_", ""));
    return acc + val * qty;
  }, 0);

  // ── Totals ───────────────────────────────────────────────────────────────
  const totalUpi = d.totals.total_upi_amount;
  const totalOnline = d.totals.total_online_amount;
  const totalSales = d.totals.total_sales_amount;

  // ── UPI payments (per-QR upi_id support) ────────────────────────────────
  const upiPayments: { id: string; upi_id?: string; amount: number }[] =
    (d as any).upi_payments ?? [];
  const showUpiAggregate = upiPayments.length === 0 && totalUpi > 0;

  // ── Online payments (with payment reference) ─────────────────────────────
  const onlinePayments: { id: string; payment_id?: string; amount: number }[] =
    (d as any).online_payments ?? [];
  const showOnlineAggregate = onlinePayments.length === 0 && totalOnline > 0;
  const productMap = Object.fromEntries(
  products.map((p) => [p.id, p.product_name])
);
  return (
    <div className="flex flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex gap-2 justify-end px-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={sharing}
          className="gap-2"
        >
          {sharing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download
        </Button>
        <Button
          size="sm"
          onClick={handleShare}
          disabled={sharing}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          {sharing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          Share
        </Button>
      </div>

      {/* Printable Report — inline styles only so html2canvas captures correctly */}
      <div
        ref={reportRef}
        style={{
          backgroundColor: "#ffffff",
          color: "#18181b",
          borderRadius: 12,
          border: "1px solid #e4e4e7",
          overflow: "hidden",
          minWidth: 320,
          maxWidth: 480,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#18181b",
            color: "#fff",
            padding: "16px 20px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#a1a1aa",
              marginBottom: 4,
              marginTop: 0,
            }}
          >
            Sales Report
          </p>
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            {dateFormatted}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#d4d4d8",
              marginTop: 2,
              marginBottom: 0,
            }}
          >
            {day}
          </p>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {/* Info */}
          <Row label="Warehouse" value={warehouseName} />
          <Row label="Delivery Boys" value={deliveryBoyNames || "—"} />

          <Divider />

          {/* Opening Stock */}
          <StockGrid items={filteredOpeningStock} label="Opening Stock" />
          {filteredOpeningStock.length > 0 && <Divider />}

          {/* Sales Items */}
          <SectionLabel>Sales Items</SectionLabel>
          {d.sales_items?.map((item) => {
            console.log(item);

            const productName =
              (item as any).product_name ||
              productMap[item.product_id] ||
              item.line_item_id ||
              "—";
            return (
              <div
                key={item?.line_item_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "#3f3f46",
                    flex: 1,
                    paddingRight: 8,
                  }}
                >
                  {productName}
                  <span
                    style={{ fontSize: 11, color: "#a1a1aa", display: "block" }}
                  >
                    {item.qty} × ₹
                    {formatINR(item.rate ?? item.total / item.qty)}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#16a34a",
                    flexShrink: 0,
                  }}
                >
                  ₹{formatINR(item.total)}
                </span>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px dashed #d4d4d8",
              paddingTop: 8,
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>Total Sales</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
              ₹{formatINR(totalSales)}
            </span>
          </div>

          <Divider />

          {/* Closing Stock */}
          <StockGrid items={closingStock} label="Closing Stock" />
          {closingStock.length > 0 && <Divider />}

          {/* Deductions */}
          <SectionLabel>Deductions</SectionLabel>

          {d.expenses.map((exp) => (
            <DeductRow
              key={exp.id}
              label={`Expense — ${exp.expenses_type}`}
              amount={exp.amount}
              type="deduct"
            />
          ))}

          {d.transactions.map((tx) => (
            <DeductRow
              key={tx.id}
              label={`Transaction (${tx.type})`}
              amount={tx.amount}
              type={tx.type === "received" ? "add" : "deduct"}
            />
          ))}

          {/* UPI — one row per QR / upi_id */}
          {upiPayments.map((upi) => (
            <DeductRow
              key={upi.id}
              label="UPI Payment"
              sub={upi.upi_id ? `ID: ${upi.upi_id}` : undefined}
              amount={upi.amount}
              type="deduct"
            />
          ))}
          {showUpiAggregate && (
            <DeductRow label="UPI Payment" amount={totalUpi} type="deduct" />
          )}

          {/* Online — one row per payment reference */}
          {onlinePayments.map((op) => (
            <DeductRow
              key={op.id}
              label="Online Payment"
              sub={op.payment_id ? `Ref: ${op.payment_id}` : undefined}
              amount={op.amount}
              type="deduct"
            />
          ))}
          {showOnlineAggregate && (
            <DeductRow
              label="Online Payment"
              amount={totalOnline}
              type="deduct"
            />
          )}

          <Divider />

          {/* Cash Denomination */}
          <SectionLabel>Cash Denomination</SectionLabel>
          {noteEntries.map(([key, qty]) => {
            const faceVal = parseInt(
              key.replace("note_", "").replace("coin_", ""),
            );
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span style={{ fontSize: 13, color: "#52525b" }}>
                  {noteLabel(key)} × {qty}
                </span>
                <span style={{ fontSize: 13, color: "#52525b", flexShrink: 0 }}>
                  ₹{formatINR(faceVal * qty)}
                </span>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px dashed #d4d4d8",
              paddingTop: 6,
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Denomination Total
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              ₹{formatINR(denomTotal)}
            </span>
          </div>

          <Divider />

          {/* Chest & Slip Status */}
          <Row
            label="Chest Location"
            value={d.cash_chest.chest_name?.toUpperCase() ?? "—"}
            valueColor={
              d.cash_chest.chest_name === "office" ? "#16a34a" : "#ea580c"
            }
          />
          <Row
            label="Slip Status"
            value={d.sales_slip.status ?? "—"}
            valueColor={
              d.sales_slip.status?.toLowerCase().includes("submit")
                ? "#ea580c"
                : "#16a34a"
            }
          />

          <Divider />

          {/* Cash to Pay */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#18181b" }}>
              Cash to Pay / Deposit
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#16a34a",
                flexShrink: 0,
              }}
            >
              ₹{formatINR(denomTotal)}
            </span>
          </div>

          {d.sales_slip.remark && (
            <p
              style={{
                fontSize: 11,
                color: "#a1a1aa",
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Remark: {d.sales_slip.remark}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f4f4f5",
            textAlign: "center",
            padding: "8px 20px",
            fontSize: 10,
            color: "#a1a1aa",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Generated · {new Date().toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}
