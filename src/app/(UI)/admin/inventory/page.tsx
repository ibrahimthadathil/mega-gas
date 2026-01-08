"use client";

// import DataTable from "@/components/data-table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getInventoryDetails } from "@/services/client_api-Service/admin/inventory/inventory_api";
// import React from "react";

// const page = () => {
//   const { data: Inventory, isLoading: inventoryLoading } = UseRQ(
//     "inventory",
//     getInventoryDetails
//   );
//   const columns = [
//     {
//       header: "No",
//       render: (_e: any, i: number) => `TR${i + 1}`,
//     },
//     {
//       key: "Ware",
//       header: "Warehouse name ",
//       render: (row: any) => row?.warehouse_name,
//     },
//   ];
//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-6">
//       <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
//       {inventoryLoading ? (
//         <Skeleton className="w-full h-24 bg-zinc-50" />
//       ) : (
//         // <DataTable columns={columns} itemsPerPage={10} data={Inventory ?? []} /><>

//       )}
//     </main>
//   );
// };

// export default page;

import DataTable from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import { getInventoryDetails } from "@/services/client_api-Service/admin/inventory/inventory_api";
import React, { useMemo } from "react";
interface InventoryItem {
  warehouse_id: string;
  product_id: string;
  warehouse_name: string;
  product_name: string;
  qty: number;
  is_empty: boolean;
  date?: string;
}
const Page = () => {
//   const { data: Inventory, isLoading: inventoryLoading } = UseRQ<InventoryItem>(
//     "inventory",
//     getInventoryDetails
//   );

const Inventory =  [

    
    {
      "warehouse_id": "beeeff0b-c848-41de-9ab0-0cc206967e12",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "Office leak",
      "product_name": "14 FULL",
      "qty": 2,
      "is_empty": false
    },
    {
      "warehouse_id": "0689096e-3b96-4920-b7ea-ee8de9bd7caf",
      "product_id": "4a615cc3-8ab7-428a-9c73-b3a57fa9c0e3",
      "warehouse_name": "3507/shameer",
      "product_name": "5 BLUE EMPTY",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
      "product_id": "4b029be7-a27c-4c9f-9c59-0d5e48349e29",
      "warehouse_name": "Chelari plant - DND",
      "product_name": "19 EMPTY",
      "qty": -40,
      "is_empty": true
    },
    {
      "warehouse_id": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Sathyan",
      "product_name": "14 EMPTY",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "0689096e-3b96-4920-b7ea-ee8de9bd7caf",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "3507/shameer",
      "product_name": "14 FULL",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "c1bccf6b-9177-4290-a5ce-66f0d3adfa9f",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Musthafa",
      "product_name": "14 EMPTY",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "7a185af1-5724-4c53-9f20-1ba96f7ef564",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Office",
      "product_name": "14 EMPTY",
      "qty": 2,
      "is_empty": false
    },
    {
      "warehouse_id": "fd1c08f6-21fd-4efc-bc3f-adc42b4982fa",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "Rafeek",
      "product_name": "14 FULL",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "Chelari plant - DND",
      "product_name": "14 FULL",
      "qty": -310,
      "is_empty": true
    },
    {
      "warehouse_id": "05819254-e3aa-4c69-b72c-f8f6454ef409",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Suku",
      "product_name": "14 EMPTY",
      "qty": 66,
      "is_empty": false
    },
    {
      "warehouse_id": "192645a7-a627-472e-b3db-5f4738c64157",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Unni",
      "product_name": "14 EMPTY",
      "qty": 57,
      "is_empty": false
    },
    {
      "warehouse_id": "2b226927-e173-454d-87fc-7e82c5baae51",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Siraj",
      "product_name": "14 EMPTY",
      "qty": 40,
      "is_empty": false
    },
    {
      "warehouse_id": "23d8c55a-969c-475e-b5be-b3362febdcd3",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Jabir",
      "product_name": "14 EMPTY",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "5223454b-080c-4907-8fc7-af518b13bbda",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Kuttan",
      "product_name": "14 EMPTY",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "2e56f8e1-10fd-4ebb-81c8-c6332a508e7f",
      "product_id": "0e5a0d35-34ff-4cf9-9d58-6cea5c4251ae",
      "warehouse_name": "Godown",
      "product_name": "5 BLUE FULL",
      "qty": 50,
      "is_empty": false
    },
    {
      "warehouse_id": "99a57515-d36a-42ec-8d63-8a72d2b95ab2",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Saleem",
      "product_name": "14 EMPTY",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "a1cc03bf-1daa-47f4-bae3-fa38179b70a2",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Noushad",
      "product_name": "14 EMPTY",
      "qty": 31,
      "is_empty": false
    },
    {
      "warehouse_id": "0689096e-3b96-4920-b7ea-ee8de9bd7caf",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "3507/shameer",
      "product_name": "14 EMPTY",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "45f24890-ccc2-4679-993b-c4567d0488bd",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "Shajahan",
      "product_name": "14 FULL",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Chelari plant - DND",
      "product_name": "14 EMPTY",
      "qty": -1175,
      "is_empty": true
    },
    {
      "warehouse_id": "2e56f8e1-10fd-4ebb-81c8-c6332a508e7f",
      "product_id": "4a615cc3-8ab7-428a-9c73-b3a57fa9c0e3",
      "warehouse_name": "Godown",
      "product_name": "5 BLUE EMPTY",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "a1cc03bf-1daa-47f4-bae3-fa38179b70a2",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "Noushad",
      "product_name": "14 FULL",
      "qty": 8,
      "is_empty": false
    },
    {
      "warehouse_id": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
      "product_id": "4a615cc3-8ab7-428a-9c73-b3a57fa9c0e3",
      "warehouse_name": "Chelari plant - DND",
      "product_name": "5 BLUE EMPTY",
      "qty": -100,
      "is_empty": true
    },
    {
      "warehouse_id": "7fdbe4bd-9c69-4744-b1c1-df85b3640630",
      "product_id": "4b029be7-a27c-4c9f-9c59-0d5e48349e29",
      "warehouse_name": "Jithin",
      "product_name": "19 EMPTY",
      "qty": 40,
      "is_empty": false
    },
    {
      "warehouse_id": "2e56f8e1-10fd-4ebb-81c8-c6332a508e7f",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Godown",
      "product_name": "14 EMPTY",
      "qty": 300,
      "is_empty": false
    },
    {
      "warehouse_id": "8efaab1d-5830-4329-ac8b-1b2cd17414f0",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Aneesh",
      "product_name": "14 EMPTY",
      "qty": 100,
      "is_empty": false
    },
    {
      "warehouse_id": "0689096e-3b96-4920-b7ea-ee8de9bd7caf",
      "product_id": "0e5a0d35-34ff-4cf9-9d58-6cea5c4251ae",
      "warehouse_name": "3507/shameer",
      "product_name": "5 BLUE FULL",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "45f24890-ccc2-4679-993b-c4567d0488bd",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Shajahan",
      "product_name": "14 EMPTY",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "fd1c08f6-21fd-4efc-bc3f-adc42b4982fa",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Rafeek",
      "product_name": "14 EMPTY",
      "qty": 0,
      "is_empty": true
    },
    {
      "warehouse_id": "400d5a52-acb4-45f0-bcf6-5e2150498034",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Jayesh",
      "product_name": "14 EMPTY",
      "qty": 66,
      "is_empty": false
    },
    {
      "warehouse_id": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
      "product_id": "0e5a0d35-34ff-4cf9-9d58-6cea5c4251ae",
      "warehouse_name": "Chelari plant - DND",
      "product_name": "5 BLUE FULL",
      "qty": -50,
      "is_empty": true
    },
    {
      "warehouse_id": "b72e7c06-9353-4150-ab14-7805de31557d",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Sudheesh",
      "product_name": "14 EMPTY",
      "qty": 60,
      "is_empty": false
    },
    {
      "warehouse_id": "4da20fc0-d16c-4a0d-a437-3bc777034427",
      "product_id": "56f79702-1e05-46bc-86c6-e29bab01869c",
      "warehouse_name": "Najeeb",
      "product_name": "14 EMPTY",
      "qty": 53,
      "is_empty": false
    },
    {
      "warehouse_id": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb",
      "product_id": "4195e948-9f1c-4931-aa85-68a08497e227",
      "warehouse_name": "Sathyan",
      "product_name": "14 FULL",
      "qty": 100,
      "is_empty": false
    }
  ]
  // Transform data into pivot format
  const pivotData = useMemo(() => {
    if (!Inventory || !Array.isArray(Inventory)) return [];

    // Group by date and warehouse_id
    const grouped = Inventory.reduce((acc: any, item: any) => {
      // Use date if available, otherwise use a placeholder
      const date = item.date || "No Date";
      const key = `${date}_${item.warehouse_id}`;

      if (!acc[key]) {
        acc[key] = {
          date,
          warehouse_id: item.warehouse_id,
          warehouse_name: item.warehouse_name,
          products: {},
        };
      }

      // Add product quantity
      acc[key].products[item.product_name] = item.qty;

      return acc;
    }, {});

    return Object.values(grouped);
  }, [Inventory]);

  // Get unique product names for dynamic columns
  const productNames = useMemo(() => {
    if (!Inventory || !Array.isArray(Inventory)) return [];

    const names = new Set<string>();
    Inventory.forEach((item: any) => {
      names.add(item.product_name);
    });

    return Array.from(names).sort();
  }, [Inventory]);

  // Build dynamic columns
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "No",
        render: (_e: any, i: number) => `${i + 1}`,
      },
      {
        key: "date",
        header: "Date",
        render: (row: any) => row?.date || "No Date",
      },
      {
        key: "warehouse_name",
        header: "Warehouse Name",
        render: (row: any) => row?.warehouse_name,
      },
    ];

    // Add dynamic product columns
    const productColumns = productNames.map((productName) => ({
      key: productName,
      header: productName,
      render: (row: any) => {
        const qty = row?.products?.[productName];
        return qty !== undefined ? qty : "-";
      },
    }));

    return [...baseColumns, ...productColumns];
  }, [productNames]);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">Inventory Stock</h1>
      {/* {inventoryLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : ( */}
        <DataTable columns={columns} itemsPerPage={10} data={pivotData ?? []} />
      {/* )} */}
    </main>
  );
};

export default Page;
