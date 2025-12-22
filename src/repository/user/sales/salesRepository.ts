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

const getAllProductsOptions = async ()=>{
  try {
    const {data,error} = await supabase.from('products').select('*').eq('is_empty',false).eq('visibility',true)
    if(error) throw error
    return data
  } catch (error) {
    throw error
  }
}

const reportDailyDelivery = async () => {
  try {
    const payload = {
  "fromWarehouseId": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb", //sathyan
  "date": "2025-12-22",

  "deliveryBoys": [
    "10a73fad-540c-4c8a-8efa-e9439c1f9713", // sathat
  ],

  "createdBy": "5ba724f3-e625-4b82-912c-5f7a080263c9", // pushpa
  "createdAt": "2025-01-14T10:30:00Z",

  "totalSalesAmount": 12500,
  "totalExpensesAmount": 1800,
  "totalTransactionsAmount": 14300,

  "totalUpiAmount": 4500,
  "totalOnlineAmount": 3200,
  "totalCashAmount": 4800,

  "openingStock": [
    {
      "productId": "5ad42421-df1d-4902-91d1-ae7af7123c15",
      "productName": "14 F",
      "qty": 120
    },
    {
      "productId": "dac1f4a9-63a9-40e2-b9fd-69f29cf381c1",
      "productName": "10KGF",
      "qty": 80
    }
  ],

  "closingStock": [
   {
      "productId": "5ad42421-df1d-4902-91d1-ae7af7123c15",
      "productName": "14 F",
      "qty": 60
    },
    {
      "productId": "dac1f4a9-63a9-40e2-b9fd-69f29cf381c1",
      "productName": "10KGF",
      "qty": 40
    }
  ],

  "sales": [
    {
      "product": {
        "productId": "5ad42421-df1d-4902-91d1-ae7af7123c15",
        "components": [
          {
            "productId": "5ad42421-df1d-4902-91d1-ae7af7123c15",
            "qty": 5
          }
        ],
        "rate": 861
      },
      "qty": 60,
      "rate": 60*861,
      "customerId": "cust-1111"
    },
    {
      "product": {
        "productId": "dac1f4a9-63a9-40e2-b9fd-69f29cf381c1",
        "components": [
          {
            "productId": "dac1f4a9-63a9-40e2-b9fd-69f29cf381c1",
            "qty": 40
          }
        ],
        "rate": 650
      },
      "qty": 40,
      "rate": 650,
      "customerId": "cust-2222"
    }
  ],

  "transactions": [
    {
      "accountId": "6d1b9d9e-5556-40c4-a0ea-f6e9ef6423ac",
      "amountPaid": 0,
      "amountReceived": 4500,
      "remark": "UPI sales collection"
    },
    {
      "accountId": "6d1b9d9e-5556-40c4-a0ea-f6e9ef6423ac",
      "amountPaid": 1800,
      "amountReceived": 0,
      "remark": "Daily expenses"
    }
  ],

  "expenses": [
    "exp-001",
    "exp-002"
  ],

  "upiPayments": [
    {
      "upiId": "Q071321009@ybl",
      "amount": 3000
    },
    {
      "upiId": "Q071321009@ybl",
      "amount": 1500
    }
  ],

  "onlinePayments": [
    {
      "consumerNo": "ONL-998877",
      "amount": 3200
    }
  ],

  "cashChest": [
    {
      "chestName": "office",
      "status": true,
      "denominations": {
        "2000": 1,
        "500": 4,
        "200": 5,
        "100": 10,
        "50": 8,
        "20": 10,
        "10": 15,
        "5": 20
      }
    }
  ]
}

  } catch (error) {
    throw error
  }
}

export { getDeliveryPayloadByVehicle, getAllProductsOptions, reportDailyDelivery };
