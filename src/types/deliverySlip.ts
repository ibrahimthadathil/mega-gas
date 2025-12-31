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
