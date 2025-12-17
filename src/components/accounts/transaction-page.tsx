
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TransactionForm } from "@/components/accounts/transaction-form"
import { Plus } from "lucide-react"
import { createNewLineItem } from "@/services/client_api-Service/user/accounts/accounts_api"
import { toast } from "sonner"

type LineItem = {
  date: string
  account_name: string
  account_id: string
  amount_received: number
  amount_paid: number
  source_form: string
  source_form_reference_id: string | null
  created_by: string
  created_at: string
}

type CashChest = {
  note_500: number
  note_200: number
  note_100: number
  note_50: number
  note_20: number
  note_10: number
  coin_5: number
  source_reference_type: string
  created_by: string
  created_at: string
}

type Transaction = {
  line_Item: LineItem
  cash_chest: CashChest
}

export default function TransactionsPage() {
  const [openReceived, setOpenReceived] = useState(false)
  const [openPaid, setOpenPaid] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      line_Item: {
        date: "2025-01-14",
        account_name: "Musthafakka",
        account_id: "6d1b9d9e-5556-40c4-a0ea-f6e9ef6423ac",
        amount_received: 0,
        amount_paid: 8500,
        source_form: "Expence",
        source_form_reference_id: null,
        created_by: "5ba724f3-e625-4b82-912c-5f7a080263c9",
        created_at: "2025-01-14T13:20:00Z",
      },
      cash_chest: {
        note_500: 15,
        note_200: 65,
        note_100: 75,
        note_50: 25,
        note_20: 65,
        note_10: 45,
        coin_5: 6,
        source_reference_type: "payments-receipts",
        created_by: "5ba724f3-e625-4b82-912c-5f7a080263c9",
        created_at: "2025-01-14T13:20:00Z",
      },
    },
  ])

  const handleAddTransaction = async (transaction: any, type: 'received' | 'paid') => {
    try {
      // alert('check the log')
      console.log(transaction);
      
      await createNewLineItem(transaction)
      // if (type === 'received') {
      //   setOpenReceived(false)
      // } else {
      //   setOpenPaid(false)
      // }
    } catch (error) {
      toast.error('transaction failed ')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTotal = (cashChest: CashChest) => {
    return (
      cashChest.note_500 * 500 +
      cashChest.note_200 * 200 +
      cashChest.note_100 * 100 +
      cashChest.note_50 * 50 +
      cashChest.note_20 * 20 +
      cashChest.note_10 * 10 +
      cashChest.coin_5 * 5
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header with title and add buttons */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-balance text-3xl font-bold tracking-tight">Transactions</h1>
          <div className="flex gap-3">
            {/* Cash Received Button */}
            <Dialog open={openReceived} onOpenChange={setOpenReceived}>
              <DialogTrigger asChild>
                <Button size="lg" variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Cash Received
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Cash Received</DialogTitle>
                </DialogHeader>
                <TransactionForm 
                  onSubmit={(transaction) => handleAddTransaction(transaction, 'received')} 
                  transactionType="received"
                />
              </DialogContent>
            </Dialog>

            {/* Cash Paid Button */}
            <Dialog open={openPaid} onOpenChange={setOpenPaid}>
              <DialogTrigger asChild>
                <Button size="lg" variant="destructive">
                  <Plus className="mr-2 h-4 w-4" />
                  Cash Paid
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Cash Paid</DialogTitle>
                </DialogHeader>
                <TransactionForm 
                  onSubmit={(transaction) => handleAddTransaction(transaction, 'paid')} 
                  transactionType="paid"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Transaction cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {transactions.map((transaction, index) => (
            <Card key={index} className="w-[600px] overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{transaction.line_Item.account_name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(transaction.line_Item.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">{transaction.line_Item.source_form}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Amount Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Received</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(transaction.line_Item.amount_received)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(transaction.line_Item.amount_paid)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}