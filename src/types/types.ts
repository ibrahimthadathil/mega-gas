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
  type: "Recharge" | "Workshop" | "Other"
  amount: number
  image?: string
  date: string
  description?:string
  settled?: boolean
}