// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { TransactionForm } from "@/components/accounts/transaction-form"
// import { Plus } from "lucide-react"
// import { createNewLineItem } from "@/services/client_api-Service/user/accounts/accounts_api"
// import { toast } from "sonner"

// /* ================= TYPES ================= */

// type LineItem = {
//   date: string
//   account_name: string
//   account_id: string
//   amount_received: number
//   amount_paid: number
//   source_form: string
//   source_form_reference_id: string | null
//   created_by: string
//   created_at: string
// }

// type CashChest = {
//   note_500: number
//   note_200: number
//   note_100: number
//   note_50: number
//   note_20: number
//   note_10: number
//   coin_5: number
//   source_reference_type: string
//   created_by: string
//   created_at: string
// }

// type Transaction = {
//   line_Item: LineItem
//   cash_chest: CashChest
// }

// /* ===== NEW: COMPONENT PROPS (LOGIC ONLY) ===== */

// type TransactionsPageProps = {
//   isSales?: boolean
//   onSalesSubmit?: (transaction: any) => void
// }

// /* ================= COMPONENT ================= */

// export default function TransactionsPage({
//   isSales = false,
//   onSalesSubmit,
// }: TransactionsPageProps) {
//   const [openReceived, setOpenReceived] = useState(false)
//   const [openPaid, setOpenPaid] = useState(false)
//   const [transactions, setTransactions] = useState<Transaction[]>()

//   /* ===== UPDATED LOGIC (NO STYLE CHANGE) ===== */

//   const handleAddTransaction = async (
//     transaction: any,
//     type: "received" | "paid"
//   ) => {
//     try {
//       // 🟢 SALES MODE → PASS DATA TO PARENT
//       if (isSales) {
//         onSalesSubmit?.({
//           line_Item:{...transaction.line_Item},
//           transactionType: type,
//         })

//         type === "received"
//           ? setOpenReceived(false)
//           : setOpenPaid(false)

//         return
//       }else await createNewLineItem(transaction)       

//       type === "received"
//         ? setOpenReceived(false)
//         : setOpenPaid(false)

//     } catch (error) {
//       toast.error("Transaction failed")
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount)
//   }

//   /* ================= JSX ================= */

//   return (
//     <div className="bg-background ">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-8 flex items-center justify-between">
//           <h1 className="text-lg sm:text-xs font-semibold tracking-tight">
//             Transactions
//           </h1>

//           <div className="flex ">
//             {/* Cash Received */}
//             <Dialog open={openReceived} onOpenChange={setOpenReceived}>
//               <DialogTrigger asChild>
//                 <Button >
//                   <Plus className="mr-2 h-2 w-2" />
//                   <p className="text-sm">Cash Received</p>
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-h-[50vh] max-w-2xl overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle className="text-sm ">Add Cash Received</DialogTitle>
//                 </DialogHeader>
//                 <TransactionForm
//                 isSales={isSales}
//                   transactionType="received"
//                   onSubmit={(transaction) =>
//                     handleAddTransaction(transaction, "received")
//                   }
//                 />
//               </DialogContent>
//             </Dialog>

//             {/* Cash Paid */}
//             <Dialog open={openPaid} onOpenChange={setOpenPaid}>
//               <DialogTrigger asChild>
//                 <Button variant="destructive">
//                   <Plus className="mr-2 h-3 w-3" />
//                   Cash Paid
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>Add Cash Paid</DialogTitle>
//                 </DialogHeader>
//                 <TransactionForm
//                 isSales={isSales}
//                   transactionType="paid"
//                   onSubmit={(transaction) =>
//                     handleAddTransaction(transaction, "paid")
//                   }
//                 />
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Transaction Cards */}
//         {!isSales&&<div className="flex gap-4 overflow-x-auto pb-2">
//           {transactions?.map((transaction, index) => (
//             <Card
//               key={index}
//               className="w-[230px] max-h-[180px] shrink-0 overflow-hidden"
//             >
//               <CardHeader className="p-2 bg-muted/50">
//                 <CardTitle className="text-sm truncate">
//                   {transaction.line_Item.account_name}
//                 </CardTitle>
//                 <p className="text-xs text-muted-foreground">
//                   {transaction.line_Item.source_form}
//                 </p>
//               </CardHeader>

//               <CardContent className="p-2">
//                 <p className="text-xs text-muted-foreground">
//                   Amount
//                 </p>
//                 <p className="text-lg font-semibold">
//                   {formatCurrency(
//                     transaction.line_Item.amount_received ||
//                       transaction.line_Item.amount_paid
//                   )}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>}
//       </div>
//     </div>
//   )
// }

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
  onSalesSubmit?: (transaction: any) => void;
  slipDate?:string
}

/* ================= COMPONENT ================= */

export default function TransactionsPage({
  isSales = false,
  onSalesSubmit,
  slipDate,
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
      } else await createNewLineItem(transaction)       

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
    <div className="bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">
            Transactions
          </h1>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Cash Received */}
            <Dialog open={openReceived} onOpenChange={setOpenReceived}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4">
                  <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">Cash Received</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle className="text-sm sm:text-base md:text-lg">
                    Add Cash Received
                  </DialogTitle>
                </DialogHeader>
                <TransactionForm
                slipDate={slipDate}
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
                <Button 
                  variant="destructive" 
                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4"
                >
                  <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">Cash Paid</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-sm sm:text-base md:text-lg">
                    Add Cash Paid
                  </DialogTitle>
                </DialogHeader>
                <TransactionForm
                slipDate={slipDate}
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
        {!isSales && (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-3">
            {transactions?.map((transaction, index) => (
              <Card
                key={index}
                className="w-[180px] sm:w-[200px] md:w-[230px] max-h-[150px] sm:max-h-[165px] md:max-h-[180px] shrink-0 overflow-hidden"
              >
                <CardHeader className="p-2 sm:p-3 bg-muted/50">
                  <CardTitle className="text-xs sm:text-sm md:text-base truncate">
                    {transaction.line_Item.account_name}
                  </CardTitle>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {transaction.line_Item.source_form}
                  </p>
                </CardHeader>

                <CardContent className="p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold">
                    {formatCurrency(
                      transaction.line_Item.amount_received ||
                        transaction.line_Item.amount_paid
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}