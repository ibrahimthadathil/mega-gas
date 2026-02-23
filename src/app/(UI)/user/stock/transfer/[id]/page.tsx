"use client";

import { useParams, useRouter } from "next/navigation";
import StockTransferSection from "@/app/(UI)/user/stock/transfer/_UI/stock-transfer-section";
import { useQueryClient } from "@tanstack/react-query";
import { StockTransfer } from "@/types/stock";
import { useEffect, useState } from "react";
import Loading from "@/loading";

export default function EditStockTransferPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const transferId = params.id as string;

  const cachedData = queryClient.getQueryData<StockTransfer>([
    "stock-transfer-edit",
    transferId,
  ]);

  const [transferData, setTransferData] = useState<StockTransfer | null>(
    cachedData || null
  );

  useEffect(() => {
    if (!cachedData) {
      router.push("/user/stock");
    } else {
      setTransferData(cachedData);
    }
  }, [cachedData, router]);

  if (!transferData) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Loading/>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Edit Stock Transfer
        </h1>
        <StockTransferSection initialData={transferData} />
      </div>
    </main>
  );
}