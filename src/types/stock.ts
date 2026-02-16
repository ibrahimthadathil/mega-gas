export interface StockTransfer {
  idx: number;
  id: string;

  transfer_date: string; // ISO date string (YYYY-MM-DD)

  from_warehouse_id: string;
  from_warehouse_name: string;

  to_warehouse_id: string;
  to_warehouse_name: string;

  return_from_warehouse_id: string;
  return_from_warehouse_name: string;

  return_to_warehouse_id: string;
  return_to_warehouse_name: string;

  product_id: string;
  product_name: string;

  return_product_id: string | null;
  return_product_name: string | null;

  qty: string;          // keeping as string since API sends string
  return_qty: string;

  empty_inclusive: boolean;

  created_by: string;
  created_at: string;   // timestamp string

  remarks: string;
}


export interface TransferStockFilters {
  startDate?: string; // ISO string
  endDate?: string; 
  warehouseId?:string;  // ISO string
  page?: number;
  limit?: number;
}



// for runing, need to rework later

export interface StockTransaction {
  idx: number;
  transaction_date: string;
  warehouse_id: string;
  warehouse_name: string;
  counter_warehouse_id: string;
  counter_warehouse_name: string;
  product_id: string;
  product_name: string;
  qty_change: string;
  cumulative_balance: string;
  source_form_type: string;
  source_form_id: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface Warehouse {
  id: string;
  name: string;
}

export interface RunningBalanceFilters {
  warehouseId?: string;
  productId?: string;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;   // ISO date string (YYYY-MM-DD)
  lastNDays?: number; // Default to 3
}