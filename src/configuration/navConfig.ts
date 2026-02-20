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
        roles: ["admin", "manager"],
      },
      {
        title: "Daily Sales Report",
        url: "/admin/sales-report",
        roles: ["admin", "manager", "accountant"],
      },
      {
        title: "Chest Summary",
        url: "/admin/chest-summary",
        roles: ["admin", "manager", "accountant"],
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
    items: [
      {
        title: "Dashboard view",
        url: "/user/dashboard",
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
    ],
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
    title: " Day Book",
    url: "#",
    icon: Wallet,
    items: [
      {
        title: "Day Book view",
        url: "/user/day-book",
        roles: ["admin", "manager", "accountant", "office_staff"],
      },
    ],
    roles: ["admin", "manager", "accountant", "office_staff"],
  },
  {
    title: "Sales",
    url: "#",
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
        title: "Sales Report",
        url: "/user/sales",
        roles: [
          "admin",
          "manager",
          "accountant",
          "driver",
          "godown_staff",
          "office_staff",
        ],
      },
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
    url: "#",
    icon: History,
    items: [
      {
        title: "Current Inventory ",
        url: "/user/inventory",
        roles: ["admin", "manager", "accountant", "driver", "office_staff"],
      },
    ],
    roles: ["admin", "manager", "accountant", "driver", "office_staff"],
  },
  {
    title: "Current Stock",
    url: "#",
    icon: Cylinder,
    items: [
      {
        title: "Current Stock Level",
        url: "/user/current-stock",
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
        title: "Running Balance",
        url: "/user/running",
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
    ],
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
    url: "#",
    icon: BookOpen,
    roles: ["admin", "manager", "accountant", "plant_driver", "godown_staff"],
    items: [
      {
        title: "Purchase Report",
        url: "/user/purchase",
        roles: [
          "admin",
          "manager",
          "accountant",
          "plant_driver",
          "godown_staff",
        ],
      },
      {
        title: "Plant Load",
        url: "/user/purchase/plant-load",
        roles: ["admin", "manager", "accountant", "plant_driver"],
      },
    ],
  },
  {
    title: "Warehouse",
    url: "#",
    icon: Warehouse,
    items: [
      {
        title: "Warehouse List",
        url: "/user/warehouses",
        roles: ["admin", "manager", "accountant", "godown_staff"],
      },
    ],
    roles: ["admin", "manager", "accountant", "godown_staff"],
  },
  {
    title: "Stock",
    url: "#",
    icon: Settings2,
    roles: ["admin", "manager", "accountant", "godown_staff", "office_staff"],
    items: [
      {
        title: "Stock Transfer List",
        url: "/user/stock",
        roles: ["admin", "manager", "accountant", "godown_staff", "office_staff"],
      },
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
    url: "#",
    icon: BookOpen,
    items:[{
      title: "Expenses List",
      url: "/user/expenses",
      
      roles: [
        "admin",
        "manager",
        "accountant",
        "driver",
        "plant_driver",
        "godown_staff",
        "office_staff",
      ],
    }],
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
    url: "#",
    icon: BookAIcon,
    roles: ["admin", "manager", "accountant", "godown_staff", "office_staff"],
    items: [
      {

        title: "Accounts List",
        url: "/user/accounts",
        roles: [
          "admin",
          "manager",
          "accountant",
          "godown_staff",
          "office_staff",
        ],
      },
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
      {
        title: "Account Ledger",
        url: "/user/accounts/ledger",
        roles: [
          "admin",
          "manager",
          "accountant",
          "office_staff",
        ],
      }
      ,
      {
        title: "Account Summary",
        url: "/user/accounts/summary",
        roles: [
          "admin",
          "manager",
          "accountant",
          "office_staff",
        ],
      }
    ],
  },
];
// Define role-based route access
export const roleRouteConfig = {
  admin: ["/admin", "/user"],
  manager: ["/admin", "/user"],
  accountant: [
    "/admin/dashboard",
    "/admin/sales-report",
    "/admin/chest-summary",
    "/user/dashboard",
    "/user/sales",
    "/user/purchase",
    "/user/warehouses",
    "/user/stock",
    "/user/day-book",
    "/user/running",
    "/user/expenses",
    "/user/accounts",
    "/user/inventory",
    "/user/current-stock",
  ],
  driver: [
    "/user/dashboard",
    "/user/sales",
    "/user/expenses",
    "/user/running",
    "/user/inventory",
    "/user/current-stock",
  ],
  plant_driver: [
    "/user/dashboard",
    "/user/purchase",
    "/user/expenses",
    "/user/running",
    "/user/current-stock",
  ],
  godown_staff: [
    "/user/dashboard",
    "/user/sales",
    "/user/purchase",
    "/user/warehouses",
    "/user/stock",
    "/user/expenses",
    "/user/running",
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
    "/user/running",
    "/user/stock",
    "/user/day-book",
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
