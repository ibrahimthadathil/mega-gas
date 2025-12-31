"use client";
import { useState } from "react";
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
export default function Home() {
  const [currentVehicle, SetCurrentVehicle] = useState("");
  const { data: WareHouses, isLoading: wareHouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse
  );
  const { data: payload, isLoading: payloadLoading } = UseRQ<any>(
    "payload",
    () => getVehiclePayload(currentVehicle),
    {
      enabled: !!currentVehicle,
    }
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState<
    string[] | null
  >();
  const [salesTransactions, setSalesTransactions] = useState<TransactionItem[]>(
    []
  );

  // Updated sales state to match SalesSection interface

  const [sales, setSales] = useState<Sale[]>([]);
  const [chestName, setChestName] = useState<"office" | "godown" | "">("");

  // near other state hooks
  const [upiPayments, setUpiPayments] = useState<
    Array<{ "UPI Id": string; amount: number }>
  >([]);

  const [onlinePayments, setOnlinePayments] = useState<
    Array<{ "consumer no": string; amount: number }>
  >([]);
  const [reportRemark, setReportRemark] = useState<string>("");
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
    const formattedTransaction: TransactionItem = {
      "account id": transaction.line_Item.account_id,
      "account name": transaction.line_Item.account_name,
      "amount paid": transaction.line_Item.amount_paid || 0,
      "amount received": transaction.line_Item.amount_received || 0,
      remark: transaction.line_Item.source_form || "Transaction",
    };

    setSalesTransactions((prev) => [...prev, formattedTransaction]);
  };

  const handleDeleteTransaction = (index: number) => {
    setSalesTransactions((prev) => prev.filter((_, i) => i !== index));
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

  // Updated totalSales calculation to match new structure
  const totalSales = sales.reduce((sum, sale) => {
    return sum + sale.rate * sale.quantity;
  }, 0);
  const totalExpenses = payload?.expenses?.reduce(
    (sum: number, expense: any) => sum + expense.amount,
    0
  );
  const netSales = Number(totalSales || 0) - Number(totalExpenses || 0);
  const totalCashReceivedTxn = salesTransactions.reduce(
    (sum, t) => sum + (t["amount received"] ?? 0),
    0
  );

  const totalCashPaidTxn = salesTransactions.reduce(
    (sum, t) => sum + (t["amount paid"] ?? 0),
    0
  );
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

    // Calculate net sold quantity per product (considering all components)
    const netSoldByProductId: Record<string, number> = {};

    sales.forEach((sale) => {
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

    // Format Opening Stock
    const openingStockForReport =
      payload?.currentStock?.map((item: any) => ({
        "product name": item.product_name,
        qty: item.qty,
        "product id": item.product_id,
      })) ?? [];

    // Format Closing Stock
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

    // Cash counted from denominations
    const actualCashCounted = Object.entries(currencyDenominations).reduce(
      (sum, [denom, count]) => sum + Number(denom) * count,
      0
    );

    const cashMismatch = actualCashCounted - expectedCashInHand;

    // Format sales for submission
    const formattedSales = sales.map((sale) => {
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
      Date: selectedDate,
      "From Warehouse id": currentVehicle,
      "Delivery boys": selectedDeliveryBoys,
      "Opening stock": openingStockForReport,
      "Closing stock": closingStockForReport,
      Sales: formattedSales,
      Expenses: payload?.expenses?.map((expense: Expense) => expense.id) ?? [],
      Transaction: salesTransactions,
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
      remark: reportRemark,
      "UPI payments": upiPayments,
      "Online payments": onlinePayments,
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
      console.log("Report submitted:", report);
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
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
            {!currentVehicle && !payload ? (
              <div className="self-center">Select your vehicle</div>
            ) : payloadLoading ? (
              <div>
                <p className="text-red-500">{"losdfdf"}</p>
              </div>
            ) : (
              payload && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <DatePicker
                      date={selectedDate}
                      onDateChange={setSelectedDate}
                    />
                  </div>
                  <DeliveryPartnerSection
                    deliveryBoys={payload?.drivers as DeliveryBoy[]}
                    selectedDeliveryBoys={selectedDeliveryBoys as string[]}
                    onChange={setSelectedDeliveryBoys}
                  />

                  <OldStockSection
                    loading={payloadLoading}
                    openingStock={payload?.currentStock}
                  />
                  <SalesSection
                    products={payload?.products || []}
                    sales={sales}
                    customers={payload?.customers}
                    onChange={setSales}
                  />
                  <ClosingStockSection
                    oldStock={payload?.currentStock}
                    sales={sales}
                  />

                  <ExpensesSection expenses={payload?.expenses as Expense[]} />
                  <TransactionsPage
                    isSales={true}
                    onSalesSubmit={handleSalesTransaction}
                  />
                  {/* Sales Transactions Display */}
                  {salesTransactions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {salesTransactions.map((transaction, index) => (
                          <Card
                            key={index}
                            className="w-[230px] max-h-[180px] shrink-0 overflow-hidden relative"
                          >
                            <Button
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
                  <NetSalesSummarySection
                    Qrcode={payload?.Qrcode}
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
              )
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
                <CurrencyDenominationsSection
                  denominations={currencyDenominations}
                  onChange={setCurrencyDenominations}
                  netSales={expectedCashInHand}
                />
                <div className="space-y-2 mt-1">
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
                <div className="space-y-2 mt-4">
                  <Label htmlFor="reportRemark" className="text-md font-medium">
                    Report Remark
                  </Label>
                  <textarea
                    id="reportRemark"
                    value={reportRemark}
                    onChange={(e) => setReportRemark(e.target.value)}
                    placeholder="Enter any additional remarks or notes for this report..."
                    className="w-full min-h-[100px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Add any notes, observations, or special
                    circumstances for this delivery report
                  </p>
                </div>
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
