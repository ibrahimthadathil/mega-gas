import supabase from "@/lib/supabase/supabaseClient";

const addPurchaseRegister = async () => {
  try {
    const payload = {
  "p_register": {
    "sap_number": "SAP-9001",
    "bill_date": "2025-01-21",
    "total_qty": 120,
    "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
    "created_at": "2025-01-21T12:00:00Z",
    "tax_invoice_number": "TAX-111"
  },
  "p_line_items": [
    {
      "product_id": "5c20f41d-2747-4683-91cf-4beda85c5c44",
      "qty": 100,
      "trip_type": "two_way",
      "warehouse_id": "0343d705-ba8f-47bc-a49e-d1c8907efd5b",
      "composite": true,
      "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
      "product_component": [
        {
          "child_product_id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
          "qty": -1
        },
        {
          "child_product_id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
          "qty": 1
        }
      ]
    }
  ]
}
    const { data, error } = await supabase.rpc("create_plant_load_with_lines",payload);
    if(error)throw error
  } catch (error) {
    console.log("@@",(error as Error).message);
    
    // throw (error as Error).message;
  }
};

export { addPurchaseRegister };
