"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UseRQ } from "@/hooks/useReactQuery";
import { getAllAccountsParty } from "@/services/client_api-Service/user/accounts/accounts_api";
import { Accounts, Transaction as ApiTransaction } from "@/types/types";

type LineItem = {
  date: string;
  account_name: string;
  account_id: string;
  amount_received: number;
  amount_paid: number;
  source_form: string;
  source_form_reference_id: string | null;
  remarks: string;
  created_at?: string;
};

type CashChest = {
  note_500: number;
  note_200: number;
  note_100: number;
  note_50: number;
  note_20: number;
  note_10: number;
  coin_5: number;
  source_reference_type: string;
  created_by?: string;
  created_at?: string;
};

type Transaction = {
  line_Item: LineItem;
  cash_chest: CashChest;
};

type TransactionFormProps = {
  onEdit?: (transaction: Transaction) => void;
  onSubmit: (transaction: Transaction) => void;
  transactionType: "received" | "paid";
  isSales?: boolean;
  initialData?: ApiTransaction;
  transactionId?: string;
};

// Create validation schema
const createTransactionSchema = (
  transactionType: "received" | "paid",
  isSales: boolean
) => {
  return z
    .object({
      line_Item: z.object({
        date: z.string().min(1, "Date is required"),
        account_name: z.string().min(1, "Account name is required"),
        account_id: z.string().min(1, "Account is required"),
        amount_received:
          transactionType === "received"
            ? z.number().positive("Amount must be greater than 0")
            : z.number(),
        amount_paid:
          transactionType === "paid"
            ? z.number().positive("Amount must be greater than 0")
            : z.number(),
        source_form: z.string(),
        source_form_reference_id: z.string().nullable(),
        remarks: z.string(),
        created_at: z.string().optional(),
      }),
      cash_chest: z.object({
        note_500: z.number().min(0, "Cannot be negative"),
        note_200: z.number().min(0, "Cannot be negative"),
        note_100: z.number().min(0, "Cannot be negative"),
        note_50: z.number().min(0, "Cannot be negative"),
        note_20: z.number().min(0, "Cannot be negative"),
        note_10: z.number().min(0, "Cannot be negative"),
        coin_5: z.number().min(0, "Cannot be negative"),
        source_reference_type: z
          .string()
          .min(1, "Source reference type is required"),
        created_by: z.string().optional(),
        created_at: z.string().optional(),
      }),
    })
    .refine(
      (data) => {
        // Skip cash chest validation if isSales is true
        if (isSales) return true;

        const cashTotal =
          data.cash_chest.note_500 * 500 +
          data.cash_chest.note_200 * 200 +
          data.cash_chest.note_100 * 100 +
          data.cash_chest.note_50 * 50 +
          data.cash_chest.note_20 * 20 +
          data.cash_chest.note_10 * 10 +
          data.cash_chest.coin_5 * 5;

        const transactionAmount =
          transactionType === "received"
            ? data.line_Item.amount_received
            : data.line_Item.amount_paid;

        return cashTotal <= transactionAmount;
      },
      {
        message: `Cash chest total cannot exceed the ${
          transactionType === "received" ? "received" : "paid"
        } amount`,
        path: ["cash_chest"],
      }
    );
};

