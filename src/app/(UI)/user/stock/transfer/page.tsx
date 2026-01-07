import StockTransferSection from "@/app/(UI)/user/stock/transfer/_UI/stock-transfer-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Stock Transfer</h1>
        <StockTransferSection />
      </div>
    </main>
  )
}


// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import StockTransferSection from "@/app/(UI)/user/stock/transfer/_UI/stock-transfer-section";
// import { StockTransfer } from "@/types/stock";
// import { Skeleton } from "@/components/ui/skeleton";

// function TransferContent() {
//   const searchParams = useSearchParams();
//   const mode = searchParams.get("mode");
//   const transferId = searchParams.get("id");
  
//   const [editData, setEditData] = useState<StockTransfer | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Fetch the transfer data when in edit mode
//     const fetchTransferData = async () => {
//       if (mode === "edit" && transferId) {
//         setLoading(true);
//         try {
//           // Replace with your actual API call
//           // const data = await getTransferById(transferId);
//           // setEditData(data);
          
//           // For now, you can get it from the cache or make an API call
//           // Example: fetch from your existing stocks data
//           console.log("Fetching transfer data for ID:", transferId);
//         } catch (error) {
//           console.error("Error fetching transfer data:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchTransferData();
//   }, [mode, transferId]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-background p-4 sm:p-8">
//         <div className="max-w-4xl mx-auto">
//           <Skeleton className="h-10 w-64 mb-8" />
//           <Skeleton className="h-96 w-full" />
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-background p-4 sm:p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-foreground">
//           {mode === "edit" ? "Edit Stock Transfer" : "Stock Transfer"}
//         </h1>
//         <StockTransferSection 
//           editData={editData} 
//           mode={mode === "edit" ? "edit" : "create"}
//         />
//       </div>
//     </main>
//   );
// }

// export default function Home() {
//   return (
//     <Suspense fallback={
//       <main className="min-h-screen bg-background p-4 sm:p-8">
//         <div className="max-w-4xl mx-auto">
//           <Skeleton className="h-10 w-64 mb-8" />
//           <Skeleton className="h-96 w-full" />
//         </div>
//       </main>
//     }>
//       <TransferContent />
//     </Suspense>
//   );
// }