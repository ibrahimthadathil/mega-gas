import { LedgerDashboard } from "@/components/ledger/ledger-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <LedgerDashboard />
    </main>
  );
}