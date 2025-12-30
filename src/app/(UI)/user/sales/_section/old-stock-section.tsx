// import { Card } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getOldStock } from "@/services/client_api-Service/user/sales/delivery_api";
// import { useQueryClient } from "@tanstack/react-query";
// import { Cylinder } from "lucide-react";
// import { useEffect } from "react";

// interface oldStock {
//   warehouse_id: string;
//   product_id: string;
//   warehouse_name: string;
//   product_name: string;
//   qty: number;
// }

// interface OldStockSectionProps {
//   vehicleId: string;
//   onLoaded?: (stock: oldStock[]) => void;
// }

// export default function OldStockSection({ vehicleId, onLoaded }: OldStockSectionProps) {
//   const queryClient= useQueryClient()
//   const { data: oldStock, isLoading: StockLoading } = UseRQ<oldStock[]>(
//     "oldstock",
//     () => getOldStock(vehicleId)
//   );

//   useEffect(() => {
//     queryClient.invalidateQueries({queryKey:['oldstock']})
//   }, [vehicleId]);

//    useEffect(() => {
//     if (oldStock && onLoaded) {
//       onLoaded(oldStock);
//     }
//   }, [oldStock, onLoaded]);
//   return (
//     <div className="space-y-3">
//       <h2 className="text-lg font-semibold text-foreground">Old Stock</h2>
//       <div className="overflow-x-auto pb-2">
//         <div className="flex gap-2">
//           {StockLoading ? (
//             <Skeleton className="h-[80px] w-2/5 rounded-xl" />
//           ) : (
//             oldStock?.map((item) => (
//               <Card key={item.product_id} className="p-3 min-w-max">
//                 <div className="flex flex-col items-center gap-2 w-24">
//                   <Cylinder className="h-6 w-6 text-primary" />
//                   <p className="text-xs font-medium text-center text-foreground line-clamp-2">
//                     {item.product_name}
//                   </p>
//                   <p className="text-xl font-bold text-primary">{item.qty}</p>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
// import { getOldStock } from "@/services/client_api-Service/user/sales/delivery_api";
import { useQueryClient } from "@tanstack/react-query";
import { Cylinder } from "lucide-react";
import { useEffect } from "react";

interface oldStock {
  warehouse_id: string;
  product_id: string;
  warehouse_name: string;
  product_name: string;
  qty: number;
}

export default function OldStockSection({openingStock,loading}:{openingStock:oldStock[],loading:boolean}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Old Stock</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2">
          {loading ? (
            <Skeleton className="h-[80px] w-2/5 rounded-xl" />
          ) : (
          openingStock?.map((item) => (
            <Card key={item.product_id} className="p-3 min-w-max">
              <div className="flex flex-col items-center gap-2 w-24">
                <Cylinder className="h-6 w-6 text-primary" />
                <p className="text-xs font-medium text-center text-foreground line-clamp-2">
                  {item.product_name}
                </p>
                <p className="text-xl font-bold text-primary">{item.qty}</p>
              </div>
            </Card>
          )))}
        </div>
      </div>
    </div>
  );
}
