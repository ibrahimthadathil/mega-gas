"use client"
import DataTable from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table } from '@/components/ui/table'
import React from 'react'

const page = () => {
 const data = [
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
]
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
              .map((n:any) => n[0])
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

]




  return (
    <div>
      <DataTable data={data} columns={columns}/>
    
    </div>
  )
}

export default page
