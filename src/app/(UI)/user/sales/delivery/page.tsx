// "use client";
// import { useState } from "react";
// import { DatePicker } from "@/components/ui/date-picker";
// import DeliveryPartnerSection from "@/app/(UI)/user/sales/_section/delivery-partner-section";
// import OldStockSection from "@/app/(UI)/user/sales/_section/old-stock-section";
// import SalesSection from "@/app/(UI)/user/sales/_section/sales-section";
// import ExpensesSection from "@/app/(UI)/user/sales/_section/expenses-section";
// import NetSalesSummarySection from "@/app/(UI)/user/sales/_section/net-sales-summary-section";
// import VerificationDialog from "@/app/(UI)/user/sales/_section/verification-dialog";
// import ClosingStockSection from "@/app/(UI)/user/sales/_section/clossing-stock-section";
// import CurrencyDenominationsSection from "@/app/(UI)/user/sales/_section/currency-denomination-section";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { useSearchParams } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
// import { Warehouse } from "../../warehouses/page";
// import TransactionsPage from "@/app/(UI)/user/sales/_section/transaction-section";
// import { Expense } from "@/types/types";
// import { ArrowLeft, Trash2 } from "lucide-react";
// import {
//   getVehiclePayload,
//   recordDelivery,
// } from "@/services/client_api-Service/user/sales/delivery_api";
// import { getDeliveryDetailsById } from "@/services/client_api-Service/admin/sales/sales_admin_api";

// interface DeliveryBoy {
//   id: string;
//   user_name: string;
// }
// interface Sale {
//   id: string;
//   productId: string;
//   productName: string;
//   rate: number;
//   quantity: number;
//   isComposite: boolean;
//   customerId?: string;
//   components?: Array<{
//     qty: number;
//     sale_price: number;
//     child_product_id: string;
//   }> | null;
// }
// interface TransactionItem {
//   "account id": string;
//   "account name"?: string;
//   "amount paid": number;
//   "amount received": number;
//   remark: string;
// }
// export default function Home() {
//   const [currentVehicle, SetCurrentVehicle] = useState("");

//   const { data: WareHouses, isLoading: wareHouseLoading } = UseRQ<Warehouse[]>(
//     "warehouse",
//     getWarehouse
//   );
//   const { data: payload, isLoading: payloadLoading } = UseRQ<any>(
//     "payload",
//     () => getVehiclePayload(currentVehicle),
//     {
//       enabled: !!currentVehicle,
//     }
//   );
//   const searchParams = useSearchParams();
//   const reportId = searchParams.get("id"); // null | string
//   const isEditMode = Boolean(reportId);
//   const { data: editReport, isLoading: editLoading } = UseRQ(
//     "delivery-report",
//     () => getDeliveryDetailsById(reportId as string),
//     {
//       enabled: !!isEditMode,
//     }
//   );
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState<
//     string[] | null
//   >();
//   const [salesTransactions, setSalesTransactions] = useState<TransactionItem[]>(
//     []
//   );

//   // Updated sales state to match SalesSection interface

//   const [sales, setSales] = useState<Sale[]>([]);
//   const [chestName, setChestName] = useState<"office" | "godown" | "">("");
//   const [isSubmit, setSubmit] = useState<boolean>(false);
//   // near other state hooks
//   const [upiPayments, setUpiPayments] = useState<
//     Array<{ "UPI Id": string; amount: number }>
//   >([]);

//   const [onlinePayments, setOnlinePayments] = useState<
//     Array<{ "consumer no": string; amount: number }>
//   >([]);
//   const [reportRemark, setReportRemark] = useState<string>("");
//   const [isVerified, setIsVerified] = useState(false);
//   const [currencyDenominations, setCurrencyDenominations] = useState<
//     Record<string, number>
//   >({
//     "500": 0,
//     "200": 0,
//     "100": 0,
//     "50": 0,
//     "20": 0,
//     "10": 0,
//   });

