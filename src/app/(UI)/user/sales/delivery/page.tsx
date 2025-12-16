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
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Warehouse } from "../../warehouses/page";

interface DeliveryBoy {
  id: string;
  name: string;
}

export default function Home() {
  const { data: WareHouses, isLoading: wareHouseLoading } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse
  );
  const [currentVehicle, SetCurrentVehicle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState<
    DeliveryBoy[]
  >([]);
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
  const [expenses, setExpenses] = useState<
    Array<{ id: string; name: string; amount: number }>
  >([]);
  const [upiReceived, setUpiReceived] = useState(0);
  const [onlinePayments, setOnlinePayments] = useState<
    Array<{ id: string; consumerName: string; amount: number }>
  >([]);
  const [isVerified, setIsVerified] = useState(false);
  const [closingStock, setClosingStock] = useState<
    Array<{ id: string; product: string; quantity: number }>
  >([]);
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
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const netSales = Number(totalSales || 0) - Number(totalExpenses || 0);

  const handleVerify = () => {
    setIsVerified(true);
  };

  const handleSubmitReport = () => {
    // Calculate cash for the report
    const totalOnlinePayments = onlinePayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const cashReceived = netSales - upiReceived - totalOnlinePayments;

    const report = {
      date: selectedDate,
      deliveryBoys: selectedDeliveryBoys,
      // oldStock,
      loads,
      sales,
      expenses,
      cashReceived,
      upiReceived,
      onlinePayments,
      closingStock,
      currencyDenominations,
      netSales,
    };
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
                <OldStockSection vehicleId={currentVehicle} />
                <SalesSection sales={sales} onChange={setSales} />
                <TransactionSection sales={sales} onChange={setSales} />
                <ExpensesSection expenses={expenses} onChange={setExpenses} />
                <NetSalesSummarySection
                  totalSales={totalSales}
                  totalExpenses={totalExpenses}
                  netSales={netSales}
                  upiReceived={upiReceived}
                  onlinePayments={onlinePayments}
                  onUpiChange={setUpiReceived}
                  onOnlinePaymentsChange={setOnlinePayments}
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
            {/* Final Sections - Only after verification */}
            <ClosingStockSection
              closingStock={closingStock}
              onChange={setClosingStock}
            />
            <CurrencyDenominationsSection
              denominations={currencyDenominations}
              onChange={setCurrencyDenominations}
              netSales={netSales}
            />

            <Button
              onClick={handleSubmitReport}
              className="w-full h-12 text-base"
            >
              Submit Report
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
