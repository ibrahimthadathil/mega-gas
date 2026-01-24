export interface SaleItem {
  sales_line_item_id: string; // uuid
  product_id: string;         // uuid
  product_name: string;
  qty: number;
  rate: number;
  total: number;
}
export interface SalesSlipPayload {
  sales_slip_id: string;      // uuid
  date: string;               // ISO date (YYYY-MM-DD)
  created_by: string;         // uuid
  chest_name:string;
  total_sales_amount: number;
  total_upi_amount: number;
  total_online_amount: number;
  total_cash_amount: number;
  created_by_name : string
  status: string;
  remark: string;
  warehouse_name:string;
  sale_items: SaleItem[];
}
