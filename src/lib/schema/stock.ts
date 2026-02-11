export type StockTransferFormData = {
  id?:string
  product: string;
  date: Date;
  from: string;
  to: string;
  quantity: string;
  remarks?: string;
  withEmpty: boolean;
  return_product_id: string | null;
};
