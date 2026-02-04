export interface lineItemFilterProps {
  date?: string;
  account_name?: string;
  type?: "amount_received" | "amount_paid"|"";
  source_form?: "Transaction received" | "Transaction paid" | "Sales Slip"|"";
}