//   const qrCodeIds = ["QR-001", "QR-002", "QR-003"];
//   const handleSalesTransaction = (transaction: any) => {
//     const formattedTransaction: TransactionItem = {
//       "account id": transaction.line_Item.account_id,
//       "account name": transaction.line_Item.account_name,
//       "amount paid": transaction.line_Item.amount_paid || 0,
//       "amount received": transaction.line_Item.amount_received || 0,
//       remark: transaction.line_Item.source_form || "Transaction",
//     };

//     setSalesTransactions((prev) => [...prev, formattedTransaction]);
//   };

//   const handleDeleteTransaction = (index: number) => {
//     setSalesTransactions((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const handlewareHouseSelection = (id: string) => {
//     SetCurrentVehicle(id);
//   };

//   // Updated totalSales calculation to match new structure
//   const totalSales = sales.reduce((sum, sale) => {
//     return sum + sale.rate * sale.quantity;
//   }, 0);
//   const totalExpenses = payload?.expenses?.reduce(
//     (sum: number, expense: any) => sum + expense.amount,
//     0
//   );
//   const netSales = Number(totalSales || 0) - Number(totalExpenses || 0);
//   const totalCashReceivedTxn = salesTransactions.reduce(
//     (sum, t) => sum + (t["amount received"] ?? 0),
//     0
//   );

//   const totalCashPaidTxn = salesTransactions.reduce(
//     (sum, t) => sum + (t["amount paid"] ?? 0),
//     0
//   );
//   // Net sales after applying transaction-section adjustments
//   const netSalesWithTransactions =
//     netSales + totalCashReceivedTxn - totalCashPaidTxn;

//   // === Totals for UPI & Online payments ===
//   const totalUpi = upiPayments.reduce((sum, p) => sum + p.amount, 0);
//   const totalOnline = onlinePayments.reduce((sum, p) => sum + p.amount, 0);

//   // Expected cash in hand = adjusted net - UPI - Online
//   const expectedCashInHand = netSalesWithTransactions - totalUpi - totalOnline;

//   const handleVerify = () => {
//     setIsVerified(true);
//   };

//   const handleSubmitReport = async () => {
//     const totalUpi = upiPayments.reduce((sum, p) => sum + p.amount, 0);
//     const totalOnline = onlinePayments.reduce((sum, p) => sum + p.amount, 0);

//     // Calculate net sold quantity per product (considering all components)
//     const netSoldByProductId: Record<string, number> = {};

//     sales.forEach((sale) => {
//       if (sale.isComposite && sale.components && sale.components.length > 0) {
//         sale.components.forEach((component) => {
//           const productId = component.child_product_id;
//           const qty = component.qty * sale.quantity;
//           netSoldByProductId[productId] =
//             (netSoldByProductId[productId] || 0) + qty;
//         });
//       } else {
//         netSoldByProductId[sale.productId] =
//           (netSoldByProductId[sale.productId] || 0) + sale.quantity;
//       }
//     });

//     // Format Opening Stock
//     const openingStockForReport =
//       payload?.currentStock?.map((item: any) => ({
//         "product name": item.product_name,
//         qty: item.qty,
//         "product id": item.product_id,
//       })) ?? [];

//     // Format Closing Stock
//     const closingStockForReport =
//       payload?.currentStock?.map((item: any) => {
//         const netSold = netSoldByProductId[item.product_id] || 0;
//         const closingQty = item.qty - netSold;

//         return {
//           "product name": item.product_name,
//           qty: closingQty,
//           "product id": item.product_id,
//         };
//       }) ?? [];

//     // Cash counted from denominations
//     const actualCashCounted = Object.entries(currencyDenominations).reduce(
//       (sum, [denom, count]) => sum + Number(denom) * count,
//       0
//     );

//     const cashMismatch = actualCashCounted - expectedCashInHand;

//     // Format sales for submission
//     const formattedSales = sales.map((sale) => {
//       const baseSale: any = {
//         "product id": sale.productId,
//         "is composite": sale.isComposite,
//         "sale qty": sale.quantity,
//         rate: sale.rate,
//       };

