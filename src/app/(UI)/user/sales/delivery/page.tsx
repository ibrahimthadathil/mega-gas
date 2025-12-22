"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import DeliveryPartnerSection from "@/app/(UI)/user/sales/_section/delivery-partner-section";
import OldStockSection from "@/app/(UI)/user/sales/_section/old-stock-section";
import TransactionSection from "@/app/(UI)/user/sales/_section/transaction-section";
import SalesSection from "@/app/(UI)/user/sales/_section/sales-section";
import ExpensesSection from "@/app/(UI)/user/sales/_section/expenses-section";
import NetSalesSummarySection from "@/app/(UI)/user/sales/_section/net-sales-summary-section";
import VerificationDialog from "@/app/(UI)/user/sales/_section/verification-dialog";
import ClosingStockSection from "@/app/(UI)/user/sales/_section/clossing-stock-section";
import CurrencyDenominationsSection from "@/app/(UI)/user/sales/_section/currency-denomination-section";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { get_expenses } from "@/services/client_api-Service/user/user_api";
import { ArrowLeft, Trash2 } from "lucide-react";
import { recordDelivery } from "@/services/client_api-Service/user/sales/delivery_api";

interface DeliveryBoy {
  id: string;
  name: string;
}

export default function Home() {
  const { data: WareHouses, isLoading: wareHouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse
  );
  const { data: Expenses, isLoading: expenseLoading } = UseRQ<Expense[]>(
    "expenses",
    get_expenses
  );
  console.log("3333", Expenses);

  const [currentVehicle, SetCurrentVehicle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState<
    DeliveryBoy[]
  >([]);
  // add near other state hooks
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null
  );
  const [salesTransactions, setSalesTransactions] = useState<any[]>([]);
  const [loads, setLoads] = useState<
    Array<{
      id: string;
      date: string;
      vehicleNo: string;
      product: string;
      quantity: number;
    }>
  >([]);
  const [sales, setSales] = useState<
    Array<{
      id: string;
      product: string;
      rate: number;
      quantity: number;
      deliveryFeeIncluded: boolean;
      deliveryCharge?: number;
    }>
  >([]);
  const [chestName, setChestName] = useState<"office" | "godown" | "">("");

  // near other state hooks
  const [oldStock, setOldStock] = useState<
    { product_id: string; product_name: string; qty: number }[]
  >([]);
  const [upiPayments, setUpiPayments] = useState<
    Array<{ id: string; consumerName: string; amount: number }>
  >([]);

  const [onlinePayments, setOnlinePayments] = useState<
    Array<{ id: string; consumerName: string; amount: number }>
  >([]);
  const [isVerified, setIsVerified] = useState(false);
  const [currencyDenominations, setCurrencyDenominations] = useState<
    Record<string, number>
  >({
    "500": 0,
    "200": 0,
    "100": 0,
    "50": 0,
    "20": 0,
    "10": 0,
  });

  const qrCodeIds = ["QR-001", "QR-002", "QR-003"];
  const handleSalesTransaction = (transaction: any) => {
    setSalesTransactions((prev) => [
      ...prev,
      { ...transaction, id: Date.now().toString() },
    ]);
  };

  const handleDeleteTransaction = (id: string) => {
    setSalesTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlewareHouseSelection = (id: string) => {
    SetCurrentVehicle(id);
  };

  const totalSales = sales.reduce((sum, sale) => {
    const baseAmount = sale.rate * sale.quantity;
    const deliveryAmount = sale.deliveryFeeIncluded
      ? (sale.deliveryCharge || 0) * sale.quantity
      : 0;
    return sum + baseAmount + deliveryAmount;
  }, 0);
  const totalExpenses = Expenses?.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const netSales = Number(totalSales || 0) - Number(totalExpenses || 0);

  const totalCashReceivedTxn = salesTransactions
    .filter((t) => t.transactionType === "received")
    .reduce((sum, t) => sum + (t.line_Item?.amount_received ?? 0), 0);

  const totalCashPaidTxn = salesTransactions
    .filter((t) => t.transactionType === "paid")
    .reduce((sum, t) => sum + (t.line_Item?.amount_paid ?? 0), 0);

  // Net sales after applying transaction-section adjustments
  const netSalesWithTransactions =
    netSales + totalCashReceivedTxn - totalCashPaidTxn;

  // === Totals for UPI & Online payments ===
  const totalUpi = upiPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOnline = onlinePayments.reduce((sum, p) => sum + p.amount, 0);

  // Expected cash in hand = adjusted net - UPI - Online
  const expectedCashInHand = netSalesWithTransactions - totalUpi - totalOnline;

  const handleVerify = () => {
    setIsVerified(true);
  };

  const handleSubmitReport = async () => {
    const totalUpi = upiPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalOnline = onlinePayments.reduce((sum, p) => sum + p.amount, 0);
    const closingStockForReport = oldStock.map((item) => {
      const soldQty = sales
        .filter((s) => s.product === item.product_name)
        .reduce((sum, s) => sum + s.quantity, 0);

      const closingQty = Math.max(item.qty - soldQty, 0);

      return {
        product_id: item.product_id,
        product_name: item.product_name,
        openingQty: item.qty,
        soldQty,
        closingQty,
      };
    });

    // Cash counted from denominations
    const actualCashCounted = Object.entries(currencyDenominations).reduce(
      (sum, [denom, count]) => sum + Number(denom) * count,
      0
    );

    const cashMismatch = actualCashCounted - expectedCashInHand;

    const report = {
      date: selectedDate,
      warehouseId: currentVehicle,
      warehouseName:
        WareHouses?.find((w) => w.id === currentVehicle)?.name ?? null,

      deliveryBoys: selectedDeliveryBoys,

      sales,
      expenses: Expenses?.filter((v) => v.id) ?? [],

      transactions: salesTransactions, // from TransactionsPage (received/paid)

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

      payments: {
        upiPayments,
        onlinePayments,
      },

      closingStock: closingStockForReport,

      cashChest: {
        chestName,
        currencyDenominations,
        actualCashCounted,
        expectedCashInHand,
        mismatch: cashMismatch,
      },
    };
    try {
      await recordDelivery(report);
    } catch (error) {}
    console.log("Report submitted:", report);
    alert("Report submitted successfully!");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Daily Report</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gas Cylinder Delivery System
          </p>
        </div>

        {!isVerified ? (
          <>
            {/* Input Sections */}
            <div className="space-y-3">
              <Label htmlFor="product" className="text-sm font-medium">
                Product Name
              </Label>
              <Select onValueChange={handlewareHouseSelection}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {WareHouses?.map((item) => (
                    <SelectItem key={item.id} value={item.id as string}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!currentVehicle ? (
              <div className="self-center">Select your vehicle</div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </div>
                <DeliveryPartnerSection
                  selectedDeliveryBoys={selectedDeliveryBoys}
                  onChange={setSelectedDeliveryBoys}
                />

                <OldStockSection
                  vehicleId={currentVehicle}
                  onLoaded={setOldStock}
                />
                <SalesSection sales={sales as any} onChange={setSales as any} />
                <ClosingStockSection oldStock={oldStock} sales={sales} />

                <ExpensesSection
                  expenses={Expenses as Expense[]}
                  onSelectExpense={setSelectedExpenseId}
                />
                <TransactionsPage
                  isSales={true}
                  onSalesSubmit={handleSalesTransaction}
                />
                {/* Sales Transactions Display */}
                {salesTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {/* <h2 className="text-lg font-semibold tracking-tight">
                      Sales Transactions
                    </h2> */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {salesTransactions.map((transaction) => (
                        <Card
                          key={transaction.id}
                          className="w-[230px] max-h-[180px] shrink-0 overflow-hidden relative"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 z-10"
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <CardHeader className="p-2 bg-muted/50">
                            <CardTitle className="text-sm truncate pr-6">
                              {transaction.line_Item?.account_name || "N/A"}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {transaction.line_Item?.source_form ||
                                transaction.transactionType}
                            </p>
                          </CardHeader>
                          <CardContent className="p-2">
                            <p className="text-xs text-muted-foreground">
                              Amount
                            </p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(
                                transaction.line_Item?.amount_received ||
                                  transaction.line_Item?.amount_paid ||
                                  0
                              )}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground text-sm">
                        No Transaction added yet
                      </p>
                    </Card>
                  </>
                )}
                <NetSalesSummarySection
                  totalSales={totalSales}
                  totalExpenses={totalExpenses}
                  netSales={netSalesWithTransactions} // will define below
                  upiPayments={upiPayments}
                  onlinePayments={onlinePayments}
                  onUpiPaymentsChange={setUpiPayments}
                  onOnlinePaymentsChange={setOnlinePayments}
                  qrCodeIds={qrCodeIds}
                  cashFromTransactionsReceived={totalCashReceivedTxn}
                  cashFromTransactionsPaid={totalCashPaidTxn}
                />
                {/* Verification Dialog */}
                <VerificationDialog
                  isOpen={true}
                  onVerify={handleVerify}
                  onCancel={() => {}}
                />
              </>
            )}
          </>
        ) : (
          <>
            {/* Wrapper */}
            <div className="relative">
              {/* Back Arrow */}
              <button
                onClick={() => setIsVerified(false)}
                className="absolute left-0 top-0 p-2 rounded-full hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="pt-10">
                <div className="space-y-2">
                  <Label htmlFor="chestName" className="text-md font-medium">
                    Chest Name
                  </Label>

                  <Select
                    value={chestName}
                    onValueChange={(value) =>
                      setChestName(value as "office" | "godown")
                    }
                  >
                    <SelectTrigger id="chestName">
                      <SelectValue placeholder="Select chest name" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="godown">Godown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <CurrencyDenominationsSection
                  denominations={currencyDenominations}
                  onChange={setCurrencyDenominations}
                  netSales={expectedCashInHand}
                />

                <Button
                  onClick={handleSubmitReport}
                  className="w-full h-12 text-base mt-4"
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
