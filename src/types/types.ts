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
  id: string
  created_by?:string
  expenses_type: "Recharge" | "Workshop" | "Other"
  amount: number
  image?: string
  created_time?: string
  description?:string
  settled?: boolean

}

export interface Vehicle {
  id?: string
  vehicle_no: string
  vehicle_type: string
  registration_date: string
  fitness_validity_date: string
  tax_validity_date: string
  insurance_validity_date: string
  pucc_validity_date: string
  permit_validity_date: string
  created_by?: string
  created_at?: string 
}

 export interface IProduct {
  id: string
  product_code: string
  product_name: string
  product_type: string
  sale_price: number
  cost_price: number
  available_qty: number
  is_composite: boolean
  is_empty:boolean;
  visibility: boolean
  price_edit_enabled: boolean
  composition: CompositionItem[];
  
}

export interface CompositionItem {
  childProductId: string
  qty: number
 
}