//       if (sale.isComposite && sale.components && sale.components.length > 0) {
//         baseSale["json components"] = sale.components.map((comp) => ({
//           "composite product id": comp.child_product_id,
//           "component qty": comp.qty,
//           "component sale price": comp.sale_price,
//         }));
//       }

//       return baseSale;
//     });

//     const report = {
//       Date: selectedDate,
//       "From Warehouse id": currentVehicle,
//       "Delivery boys": selectedDeliveryBoys,
//       "Opening stock": openingStockForReport,
//       "Closing stock": closingStockForReport,
//       Sales: formattedSales,
//       Expenses: payload?.expenses?.map((expense: Expense) => expense.id) ?? [],
//       Transaction: salesTransactions,
//       totals: {
//         totalSales,
//         totalExpenses,
//         netSalesBase: netSales,
//         cashFromTransactionsReceived: totalCashReceivedTxn,
//         cashFromTransactionsPaid: totalCashPaidTxn,
//         netSalesWithTransactions,
//         totalUpi,
//         totalOnline,
//         expectedCashInHand,
//       },
//       remark: reportRemark,
//       "UPI payments": upiPayments,
//       "Online payments": onlinePayments,
//       cashChest: {
//         chestName,
//         currencyDenominations,
//         actualCashCounted,
//         expectedCashInHand,
//         mismatch: cashMismatch,
//       },
//     };

//     try {
//       setSubmit(true);
//       await recordDelivery(report);
//       console.log("Report submitted:", report);
//       alert("Report submitted successfully!");
//       alert("Don't submit successfuagain...!!");
//     } catch (error) {
//       console.error("Error submitting report:", error);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-background">
//       <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-foreground">Daily Report</h1>
//           <p className="text-muted-foreground text-sm mt-1">
//             Gas Cylinder Delivery System
//           </p>
//         </div>

//         {!isVerified ? (
//           <>
//             {/* Input Sections */}
//             <div className="space-y-3">
//               <Label htmlFor="product" className="text-sm font-medium">
//                 Product Name
//               </Label>
//               <Select onValueChange={handlewareHouseSelection}>
//                 <SelectTrigger id="product">
//                   <SelectValue placeholder="Select Vehicle" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {WareHouses?.map((item) => (
//                     <SelectItem key={item.id} value={item.id as string}>
//                       {item.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             {!currentVehicle && !payload ? (
//               <div className="self-center">Select your vehicle</div>
//             ) : payloadLoading ? (
//               <div>
//                 <p className="text-red-500">{"losdfdf"}</p>
//               </div>
//             ) : (
//               payload && (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Select Date</label>
//                     <DatePicker
//                       date={selectedDate}
//                       onDateChange={setSelectedDate}
//                       allowFutureDates={true}
//                     />
//                   </div>
//                   <DeliveryPartnerSection
//                     deliveryBoys={payload?.drivers as DeliveryBoy[]}
//                     selectedDeliveryBoys={selectedDeliveryBoys as string[]}
//                     onChange={setSelectedDeliveryBoys}
//                   />

//                   <OldStockSection
//                     loading={payloadLoading}
//                     openingStock={payload?.currentStock}
//                   />
//                   <SalesSection
//                     products={payload?.products || []}
//                     sales={sales}
//                     customers={payload?.customers}
//                     onChange={setSales}
//                   />
//                   <ClosingStockSection
//                     oldStock={payload?.currentStock}
//                     sales={sales}
//                   />

