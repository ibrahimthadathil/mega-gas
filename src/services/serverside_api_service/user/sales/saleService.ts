import {
  getAllProductsOptions,
  reportDailyDelivery,
} from "@/repository/user/sales/salesRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { STATUS } from "@/types/types";

const getDeliverableProduct = async () => {
  try {
    const product = await getAllProductsOptions();
    if (product) return { success: true, product };
    else return { success: false };
  } catch (error) {
    throw error;
  }
};

const recordDelivery = async (data: any, authId: string) => {
  try {
    const checkUser = await checkUserByAuthId(authId);
    if(checkUser){
      const payload = {
        "From Warehouse id": data.warehouseId,
        Date: data.date,
        "Delivery boys": data.deliveryBoys,
        "Created by": checkUser.id,
        "Created at": data.date,
  
        "Total sales amount": data.totals.totalSales,
  
        "Total expenses amount": data.totals.totalExpenses,
  
        "Total transactions amount":
          data.totals.cashFromTransactionsReceived -
          data.totals.cashFromTransactionsPaid,
  
        "Total upi amount": data.totals.totalUpi,
  
        "Total online amount": data.totals.totalOnline,
  
        "Total Cash amount": data.cashChest.actualCashCounted,
  
        "Opening stock": data.closingStock.map((item: any) => ({
          "product name": item.product_name,
          qty: item.openingQty,
          "product id": item.product_id,
        })),
  
        "Closing stock": data.closingStock.map((item: any) => ({
          "product name": item.product_name,
          qty: item.closingQty,
          "product id": item.product_id,
        })),
  
        Sales: data.sales.map((sale: any) => ({
          "product id": sale.productId,
          "is composite": false,
          "sale qty": sale.quantity,
          rate: sale.rate,
          "customer id": null,
        })),
  
        Transaction: data.transactions.map((tx: any) => ({
          "account id": tx.account_id,
          "amount paid": tx.amount_paid ?? 0,
          "amount received": tx.amount_received,
          remark: tx.remarks ?? "",
        })),
  
        Expenses: data.expenses.map((exp: { id: string }) => exp.id),
  
        "UPI payments": data.payments.upiPayments.map((upi: any) => ({
          "UPI Id": upi.consumerName,
          amount: upi.amount,
        })),
  
        "Online payments": data.payments.onlinePayments.map((online: any) => ({
          "consumer no": online.consumerName,
          amount: online.amount,
        })),
  
        "Cash chest": {
          ...data.cashChest.currencyDenominations,
          status: "submitted",
          "chest name": data.cashChest.chestName,
        },
      };
      const result = await reportDailyDelivery(payload);
      if (result) return { success: true };
      else throw new Error("Failed to add slip");
    }else throw new Error(STATUS.FORBIDDEN.message)

  } catch (error) {
    throw error;
  }
};

export { getDeliverableProduct, recordDelivery };