export function TransactionForm({
  onSubmit,
  transactionType,
  isSales = false,
  initialData,
  transactionId,
  onEdit,
}: TransactionFormProps) {
  const { data: accountName, isLoading } = UseRQ<Accounts[]>(
    "accounts",
    getAllAccountsParty
  );

  const transformInitialData = (data?: ApiTransaction): Transaction => {
    if (!data) {
      return {
        line_Item: {
          date: new Date().toISOString().split("T")[0],
          account_name: "",
          account_id: "",
          amount_received: 0,
          amount_paid: 0,
          source_form: "Transaction "  + transactionType,
          source_form_reference_id: null,
          remarks: "",
          
        },
        cash_chest: {
          note_500: 0,
          note_200: 0,
          note_100: 0,
          note_50: 0,
          note_20: 0,
          note_10: 0,
          coin_5: 0,
          source_reference_type: "payments-receipts",
          
        },
      };
    }

    return {
      line_Item: {
        date:
          data.date ||
          data.transaction_date?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        account_name: data.account_name || "",
        account_id: data.account_id || "",
        amount_received: data.amount_received || 0,
        amount_paid: data.amount_paid || 0,
        source_form: data.source_form || "Expence",
        source_form_reference_id: null,
        remarks: data.remark || "",
      },
      cash_chest: {
        note_500: data.note_500 || 0,
        note_200: data.note_200 || 0,
        note_100: data.note_100 || 0,
        note_50: data.note_50 || 0,
        note_20: data.note_20 || 0,
        note_10: data.note_10 || 0,
        coin_5: data.coin_5 || 0,
        source_reference_type: "payments-receipts",

      },
    };
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Transaction>({
    resolver: zodResolver(createTransactionSchema(transactionType, isSales)),
    defaultValues: transformInitialData(initialData),
  });

  const watchedFields = watch();
  const showCashChest =
    !isSales &&
    watchedFields.line_Item.date !== "" &&
    watchedFields.line_Item.account_id !== "" &&
    (transactionType === "received"
      ? watchedFields.line_Item.amount_received > 0
      : watchedFields.line_Item.amount_paid > 0);

  useEffect(() => {
    if (initialData) {
      reset(transformInitialData(initialData));
    }
  }, [initialData, reset]);

  const calculateTotal = () => {
    return (
      watchedFields.cash_chest.note_500 * 500 +
      watchedFields.cash_chest.note_200 * 200 +
      watchedFields.cash_chest.note_100 * 100 +
      watchedFields.cash_chest.note_50 * 50 +
      watchedFields.cash_chest.note_20 * 20 +
      watchedFields.cash_chest.note_10 * 10 +
      watchedFields.cash_chest.coin_5 * 5
    );
  };

  const handleAccountSelect = (accountId: string) => {
    const selectedAccount = accountName?.find((acc) => acc.id === accountId);
    setValue("line_Item.account_id", accountId);
    setValue("line_Item.account_name", selectedAccount?.account_name || "");
  };

  const onFormSubmit = (data: Transaction) => {
    if (onEdit && transactionId) {
      onEdit(data);
    } else {
      onSubmit(data);
    }
  };

  const isEditMode = !!transactionId && !!onEdit;
  const cashTotal = calculateTotal();
  const transactionAmount =
    transactionType === "received"
      ? watchedFields.line_Item.amount_received
      : watchedFields.line_Item.amount_paid;
  const cashExceedsAmount = !isSales && cashTotal > transactionAmount;

  return (
    <div className="space-y-6">
      {/* Line Item Section */}
      <div className="space-y-4">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Transaction Details</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="line_Item.date"
                control={control}
                render={({ field }) => (
                  <Input id="date" type="date" {...field}  readOnly={isSales}/>
                )}
              />
              {errors.line_Item?.date && (
                <p className="text-sm text-red-500">
                  {errors.line_Item.date.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account_name">Account Name</Label>
              <Controller
                name="line_Item.account_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={handleAccountSelect}
                  >
                    <SelectTrigger id="account_name">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoading &&
                        accountName?.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account?.id as string}
                          >
                            {account.account_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.line_Item?.account_id && (
                <p className="text-sm text-red-500">
                  {errors.line_Item.account_id.message}
                </p>
              )}
            </div>

            {transactionType === "received" ? (
              <div className="grid gap-2">
                <Label htmlFor="amount_received">Cash Received</Label>
                <Controller
                  name="line_Item.amount_received"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount_received"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  )}
                />
                {errors.line_Item?.amount_received && (
                  <p className="text-sm text-red-500">
                    {errors.line_Item.amount_received.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="amount_paid">Cash Paid</Label>
                <Controller
                  name="line_Item.amount_paid"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount_paid"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  )}
                />
                {errors.line_Item?.amount_paid && (
                  <p className="text-sm text-red-500">
                    {errors.line_Item.amount_paid.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Controller
                name="line_Item.remarks"
                control={control}
                render={({ field }) => (
                  <Input
                    id="remarks"
                    type="text"
                    placeholder="Add any notes or comments"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {showCashChest && (
        <>
          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Cash Chest</h3>
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="note_500">₹500 Notes</Label>
                    <Controller
                      name="cash_chest.note_500"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="note_500"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_200">₹200 Notes</Label>
                    <Controller
                      name="cash_chest.note_200"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="note_200"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_100">₹100 Notes</Label>
                    <Controller
                      name="cash_chest.note_100"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="note_100"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_50">₹50 Notes</Label>
                    <Controller
                      name="cash_chest.note_50"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="note_50"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_20">₹20 Notes</Label>
                    <Controller
                      name="cash_chest.note_20"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="note_20"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_10">₹10 Notes</Label>
                    <Controller
                      name="cash_chest.note_10"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="note_10"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="coin_5">₹5 Coins</Label>
                    <Controller
                      name="cash_chest.coin_5"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="coin_5"
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="source_reference_type">
                      Source Reference Type
                    </Label>
                    <Controller
                      name="cash_chest.source_reference_type"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="source_reference_type"
                          placeholder="e.g., payments-receipts"
                          {...field}
                        />
                      )}
                    />
                    {errors.cash_chest?.source_reference_type && (
                      <p className="text-sm text-red-500">
                        {errors.cash_chest.source_reference_type.message}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    cashExceedsAmount ? "bg-red-50" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Total Cash Amount:
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        cashExceedsAmount ? "text-red-600" : ""
                      }`}
                    >
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                      }).format(cashTotal)}
                    </span>
                  </div>
                  {cashExceedsAmount && (
                    <p className="mt-2 text-sm text-red-600">
                      Cash chest total (₹{cashTotal.toLocaleString("en-IN")})
                      exceeds {transactionType} amount (₹
                      {transactionAmount.toLocaleString("en-IN")})
                    </p>
                  )}
                </div>

                {errors.cash_chest && "message" in errors.cash_chest && (
                  <p className="text-sm text-red-500">
                    {errors.cash_chest.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSubmit(onFormSubmit)}
          size="lg"
          disabled={cashExceedsAmount}
        >
          {isEditMode
            ? "Update Transaction"
            : transactionType === "received"
            ? "Add Cash Received"
            : "Add Cash Paid"}
        </Button>
      </div>
    </div>
  );
}
