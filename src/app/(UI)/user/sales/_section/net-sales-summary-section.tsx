// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Trash2, Plus } from "lucide-react"

// interface OnlinePayment {
//   id: string
//   consumerName: string
//   amount: number
// }

// interface NetSalesSummarySectionProps {
//   totalSales: number
//   totalExpenses: number
//   netSales: number
//   upiReceived: number
//   onlinePayments: OnlinePayment[]
//   onUpiChange: (value: number) => void
//   onOnlinePaymentsChange: (payments: OnlinePayment[]) => void
// }

// export default function NetSalesSummarySection({
//   totalSales,
//   totalExpenses,
//   netSales,
//   upiReceived,
//   onlinePayments,
//   onUpiChange,
//   onOnlinePaymentsChange,
// }: NetSalesSummarySectionProps) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [formData, setFormData] = useState({ consumerName: "", amount: "" })

//   const handleAddOnlinePayment = () => {
//     if (formData.consumerName && formData.amount) {
//       const newPayment: OnlinePayment = {
//         id: Date.now().toString(),
//         consumerName: formData.consumerName,
//         amount: Number.parseFloat(formData.amount),
//       }
//       onOnlinePaymentsChange([...onlinePayments, newPayment])
//       setFormData({ consumerName: "", amount: "" })
//       setIsDialogOpen(false)
//     }
//   }

//   const handleDeleteOnlinePayment = (id: string) => {
//     onOnlinePaymentsChange(onlinePayments.filter((payment) => payment.id !== id))
//   }

//   const totalOnlinePayments = onlinePayments.reduce((sum, payment) => sum + payment.amount, 0)

//   // Calculate cash as net sales minus UPI and online payments
//   const cashReceived = netSales - upiReceived - totalOnlinePayments
//   const totalPayments = cashReceived + upiReceived + totalOnlinePayments

//   return (
//     <div className="space-y-3">
//       <h2 className="text-lg font-semibold text-foreground">Net Sales Summary</h2>
//       <div className="space-y-2">
//         <Card className="p-4 bg-card">
//           <p className="text-xs text-muted-foreground">Total Sales</p>
//           <p className="text-2xl font-bold text-foreground">₹{totalSales.toLocaleString()}</p>
//         </Card>
//         <Card className="p-4 bg-card">
//           <p className="text-xs text-muted-foreground">Total Expenses</p>
//           <p className="text-2xl font-bold text-foreground">₹{totalExpenses.toLocaleString()}</p>
//         </Card>
//         <Card className="p-4 bg-primary/10">
//           <p className="text-xs text-muted-foreground">Net Sales</p>
//           <p className="text-2xl font-bold text-primary">₹{netSales.toLocaleString()}</p>
//         </Card>
//       </div>

