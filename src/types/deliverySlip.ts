// Frontend Payload Interface
export interface DeliveryPayload {
  Date: string; // ISO 8601 format
  'From Warehouse id': string; // UUID
  'Delivery boys': string[]; // Array of UUIDs
  'Opening stock': StockItem[];
  'Closing stock': StockItem[];
  remark?:string;
  Sales: SaleItem[];
  Expenses: string[]; // Array of expense IDs (UUIDs)
  Transaction: TransactionItem[];
  totals: TotalsBreakdown;
  'UPI payments': UPIPayment[];
  'Online payments': OnlinePayment[];
  cashChest: CashChest;
  'Created by'?: string; // Optional - UUID of the user creating the slip
}
interface StockItem {
  'product name': string;
  qty: number;
  'product id': string; // UUID
}

interface SaleItem {
  'product id': string; // UUID
  'is composite': boolean;
  'sale qty': number;
  rate: number;
  'customer id'?: string; // Optional - UUID
  'json components'?: CompositeComponent[]; // Only for composite products
}

interface CompositeComponent {
  'composite product id': string; // UUID
  'component qty': number;
  'component sale price': number;
}

interface TransactionItem {
  'account id': string; // UUID
  'account name': string;
  'amount paid': number;
  'amount received': number;
  remark: string;
}

interface TotalsBreakdown {
  totalSales: number;
  totalExpenses: number;
  netSalesBase: number;
  cashFromTransactionsReceived: number;
  cashFromTransactionsPaid: number;
  netSalesWithTransactions: number;
  totalUpi: number;
  totalOnline: number;
  expectedCashInHand: number;
}

interface UPIPayment {
  id: string;
  consumerName: string; // UPI ID
  amount: number;
}

interface OnlinePayment {
  id: string;
  consumerName: string; // Consumer number or name
  amount: number;
}

interface CashChest {
  chestName: string;
  currencyDenominations: CurrencyDenominations;
  actualCashCounted: number;
  expectedCashInHand: number;
  mismatch: number;
}

interface CurrencyDenominations {
  '2000'?: number;
  '500': number;
  '200': number;
  '100': number;
  '50': number;
  '20': number;
  '10': number;
  '5'?: number;
}

export interface DeliveryReportData {
    stock: {
      closing_stock: { qty: number; "product id": string; "product name": string }[];
      opening_stock: { qty: number; "product id": string; "product name": string }[];
    };
    totals: {
      total_upi_amount: number;
      total_cash_amount: number;
      total_sales_amount: number;
      total_online_amount: number;
      total_expenses_amount: number;
      total_transactions_amount: number;
    };
    expenses: {
      id: string;
      amount: number;
      status: boolean;
      description: string | null;
      account_name: string | null;
      created_time: string;
      expenses_type: string;
    }[];
    cash_chest: {
      notes: Record<string, number>;
      chest_name: string;
    };
    sales_slip: {
      id: string;
      date: string;
      remark: string;
      status: string;
      round_off: number;
      created_at: string;
      created_by: string;
      warehouse_id: string;
    };
    sales_items: {
      qty: number;
      rate: number;
      total: number;
      components: {
        qty: number;
        child_product_id: string;
        child_product_code: string;
        child_product_name: string;
      }[];
      product_id: string;
      is_composite: boolean;
      line_item_id: string;
      warehouse_id: string;
    }[];
    transactions: {
      id: string;
      amount: number;
      type: "received" | "paid";
      description?: string;
    }[];
    upi_payments: { amount: number; upi_id: string }[];
    online_payments: { amount: number; provider: string }[];
    delivery_boys: string[];
  
}