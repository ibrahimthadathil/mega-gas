"use client";

import type React from "react";

import { useState } from "react";
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
import {
  getAllAccountsParty,
} from "@/services/client_api-Service/user/accounts/accounts_api";
import { Accounts } from "@/types/types";

type LineItem = {
  date: string;
  account_name: string;
  account_id: string;
  amount_received: number;
  amount_paid: number;
  source_form: string;
  source_form_reference_id: string | null;
  remarks: string;
  created_at: string;
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
  created_by: string;
  created_at: string;
};

type Transaction = {
  line_Item: LineItem;
  cash_chest: CashChest;
};

type TransactionFormProps = {
  onSubmit: (transaction: Transaction) => void;
  transactionType: 'received' | 'paid';
  isSales?:Boolean;
};

export function TransactionForm({ onSubmit, transactionType,isSales=false }: TransactionFormProps) {
  const { data: accountName, isLoading } = UseRQ<Accounts[]>(
    "accounts",
    getAllAccountsParty
  );  
  const [formData, setFormData] = useState<Transaction>({
    line_Item: {
      date: new Date().toISOString().split("T")[0],
      account_name: "",
      account_id: "",
      amount_received: 0,
      amount_paid: 0,
      source_form: "Expence",
      source_form_reference_id: null,
      remarks: "",
      created_at: new Date().toISOString(),
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
      created_by: "",
      created_at: new Date().toISOString(),
    },
  });

  const [showCashChest, setShowCashChest] = useState(false);

  const checkLineItemsFilled = () => {
    const amountFilled = transactionType === 'received' 
      ? formData.line_Item.amount_received > 0
      : formData.line_Item.amount_paid > 0;
      
    return (
      formData.line_Item.date !== "" &&
      formData.line_Item.account_id !== "" &&
      amountFilled
    );
  };

  const calculateTotal = () => {
    return (
      formData.cash_chest.note_500 * 500 +
      formData.cash_chest.note_200 * 200 +
      formData.cash_chest.note_100 * 100 +
      formData.cash_chest.note_50 * 50 +
      formData.cash_chest.note_20 * 20 +
      formData.cash_chest.note_10 * 10 +
      formData.cash_chest.coin_5 * 5
    );
  };

  const handleLineItemChange = (field: keyof LineItem, value: any) => {
    setFormData({
      ...formData,
      line_Item: {
        ...formData.line_Item,
        [field]: value,
      },
    });

    setTimeout(() => {
      if (checkLineItemsFilled() && !showCashChest) {
        setShowCashChest(true);
      }
    }, 0);
  };

  const handleAccountSelect = (accountId: string) => {
    const selectedAccount = accountName?.find(acc => acc.id === accountId);
    
    setFormData({
      ...formData,
      line_Item: {
        ...formData.line_Item,
        account_id: accountId,
        account_name: selectedAccount?.account_name || "",
      },
    });

    setTimeout(() => {
      if (checkLineItemsFilled() && !showCashChest) {
        setShowCashChest(true);
      }
    }, 0);
  };

  const handleCashChestChange = (field: keyof CashChest, value: any) => {
    setFormData({
      ...formData,
      cash_chest: {
        ...formData.cash_chest,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("check the logs");
    console.log("Form data:", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Line Item Section */}
      <div className="space-y-4">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Transaction Details</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.line_Item.date}
                onChange={(e) => handleLineItemChange("date", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account_name">Account Name</Label>
              <Select
                value={formData.line_Item.account_id}
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
            </div>

            {/* Conditionally render amount field based on transaction type */}
            {transactionType === 'received' ? (
              <div className="grid gap-2">
                <Label htmlFor="amount_received">Cash Received</Label>
                <Input
                  id="amount_received"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.line_Item.amount_received}
                  onChange={(e) =>
                    handleLineItemChange(
                      "amount_received",
                      Number.parseFloat(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="amount_paid">Cash Paid</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.line_Item.amount_paid}
                  onChange={(e) =>
                    handleLineItemChange(
                      "amount_paid",
                      Number.parseFloat(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                type="text"
                placeholder="Add any notes or comments"
                value={formData.line_Item.remarks}
                onChange={(e) =>
                  handleLineItemChange("remarks", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {showCashChest&& !isSales &&  (
        <>
          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Cash Chest</h3>
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="note_500">₹500 Notes</Label>
                    <Input
                      id="note_500"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.note_500}
                      onChange={(e) =>
                        handleCashChestChange(
                          "note_500",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_200">₹200 Notes</Label>
                    <Input
                      id="note_200"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.note_200}
                      onChange={(e) =>
                        handleCashChestChange(
                          "note_200",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_100">₹100 Notes</Label>
                    <Input
                      id="note_100"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.note_100}
                      onChange={(e) =>
                        handleCashChestChange(
                          "note_100",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_50">₹50 Notes</Label>
                    <Input
                      id="note_50"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.note_50}
                      onChange={(e) =>
                        handleCashChestChange(
                          "note_50",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_20">₹20 Notes</Label>
                    <Input
                      id="note_20"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.note_20}
                      onChange={(e) =>
                        handleCashChestChange(
                          "note_20",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note_10">₹10 Notes</Label>
                    <Input
                      id="note_10"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.note_10}
                      onChange={(e) =>
                        handleCashChestChange(
                          "note_10",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="coin_5">₹5 Coins</Label>
                    <Input
                      id="coin_5"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cash_chest.coin_5}
                      onChange={(e) =>
                        handleCashChestChange(
                          "coin_5",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="source_reference_type">
                      Source Reference Type
                    </Label>
                    <Input
                      id="source_reference_type"
                      placeholder="e.g., payments-receipts"
                      value={formData.cash_chest.source_reference_type}
                      onChange={(e) =>
                        handleCashChestChange(
                          "source_reference_type",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Total Cash Amount:
                    </span>
                    <span className="text-lg font-bold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                      }).format(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg">
          {transactionType === 'received' ? 'Add Cash Received' : 'Add Cash Paid'}
        </Button>
      </div>
    </form>
  );
}