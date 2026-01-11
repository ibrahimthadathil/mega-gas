"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TransactionForm } from "@/components/accounts/transaction-form"
import { Plus } from "lucide-react"
import { createNewLineItem } from "@/services/client_api-Service/user/accounts/accounts_api"
import { toast } from "sonner"

/* ================= TYPES ================= */

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

/* ===== NEW: COMPONENT PROPS (LOGIC ONLY) ===== */

type TransactionsPageProps = {
  isSales?: boolean
  onSalesSubmit?: (transaction: any) => void
}

/* ================= COMPONENT ================= */

export default function TransactionsPage({
  isSales = false,
  onSalesSubmit,
}: TransactionsPageProps) {
  const [openReceived, setOpenReceived] = useState(false)
  const [openPaid, setOpenPaid] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>()

  /* ===== UPDATED LOGIC (NO STYLE CHANGE) ===== */

  const handleAddTransaction = async (
    transaction: any,
    type: "received" | "paid"
  ) => {
    try {
      // 🟢 SALES MODE → PASS DATA TO PARENT
      if (isSales) {
        onSalesSubmit?.({
          line_Item:{...transaction.line_Item},
          transactionType: type,
        })

        type === "received"
          ? setOpenReceived(false)
          : setOpenPaid(false)

        return
      }else await createNewLineItem(transaction)       

      type === "received"
        ? setOpenReceived(false)
        : setOpenPaid(false)

    } catch (error) {
      toast.error("Transaction failed")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  /* ================= JSX ================= */

  return (
    <div className="bg-background ">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Transactions
          </h1>

          <div className="flex gap-3">
            {/* Cash Received */}
            <Dialog open={openReceived} onOpenChange={setOpenReceived}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-3 w-3" />
                  Cash Received
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[50vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Cash Received</DialogTitle>
                </DialogHeader>
                <TransactionForm
                isSales={isSales}
                  transactionType="received"
                  onSubmit={(transaction) =>
                    handleAddTransaction(transaction, "received")
                  }
                />
              </DialogContent>
            </Dialog>

            {/* Cash Paid */}
            <Dialog open={openPaid} onOpenChange={setOpenPaid}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Plus className="mr-2 h-3 w-3" />
                  Cash Paid
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Cash Paid</DialogTitle>
                </DialogHeader>
                <TransactionForm
                isSales={isSales}
                  transactionType="paid"
                  onSubmit={(transaction) =>
                    handleAddTransaction(transaction, "paid")
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Transaction Cards */}
        {!isSales&&<div className="flex gap-4 overflow-x-auto pb-2">
          {transactions?.map((transaction, index) => (
            <Card
              key={index}
              className="w-[230px] max-h-[180px] shrink-0 overflow-hidden"
            >
              <CardHeader className="p-2 bg-muted/50">
                <CardTitle className="text-sm truncate">
                  {transaction.line_Item.account_name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {transaction.line_Item.source_form}
                </p>
              </CardHeader>

              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground">
                  Amount
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    transaction.line_Item.amount_received ||
                      transaction.line_Item.amount_paid
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>}
      </div>
    </div>
  )
}
