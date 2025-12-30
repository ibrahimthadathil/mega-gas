"use client";

import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import SimpleCard from "@/components/ui/simple-card";
import { Expense } from "@/types/types";

interface ExpensesSectionProps {
  expenses: Expense[];
}

export default function ExpensesSection({
  expenses,
}: ExpensesSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Expenses</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {expenses?.map((expense) => {
            return (
              <Card
                key={expense.id}
                className={`p-4 min-w-max w-56 cursor-pointer transition-colors`}
              >
                <SimpleCard
                  icon={FileText}
                  title={expense?.expenses_type}
                  subtitle={expense?.description?.substring(0, 20)}
                  amount={`₹${expense?.amount.toLocaleString()}`}
                  size="sm"
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}