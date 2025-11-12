"use client"
import dynamic from "next/dynamic"
const ExpenseSection = dynamic(()=>import('@/app/(UI)/user/expenses/_UI/expence-section'))

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <ExpenseSection />
    </main>
  )
}
