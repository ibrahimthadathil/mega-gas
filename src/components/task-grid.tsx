// "use client"
// import TaskCard from "./task-card"

// export default function TaskGrid() {
//   const tasks = [
//     {
//       id: 1,
//       title: "Completed Tasks",
//       icon: "📋",
//       color: "text-yellow-600",
//     },
//     {
//       id: 2,
//       title: "Update Hose Pipe",
//       icon: "⚙️",
//       color: "text-green-600",
//     },
//     {
//       id: 3,
//       title: "Service Area Task",
//       icon: "🏗️",
//       color: "text-green-600",
//     },
//     {
//       id: 4,
//       title: "Update Mobile No.",
//       icon: "📱",
//       color: "text-purple-600",
//     },
//     {
//       id: 5,
//       title: "DBC",
//       icon: "🛢️",
//       color: "text-orange-600",
//     },
//     {
//       id: 6,
//       title: "LERC Tight Joint change",
//       icon: "🔧",
//       color: "text-yellow-600",
//     },
//     {
//       id: 7,
//       title: "E-KYC",
//       icon: "🔐",
//       color: "text-purple-600",
//     },
//     {
//       id: 8,
//       title: "NFR Sale",
//       icon: "📊",
//       color: "text-purple-600",
//     },
//     {
//       id: 9,
//       title: "Product Upliftment",
//       icon: "📈",
//       color: "text-yellow-600",
//     },
//     {
//       id: 10,
//       title: "Service Log",
//       icon: "📋",
//       color: "text-blue-600",
//     },
//     {
//       id: 11,
//       title: "Loyalty Onboarding",
//       icon: "🎁",
//       color: "text-yellow-600",
//     },
//     {
//       id: 12,
//       title: "Sampark",
//       icon: "📱",
//       color: "text-[#FF8C42]",
//     },
//   ]

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//       {tasks.map((task) => (
//         <TaskCard key={task.id} task={task} />
//       ))}
//     </div>
//   )
// }

import {
  User,
  Package,
  TrendingUp,
  DollarSign,
  Database,
  FileText,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardGrid() {
  const { user } = useSelector((state: Rootstate) => state);
  const { Logout } = useAuth();
  const route = useRouter();
  const handleCardClick = (url: string) => {
    if (url) {
      route.push(url);
    }
  };
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your overview
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* User Profile Card */}
          <Card
            onClick={() => handleCardClick("/profile")}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 col-span-2 md:col-span-1"
          >
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.user_name}</CardTitle>
                    <CardDescription className="text-xs">
                      {user.role}
                    </CardDescription>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <span className="mr-2">📧</span>
                    <span className="text-xs">{user.email}</span>
                  </div>
                  {/* <div className="flex items-center text-muted-foreground">
                    <span className="mr-2">📱</span>
                    <span className="text-xs">+91 {user.}</span>
                  </div> */}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Inventory Transaction */}
          <Card
            onClick={() => handleCardClick("/user/inventory")}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-base mt-3">
                Inventory Transaction
              </CardTitle>
              <CardDescription className="text-xs">
                Manage stock movement
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Sales Report */}
          <Card
            onClick={() => handleCardClick("/user/sales")}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-base mt-3">Sales Report</CardTitle>
              <CardDescription className="text-xs">
                View your performance
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Expenses */}
          <Card
            onClick={() => handleCardClick("/user/expenses")}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-base mt-3">Expenses</CardTitle>
              <CardDescription className="text-xs">
                Track your spending
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Current Stock */}
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="text-sm font-bold">
                  247
                </Badge>
              </div>
              <CardTitle className="text-base mt-3">Current Stock</CardTitle>
              <CardDescription className="text-xs">
                Available cylinders
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Sales Slip */}
          <Card
            onClick={() => handleCardClick("/user/sales/delivery")}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-base mt-3">Sales Slip</CardTitle>
              <CardDescription className="text-xs">
                Generate invoices
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Logout */}
          <Card
            onClick={() => Logout()}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-base mt-3">Logout</CardTitle>
              <CardDescription className="text-xs">
                End your session
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
