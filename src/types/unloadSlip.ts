export type UUID = string;

export interface IdName {
  id: UUID;
  name: string;
}

export interface UnloadingStaff {
  id: UUID;
  name: string;
}

export type TripType = "oneWay" | "two_way";

export interface UnloadDetail {
  id: UUID;

  product: IdName;

  qty: number;

  return_product: IdName | null;

  return_qty: number;

  to_warehouse: IdName;

  to_return_warehouse: IdName | null;

  trip_type: TripType;
}

export interface PlantLoadUnloadView {
  plant_load_register_id: UUID;

  bill_date: string; // ISO date (YYYY-MM-DD)

  sap_number: string | null;

  unload_date : string;


  total_return_qty:number;

  warehouse: IdName;

  total_qty: number;

  unloaded_qty: number;

  unloading_staff: UnloadingStaff[] 

  unload_details: UnloadDetail[]
}
<<<<<<< HEAD
=======


>>>>>>> 6dae87681bd68e514ea651efef36e277bc685d62
export type UnloadFilters = {
  page?: number;
  limit?: number;

  warehouseId?: string;

  billDateFrom?: string;   // '2026-01-01'
  billDateTo?: string;     // '2026-01-31'

  unloadDateFrom?: string; // '2026-01-01'
  unloadDateTo?: string;   // '2026-01-31';
};