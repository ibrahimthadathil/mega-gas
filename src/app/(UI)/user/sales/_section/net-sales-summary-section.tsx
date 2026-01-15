"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";

/* ================= UPDATED TYPES ================= */

interface UpiPayment {
  "UPI Id": string;
  amount: number;
}

interface OnlinePayment {
  "consumer no": string;
  amount: number;
}
interface QR {
  id:string;
  upi_id:string;
  name:string;
  terminal_name:string
}

interface NetSalesSummarySectionProps {
  totalSales: number;
  totalExpenses: number | undefined;
  netSales: number;
  Qrcode: QR[];
  upiPayments: UpiPayment[];
  onlinePayments: OnlinePayment[];

  onUpiPaymentsChange: (payments: UpiPayment[]) => void;
  onOnlinePaymentsChange: (payments: OnlinePayment[]) => void;

  qrCodeIds: string[];

  cashFromTransactionsReceived?: number;
  cashFromTransactionsPaid?: number;
}

export default function NetSalesSummarySection({
  Qrcode,
  totalSales,
  totalExpenses,
  netSales,
  upiPayments = [],
  onlinePayments = [],
  onUpiPaymentsChange,
  onOnlinePaymentsChange,
  qrCodeIds = [],
  cashFromTransactionsReceived = 0,
  cashFromTransactionsPaid = 0,
}: NetSalesSummarySectionProps) {
  const [upiDialogOpen, setUpiDialogOpen] = useState(false);
  const [onlineDialogOpen, setOnlineDialogOpen] = useState(false);

  const [upiFormData, setUpiFormData] = useState({
    upiId: "",
    amount: "",
  });

  const [onlineFormData, setOnlineFormData] = useState({
    consumerNo: "",
    amount: "",
  });

  /* ================= UPI PAYMENT HANDLERS ================= */

  const addUpiPayment = () => {
    if (!upiFormData.upiId || !upiFormData.amount) return;

    onUpiPaymentsChange([
      ...upiPayments,
      {
        "UPI Id": upiFormData.upiId,
        amount: Number(upiFormData.amount),
      },
    ]);

    setUpiFormData({ upiId: "", amount: "" });
    setUpiDialogOpen(false);
  };

  const deleteUpiPayment = (upiId: string, index: number) => {
    onUpiPaymentsChange(upiPayments.filter((_, i) => i !== index));
  };

  /* ================= ONLINE PAYMENT HANDLERS ================= */

  const addOnlinePayment = () => {
    if (!onlineFormData.consumerNo || !onlineFormData.amount) return;

    onOnlinePaymentsChange([
      ...onlinePayments,
      {
        "consumer no": onlineFormData.consumerNo,
        amount: Number(onlineFormData.amount),
      },
    ]);

    setOnlineFormData({ consumerNo: "", amount: "" });
    setOnlineDialogOpen(false);
  };

  const deleteOnlinePayment = (index: number) => {
    onOnlinePaymentsChange(onlinePayments.filter((_, i) => i !== index));
  };

  /* ================= CALCULATIONS ================= */

  const totalUpi = upiPayments.reduce((s, p) => s + p.amount, 0);
  const totalOnline = onlinePayments.reduce((s, p) => s + p.amount, 0);

  const cashReceived = netSales - totalUpi - totalOnline;
  const totalPayments = cashReceived + totalUpi + totalOnline;

  /* ================= JSX ================= */

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Net Sales Summary
      </h2>

      <div className="space-y-2">
        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold">₹{totalSales.toLocaleString()}</p>
        </Card>

        <Card className="p-4 bg-card">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold">
            ₹{totalExpenses?.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-primary/10">
          <p className="text-xs text-muted-foreground">Net Sales</p>
          <p className="text-2xl font-bold text-primary">
            ₹{netSales?.toLocaleString()}
          </p>
        </Card>
      </div>

      <Card className="p-4 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          Cash Adjustments from Transactions
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600">Cash Received</span>
            <span className="font-medium text-green-600">
              +₹{cashFromTransactionsReceived.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">Cash Paid</span>
            <span className="font-medium text-red-600">
              -₹{cashFromTransactionsPaid.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* ================= UPI PAYMENT ================= */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">UPI Payment (₹)</label>

          <Dialog open={upiDialogOpen} onOpenChange={setUpiDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add UPI Payment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    UPI ID / QR Code
                  </label>
                  <select
                    value={upiFormData.upiId}
                    onChange={(e) =>
                      setUpiFormData({
                        ...upiFormData,
                        upiId: e.target.value,
                      })
                    }
                    className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                  >
                    <option value="">Select QR Code</option>
                    {Qrcode.map((qr) => (
                      <option key={qr.id} value={qr.upi_id}>
                        {qr.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <Input
                    type="number"
                    value={upiFormData.amount}
                    onChange={(e) =>
                      setUpiFormData({
                        ...upiFormData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="button" className="w-full" onClick={addUpiPayment}>
                  Add Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {upiPayments.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {upiPayments.map((payment, index) => (
                <Card key={index} className="p-3 min-w-max w-48">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">UPI ID</p>
                      <p className="text-sm font-medium break-all">
                        {payment["UPI Id"]}
                      </p>
                    </div>
                    <Button
                    type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteUpiPayment(payment["UPI Id"], index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-primary">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= ONLINE PAYMENT ================= */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Online Payment (₹)</label>

          <Dialog open={onlineDialogOpen} onOpenChange={setOnlineDialogOpen}>
            <DialogTrigger asChild>
              <Button
              type="button"
                size="sm"
                variant="outline"
                className="gap-1 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Online Payment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Consumer Number</label>
                  <Input
                    placeholder="e.g., CUST-001"
                    value={onlineFormData.consumerNo}
                    onChange={(e) =>
                      setOnlineFormData({
                        ...onlineFormData,
                        consumerNo: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <Input
                    type="number"
                    value={onlineFormData.amount}
                    onChange={(e) =>
                      setOnlineFormData({
                        ...onlineFormData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="button" className="w-full" onClick={addOnlinePayment}>
                  Add Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {onlinePayments.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {onlinePayments.map((payment, index) => (
                <Card key={index} className="p-3 min-w-max w-48">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Consumer No
                      </p>
                      <p className="text-sm font-medium">
                        {payment["consumer no"]}
                      </p>
                    </div>
                    <Button
                    type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteOnlinePayment(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-primary">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= CASH SUMMARY ================= */}
      <Card className="p-4 bg-green-50 dark:bg-green-950/20">
        <p className="text-xs text-muted-foreground">
          Cash To Pay (Auto-calculated)
        </p>
        <p className="text-2xl font-bold text-green-700">
          ₹{cashReceived.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Net Sales - UPI - Online Payments
        </p>
      </Card>

      {/* <Card className="p-4 bg-muted/50">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Payments</span>
          <span className="text-xl font-bold">
            ₹{totalPayments.toLocaleString()}
          </span>
        </div>
      </Card> */}
    </div>
  );
}
