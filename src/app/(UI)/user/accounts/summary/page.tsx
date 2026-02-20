import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AccountSummaryTable } from "@/components/accounts/account-summary-table";
export default function AccountSummaryPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Summary</h1>
            <p className="text-slate-500">Overview of all account positions and net balances.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/user/accounts/ledger" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Ledger
            </Link>
          </Button>
        </header>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Master List</h2>
          </div>
          <AccountSummaryTable  />
        </section>
      </div>
    </main>
  );
}
