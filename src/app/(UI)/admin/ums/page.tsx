"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, DotSquare, Trash } from "lucide-react";
import UserDialog from "@/components/dialog";
import { UseRQ } from "@/hooks/useReactQuery";
import { deleteUser, editUser, getAllUsers } from "@/services/client_api-Service/admin/ums/ums_api";
import { IUser } from "@/types/types";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DataTable from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import AlertModal from "@/components/alert-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const queryClient = useQueryClient()
  const { data: users, isLoading: loadingUser } = UseRQ<IUser[]>(
    "users",
    getAllUsers
  );
  
  const handelDeleteUser = async(id: string) => {
    try {
      const data = await deleteUser(id);
      if (data.success) {
        toast.success("User deleted successfully");
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  const handleSaveUser = async(data:IUser,id?:string,authid?:string) => {
    try {
      data.auth_id=authid
      const datas = await editUser(data,id)
      if(datas.success){
        toast.success(datas.message)
        queryClient.invalidateQueries({queryKey:['users']})
      }
    } catch (error) {
      
    }    
  };

  const filteredUsers = useMemo(() => {
    let filtered = users || [];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole && selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    return filtered;
  }, [users, searchQuery, selectedRole]);

  const columns = [
    {
      header: "No",
      render: (_e: IUser, i: number) => `LB${i + 1}`,
    },
    {
      key: "user_name",
      header: "User",
      render: (user: IUser) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border rounded-full">
            <AvatarFallback>
              {user?.user_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-yellow-500">{user?.user_name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      header: "Joined",
      render: (user: IUser) => formatDate(new Date(user?.created_at as Date)),
    },
    {
      header: "Actions",
      render: (user: IUser) => (
        <UserDialog
          user={user}
          onSave={handleSaveUser}
          users={users || []}
          trigger={
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
      ),
    },
    {
      header: "Delete",
      render: (user: IUser) => (
        <AlertModal
          data={user}
          contents={[
            <Trash className="h-5 w-5" />,
            <>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold text-orange-400">
                {user.user_name || "this user"}
              </span>
              's account and remove their data from our servers.
            </>,
          ]}
          style="hover:bg-destructive hover:text-destructive-foreground p-2"
         action={()=>handelDeleteUser(user.id as string)}
        />
      ),
    },
  ];

  return loadingUser ? (
    <>
      <div className="space-y-4 p-3 flex justify-center h-full items-center">
        <DotSquare className="w-8 h-8 animate-bounce" />
      </div>
    </>
  ) : (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <UserDialog
          onSave={handleSaveUser}
          users={users || []}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          }
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-600">Filter by Role:</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="office_staff">Office Staff</SelectItem>
              <SelectItem value="plant_driver">Plant Driver</SelectItem>
              <SelectItem value="godown_staff">Godown Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      {users && (
        <DataTable
          data={filteredUsers ?? []}
          columns={columns}
          itemsPerPage={9}
        />
      )}
    </div>
  );
};

export default Page;
