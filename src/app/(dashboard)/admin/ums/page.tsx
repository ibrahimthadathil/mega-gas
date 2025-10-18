// "use client"
// import DataTable from '@/components/data-table'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Table } from '@/components/ui/table'
// import React from 'react'

// const page = () => {
//  const data = [
//   {
//     _id: "u1",
//     firstName: "Ibrahim",
//     email: "ibrahim@gmail.com",
//     role: "Seller",
//     profile: "",
//     createdAt: new Date().toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "u2",
//     firstName: "John",
//     email: "john@gmail.com",
//     role: "Buyer",
//     profile: "",
//     createdAt: new Date().toISOString(),
//     isActive: false,
//   },
//   {
//     _id: "u3",
//     firstName: "Meera",
//     email: "meera@gmail.com",
//     role: "Seller",
//     profile: "",
//     createdAt: new Date().toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "u4",
//     firstName: "Anas",
//     email: "anas@gmail.com",
//     role: "Buyer",
//     profile: "",
//     createdAt: new Date().toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "u5",
//     firstName: "Riya",
//     email: "riya@gmail.com",
//     role: "Buyer",
//     profile: "",
//     createdAt: new Date().toISOString(),
//     isActive: false,
//   }
// ]
//  const columns = [
//   {
//     header: "No",
//     render: (_e: any, i: number) => `LB${i + 101}`,
//   },
//   {
//     key: "firstName",
//     header: "User",
//     render: (user: any) => (
//       <div className="flex items-center gap-2">
//         <Avatar className="h-8 w-8 border rounded-full">
//           <AvatarImage
//             src={user?.profile}
//             alt={user?.firstName}
//             className="object-cover w-8 h-8 rounded-full"
//           />
//           <AvatarFallback>
//             {user.firstName
//               .split(" ")
//               .map((n:any) => n[0])
//               .join("")
//               .toUpperCase()}
//           </AvatarFallback>
//         </Avatar>
//         <span className="font-medium text-yellow-500">
//           {user.firstName}
//         </span>
//       </div>
//     ),
//   },
//   { key: "email", header: "Email" },
//   { key: "role", header: "Role" },
//   {
//     header: "Joined",
//     render: (user: any) =>
//       new Date(user.createdAt as Date).toLocaleDateString(),
//   },
//   {
//     header: "Status",
//     render: (user: any) => (
//       <span
//         className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
//           user.isActive ? "text-green-700" : "text-red-700"
//         }`}
//       >
//         {user.isActive ? "Active" : "Blocked"}
//       </span>
//     ),
//   },

// ]




//   return (
//     <div>
//       <DataTable data={data} columns={columns}/>
    
//     </div>
//   )
// }

// export default page


// app/users/page.tsx
"use client"
import React, { useState, useMemo } from 'react'
import DataTable from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Search, Plus, Pencil } from 'lucide-react'
import UserDialog from '@/components/dialog'

const Page = () => {
  const [users, setUsers] = useState([
    {
      _id: "u1",
      firstName: "Ibrahim",
      email: "ibrahim@gmail.com",
      role: "Seller",
      profile: "",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    {
      _id: "u2",
      firstName: "John",
      email: "john@gmail.com",
      role: "Buyer",
      profile: "",
      createdAt: new Date().toISOString(),
      isActive: false,
    },
    {
      _id: "u3",
      firstName: "Meera",
      email: "meera@gmail.com",
      role: "Seller",
      profile: "",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    {
      _id: "u4",
      firstName: "Anas",
      email: "anas@gmail.com",
      role: "Buyer",
      profile: "",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    {
      _id: "u5",
      firstName: "Riya",
      email: "riya@gmail.com",
      role: "Buyer",
      profile: "",
      createdAt: new Date().toISOString(),
      isActive: false,
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Handle save user (add or edit)
  const handleSaveUser = (userData: any, userId?: string) => {
    if (userId) {
      // Edit existing user
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...userData } : user
      ))
    } else {
      // Add new user
      const newUser = {
        _id: `u${users.length + 1}`,
        ...userData,
        profile: "",
        createdAt: new Date().toISOString(),
      }
      setUsers([...users, newUser])
    }
  }

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const search = searchQuery.toLowerCase()
      return (
        user.firstName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      )
    })

    // Sort based on selected option
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.firstName.localeCompare(b.firstName)
        case 'email':
          return a.email.localeCompare(b.email)
        case 'role':
          return a.role.localeCompare(b.role)
        default:
          return 0
      }
    })

    return filtered
  }, [users, searchQuery, sortBy])

  const columns = [
    {
      header: "No",
      render: (_e: any, i: number) => `LB${i + 101}`,
    },
    {
      key: "firstName",
      header: "User",
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border rounded-full">
            <AvatarImage
              src={user?.profile}
              alt={user?.firstName}
              className="object-cover w-8 h-8 rounded-full"
            />
            <AvatarFallback>
              {user.firstName
                .split(" ")
                .map((n: any) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-yellow-500">
            {user.firstName}
          </span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      header: "Joined",
      render: (user: any) =>
        new Date(user.createdAt as Date).toLocaleDateString(),
    },
    {
      header: "Status",
      render: (user: any) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            user.isActive ? "text-green-700" : "text-red-700"
          }`}
        >
          {user.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (user: any) => (
        <UserDialog
          user={user}
          onSave={handleSaveUser}
          trigger={
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
      ),
    },
  ]

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
      <DataTable data={filteredAndSortedUsers} columns={columns} />
    </div>
  )
}

export default Page