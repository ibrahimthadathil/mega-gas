import {
  daily_Report_View,
  delete_sales,
  edit_sales_slip,
  get_Sales_Slip_ById,
} from "@/repository/admin/Dashboard/salesReport- repository";
import { checkUserByAuthId } from "@/repository/user/userRepository";

const deleteSaleSlip = async (authid: string, slipId: string) => {
  try {
    const checkUser = await checkUserByAuthId(authid);

    if (checkUser) {
      const isDeleted = await delete_sales(slipId, checkUser.id);
      if (isDeleted) return { success: true, message: "Deleted successfully" };
      else return { success: false, message: "Failed to Delete" };
    } else throw Error("Unauthorized");
  } catch (error) {
    console.log((error as Error).message);

    return { success: false, message: (error as Error).message };
  }
};

const getSalesSlipByID = async (slipId: string) => {
  try {
    const data = await get_Sales_Slip_ById(slipId);
    if (data) return { success: true, data };
    else throw Error("Failed to fetch Try Later");
  } catch (error) {
    return { success: true, message: (error as Error).message };
  }
};

const editSaleSlip = async (data: any, authId: string, slipId: string) => {
  try {
    const checkUser = await checkUserByAuthId(authId);
    if (checkUser) {
      const cash = data.cashChest.currencyDenominations;
      const payload = {
        sales_slip_id: data.id,
        "Created by": checkUser.id,
        "Created at": new Date().toDateString(),
        Date: data.Date,
        "From Warehouse id": data["From Warehouse id"],
        "Total sales amount": data.totals.totalSales,
        "Total expenses amount": data.totals.totalExpenses,
        "Total upi amount": data.totals.totalUpi,
        "Total online amount": data.totals.totalOnline,
        "Total Cash amount": data.totals.expectedCashInHand,
        "Total transactions amount": data.totals.netSalesWithTransactions,
        Sales: data.Sales.map((item: any) => ({
          line_item_id: item.line_item_id || null,
          "product id": item["product id"],
          "sale qty": item["sale qty"],
          rate: item.rate,
          "is composite": item["is composite"],
          "json components": item["json components"] || undefined,
          components: item["components"] || undefined,
        })),

        "Delivery boys": data["Delivery boys"] || [],
        Expenses: data.Expenses || [],
        "Cash chest": {
          "chest name": data.cashChest.chestName,
          "2000": cash["2000"] || 0,
          "500": cash["500"] || 0,
          "200": cash["200"] || 0,
          "100": cash["100"] || 0,
          "50": cash["50"] || 0,
          "20": cash["20"] || 0,
          "10": cash["10"] || 0,
          "5": cash["5"] || 0,
          remark: data.remark || "",
          status: data.status,
        },

        "UPI payments": data["UPI payments"] || [],
        "Online payments": data["Online payments"] || [],
        Transaction: data.Transaction || [],
      };
      const updated = await edit_sales_slip(
        payload,
        data.remark || "",
        data.cashChest.mismatch || 0,
        checkUser.id,
        slipId
      );
      if (updated) return { success: true, message: "Updated" };
      else throw Error("Failed to update, Try Later");
    } else throw Error("Un-authorized");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const getAllSalesReports = async () => {
  try {
    const report = await daily_Report_View();
    if (report) return { success: true, data: report };
    else return { success: false };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export { deleteSaleSlip, getSalesSlipByID, getAllSalesReports, editSaleSlip };
