// "use client";

// import { Card } from "@/components/ui/card";
// import { Cylinder } from "lucide-react";

// type OldStockItem = {
//   product_id: string;
//   product_name: string;
//   qty: number;
// };

// type SaleItem = {
//   product: string;      // matches product_name
//   quantity: number;
// };

// interface ClosingStockSectionProps {
//   oldStock: OldStockItem[];    // opening stock list
//   sales: SaleItem[];           // sales list from parent
// }

// export default function ClosingStockSection({
//   oldStock,
//   sales,
// }: ClosingStockSectionProps) {
//   // Build a map of total sold quantity per product_name
//   const soldByProduct: Record<string, number> = sales.reduce(
//     (acc, sale) => {
//       acc[sale.product] = (acc[sale.product] || 0) + sale.quantity;
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   // Compute closing stock = opening qty - sold qty (min 0)
//   const closingStock = oldStock.map((item) => {
//     const soldQty = soldByProduct[item.product_name] || 0;
//     const remaining = Math.max(item.qty - soldQty, 0);

//     return {
//       product_id: item.product_id,
//       product_name: item.product_name,
//       qty: remaining,
//     };
//   });

//   return (
//     <div className="space-y-3">
//       <h2 className="text-lg font-semibold text-foreground">Closing Stock</h2>
//       <div className="overflow-x-auto pb-2">
//         <div className="flex gap-2">
//           {closingStock.map((item) => (
//             <Card key={item.product_id} className="p-3 min-w-max">
//               <div className="flex flex-col items-center gap-2 w-24">
//                 <Cylinder className="h-6 w-6 text-primary" />
//                 <p className="text-xs font-medium text-center text-foreground line-clamp-2">
//                   {item.product_name}
//                 </p>
//                 <p className="text-xl font-bold text-primary">{item.qty}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { Card } from "@/components/ui/card";
import { Cylinder } from "lucide-react";

type OldStockItem = {
  product_id: string;
  product_name: string;
  qty: number;
};

type SaleItem = {
  product: string; // must match product_name in old stock
  quantity: number;
};

interface ClosingStockSectionProps {
  oldStock: OldStockItem[];
  sales: SaleItem[];
}

export default function ClosingStockSection({
  oldStock,
  sales,
}: ClosingStockSectionProps) {
  // Total sold quantity per product
  const soldByProduct: Record<string, number> = sales.reduce(
    (acc, sale) => {
      acc[sale.product] = (acc[sale.product] || 0) + sale.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  // Closing = opening qty - sold qty (min 0)
  const closingStock = oldStock.map((item) => {
    const soldQty = soldByProduct[item.product_name] || 0;
    const remaining = Math.max(item.qty - soldQty, 0);

    return {
      product_id: item.product_id,
      product_name: item.product_name,
      qty: remaining,
    };
  });

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Closing Stock</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2">
          {closingStock.map((item) => (
            <Card key={item.product_id} className="p-3 min-w-max">
              <div className="flex flex-col items-center gap-2 w-24">
                <Cylinder className="h-6 w-6 text-primary" />
                <p className="text-xs font-medium text-center text-foreground line-clamp-2">
                  {item.product_name}
                </p>
                <p className="text-xl font-bold text-primary">{item.qty}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}