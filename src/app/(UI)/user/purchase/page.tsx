"use client";
import { UseRQ } from "@/hooks/useReactQuery";
import { getPlantLoadRegister } from "@/services/client_api-Service/user/purchase/purchase_api";

export default function Home() {
  const { data, isLoading } = UseRQ("register", getPlantLoadRegister);
  console.log(data);
  
  return (
    <main className="min-h-screen bg-background p-3 md:p-8">
      <h1>purchase view page</h1>
    </main>
  );
}