//                   <ExpensesSection expenses={payload?.expenses as Expense[]} />
//                   <TransactionsPage
//                     isSales={true}
//                     onSalesSubmit={handleSalesTransaction}
//                   />
//                   {/* Sales Transactions Display */}
//                   {salesTransactions.length > 0 ? (
//                     <div className="space-y-3">
//                       <div className="flex gap-4 overflow-x-auto pb-2">
//                         {salesTransactions.map((transaction, index) => (
//                           <Card
//                             key={index}
//                             className="w-[230px] max-h-[180px] shrink-0 overflow-hidden relative"
//                           >
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="absolute top-1 right-1 h-6 w-6 z-10"
//                               onClick={() => handleDeleteTransaction(index)}
//                             >
//                               <Trash2 className="h-4 w-4 text-destructive" />
//                             </Button>
//                             <CardHeader className="p-2 bg-muted/50">
//                               <CardTitle className="text-sm truncate pr-6">
//                                 {transaction["account name"]}
//                               </CardTitle>
//                               <p className="text-xs text-muted-foreground">
//                                 {transaction.remark}
//                               </p>
//                             </CardHeader>
//                             <CardContent className="p-2">
//                               <p className="text-xs text-muted-foreground">
//                                 Amount
//                               </p>
//                               <p className="text-lg font-semibold">
//                                 {formatCurrency(
//                                   transaction["amount received"] ||
//                                     transaction["amount paid"] ||
//                                     0
//                                 )}
//                               </p>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <Card className="p-6 text-center">
//                       <p className="text-muted-foreground text-sm">
//                         No Transaction added yet
//                       </p>
//                     </Card>
//                   )}
//                   <NetSalesSummarySection
//                     Qrcode={payload?.Qrcode}
//                     totalSales={totalSales}
//                     totalExpenses={totalExpenses}
//                     netSales={netSalesWithTransactions} // will define below
//                     upiPayments={upiPayments}
//                     onlinePayments={onlinePayments}
//                     onUpiPaymentsChange={setUpiPayments}
//                     onOnlinePaymentsChange={setOnlinePayments}
//                     qrCodeIds={qrCodeIds}
//                     cashFromTransactionsReceived={totalCashReceivedTxn}
//                     cashFromTransactionsPaid={totalCashPaidTxn}
//                   />
//                   {/* Verification Dialog */}
//                   <VerificationDialog
//                     isOpen={true}
//                     onVerify={handleVerify}
//                     onCancel={() => {}}
//                   />
//                 </>
//               )
//             )}
//           </>
//         ) : (
//           <>
//             {/* Wrapper */}
//             <div className="relative">
//               {/* Back Arrow */}
//               <button
//                 onClick={() => setIsVerified(false)}
//                 className="absolute left-0 top-0 p-2 rounded-full hover:bg-gray-100"
//                 aria-label="Go back"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>

//               {/* Content */}
//               <div className="pt-10">
//                 <CurrencyDenominationsSection
//                   denominations={currencyDenominations}
//                   onChange={setCurrencyDenominations}
//                   netSales={expectedCashInHand}
//                 />
//                 <div className="space-y-2 mt-1">
//                   <Label htmlFor="chestName" className="text-md font-medium">
//                     Chest Name
//                   </Label>

//                   <Select
//                     value={chestName}
//                     onValueChange={(value) =>
//                       setChestName(value as "office" | "godown")
//                     }
//                   >
//                     <SelectTrigger id="chestName">
//                       <SelectValue placeholder="Select chest name" />
//                     </SelectTrigger>

//                     <SelectContent>
//                       <SelectItem value="office">Office</SelectItem>
//                       <SelectItem value="godown">Godown</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="reportRemark" className="text-md font-medium">
//                     Report Remark
//                   </Label>
//                   <textarea
//                     id="reportRemark"
//                     value={reportRemark}
//                     onChange={(e) => setReportRemark(e.target.value)}
//                     placeholder="Enter any additional remarks or notes for this report..."
//                     className="w-full min-h-[100px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Optional: Add any notes, observations, or special
//                     circumstances for this delivery report
//                   </p>
//                 </div>
//                 <Button
//                   disabled={isSubmit}
//                   onClick={handleSubmitReport}
//                   className="w-full h-12 text-base mt-4"
//                 >
//                   Submit Report
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import DeliveryPartnerSection from "@/app/(UI)/user/sales/_section/delivery-partner-section";
import OldStockSection from "@/app/(UI)/user/sales/_section/old-stock-section";
import SalesSection from "@/app/(UI)/user/sales/_section/sales-section";
import ExpensesSection from "@/app/(UI)/user/sales/_section/expenses-section";
import NetSalesSummarySection from "@/app/(UI)/user/sales/_section/net-sales-summary-section";
import VerificationDialog from "@/app/(UI)/user/sales/_section/verification-dialog";
import ClosingStockSection from "@/app/(UI)/user/sales/_section/clossing-stock-section";
import CurrencyDenominationsSection from "@/app/(UI)/user/sales/_section/currency-denomination-section";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Warehouse } from "../../warehouses/page";
import TransactionsPage from "@/app/(UI)/user/sales/_section/transaction-section";
import { Expense } from "@/types/types";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  getVehiclePayload,
  recordDelivery,
} from "@/services/client_api-Service/user/sales/delivery_api";
import {
  getDeliveryDetailsById,
  updateSalesSlip,
} from "@/services/client_api-Service/admin/sales/sales_admin_api";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface DeliveryBoy {
  id: string;
  user_name: string;
}

