import supabase from "@/lib/supabase/supabaseClient";

const unload_Slip = async () => {
  try {

    const payloads ={ 
    payload:[
  {
    "product_id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
    "qty": 50,

    "return_product_id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
    "return_qty": 40,

    "from_warehouse_id": "0689096e-3b96-4920-b7ea-ee8de9bd7caf", // vallya vandi
    "to_warehouse_id": "99a57515-d36a-42ec-8d63-8a72d2b95ab2", // cheriya vandi

    "from_warehouse_return_id": "99a57515-d36a-42ec-8d63-8a72d2b95ab2", // cheriya vandi
    "to_warehouse_return_id": "0689096e-3b96-4920-b7ea-ee8de9bd7caf", // valiya vandi

    "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
    "created_at": "2025-11-27T12:00:00Z",

    "plant_load_register_id": "028a3cb6-7e93-4fa4-9c2d-206a5c41510c",
    "plant_load_line_item_id": "aae7f390-0137-4cbe-94f5-ccb0bdee314d",

    "consumed": false,
    "consumption_qty": 0,

    "trip_type": "two_way"
},
//   {
//     "product_id": "77777777-7777-7777-7777-777777777777",
//     "qty": 5,

//     "return_product_id": null,
//     "return_qty": 0,

//     "from_warehouse_id": null,
//     "to_warehouse_id": "88888888-8888-8888-8888-888888888888",

//     "from_warehouse_return_id": null,
//     "to_warehouse_return_id": null,

//     "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",

//     "created_at": "2025-11-27T12:10:00Z",

//     "plant_load_register_id": null,
//     "plant_load_line_item_id": null,

//     "consumed": true,
//     "consumption_qty": 5,

//     "trip_type": "return"
//   }
],plant_load_staff:null}

    const {error} = await supabase.rpc('insert_unload_slips_batch_with_staff',payloads)
    if(error) throw error
  } catch (error) {
    console.log((error as Error).message,);
    throw (error as Error).message;
  }
};


export {  unload_Slip }