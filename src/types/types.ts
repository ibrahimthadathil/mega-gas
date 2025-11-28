import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  roles: string[]; // list of allowed roles like ["admin", "manager"]
  isActive?: boolean;
  items?: NavItem[]; // for nested menus
};
export interface IUser {
  user_name: string;
  email: string;
  phone: string;
  password: string;
  role: userRole;
  createdAt?: Date;
}

export enum userRole {
  Admin = "Admin",
  Staff = "Staff",
  Sriver = "Driver",
}

export const STATUS = {
  SUCCESS: { code: 200, message: "Success" },
  CREATED: { code: 201, message: "Resource created successfully" },
  BAD_REQUEST: { code: 400, message: "Bad request" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized" },
  FORBIDDEN: { code: 403, message: "Forbidden" },
  NOT_FOUND: { code: 404, message: "Resource not found" },
  CONFLICT: { code: 409, message: "Conflict occurred" },
  SERVER_ERROR: { code: 500, message: "Internal server error" },
} as const;

export interface Expense {
  id: string;
  created_by?: string;
  expenses_type: "Recharge" | "Workshop" | "Other";
  amount: number;
  image?: string;
  created_time?: string;
  description?: string;
  settled?: boolean;
}

export interface Vehicle {
  id?: string;
  vehicle_no: string;
  vehicle_type: string;
  registration_date: string;
  fitness_validity_date: string;
  tax_validity_date: string;
  insurance_validity_date: string;
  pucc_validity_date: string;
  permit_validity_date: string;
  created_by?: string;
  created_at?: string;
}

export interface IProduct {
  id: string;
  product_code: string;
  product_name: string;
  product_type: string;
  sale_price: number;
  cost_price: number;
  available_qty: number;
  is_composite: boolean;
  is_empty: boolean;
  visibility: boolean;
  price_edit_enabled: boolean;
  composition: CompositionItem[];
  tags?: string[];
  components?: {
    child_product_id: string;
    qty: number;
    child_product_name: string;
  }[];
}

export interface CompositionItem {
  childProductId: string;
  qty: number;
}

export interface ProductComponent {
  qty: number;
  child_product_id: string;
  child_product_code: string;
  child_product_name: string;
}

export interface MaterializedProduct {
  id: string;
  product_code: string;
  product_name: string;
  product_type: string;
  is_composite: boolean;
  is_empty: boolean | null;
  sale_price: number;
  price_edit_enabled: boolean;
  visibility: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  components: ProductComponent[] | null;
  total_components_qty_required: number | null;
  last_refreshed_at: string;
  return_product_id?: string;
  empty_warehouse_id?: string;
}

export interface PlantLoadFormData {
  invoiceNumber: string;
  sapNumber: string;
  date: Date | undefined;
  warehouse: string;
}

export interface PurchaseProduct extends MaterializedProduct {
  tripType: string;
  quantity: number;
}

export interface PurchaseRegisterPayload extends PlantLoadFormData {
  products: PurchaseProduct[];
}

interface LineItem {
  qty: number;
  trip_type: string;
  product_name: string;
}

export interface PlantLoadRecord {
  id: string;
  sap_number: string;
  bill_date: string;
  unloading_date: string | null;
  total_full_qty: number;
  unloaded_qty: number;
  balance: number;
  created_by: string;
  created_at: string;
  tax_invoice_number: string;
  warehouse_id: string;
  total_return_qty: number;
  warehouse_name: string;
  line_items: LineItem[];
}
