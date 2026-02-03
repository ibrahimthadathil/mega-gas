import { NavItem } from "@/types/types";
import {
  ClipboardCheck,
  BookOpen,
  Settings2,
  LayoutDashboardIcon,
  Warehouse,
  BookAIcon,
  History,
  Cylinder,
  Wallet,
} from "lucide-react";
export const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboardIcon,
    roles: ["admin", "manager", "accountant"],
    items: [
      {
        title: "User Management",
        url: "/admin/ums",
        roles: ["admin", "manager",],
      },
      {
        title: "Daily Sales Report",
        url: "/admin/sales-report",
        roles: ["admin", "manager", "accountant"],
      },
      {
        title:"Chest Summary",
        url:"/admin/chest-summary",
        roles:["admin","manager","accountant"]
      },
      {
        title: "Product Management",
        url: "/admin/product",
        roles: ["admin", "manager"],
      },
      {
        title: "Vehicle Managment",
        url: "/admin/vehicle",
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    title: "User Dashboard",
    url: "/user/dashboard",
    icon: LayoutDashboardIcon,
    roles: [
      "admin",
      "manager",
      "accountant",
      "driver",
      "plant_driver",
      "godown_staff",
      "office_staff",
    ],
  },
  {
    title:" Day Book",
    url:'/user/day-book',
    icon: Wallet,
    roles:[
      "admin",
      "manager",
      "accountant",
      "office_staff",
    ]
  },
  {
    title: "Sales",
    url: "/user/sales",
    icon: ClipboardCheck,
    roles: [
      "admin",
      "manager",
      "accountant",
      "driver",
      "godown_staff",
      "office_staff",
    ],
    items: [
      {
        title: "Delivery",
        url: "/user/sales/delivery",
        roles: [
          "admin",
          "manager",
          "accountant",
          "driver",
          "godown_staff",
          "office_staff",
        ],
      },
    ],
  },
  {
    title: "Inventory Level",
    url: "/user/inventory",
    icon: History,
    roles: ["admin", "manager", "accountant", "driver", "office_staff"],
  },
  {
    title: "Current Stock",
    url: "/user/current-stock",
    icon: Cylinder,
    roles: [
      "admin",
      "manager",
      "accountant",
      "godown_staff",
      "driver",
      "plant_driver",
      "office_staff",
    ],
  },
  {
    title: "Purchase",
    url: "/user/purchase",
    icon: BookOpen,
    roles: ["admin", "manager", "accountant", "plant_driver", "godown_staff"],
    items: [
      {
        title: "Plant Load",
        url: "/user/purchase/plant-load",
        roles: ["admin", "manager", "accountant", "plant_driver"],
      },
    ],
  },
  {
    title: "Warehouse",
    url: "/user/warehouses",
    icon: Warehouse,
    roles: ["admin", "manager", "accountant", "godown_staff"],
  },
  {
    title: "Stock",
    url: "/user/stock",
    icon: Settings2,
    roles: ["admin", "manager", "accountant", "godown_staff", "office_staff"],
    items: [
      {
        title: "unload Slip",
        url: "/user/stock/load-slip",
        roles: ["admin", "manager", "accountant", "godown_staff"],
      },
      {
        title: "Stock Transfer",
        url: "/user/stock/transfer",
        roles: [
          "admin",
          "manager",
          "accountant",
          "godown_staff",
          "office_staff",
        ],
      },
    ],
  },
  {
    title: "Expenses",
    url: "/user/expenses",
    icon: BookOpen,
    roles: [
      "admin",
      "manager",
      "accountant",
      "driver",
      "plant_driver",
      "godown_staff",
      "office_staff",
    ],
  },

  {
    title: "Accounts",
    url: "/user/accounts",
    icon: BookAIcon,
    roles: ["admin", "manager", "accountant", "godown_staff", "office_staff"],
    items: [
      {
        title: "Transactions",
        url: "/user/accounts/transactions",
        roles: [
          "admin",
          "manager",
          "accountant",
          "godown_staff",
          "office_staff",
        ],
      },
    ],
  },
];
// Define role-based route access
export const roleRouteConfig = {
  admin: ["/admin", "/user"],
  manager: ["/admin", "/user"],
  accountant: [
    "/admin/dashboard",
    "admin/sales-report",
    "/admin/chest-summary",
    "/user/dashboard",
    "/user/sales",
    "/user/purchase",
    "/user/warehouses",
    "/user/stock",
    '/user/day-book',
    "/user/expenses",
    "/user/accounts",
    "/user/inventory",
    "/user/current-stock",
  ],
  driver: [
    "/user/dashboard",
    "/user/sales",
    "/user/expenses",
    "/user/inventory",
    "/user/current-stock",
  ],
  plant_driver: [
    "/user/dashboard",
    "/user/purchase",
    "/user/expenses",
    "/user/current-stock",
  ],
  godown_staff: [
    "/user/dashboard",
    "/user/sales",
    "/user/purchase",
    "/user/warehouses",
    "/user/stock",
    "/user/expenses",
    "/user/accounts",
    "/user/inventory",
    "/user/current-stock",
  ],
  office_staff: [
    "/user/dashboard",
    "/user/sales",
    "/user/expenses",
    "/user/inventory",
    "/user/current-stock",
    "/user/accounts",
    "/user/stock",
    '/user/day-book',
  ],
};

export const filterByRole = (items: NavItem[], role: string): NavItem[] => {
  return items
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      items: item.items ? filterByRole(item.items, role) : undefined,
    }));
};
