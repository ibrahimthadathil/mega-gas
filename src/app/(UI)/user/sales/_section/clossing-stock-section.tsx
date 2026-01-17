"use client";

import { Card } from "@/components/ui/card";
import { Cylinder } from "lucide-react";

type OpeningStockItem = {
  product_id: string;
  product_name: string;
  qty: number;
};

type SaleComponent = {
  qty: number;
  child_product_id: string;
};

type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  isComposite: boolean;
  components?: SaleComponent[];
};

interface ClosingStockSectionProps {
  oldStock: OpeningStockItem[] | any;
  sales: SaleItem[] | any;
  products: any[];
}

const calculateClosingStock = (
  openingStock: OpeningStockItem[],
  salesData: SaleItem[],
  products:any[]
): any[] => {

  const stockMap: Record<string, { qty: number; product_name: string }> = {};

  // A. Initialize stockMap with opening stock
  openingStock.forEach(item => {
    stockMap[item.product_id] = {
      qty: (stockMap[item.product_id]?.qty || 0) + item.qty,
      product_name: item.product_name
    };
  });

  // B. Process Sales7686
  salesData.forEach(sale => {
    if (sale.isComposite && sale.components) {
      sale.components.forEach(comp => {
        const deduction = sale.quantity * comp.qty;
        if (!stockMap[comp.child_product_id]) {
          stockMap[comp.child_product_id] = { qty: 0, product_name: "" };
        }
        stockMap[comp.child_product_id].qty -= deduction;
      });
    } else {
      // Handle Simple Product Sale
      const deduction = sale.quantity;
      if (!stockMap[sale.productId]) {
        stockMap[sale.productId] = { qty: 0, product_name: sale.productName };
      }
      stockMap[sale.productId].qty -= deduction;
    }
  });
  console.log('@@@',stockMap);
  
  // C. Convert back to array format
 const productMap = Object.fromEntries(
  products.map(p => [p.id, p])
);

return Object.entries(stockMap)
  .map(([id, { qty }]) => {
    const product = productMap[id];
    if (!product?.tags?.includes("clossing_stock")) return null;

    return {
      product_id: id,
      product_name: product.product_name,
      qty,
    };
  })
  .filter(Boolean);

};

// const calculateClosingStock = (
//   openingStock: OpeningStockItem[], 
//   salesData: SaleItem[],
//   productMaster: any[]
// ): any[] => {
  
//   // --- PHASE 1: Calculate Stock (Logic remains generic for all items) ---

//   const stockMap: Record<string, number> = {};

//   // A. Process Opening Stock
//   openingStock.forEach(item => {
//     const current = stockMap[item.product_id] || 0;
//     stockMap[item.product_id] = current + item.qty;
//   });

//   // B. Process Sales
//   salesData.forEach(sale => {
//     if (sale.isComposite && sale.components) {
//       sale.components.forEach(comp => {
//         const deduction = sale.quantity * comp.qty;
//         const currentStock = stockMap[comp.child_product_id] || 0;
//         stockMap[comp.child_product_id] = currentStock - deduction;
//       });
//     } else {
//       const deduction = sale.quantity;
//       const currentStock = stockMap[sale.productId] || 0;
//       stockMap[sale.productId] = currentStock - deduction;
//     }
//   });


//   // --- PHASE 2: Lookup Map & Filtering ---

//   // Create a lookup map for product details from the master list
//   const productMeta: Record<string, { name: string, tags: string[] }> = {};
//   productMaster.forEach(p => {
//     productMeta[p.id] = { name: p.product_name, tags: p.tags || [] };
//   });

//   // Convert stockMap to array and apply filters
//   return Object.entries(stockMap).reduce((results, [id, qty]) => {
    
//     // 1. Get product details (Name/Tags)
//     const meta = productMeta[id];

//     // 2. Define Filter Conditions
//     const isNonZero = qty !== 0;
//     const hasClosingTag = meta && meta.tags.includes("clossing_stock");

//     // 3. Apply Filters: Must be non-zero AND have the specific tag
//     if (isNonZero && hasClosingTag) {
//       results.push({
//         "product_name": meta.name,
//         "id": id,
//         "qty": qty
//       });
//     }

//     return results;
//   }, [] as any[]);
// };
export default function ClosingStockSection({
  oldStock,
  sales,
  products,
}: ClosingStockSectionProps) {
  // console.log('OLD  :- ',JSON.stringify(  oldStock,null,2));
  // console.log("SALES :- " ,JSON.stringify( sales,null,2));

  const closingStock = calculateClosingStock(oldStock, sales, products);
  console.log(closingStock);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Closing Stock</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {closingStock.map(
            (item) =>
              item.qty != 0 && (
                <Card key={item.id} className="p-4 min-w-max">
                  <div className="flex flex-col items-center gap-3 w-32">
                    <p className="text-md font-medium text-center text-foreground line-clamp-2">
                      {item.product_name}
                    </p>

                    <div className="w-full pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-semibold">
                          Stock: <Cylinder className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          {item.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
          )}
        </div>
      </div>
    </div>
  );
}
