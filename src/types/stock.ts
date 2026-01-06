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
