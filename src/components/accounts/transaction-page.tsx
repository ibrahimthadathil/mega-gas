"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/accounts/transaction-form";
import { Plus, Trash2, Pencil } from "lucide-react";
import { createNewLineItem } from "@/services/client_api-Service/user/accounts/accounts_api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
} from "@/services/client_api-Service/user/accounts/transaction_api";
import { Transaction } from "@/types/types";
import AlertModal from "@/components/alert-dialog";

// type LineItem = {
//   date: string;
//   account_name: string;
//   account_id: string;
//   amount_received: number;
//   amount_paid: number;
//   source_form: string;
//   source_form_reference_id: string | null;
//   created_by: string;
//   created_at: string;
// };

// type CashChest = {
//   note_500: number;
//   note_200: number;
//   note_100: number;
//   note_50: number;
//   note_20: number;
//   note_10: number;
//   coin_5: number;
//   source_reference_type: string;
//   created_by: string;
//   created_at: string;
// };

// type Transaction = {
//   line_Item: LineItem;
//   cash_chest: CashChest;
// };

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [openReceived, setOpenReceived] = useState(false);
  const [openPaid, setOpenPaid] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const { data: Transaction, isLoading: transactionLoading } = UseRQ<
    Transaction[]
  >("transaction", getAllTransactions);

  const handleAddTransaction = async (
    transaction: any,
    type: "received" | "paid"
  ) => {
    try {
      console.log(transaction);
      
      const data = await createNewLineItem(transaction);
      if (data.success) {
        setOpenReceived(false);
        queryClient.invalidateQueries({ queryKey: ["transaction"] });
        toast.success("Added new transaction");
      } else throw Error("Failed to Record new Transaction");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEdit = async (payload: any) => {
    if (!editingTransaction) return;
    
    try {
      const data = await updateTransaction(editingTransaction.line_item_id, payload);
      if (data.success) {
        setOpenEdit(false);
        setEditingTransaction(null);
        queryClient.invalidateQueries({ queryKey: ["transaction"] });
        toast.success("Transaction updated successfully");
      } else throw Error("Failed to update transaction");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const data = await deleteTransaction(id);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["transaction"] });
        toast.success("Deleted");
      } else throw Error("Failed to Delete  Transaction");
    } catch (error) {}
  };


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header with title and add buttons */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Transactions
          </h1>
          <div className="flex gap-3">
            {/* Cash Received Button */}
            <Dialog open={openReceived} onOpenChange={setOpenReceived}>
              <DialogTrigger asChild>
                <Button size="lg" variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Cash Received
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle>Add Cash Received</DialogTitle>
                </DialogHeader>
                <TransactionForm
                  onSubmit={(transaction) =>
                    handleAddTransaction(transaction, "received")
                  }
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
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle>Add Cash Paid</DialogTitle>
                </DialogHeader>
                <TransactionForm
                  onSubmit={(transaction) =>
                    handleAddTransaction(transaction, "paid")
                  }
                  transactionType="paid"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Transaction Dialog */}
        <Dialog 
          open={openEdit} 
          onOpenChange={(open) => {
            setOpenEdit(open);
            if (!open) {
              setEditingTransaction(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {editingTransaction && (
              <TransactionForm
                onSubmit={() => {}}
                onEdit={handleEdit}
                transactionType={
                  editingTransaction.amount_received > 0 ? "received" : "paid"
                }
                initialData={editingTransaction}
                transactionId={editingTransaction.line_item_id}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Transaction cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!transactionLoading &&
            Transaction?.map((transaction, index) => (
              <Card key={index} className="w-[300px] overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {transaction.account_name}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {transaction.source_form}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Amount Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Amount Received
                        </span>
                        <span className="font-medium text-green-600">
                          {transaction.amount_received}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Amount Paid
                        </span>
                        <span className="font-medium text-red-600">
                          {transaction.amount_paid}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="flex gap-2 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setOpenEdit(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <AlertModal
                    data={transaction}
                    style="flex-1"
                    varient={"ghost"}
                    contents={[
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive gap-2 w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>,
                      <>
                        This action cannot be undone. This will permanently delete{" "}
                        <span className="font-semibold text-orange-400">
                          {transaction.account_name || "This Account"}
                        </span>
                        's transaction and remove their data from our servers.
                      </>,
                    ]}
                    action={() => onDelete(transaction.line_item_id as string)}
                  />
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
