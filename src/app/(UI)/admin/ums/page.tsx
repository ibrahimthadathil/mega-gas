"use client"
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Plus,  } from 'lucide-react'
import UserDialog from '@/components/dialog'

const Page = () => {
  // const [users] = useState([
  //   {
  //     _id: "u1",
  //     user_name: "Ibrahim",
  //     email: "ibrahim@gmail.com",
  //     role: "Seller",
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     _id: "u2",
  //     user_name: "John",
  //     email: "john@gmail.com",
  //     role: "Buyer",
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     _id: "u3",
  //     user_name: "Meera",
  //     email: "meera@gmail.com",
  //     role: "Seller",
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     _id: "u4",
  //     user_name: "Anas",
  //     email: "anas@gmail.com",
  //     role: "Buyer",
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     _id: "u5",
  //     user_name: "Riya",
  //     email: "riya@gmail.com",
  //     role: "Buyer",
  //     createdAt: new Date().toISOString(),
  //   }
  // ])

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Handle save user (add or edit)
  const handleSaveUser = () => {

  }


  // const columns = [
  //   {
  //     header: "No",
  //     render: (_e: IUser, i: number) => `LB${i + 101}`,
  //   },
  //   {
  //     key: "user_name",
  //     header: "User",
  //     render: (user: IUser) => (
  //       <div className="flex items-center gap-2">
  //         <Avatar className="h-8 w-8 border rounded-full">
  //           <AvatarImage
  //             src={user?.user_name}
  //             alt={user?.user_name}
  //             className="object-cover w-8 h-8 rounded-full"
  //           />
  //           <AvatarFallback>
  //             {user?.user_name
  //               .split(" ")
  //               .map((n: string) => n[0])
  //               .join("")
  //               .toUpperCase()}
  //           </AvatarFallback>
  //         </Avatar>
  //         <span className="font-medium text-yellow-500">
  //           {user?.user_name}
  //         </span>
  //       </div>
  //     ),
  //   },
  //   { key: "email", header: "Email" },
  //   { key: "role", header: "Role" },
  //   {
  //     header: "Joined",
  //     render: (user: IUser) =>
  //       new Date(user?.createdAt as Date).toLocaleDateString(),
  //   },
  //   {
  //     header: "Actions",
  //     render: (user: IUser) => (
  //       <UserDialog
  //         user={user}
  //         onSave={handleSaveUser}
  //         trigger={
  //           <Button variant="ghost" size="sm">
  //             <Pencil className="h-4 w-4" />
  //           </Button>
  //         }
  //       />
  //     ),
  //   },
  // ]

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <UserDialog
          onSave={handleSaveUser}
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
          <Label className="text-sm text-gray-600">Sort by:</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      {/* <DataTable data={users} columns={columns} /> */}
    </div>
  )
}

export default Page