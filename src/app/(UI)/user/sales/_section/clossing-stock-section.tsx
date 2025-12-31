"use client";

import { Card } from "@/components/ui/card";
import { Cylinder } from "lucide-react";

type OldStockItem = {
  product_id: string;
  product_name: string;
  qty: number;
};

type SaleComponent = {
  qty: number;
  sale_price: number;
  child_product_id: string;
};

type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  isComposite: boolean;
  components?: SaleComponent[] | null;
};

interface ClosingStockSectionProps {
  oldStock: OldStockItem[];
  sales: SaleItem[];
}

export default function ClosingStockSection({
  oldStock,
  sales,
}: ClosingStockSectionProps) {
  // Calculate sold and returned quantities per product ID
  const filledSoldByProductId: Record<string, number> = {};
  const emptiesReturnedByProductId: Record<string, number> = {};

  sales.forEach((sale) => {
    if (sale.isComposite && sale.components && sale.components.length > 0) {
      // Check if there's any negative component (empty return) in this sale
      const hasEmptyReturn = sale.components.some(comp => comp.qty < 0);
      
      sale.components.forEach((component) => {
        const productId = component.child_product_id;
        const qty = component.qty * sale.quantity;
        
        if (component.qty > 0) {
          // Filled cylinders sold
          filledSoldByProductId[productId] = 
            (filledSoldByProductId[productId] || 0) + qty;
          
          // If this sale has empty return, count this filled sale as having an empty
          if (hasEmptyReturn) {
            emptiesReturnedByProductId[productId] = 
              (emptiesReturnedByProductId[productId] || 0) + qty;
          }
        }
      });
    } else {
      // Non-composite products count as filled sold only
      filledSoldByProductId[sale.productId] = 
        (filledSoldByProductId[sale.productId] || 0) + sale.quantity;
      // Non-composite products don't have empties
    }
  });

  // Calculate net sold quantity (considering all components)
  const netSoldByProductId: Record<string, number> = {};
  
  sales.forEach((sale) => {
    if (sale.isComposite && sale.components && sale.components.length > 0) {
      sale.components.forEach((component) => {
        const productId = component.child_product_id;
        const qty = component.qty * sale.quantity;
        netSoldByProductId[productId] = (netSoldByProductId[productId] || 0) + qty;
      });
    } else {
      netSoldByProductId[sale.productId] = 
        (netSoldByProductId[sale.productId] || 0) + sale.quantity;
    }
  });

  // Calculate closing stock for each product
  const closingStock = oldStock.map((item) => {
    const filledSold = filledSoldByProductId[item.product_id] || 0;
    const emptiesReturned = emptiesReturnedByProductId[item.product_id] || 0;
    const netSold = netSoldByProductId[item.product_id] || 0;
    const closing = item.qty - netSold;

    return {
      product_id: item.product_id,
      product_name: item.product_name,
      closingQty: closing,
      filledSold: filledSold,
      emptiesReturned: emptiesReturned,
    };
  });

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Closing Stock</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {closingStock.map((item) => (
            <Card key={item.product_id} className="p-4 min-w-max">
              <div className="flex flex-col items-center gap-3 w-32">
                {/* <Cylinder className="h-8 w-8 text-primary" /> */}
                <p className="text-md font-medium text-center text-foreground line-clamp-2">
                  {item.product_name} 
                </p>
                
                {/* Closing Stock - Main Display */}
                {/* <div className="text-center w-full">
                  <p className="text-xl font-bold text-primary">
                    {item.closingQty}
                  </p>
                </div> */}

                {/* Sold Count */}
                <div className="w-full pt-2 border-t">  
                  <div className="flex justify-between items-center">
                    <span className="text-md font-semibold">Full: <Cylinder className="h-5 w-5"/></span>
                    <span className="text-sm font-semibold text-red-600">
                      {item.closingQty}
                    </span>
                  </div>
                </div>

                {/* Empty Cylinders Returned */}
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-md font-semibold">Empty:<Cylinder className="h-5 w-5"/></span>
                    <span className="text-sm font-semibold text-green-600">
                      {item.emptiesReturned}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}