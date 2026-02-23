

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionForm } from "@/components/accounts/transaction-form";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRightFromSquareIcon,
} from "lucide-react";
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
import { lineItemFilterProps } from "@/types/transaction ";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { currentDate } from "@/lib/utils";
import Link from "next/link";
interface FilterState extends lineItemFilterProps {
  page: number;
  limit: number;
}
export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [openReceived, setOpenReceived] = useState(false);
  const [openPaid, setOpenPaid] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Filter states
  const [filter, setFilter] = useState<FilterState>({
    account_name: "",
    date: "",
    source_form: "",
    type: "",
    page: 1,
    limit: 10,
  });

  const { data: response, isLoading: transactionLoading } = UseRQ<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
  }>(["transaction", filter], () => getAllTransactions(filter));

  const transactions = response?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / filter.limit);

  const handleAddTransaction = async (
    transaction: any,
    type: "received" | "paid",
  ) => {
    try {

      const data = await createNewLineItem(transaction);
      if (data.success) {
        setOpenReceived(false);
        setOpenPaid(false);
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
      const data = await updateTransaction(
        editingTransaction.line_item_id,
        payload,
      );
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
      } else throw Error("Failed to Delete Transaction");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilter({
      account_name: "",
      date: "",
      source_form: "",
      type: "",
      page: 1,
      limit: 10,
    });
  };

  const hasActiveFilters =
    filter.account_name || filter.date || filter.source_form || filter.type;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header with title and add buttons */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Transactions
          </h1>
          <div className="flex gap-3">
            <Dialog open={openReceived} onOpenChange={setOpenReceived}>
              <DialogTrigger asChild>
                <Button size="lg" variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Cash Received
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-h-[90vh] max-w-2xl overflow-y-auto"
                aria-describedby={undefined}
              >
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

            <Dialog open={openPaid} onOpenChange={setOpenPaid}>
              <DialogTrigger asChild>
                <Button size="lg" variant="destructive">
                  <Plus className="mr-2 h-4 w-4" />
                  Cash Paid
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-h-[90vh] max-w-2xl overflow-y-auto"
                aria-describedby={undefined}
              >
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

        {/* Filters */}
        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                placeholder="Search account..."
                value={filter.account_name}
                onChange={(e) =>
                  handleFilterChange("account_name", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={filter.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_form">Source Form</Label>
              <Select
                value={filter.source_form}
                onValueChange={(value) =>
                  handleFilterChange("source_form", value)
                }
              >
                <SelectTrigger id="source_form">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="Transaction received">
                    Transaction Received
                  </SelectItem>
                  <SelectItem value="Transaction paid">
                    Transaction Paid
                  </SelectItem>
                  <SelectItem value="Sales Slip">Sales Slip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={filter.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="amount_received">Received</SelectItem>
                  <SelectItem value="amount_paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <DialogContent
            className="max-h-[90vh] max-w-2xl overflow-y-auto"
            aria-describedby={undefined}
          >
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

        {/* Transaction table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Source Form</TableHead>
                <TableHead>Amount Received</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(
                        transaction.transaction_date || transaction.date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{transaction.account_name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span >{transaction.source_form}</span>

                      {transaction.source_form === "Sales Slip" &&
                        transaction.source_reference_id && (
                          <Link
                            href={`/user/sales/delivery?id=${transaction.source_reference_id}`}
                            className="text-blue-600 hover:underline  text-xs"
                          >
                             <ArrowUpRightFromSquareIcon className="w-3 h-3"/>
                          </Link>
                        )}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {transaction.amount_received}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {transaction.amount_paid}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const remark = currentDate(transaction.created_at);

                        return (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="max-w-[100px] truncate cursor-pointer text-center">
                                  {remark.slice(0, 7)}..
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs whitespace-pre-wrap">
                                  {remark}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })()}
                    </TableCell>

                    <TableCell>
                      {transaction.source_form !== "Sales Slip" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setOpenEdit(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertModal
                            data={transaction}
                            varient={"ghost"}
                            contents={[
                             
                                <Trash2 className="w-4 h-4" />
                              ,
                              <>
                                This action cannot be undone. This will
                                permanently delete{" "}
                                <span className="font-semibold text-orange-400">
                                  {transaction.account_name || "This Account"}
                                </span>
                                's transaction and remove their data from our
                                servers.
                              </>,
                            ]}
                            action={() =>
                              onDelete(transaction.line_item_id as string)
                            }
                          />
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {transactions.length === 0
              ? 0
              : (filter.page - 1) * filter.limit + 1}{" "}
            to {Math.min(filter.page * filter.limit, total)} of {total}{" "}
            transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilter((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filter.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (filter.page <= 3) {
                  pageNum = i + 1;
                } else if (filter.page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = filter.page - 2 + i;
                }
                return (
                  <Button
                    key={i}
                    variant={filter.page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, page: pageNum }))
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilter((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={filter.page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
