"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  ClipboardCheck,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  Map,
  PieChart,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [
        {
          title: "User Mangment",
          url: "/admin/ums",
        },
      
      ],
    },
    {
      title: "Sales",
      url: "/user/sales",
      icon: ClipboardCheck,
      items: [
        {
          title: "Delivery",
          url: "/user/sales/delivery",
        },
      
      ],
    },
    {
      title: "Purchase",
      url: "/user/purchase",
      icon: BookOpen,
      items: [
        {
          title: "Plant Load",
          url: "/user/purchase/plant-load",
        },
       
      ],
    },
   
    {
      title: "Stock",
      url: "/user/stock",
      icon: Settings2,
      items: [
        {
          title: "Load slip",
          url: "/user/stock/load-slip",
        },
        {
          title: "Stock Transfer",
          url: "/user/stock/transfer",
        },
    
      ],
    },
     {
      title: "Expenses",
      url: "/user/expenses",
      icon: BookOpen,
      items: [
        {
          title: "Add Expense",
          url: "/user/expenses/add-expense",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
