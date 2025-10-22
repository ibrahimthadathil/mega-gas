"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface User {
  _id?: string
  username: string
  password: string
  email: string
  phone: string
  role: string
  isActive: boolean
}

interface UserDialogProps {
  user?: User
  onSave: (userData: Omit<User, "_id">, userId?: string) => void
  trigger: React.ReactNode
}

const UserDialog: React.FC<UserDialogProps> = ({ user, onSave, trigger }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: user?.password || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Driver",
    isActive: user?.isActive ?? true,
  })

  const handleSubmit = () => {
    if (!formData.username || !formData.password || !formData.email || !formData.phone) return

    onSave(formData, user?._id)
    setOpen(false)

    // Reset form if adding new user
    if (!user) {
      setFormData({
        username: "",
        password: "",
        email: "",
        phone: "",
        role: "Driver",
        isActive: true,
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && user) {
      // Reset form data when opening for edit
      setFormData({
        username: user.username,
        password: user.password,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user information here." : "Add a new user to the system."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
         
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{user ? "Save Changes" : "Add User"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog
