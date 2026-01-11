import { NavItem } from "@/types/types";
import {
  ClipboardCheck,
  BookOpen,
  Settings2,
  LayoutDashboardIcon,
  Warehouse,
  BookAIcon,
  Power,
} from "lucide-react";
import { title } from "process";
export const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboardIcon,
    roles: ["admin", "manager", "accountant"], 
    items: [
      { title: "User Management", url: "/admin/ums", roles: ["admin", "manager"] },
      { title: "Daily Sales Report", url: "/admin/sales-report", roles: ["admin", "manager"] },
      { title: "Inventory Level", url: "/admin/inventory", roles: ["admin", "manager"] },
      { title: "Product Management", url: "/admin/product", roles: ["admin", "manager"] },
      { title: "Vehicle Managment", url: "/admin/vehicle", roles: ["admin", "manager"] },
    ],
  },
  {
    title: "User Dashboard",
    url: "/user/dashboard",
    icon: LayoutDashboardIcon,
    roles: ["admin", "manager", "accountant", "driver", "plant_driver", "godown_keeper"],
  },
  {
    title: "Sales",
    url: "/user/sales",
    icon: ClipboardCheck,
    roles: ["admin", "manager", "accountant", "driver", "godown_keeper"],
    items: [
      { title: "Delivery", url: "/user/sales/delivery", roles: ["admin", "manager", "accountant", "driver", "godown_keeper"] },
    ],
  },
  {
    title: "Purchase",
    url: "/user/purchase",
    icon: BookOpen,
    roles: ["admin", "manager", "accountant", "plant_driver"],
    items: [
      { title: "Plant Load", url: "/user/purchase/plant-load", roles: ["admin", "manager", "accountant", "plant_driver"] },
    ],
  },
  {
    title:'Warehouse',
    url:'/user/warehouses',
    icon: Warehouse,
    roles : ["admin","manager","accountant","godown_keeper",]
  },
  {
    title: "Stock",
    url: "/user/stock",
    icon: Settings2,
    roles: ["admin", "manager", "accountant", "godown_keeper"],
    items: [
      { title: "unload Slip", url: "/user/stock/load-slip", roles: ["admin", "manager", "accountant", "godown_keeper"] },
      { title: "Stock Transfer", url: "/user/stock/transfer", roles: ["admin", "manager", "accountant", "godown_keeper"] },
    ],
  },
  {
    title: "Expenses",
    url: "/user/expenses",
    icon: BookOpen,
    roles: ["admin", "manager", "accountant", "driver", "plant_driver", "godown_keeper"],
  },
  {
    title:'Accounts',
    url:'/user/accounts',
    icon:BookAIcon,
    roles: ["admin", "manager", "accountant", "godown_keeper"],
    items:[
      {title:'Transactions',url:'/user/accounts/transactions',roles:["admin", "manager", "accountant", "godown_keeper"]}
    ]
  },
 
];

export const filterByRole = (items: NavItem[], role: string): NavItem[] =>{
  return items
    .filter(item => item.roles.includes(role))
    .map(item => ({
      ...item,
      items: item.items ? filterByRole(item.items, role) : undefined,
    }))
}



