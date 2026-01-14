"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/store/selectors/authSelectors";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { HomeIcon } from "lucide-react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const is_authenticated = useSelector(selectIsAuthenticated);
  const router = useRouter()
  const {Logout} = useAuth()
  useEffect(() => {
    if (!is_authenticated) {
      Logout()
      redirect("/user/login");
    }
  }, [is_authenticated]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1 hover:cursor-pointer" />
            <HomeIcon className="-ml-1 hover:cursor-pointer w-4 h-4" onClick={()=>router.push('/user/dashboard')} color="orange"/>
            {/* <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            /> */}
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
