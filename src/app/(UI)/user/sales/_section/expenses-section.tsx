"use client"

import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import SimpleCard from "@/components/ui/simple-card"

interface Expense {
  id: string
  date: string
  name: string
  amount: number
  image?: string
}

interface ExpensesSectionProps {
  expenses: Expense[]
  onChange: (expenses: Expense[]) => void
}

const dummyExpense: Expense = {
  id: "dummy-exp-1",
  date: "2025-01-15",
  name: "Fuel",
  amount: 2500,
}

export default function ExpensesSection({ expenses, onChange }: ExpensesSectionProps) {
  const displayExpenses = expenses.length === 0 ? [dummyExpense] : expenses
  const totalExpenses = displayExpenses.filter((e) => e.id !== "dummy-exp-1").reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Expenses</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {displayExpenses.map((expense) => (
            <Card key={expense.id} className="p-4 min-w-max w-56">
              <SimpleCard
                icon={FileText}
                title={expense.name}
                subtitle={expense.date}
                amount={`₹${expense.amount.toLocaleString()}`}
                size="sm"
              />
            </Card>
          ))}
        </div>
      </div>

      {totalExpenses > 0 && (
        <Card className="p-4 bg-muted">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">Total Expenses</p>
            <p className="text-xl font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
