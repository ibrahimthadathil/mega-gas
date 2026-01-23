import { getExpensesByStatus } from "@/repository/user/expenses/expenseRepository";
import {
  daily_Report_View,
  getAllProductsOptions,
  getDeliveryPayloadByVehicle,
  getGSTCustomer,
  getUPIQR,
  reportDailyDelivery,
} from "@/repository/user/sales/salesRepository";
import {
  checkUserByAuthId,
  getUserByRole,
} from "@/repository/user/userRepository";
import { DeliveryPayload } from "@/types/deliverySlip";
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

const getDeliveryPayload = async (vehicleId: string, authId: string) => {
  try {
    const user = await checkUserByAuthId(authId);
    if (user) {
      const [drivers, currentStock, expenses, products, customers, Qrcode] =
        await Promise.all([
          getUserByRole(["driver", "godown_staff"]),
          getDeliveryPayloadByVehicle(vehicleId),
          getExpensesByStatus(user.id),
          getAllProductsOptions(),
          getGSTCustomer(),
          getUPIQR(),
        ]);
      return {
        success: true,
        data: {
          drivers: drivers ?? [],
          currentStock: currentStock ?? [],
          expenses,
          products,
          customers,
          Qrcode,
        },
      };
    } else throw new Error(STATUS.FORBIDDEN.message);
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const recordDelivery = async (data: DeliveryPayload, authId: string) => {
  try {
    const checkUser = await checkUserByAuthId(authId);
    if (checkUser) {
      const payload = {
        "From Warehouse id": data["From Warehouse id"],
        Date: data.Date,
        "Delivery boys": data["Delivery boys"],
        "Created by": checkUser.id,
        "Created at": data.Date,
        "Total sales amount": data.totals.totalSales,
        "Total expenses amount": data.totals.totalExpenses,
        "Total transactions amount":
          data.totals.cashFromTransactionsReceived -
          data.totals.cashFromTransactionsPaid,
        "Total upi amount": data.totals.totalUpi,
        "Total online amount": data.totals.totalOnline,
        "Total Cash amount": data.cashChest.actualCashCounted,
        "Opening stock": data["Opening stock"],
        "Closing stock": data["Closing stock"],
        Sales: data.Sales,
        Transaction: data.Transaction,
        Expenses: data.Expenses,
        "UPI payments": data["UPI payments"],
        "Online payments": data["Online payments"],
        "Cash chest": {
          ...data.cashChest.currencyDenominations,
          status: "Submitted",
          "chest name": data.cashChest.chestName,
        },
      };
      console.log(payload);

      const result = await reportDailyDelivery(
        payload,
        data.remark as string,
        data.cashChest.mismatch,
      );
      if (result) return { success: true };
      else throw new Error("Failed to add slip");
    } else throw new Error(STATUS.FORBIDDEN.message);
  } catch (error) {
    throw error;
  }
};

const dailyReport = async (authId: string) => {
  try {
    const user = await checkUserByAuthId(authId);
    if (user) {
      const data = await daily_Report_View(user?.delivery_boys);
      if (data) return { success: true, data };
      else return { success: false, message: "Not found" };
    } else throw Error("Unauthorized");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export {
  getDeliverableProduct,
  recordDelivery,
  getDeliveryPayload,
  dailyReport,
};
