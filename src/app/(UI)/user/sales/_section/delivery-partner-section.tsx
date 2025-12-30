// "use client";

// import { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface DeliveryBoy {
//   id: string;
//   user_name: string;
// }

// interface DeliveryPartnerSectionProps {
//   selectedDeliveryBoys: DeliveryBoy[];
//   onChange: (deliveryBoys: DeliveryBoy[]) => void;
//   deliveryBoys:DeliveryBoy[]
// }


// export default function DeliveryPartnerSection({
//   selectedDeliveryBoys,
//   onChange,
//   deliveryBoys
// }: DeliveryPartnerSectionProps) {
//   const [selectedValue, setSelectedValue] = useState<string>("");

//   const handleAddDeliveryBoy = (deliveryBoyId: string) => {
//     const deliveryBoy = deliveryBoys.find((db) => db.id === deliveryBoyId);
//     if (
//       deliveryBoy &&
//       !selectedDeliveryBoys.some((db) => db.id === deliveryBoyId)
//     ) {
//       onChange([...selectedDeliveryBoys, deliveryBoy]);
//     }
//     setSelectedValue("");
//   };

//   const handleRemoveDeliveryBoy = (deliveryBoyId: string) => {
//     onChange(selectedDeliveryBoys.filter((db) => db.id !== deliveryBoyId));
//   };

//   // Get available delivery boys (not already selected)
//   const availableDeliveryBoys = deliveryBoys?.filter(
//     (db) => !selectedDeliveryBoys.some((selected) => selected.id === db.id)
//   )??[];

//   return (
//     <>
      
//       <Card className="p-4">
//         <div className="space-y-3">
//           <h2 className="text-lg font-semibold text-foreground">
//             Delivery Boys
//           </h2>

//           <Select value={selectedValue} onValueChange={handleAddDeliveryBoy}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select delivery boys" />
//             </SelectTrigger>
//             <SelectContent>
//               {
//               // availableDeliveryBoys.length === 0 ? (
//               //   <div className="px-2 py-1.5 text-sm text-muted-foreground">
//               //     All delivery boys selected
//               //   </div>
//               // ) :
//                (
//                 availableDeliveryBoys.map((deliveryBoy) => (
//                   <SelectItem key={deliveryBoy.id} value={deliveryBoy.id}>
//                     {deliveryBoy.user_name}
//                   </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>

//           {/* Selected Delivery Boys */}
//           {selectedDeliveryBoys.length > 0 && (
//             <div className="pt-2 border-t">
//               <label className="text-sm font-medium text-muted-foreground mb-2 block">
//                 Selected Delivery Boys ({selectedDeliveryBoys.length})
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {selectedDeliveryBoys.map((deliveryBoy) => (
//                   <div
//                     key={deliveryBoy.id}
//                     className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md"
//                   >
//                     <span className="text-sm font-medium">
//                       {deliveryBoy.user_name}
//                     </span>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="h-5 w-5 p-0 hover:bg-primary/20"
//                       onClick={() => handleRemoveDeliveryBoy(deliveryBoy.id)}
//                     >
//                       <X className="h-3.5 w-3.5" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {selectedDeliveryBoys.length === 0 && (
//             <p className="text-sm text-muted-foreground pt-2 border-t">
//               No delivery boys selected. Please select from the dropdown above.
//             </p>
//           )}
//         </div>
//       </Card>
//     </>
//   );
// }


"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeliveryBoy {
  id: string;
  user_name: string;
}

interface DeliveryPartnerSectionProps {
  selectedDeliveryBoys: string[] ;
  onChange: (deliveryBoyIds: string[] | null) => void;
  deliveryBoys: DeliveryBoy[];
}

export default function DeliveryPartnerSection({
  selectedDeliveryBoys,
  onChange,
  deliveryBoys,
}: DeliveryPartnerSectionProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Ensure selectedDeliveryBoys is always an array
  const selectedIds = selectedDeliveryBoys || [];

  const handleAddDeliveryBoy = (deliveryBoyId: string) => {
    if (!selectedIds.includes(deliveryBoyId)) {
      onChange([...selectedIds, deliveryBoyId]);
    }
    setSelectedValue("");
  };

  const handleRemoveDeliveryBoy = (deliveryBoyId: string) => {
    const updatedIds = selectedIds.filter((id) => id !== deliveryBoyId);
    onChange(updatedIds.length > 0 ? updatedIds : null);
  };

  // Get available delivery boys (not already selected)
  const availableDeliveryBoys = deliveryBoys?.filter(
    (db) => !selectedIds.includes(db.id)
  ) ?? [];

  // Get full delivery boy objects for selected IDs
  const selectedDeliveryBoysObjects = selectedIds
    .map((id) => deliveryBoys?.find((db) => db.id === id))
    .filter((db): db is DeliveryBoy => db !== undefined);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Delivery Boys
        </h2>

        <Select value={selectedValue} onValueChange={handleAddDeliveryBoy}>
          <SelectTrigger>
            <SelectValue placeholder="Select delivery boys" />
          </SelectTrigger>
          <SelectContent>
            {availableDeliveryBoys.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                All delivery boys selected
              </div>
            ) : (
              availableDeliveryBoys.map((deliveryBoy) => (
                <SelectItem key={deliveryBoy.id} value={deliveryBoy.id}>
                  {deliveryBoy.user_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Selected Delivery Boys */}
        {selectedDeliveryBoysObjects.length > 0 && (
          <div className="pt-2 border-t">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Selected Delivery Boys ({selectedDeliveryBoysObjects.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedDeliveryBoysObjects.map((deliveryBoy) => (
                <div
                  key={deliveryBoy.id}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md"
                >
                  <span className="text-sm font-medium">
                    {deliveryBoy.user_name}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 hover:bg-primary/20"
                    onClick={() => handleRemoveDeliveryBoy(deliveryBoy.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDeliveryBoysObjects.length === 0 && (
          <p className="text-sm text-muted-foreground pt-2 border-t">
            No delivery boys selected. Please select from the dropdown above.
          </p>
        )}
      </div>
    </Card>
  );
}