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


