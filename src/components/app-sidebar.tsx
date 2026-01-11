"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Flame,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import { filterByRole, navItems } from "@/configuration/navConfig";
import { useAuth } from "@/hooks/useAuth";

// This is sample data.
const data = {
  user: {
    user_name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    phone: "",
    role: "",
  },
  teams: [
    {
      name: "Megha Indane",
      logo: Flame,
      plan: "Enterprise",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],

  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {Logout} = useAuth()
  const user = useSelector((state: Rootstate) => state.user);
  const filterdNav = React.useMemo(
    () => filterByRole(navItems, user.role as string),
    [user.role]
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filterdNav } onLogout={Logout} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
