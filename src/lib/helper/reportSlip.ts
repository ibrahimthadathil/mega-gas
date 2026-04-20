// ─── Stock-related types ─────────────────────────────────────────────────────
export interface OpeningStockItem {
  product_id: string;
  product_name: string;
  qty: number;
  tags: string[];
}

export interface ReportProduct {
  id: string;
  product_name: string;
  tags: string[];
}

export interface SaleItemForStock {
  productId: string;
  productName: string;
  quantity: number;
  isComposite: boolean;
  components?: Array<{ qty: number; child_product_id: string }> | null;
}
export interface ClosingStockEntry {
  product_id: string;
  product_name: string;
  qty: number;
  tags: string[];
}
// Replace the captureCanvas function with this:
let html2canvasPromise: Promise<typeof import("html2canvas").default> | null = null;
function getHtml2Canvas() {
  if (!html2canvasPromise) {
    html2canvasPromise = import("html2canvas").then((m) => m.default);
  }
  return html2canvasPromise;
}
export async function captureCanvas(el: HTMLElement) {
  const html2canvas = await getHtml2Canvas();

  // Snapshot all CSS custom properties on :root before cloning
  const rootStyles = getComputedStyle(document.documentElement);

  return html2canvas(el, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    onclone: (doc, clonedEl) => {
      // 1. Override every CSS variable that might contain lab() / oklch() / p3
      //    with a safe hex equivalent on the cloned :root
      const safeVarOverrides: Record<string, string> = {};
      for (const prop of Array.from(rootStyles)) {
        if (!prop.startsWith("--")) continue;
        const val = rootStyles.getPropertyValue(prop).trim();
        if (
          val.includes("lab(") ||
          val.includes("lch(") ||
          val.includes("oklch(") ||
          val.includes("oklab(") ||
          val.includes("color(display-p3") ||
          val.includes("color(srgb")
        ) {
          safeVarOverrides[prop] = "#000000"; // fallback — harmless for capture
        }
      }

      const overrideStyle = doc.createElement("style");
      overrideStyle.textContent = `:root { ${Object.entries(safeVarOverrides)
        .map(([k, v]) => `${k}: ${v} !important;`)
        .join(" ")} }`;
      doc.head.appendChild(overrideStyle);

      // 2. Walk every element and patch any remaining lab/oklch in *inline* styles
      doc.querySelectorAll<HTMLElement>("*").forEach((node) => {
        const computed = window.getComputedStyle(node);
        const unsafePattern = /lab\(|lch\(|oklch\(|oklab\(|color\(display-p3|color\(srgb/;

        if (unsafePattern.test(computed.color)) {
          node.style.color = "#000000";
        }
        if (unsafePattern.test(computed.backgroundColor)) {
          node.style.backgroundColor = "#ffffff";
        }
        if (unsafePattern.test(computed.borderColor)) {
          node.style.borderColor = "#e4e4e7";
        }
        if (unsafePattern.test(computed.fill)) {
          node.style.fill = "#000000";
        }
        if (unsafePattern.test(computed.stroke)) {
          node.style.stroke = "#000000";
        }
      });
    },
  });
}


export function calculateClosingStock(
  openingStock: OpeningStockItem[],
  salesData: SaleItemForStock[],
  productMap: Record<string, ReportProduct>, // Accept pre-built map
): ClosingStockEntry[] {
  const stockMap: Record<string, { qty: number; product_name: string }> = {};

  for (const item of openingStock) {
    stockMap[item.product_id] = {
      qty: (stockMap[item.product_id]?.qty ?? 0) + item.qty,
      product_name: item.product_name,
    };
  }

  for (const sale of salesData) {
    if (sale.isComposite && sale.components) {
      for (const comp of sale.components) {
        const deduction = sale.quantity * comp.qty;
        if (!stockMap[comp.child_product_id]) {
          stockMap[comp.child_product_id] = { qty: 0, product_name: "" };
        }
        stockMap[comp.child_product_id].qty -= deduction;
      }
    } else {
      if (!stockMap[sale.productId]) {
        stockMap[sale.productId] = { qty: 0, product_name: sale.productName };
      }
      stockMap[sale.productId].qty -= sale.quantity;
    }
  }

  const result: ClosingStockEntry[] = [];
  for (const [id, { qty }] of Object.entries(stockMap)) {
    const product = productMap[id];
    if (!product?.tags?.includes("clossing_stock") || qty === 0) continue;
    result.push({
      product_id: id,
      product_name: product.product_name || stockMap[id].product_name || id,
      qty,
      tags: product.tags ?? [],
    });
  }
  return result;
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return {
    formatted: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    day: days[d.getDay()],
  };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0 }).format(amount);
}