//       <div className="space-y-3 mt-4">
//         <div>
//           <label className="text-sm font-medium">UPI Received (₹)</label>
//           <input
//             type="number"
//             value={upiReceived}
//             onChange={(e) => onUpiChange(Number.parseFloat(e.target.value) || 0)}
//             placeholder="0"
//             className="w-full border border-input rounded-md px-3 py-2 bg-background outline-none text-sm font-medium"
//             style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
//           />
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-medium">Online Payment (₹)</label>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <Button
//                 onClick={() => setIsDialogOpen(true)}
//                 size="sm"
//                 variant="outline"
//                 className="gap-1 bg-transparent"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add Online Payment</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium">Consumer Name</label>
//                     <Input
//                       placeholder="Enter consumer name"
//                       value={formData.consumerName}
//                       onChange={(e) => setFormData({ ...formData, consumerName: e.target.value })}
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium">Amount (₹)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={formData.amount}
//                       onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                     />
//                   </div>
//                   <Button onClick={handleAddOnlinePayment} className="w-full">
//                     Add Payment
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {onlinePayments.length > 0 && (
//             <div className="overflow-x-auto pb-2">
//               <div className="flex gap-2">
//                 {onlinePayments.map((payment) => (
//                   <Card key={payment.id} className="p-3 min-w-max w-48">
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <p className="text-xs text-muted-foreground">Consumer</p>
//                         <p className="text-sm font-medium text-foreground">{payment.consumerName}</p>
//                       </div>
//                       <Button size="sm" variant="ghost" onClick={() => handleDeleteOnlinePayment(payment.id)}>
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </div>
//                     <div className="bg-primary/10 rounded p-2">
//                       <p className="text-xs text-muted-foreground">Amount</p>
//                       <p className="text-lg font-bold text-primary">₹{payment.amount.toLocaleString()}</p>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Auto-calculated Cash */}
//         <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
//           <p className="text-xs text-muted-foreground mb-1">Cash Received (Auto-calculated)</p>
//           <p className="text-2xl font-bold text-green-700 dark:text-green-400">
//             ₹{cashReceived.toLocaleString()}
//           </p>
//           <p className="text-xs text-muted-foreground mt-2">
//             Net Sales - UPI - Online Payments
//           </p>
//         </Card>
//       </div>

//       <Card className="p-4 bg-muted/50 border-border">
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium">Total Payments</span>
//             <span className="text-xl font-bold text-foreground">₹{totalPayments.toLocaleString()}</span>
//           </div>
//           <div className="text-xs text-muted-foreground space-y-1">
//             <div className="flex justify-between">
//               <span>Cash (Auto):</span>
//               <span>₹{cashReceived.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>UPI:</span>
//               <span>₹{upiReceived.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Online:</span>
//               <span>₹{totalOnlinePayments.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

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

/* ================= TYPES ================= */

interface Payment {
  id: string;
  consumerName: string;
  amount: number;
}

interface NetSalesSummarySectionProps {
  totalSales: number;
  totalExpenses: number|undefined;
  netSales: number;

  upiPayments: Payment[];
  onlinePayments: Payment[];

  onUpiPaymentsChange: (payments: Payment[]) => void;
  onOnlinePaymentsChange: (payments: Payment[]) => void;

  qrCodeIds: string[];

  // NEW: cash adjustments from TransactionsPage
  cashFromTransactionsReceived?: number;
  cashFromTransactionsPaid?: number;
}
/* ================= COMPONENT ================= */

// export default function NetSalesSummarySection({
//   totalSales,
//   totalExpenses,
//   netSales,
//   upiPayments = [],
//   onlinePayments = [],
//   onUpiPaymentsChange,
//   onOnlinePaymentsChange,
// }: NetSalesSummarySectionProps) {
// component signature
export default function NetSalesSummarySection({
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

  const [formData, setFormData] = useState({
    consumerName: "",
    amount: "",
  });

  /* ================= COMMON HELPERS ================= */

  const addPayment = (
    list: Payment[],
    onChange: (payments: Payment[]) => void,
    close: () => void
  ) => {
    if (!formData.consumerName || !formData.amount) return;

    onChange([
      ...list,
      {
        id: Date.now().toString(),
        consumerName: formData.consumerName,
        amount: Number(formData.amount),
      },
    ]);

    setFormData({ consumerName: "", amount: "" });
    close();
  };

  const deletePayment = (
    id: string,
    list: Payment[],
    onChange: (payments: Payment[]) => void
  ) => {
    onChange(list.filter((p) => p.id !== id));
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
                  <label className="text-sm font-medium">QR Code ID</label>
                  <select
                    value={formData.consumerName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consumerName: e.target.value,
                      })
                    }
                    className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                  >
                    <option value="">Select QR Code</option>
                    {qrCodeIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    addPayment(upiPayments, onUpiPaymentsChange, () =>
                      setUpiDialogOpen(false)
                    )
                  }
                >
                  Add Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {upiPayments.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {upiPayments.map((payment) => (
                <Card key={payment.id} className="p-3 min-w-max w-48">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Consumer</p>
                      <p className="text-sm font-medium">
                        {payment.consumerName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        deletePayment(
                          payment.id,
                          upiPayments,
                          onUpiPaymentsChange
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-xs text-muted-foreground">QR Code</p>
                    <p className="text-sm font-medium">
                      {payment.consumerName}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= ONLINE PAYMENT (UNCHANGED UI) ================= */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Online Payment (₹)</label>

          <Dialog open={onlineDialogOpen} onOpenChange={setOnlineDialogOpen}>
            <DialogTrigger asChild>
              <Button
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
                  <label className="text-sm font-medium">Consumer Name</label>
                  <Input
                    value={formData.consumerName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consumerName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    addPayment(onlinePayments, onOnlinePaymentsChange, () =>
                      setOnlineDialogOpen(false)
                    )
                  }
                >
                  Add Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {onlinePayments.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {onlinePayments.map((payment) => (
                <Card key={payment.id} className="p-3 min-w-max w-48">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Consumer</p>
                      <p className="text-sm font-medium">
                        {payment.consumerName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        deletePayment(
                          payment.id,
                          onlinePayments,
                          onOnlinePaymentsChange
                        )
                      }
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
          Cash Received (Auto-calculated)
        </p>
        <p className="text-2xl font-bold text-green-700">
          ₹{cashReceived.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Net Sales - UPI - Online Payments
        </p>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Payments</span>
          <span className="text-xl font-bold">
            ₹{totalPayments.toLocaleString()}
          </span>
        </div>
      </Card>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Trash2, Plus } from "lucide-react";

// /* ================= TYPES ================= */

// interface Payment {
//   id: string;
//   consumerName: string;
//   amount: number;
// }

// interface UpiPayment {
//   id: string;
//   qrCodeId: string;
//   amount: number;
// }

// interface NetSalesSummarySectionProps {
//   totalSales: number;
//   totalExpenses: number;
//   netSales: number;

//   upiPayments: UpiPayment[];
//   onlinePayments: Payment[];
//   qrCodeIds: string[]; // List of available QR code IDs

//   onUpiPaymentsChange: (payments: UpiPayment[]) => void;
//   onOnlinePaymentsChange: (payments: Payment[]) => void;
// }

// /* ================= COMPONENT ================= */

// export default function NetSalesSummarySection({
//   totalSales,
//   totalExpenses,
//   netSales,
//   upiPayments = [],
//   onlinePayments = [],
//   qrCodeIds = [],
//   onUpiPaymentsChange,
//   onOnlinePaymentsChange,
// }: NetSalesSummarySectionProps) {
//   const [upiDialogOpen, setUpiDialogOpen] = useState(false);
//   const [onlineDialogOpen, setOnlineDialogOpen] = useState(false);

//   const [upiFormData, setUpiFormData] = useState({
//     qrCodeId: "",
//     amount: "",
//   });

//   const [onlineFormData, setOnlineFormData] = useState({
//     consumerName: "",
//     amount: "",
//   });

//   /* ================= COMMON HELPERS ================= */

//   const addUpiPayment = () => {
//     if (!upiFormData.qrCodeId || !upiFormData.amount) return;

//     onUpiPaymentsChange([
//       ...upiPayments,
//       {
//         id: Date.now().toString(),
//         qrCodeId: upiFormData.qrCodeId,
//         amount: Number(upiFormData.amount),
//       },
//     ]);

//     setUpiFormData({ qrCodeId: "", amount: "" });
//     setUpiDialogOpen(false);
//   };

//   const addOnlinePayment = () => {
//     if (!onlineFormData.consumerName || !onlineFormData.amount) return;

//     onOnlinePaymentsChange([
//       ...onlinePayments,
//       {
//         id: Date.now().toString(),
//         consumerName: onlineFormData.consumerName,
//         amount: Number(onlineFormData.amount),
//       },
//     ]);

//     setOnlineFormData({ consumerName: "", amount: "" });
//     setOnlineDialogOpen(false);
//   };

//   const deletePayment = (
//     id: string,
//     list: any[],
//     onChange: (payments: any[]) => void
//   ) => {
//     onChange(list.filter((p) => p.id !== id));
//   };

//   /* ================= CALCULATIONS ================= */

//   const totalUpi = upiPayments.reduce((s, p) => s + p.amount, 0);
//   const totalOnline = onlinePayments.reduce((s, p) => s + p.amount, 0);

//   const cashReceived = netSales - totalUpi - totalOnline;
//   const totalPayments = cashReceived + totalUpi + totalOnline;

//   /* ================= JSX ================= */

//   return (
//     <div className="space-y-3">
//       <h2 className="text-lg font-semibold text-foreground">
//         Net Sales Summary
//       </h2>

//       <div className="space-y-2">
//         <Card className="p-4 bg-card">
//           <p className="text-xs text-muted-foreground">Total Sales</p>
//           <p className="text-2xl font-bold">₹{totalSales.toLocaleString()}</p>
//         </Card>

//         <Card className="p-4 bg-card">
//           <p className="text-xs text-muted-foreground">Total Expenses</p>
//           <p className="text-2xl font-bold">
//             ₹{totalExpenses.toLocaleString()}
//           </p>
//         </Card>

//         <Card className="p-4 bg-primary/10">
//           <p className="text-xs text-muted-foreground">Net Sales</p>
//           <p className="text-2xl font-bold text-primary">
//             ₹{netSales.toLocaleString()}
//           </p>
//         </Card>
//       </div>

//       {/* ================= UPI PAYMENT ================= */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <label className="text-sm font-medium">UPI Payment (₹)</label>

//           <Dialog open={upiDialogOpen} onOpenChange={setUpiDialogOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="gap-1 bg-transparent"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//             </DialogTrigger>

//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add UPI Payment</DialogTitle>
//               </DialogHeader>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">QR Code ID</label>
//                   <select
//                     value={upiFormData.qrCodeId}
//                     onChange={(e) =>
//                       setUpiFormData({
//                         ...upiFormData,
//                         qrCodeId: e.target.value,
//                       })
//                     }
//                     className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
//                   >
//                     <option value="">Select QR Code</option>
//                     {qrCodeIds.map((qrId) => (
//                       <option key={qrId} value={qrId}>
//                         {qrId}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Amount (₹)</label>
//                   <Input
//                     type="number"
//                     value={upiFormData.amount}
//                     onChange={(e) =>
//                       setUpiFormData({
//                         ...upiFormData,
//                         amount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <Button className="w-full" onClick={addUpiPayment}>
//                   Add Payment
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {upiPayments.length > 0 && (
//           <div className="overflow-x-auto pb-2">
//             <div className="flex gap-2">
//               {upiPayments.map((payment) => (
//                 <Card key={payment.id} className="p-3 min-w-max w-48">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <p className="text-xs text-muted-foreground">QR Code</p>
//                       <p className="text-sm font-medium">
//                         {payment.qrCodeId}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() =>
//                         deletePayment(
//                           payment.id,
//                           upiPayments,
//                           onUpiPaymentsChange
//                         )
//                       }
//                     >
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   </div>

//                   <div className="bg-primary/10 rounded p-2">
//                     <p className="text-xs text-muted-foreground">Amount</p>
//                     <p className="text-lg font-bold text-primary">
//                       ₹{payment.amount.toLocaleString()}
//                     </p>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= ONLINE PAYMENT ================= */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <label className="text-sm font-medium">Online Payment (₹)</label>

//           <Dialog open={onlineDialogOpen} onOpenChange={setOnlineDialogOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="gap-1 bg-transparent"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add
//               </Button>
//             </DialogTrigger>

//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add Online Payment</DialogTitle>
//               </DialogHeader>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">Consumer Name</label>
//                   <Input
//                     value={onlineFormData.consumerName}
//                     onChange={(e) =>
//                       setOnlineFormData({
//                         ...onlineFormData,
//                         consumerName: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Amount (₹)</label>
//                   <Input
//                     type="number"
//                     value={onlineFormData.amount}
//                     onChange={(e) =>
//                       setOnlineFormData({
//                         ...onlineFormData,
//                         amount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <Button className="w-full" onClick={addOnlinePayment}>
//                   Add Payment
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {onlinePayments.length > 0 && (
//           <div className="overflow-x-auto pb-2">
//             <div className="flex gap-2">
//               {onlinePayments.map((payment) => (
//                 <Card key={payment.id} className="p-3 min-w-max w-48">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <p className="text-xs text-muted-foreground">Consumer</p>
//                       <p className="text-sm font-medium">
//                         {payment.consumerName}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() =>
//                         deletePayment(
//                           payment.id,
//                           onlinePayments,
//                           onOnlinePaymentsChange
//                         )
//                       }
//                     >
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   </div>

//                   <div className="bg-primary/10 rounded p-2">
//                     <p className="text-xs text-muted-foreground">Amount</p>
//                     <p className="text-lg font-bold text-primary">
//                       ₹{payment.amount.toLocaleString()}
//                     </p>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= CASH SUMMARY ================= */}
//       <Card className="p-4 bg-green-50 dark:bg-green-950/20">
//         <p className="text-xs text-muted-foreground">
//           Cash Received (Auto-calculated)
//         </p>
//         <p className="text-2xl font-bold text-green-700 dark:text-green-400">
//           ₹{cashReceived.toLocaleString()}
//         </p>
//         <p className="text-xs text-muted-foreground mt-2">
//           Net Sales - UPI - Online Payments
//         </p>
//       </Card>

//       <Card className="p-4 bg-muted/50">
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium">Total Payments</span>
//             <span className="text-xl font-bold">
//               ₹{totalPayments.toLocaleString()}
//             </span>
//           </div>
//           <div className="text-xs text-muted-foreground space-y-1">
//             <div className="flex justify-between">
//               <span>Cash (Auto):</span>
//               <span>₹{cashReceived.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>UPI:</span>
//               <span>₹{totalUpi.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Online:</span>
//               <span>₹{totalOnline.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