interface Sale {
  id: string;
  productId: string;
  productName: string;
  rate: number;
  quantity: number;
  isComposite: boolean;
  customerId?: string;
  components?: Array<{
    qty: number;
    sale_price: number;
    child_product_id: string;
  }> | null;
}

interface TransactionItem {
  "account id": string;
  "account name"?: string;
  "amount paid": number;
  "amount received": number;
  remark: string;
}

interface DeliveryReportForm {
  date: Date | undefined;
  vehicleId: string;
  // warehouse_id?:string;
  deliveryBoys: string[];
  sales: Sale[];
  salesTransactions: TransactionItem[];
  upiPayments: Array<{ "UPI Id": string; amount: number }>;
  onlinePayments: Array<{ "consumer no": string; amount: number }>;
  chestName: "office" | "godown" | "";
  currencyDenominations: Record<string, number>;
  reportRemark: string;
  status?: "Submitted" | "Settled";
}

const transformEditDataToForm = (
  editData: any
): Partial<DeliveryReportForm> => {
  if (!editData) return {};

  const denominationMap: Record<string, string> = {
    note_500: "500",
    note_200: "200",
    note_100: "100",
    note_50: "50",
    note_20: "20",
    note_10: "10",
  };

  const currencyDenominations: Record<string, number> = {};
  if (editData.cash_chest?.notes) {
    Object.entries(editData.cash_chest.notes).forEach(([key, value]) => {
      const mappedKey = denominationMap[key];
      if (mappedKey) {
        currencyDenominations[mappedKey] = value as number;
      }
    });
  }

  const sales: Sale[] =
    editData.sales_items
      ?.filter((item: any) => item.qty > 0)
      .map((item: any) => ({
        id: item.line_item_id,
        productId: item.product_id,
        productName: "", // Will be populated from payload
        rate: item.rate,
        quantity: item.qty,
        isComposite: item.is_composite,
        components: item.components || null,
      })) || [];

  // Transform transactions with proper field mapping
  const salesTransactions: TransactionItem[] =
    editData.transactions?.map((txn: any) => ({
      "account id": txn.account_id,
      "account name": txn.account_name || "Account", // Provide default if missing
      "amount paid": txn.amount_paid || 0,
      "amount received": txn.amount_received || 0,
      remark: txn.remark || "Transaction",
    })) || [];

  return {
    date: editData.sales_slip?.date
      ? new Date(editData.sales_slip.date)
      : undefined,
    deliveryBoys: editData.delivery_boys || [],
    sales,
    salesTransactions,
    upiPayments:
      editData.upi_payments?.map((upi: any) => ({
        "UPI Id": upi.upi_id,
        amount: upi.amount,
      })) || [],
    onlinePayments:
      editData.online_payments?.map((online: any) => ({
        "consumer no": online.consumer_no || "",
        amount: online.amount,
      })) || [],
    chestName: editData.cash_chest?.chest_name || "",
    currencyDenominations,
    reportRemark: editData.sales_slip?.remark || "",
    status: editData.sales_slip?.status || "Submitted",
  };
};
export default function Home() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const isEditMode = Boolean(reportId);

  const [currentVehicle, setCurrentVehicle] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const route = useRouter()
  const { data: wareHouses, isLoading: wareHouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse
  );

  const { data: payload, isLoading: payloadLoading } = UseRQ<any>(
    ["payload", currentVehicle],
    () => getVehiclePayload(currentVehicle),
    { enabled: !!currentVehicle }
  );

  const { data: editReport, isLoading: editLoading } = UseRQ(
    ["delivery-report", reportId],
    async () => {
      if (!reportId) {
        return null;
      }
      return await getDeliveryDetailsById(reportId);
    },
    { enabled: !!isEditMode }
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DeliveryReportForm>({
    defaultValues: {
      date: undefined,
      vehicleId: "",
      // warehouse_id:"",
      deliveryBoys: [],
      sales: [],
      salesTransactions: [],
      upiPayments: [],
      onlinePayments: [],
      chestName: "",
      currencyDenominations: {
        "500": 0,
        "200": 0,
        "100": 0,
        "50": 0,
        "20": 0,
        "10": 0,
      },
      reportRemark: "",
      status: "Submitted",
    },
  });

  // Watch form values for calculations
  const sales = watch("sales");
  const salesTransactions = watch("salesTransactions");
  const upiPayments = watch("upiPayments");
  const onlinePayments = watch("onlinePayments");
  const currencyDenominations = watch("currencyDenominations");

  // Populate form with edit data
  useEffect(() => {
    if (isEditMode && editReport && !editLoading) {
      const transformedData = transformEditDataToForm(editReport);
      reset(transformedData as DeliveryReportForm);

      // Set vehicle ID if available from edit data
      if ((editReport as any).sales_slip?.warehouse_id) {
        setCurrentVehicle((editReport as any).sales_slip.warehouse_id);
        setValue("vehicleId", (editReport as any).sales_slip.warehouse_id);
      }
    }
  }, [editReport, editLoading, isEditMode, reset, setValue]);

  // Calculations
  const totalSales =
    sales?.reduce((sum, sale) => sum + sale.rate * sale.quantity, 0) || 0;
  const totalExpenses =
    payload?.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) ||
    0;
  const netSales = totalSales - totalExpenses;

  const totalCashReceivedTxn =
    salesTransactions?.reduce(
      (sum, t) => sum + (t["amount received"] ?? 0),
      0
    ) || 0;

  const totalCashPaidTxn =
    salesTransactions?.reduce((sum, t) => sum + (t["amount paid"] ?? 0), 0) ||
    0;

  const netSalesWithTransactions =
    netSales + totalCashReceivedTxn - totalCashPaidTxn;
  const totalUpi = upiPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalOnline =
    onlinePayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const expectedCashInHand = netSalesWithTransactions - totalUpi - totalOnline;

  const handleSalesTransaction = (transaction: any) => {
    const formattedTransaction: TransactionItem = {
      "account id": transaction.line_Item.account_id,
      "account name": transaction.line_Item.account_name,
      "amount paid": transaction.line_Item.amount_paid || 0,
      "amount received": transaction.line_Item.amount_received || 0,
      remark: transaction.line_Item.source_form || "Transaction",
    };

    const current = watch("salesTransactions") || [];
    setValue("salesTransactions", [...current, formattedTransaction]);
  };

  const handleDeleteTransaction = (index: number) => {
    const current = watch("salesTransactions") || [];
    setValue(
      "salesTransactions",
      current.filter((_, i) => i !== index)
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlewareHouseSelection = (id: string) => {
    setCurrentVehicle(id);
    setValue("vehicleId", id);
  };

  const handleVerify = () => {
    setIsVerified(true);
  };

  const onSubmit = async (data: DeliveryReportForm) => {
    // Calculate net sold quantity per product
    const netSoldByProductId: Record<string, number> = {};

    data.sales.forEach((sale) => {
      if (sale.isComposite && sale.components && sale.components.length > 0) {
        sale.components.forEach((component) => {
          const productId = component.child_product_id;
          const qty = component.qty * sale.quantity;
          netSoldByProductId[productId] =
            (netSoldByProductId[productId] || 0) + qty;
        });
      } else {
        netSoldByProductId[sale.productId] =
          (netSoldByProductId[sale.productId] || 0) + sale.quantity;
      }
    });

    const openingStockForReport =
      payload?.currentStock?.map((item: any) => ({
        "product name": item.product_name,
        qty: item.qty,
        "product id": item.product_id,
      })) ?? [];

    const closingStockForReport =
      payload?.currentStock?.map((item: any) => {
        const netSold = netSoldByProductId[item.product_id] || 0;
        const closingQty = item.qty - netSold;
        return {
          "product name": item.product_name,
          qty: closingQty,
          "product id": item.product_id,
        };
      }) ?? [];

    const actualCashCounted = Object.entries(data.currencyDenominations).reduce(
      (sum, [denom, count]) => sum + Number(denom) * count,
      0
    );

    const cashMismatch = actualCashCounted - expectedCashInHand;

    const formattedSales = data.sales.map((sale) => {
      const baseSale: any = {
        "product id": sale.productId,
        "is composite": sale.isComposite,
        "sale qty": sale.quantity,
        rate: sale.rate,
      };

      if (sale.isComposite && sale.components && sale.components.length > 0) {
        baseSale["json components"] = sale.components.map((comp) => ({
          "composite product id": comp.child_product_id,
          "component qty": comp.qty,
          "component sale price": comp.sale_price,
        }));
      }

      return baseSale;
    });

    const report = {
      ...(isEditMode && reportId ? { id: reportId } : {}),
      Date: formatDate(data.date as Date),
      "From Warehouse id": currentVehicle,
      "Delivery boys": data.deliveryBoys,
      "Opening stock": openingStockForReport,
      "Closing stock": closingStockForReport,
      Sales: formattedSales,
      Expenses: payload?.expenses?.map((expense: Expense) => expense.id) ?? [],
      Transaction: data.salesTransactions,
      totals: {
        totalSales,
        totalExpenses,
        netSalesBase: netSales,
        cashFromTransactionsReceived: totalCashReceivedTxn,
        cashFromTransactionsPaid: totalCashPaidTxn,
        netSalesWithTransactions,
        totalUpi,
        totalOnline,
        expectedCashInHand,
      },
      remark: data.reportRemark,
      status: data.status,
      "UPI payments": data.upiPayments,
      "Online payments": data.onlinePayments,
      cashChest: {
        chestName: data.chestName,
        currencyDenominations: data.currencyDenominations,
        actualCashCounted,
        expectedCashInHand,
        mismatch: cashMismatch,
      },
    };
    // console.log("final report : - ", report);

    try {
      setSubmit(true);
      let data;
      if (!isEditMode) data = await recordDelivery(report);
      else data = await updateSalesSlip(report,report.id as string);
      if (data.success){ 
        route.push('/user/sales')
        toast.success(data.message)}
      else toast.warning(data.message)
      setSubmit(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      setSubmit(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Edit Daily Report" : "Daily Report"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gas Cylinder Delivery System
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isVerified ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="product" className="text-sm font-medium">
                  Vehicle Name
                </Label>
                <Controller
                  name="vehicleId"
                  control={control}
                  rules={{ required: "Vehicle selection is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlewareHouseSelection(value);
                      }}
                    >
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {wareHouses?.map((item) => (
                          <SelectItem key={item.id} value={item.id as string}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.vehicleId && (
                  <p className="text-sm text-red-500">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>

              {!currentVehicle && !payload ? (
                <div className="self-center">Select your vehicle</div>
              ) : payloadLoading || editLoading ? (
                <div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                payload && (
                  <>
                    <div className="space-y-2 mb-2 mt-4">
                      <label className="text-sm font-medium">Select Date</label>
                      <Controller
                        name="date"
                        control={control}
                        rules={{ required: "Date is required" }}
                        render={({ field }) => (
                          <DatePicker
                            date={field.value}
                            onDateChange={field.onChange}
                            // allowFutureDates={true}
                          />
                        )}
                      />
                      {errors.date && (
                        <p className="text-sm text-red-500">
                          {errors.date.message}
                        </p>
                      )}
                    </div>

                    <Controller
                      name="deliveryBoys"
                      control={control}
                      render={({ field }) => (
                        <DeliveryPartnerSection
                          deliveryBoys={payload?.drivers as DeliveryBoy[]}
                          selectedDeliveryBoys={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <OldStockSection
                      loading={payloadLoading}
                      openingStock={payload?.currentStock}
                    />

                    <Controller
                      name="sales"
                      control={control}
                      render={({ field }) => (
                        <SalesSection
                          products={payload?.products || []}
                          sales={field.value}
                          customers={payload?.customers}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <ClosingStockSection
                      oldStock={payload?.currentStock}
                      sales={sales || []}
                    />

                    <ExpensesSection
                      expenses={payload?.expenses as Expense[]}
                    />

                    <TransactionsPage
                      isSales={true}
                      onSalesSubmit={handleSalesTransaction}
                    />

                    {salesTransactions && salesTransactions.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {salesTransactions.map((transaction, index) => (
                            <Card
                              key={index}
                              className="w-[230px] max-h-[180px] shrink-0 overflow-hidden relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 z-10"
                                onClick={() => handleDeleteTransaction(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              <CardHeader className="p-2 bg-muted/50">
                                <CardTitle className="text-sm truncate pr-6">
                                  {transaction["account name"]}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  {transaction.remark}
                                </p>
                              </CardHeader>
                              <CardContent className="p-2">
                                <p className="text-xs text-muted-foreground">
                                  Amount
                                </p>
                                <p className="text-lg font-semibold">
                                  {formatCurrency(
                                    transaction["amount received"] ||
                                      transaction["amount paid"] ||
                                      0
                                  )}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground text-sm">
                          No Transaction added yet
                        </p>
                      </Card>
                    )}

                    <Controller
                      name="upiPayments"
                      control={control}
                      render={({ field: upiField }) => (
                        <Controller
                          name="onlinePayments"
                          control={control}
                          render={({ field: onlineField }) => (
                            <NetSalesSummarySection
                              Qrcode={payload?.Qrcode}
                              totalSales={totalSales}
                              totalExpenses={totalExpenses}
                              netSales={netSalesWithTransactions}
                              upiPayments={upiField.value}
                              onlinePayments={onlineField.value}
                              onUpiPaymentsChange={upiField.onChange}
                              onOnlinePaymentsChange={onlineField.onChange}
                              qrCodeIds={["QR-001", "QR-002", "QR-003"]}
                              cashFromTransactionsReceived={
                                totalCashReceivedTxn
                              }
                              cashFromTransactionsPaid={totalCashPaidTxn}
                            />
                          )}
                        />
                      )}
                    />

                    <VerificationDialog
                      isOpen={true}
                      onVerify={handleVerify}
                      onCancel={() => {}}
                    />
                  </>
                )
              )}
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVerified(false)}
                className="absolute left-0 top-0 p-2 rounded-full hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="pt-10 space-y-4">
                <Controller
                  name="currencyDenominations"
                  control={control}
                  render={({ field }) => (
                    <CurrencyDenominationsSection
                      denominations={field.value}
                      onChange={field.onChange}
                      netSales={expectedCashInHand}
                    />
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="chestName" className="text-md font-medium">
                    Chest Name
                  </Label>
                  <Controller
                    name="chestName"
                    control={control}
                    rules={{ required: "Chest name is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="chestName">
                          <SelectValue placeholder="Select chest name" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="godown">Godown</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.chestName && (
                    <p className="text-sm text-red-500">
                      {errors.chestName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportRemark" className="text-md font-medium">
                    Report Remark
                  </Label>
                  <Controller
                    name="reportRemark"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        id="reportRemark"
                        {...field}
                        placeholder="Enter any additional remarks or notes for this report..."
                        className="w-full min-h-[100px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Add any notes, observations, or special
                    circumstances for this delivery report
                  </p>
                </div>

                {isEditMode && (
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-md font-medium">
                      Report Status
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="Settled">Settled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmit}
                  className="w-full h-12 text-base"
                >
                  {isSubmit
                    ? "Submitting..."
                    : isEditMode
                    ? "Update Report"
                    : "Submit Report"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
