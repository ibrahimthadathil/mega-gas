import supabase from "@/lib/supabase/supabaseClient";

const getDeliveryPayloadByVehicle = async (vehicleId: string) => {
  try {
    const { data, error } = await supabase
      .from("current_inventory_levels")
      .select("*")
      .eq("warehouse_id", vehicleId)
      .eq("is_empty", false);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const getAllProductsOptions = async () => {
  try {
    const { data, error } = await supabase
      .from("materialized_products_cache")
      .select("*")
      .eq("is_empty", false)
      .eq("visibility", true);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const getUPIQR = async () => {
  try {
    const { data, error } = await supabase.from("upi_qrcode").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

const reportDailyDelivery = async (
  payload: any,
  remark: string,
  roundOff: number
) => {
  try {
    // const payload = {
    //   "From Warehouse id": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb",
    //   "Date": "2025-12-23T10:00:00Z",
    //   "Delivery boys": [
    //     "94f02391-a899-4cf2-92f2-20d5889ceb0e", // sathyan
    //     "10a73fad-540c-4c8a-8efa-e9439c1f9713", // sathar
    //   ],
    //   "Created by": "5ba724f3-e625-4b82-912c-5f7a080263c9", // pushpa
    //   "Created at": "2025-12-23T10:05:00Z",
    //   "Total sales amount": 18615.00,
    //   "Total expenses amount": 399.00,
    //   "Total transactions amount": -1601.00,
    //   "Total upi amount": 8615.00,
    //   "Total online amount": 1000.00,
    //   "Total Cash amount": 9000.00,
    //   "Opening stock": [
    //     { "product name": "14 F", "qty": 100, "product id": "5ad42421-df1d-4902-91d1-ae7af7123c15" }, // 14F
    //     { "product name": "5KGF", "qty": 20, "product id": "58230e55-9d85-49f3-950b-9c893c957f26" }//5f
    //   ],
    //   "Closing stock": [
    //    { "product name": "14 F", "qty": 90, "product id": "5ad42421-df1d-4902-91d1-ae7af7123c15" }, // 14F
    //     { "product name": "5KGF", "qty": 10, "product id": "58230e55-9d85-49f3-950b-9c893c957f26" }//5f
    //   ],
    //   "Sales": [
    //     {
    //       "product id": "58230e55-9d85-49f3-950b-9c893c957f26",  //5
    //       "is composite": false,
    //       "sale qty": 10,
    //       "rate": 1000,
    //       "customer id": "76ab6e73-80bd-4bb9-86d1-6f2f65a21f06"
    //     },
    //     {
    //       "product id": "cff1fbaf-9e9b-4476-9ff5-43883d56a0dc", //14 re
    //       "is composite": true,
    //       "sale qty": 10,
    //       "rate": 861.50,
    //       // "customer id": "66666666-6666-6666-6666-666666666666",
    //       "customer id": "03c1649c-7721-43c3-85ba-05a264de25e2",
    //       "json components": [
    //         {
    //           "composite product id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
    //           "component qty": 1,
    //           "component sale price": 861.50
    //         },
    //         {
    //           "composite product id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
    //           "component qty": -1,
    //           "component sale price": 0
    //         }
    //       ]
    //     }
    //   ],
    //
    //   "Transaction": [
    //     {
    //       "account id": "e08c8b6b-63e2-45ab-96aa-3f09f36764dd", // sebi
    //       "amount paid": 0,
    //       "amount received": 399,
    //       "remark": "Cash received"
    //     },
    //     {
    //       "account id": "6d1b9d9e-5556-40c4-a0ea-f6e9ef6423ac" ,  // mustha
    //       "amount paid":
    //       2000,
    //       "amount received": 0,
    //       "remark": "Paid fees"
    //     }
    //   ],
    //   "Expenses": [
    //     "eb4a0027-6b8e-42f2-bf9f-8dedb2d2ecd0", // recharge
    //   ],
    //   "UPI payments": [
    //     { "UPI Id": "Q071321009@ybl", "amount": 4000 },
    //     { "UPI Id": "Q071321009@ybl", "amount": 4615 }
    //   ],
    //   "Online payments": [
    //     { "consumer no": "CUST-001", "amount": 750.00 },
    //     { "consumer no": "CUST-001", "amount": 250.00 }
    //   ],
    //   "Cash chest": {
    //     "2000": 0,
    //     "500": 17,
    //     "200": 5,
    //     "100": 0,
    //     "50": 0,
    //     "20": 0,
    //     "10": 0,
    //     "5": 0,
    //     "status": "submitted",
    //     "chest name": "Main Chest"
    //   }
    // }
    const { data, error } = await supabase.rpc("create_sales_slip_new", {
      payload,
      p_remark: remark,
      p_round_off: roundOff,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};



const getGSTCustomer = async () => {
  try {
    const { data, error } = await supabase.from("customers").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const daily_Report_View = async (
  userId: string,
 { page = 1, limit = 7 }: { page?: number; limit?: number } = {}
) => {
  const offset = (page - 1) * limit;
  try {
    const { data, error } = await supabase
      .from("daily_sales_report_view")
      .select("*", { count: "exact" })
      .eq("created_by", userId)
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export {
  getDeliveryPayloadByVehicle,
  getAllProductsOptions,
  daily_Report_View,
  reportDailyDelivery,
  getGSTCustomer,
  getUPIQR,
};
