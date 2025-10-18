// // components/UserDialog.tsx
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface User {
  _id?: string
  firstName: string
  email: string
  role: string
  isActive: boolean
}

interface UserDialogProps {
  user?: User
  onSave: (userData: Omit<User, '_id'>, userId?: string) => void
  trigger: React.ReactNode
}

const UserDialog: React.FC<UserDialogProps> = ({ user, onSave, trigger }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    email: user?.email || '',
    role: user?.role || 'Buyer',
    isActive: user?.isActive ?? true,
  })

  const handleSubmit = () => {
    if (!formData.firstName || !formData.email) return
    
    onSave(formData, user?._id)
    setOpen(false)
    
    // Reset form if adding new user
    if (!user) {
      setFormData({
        firstName: '',
        email: '',
        role: 'Buyer',
        isActive: true,
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && user) {
      // Reset form data when opening for edit
      setFormData({
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update user information here.' : 'Add a new user to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter name"
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
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buyer">Buyer</SelectItem>
                <SelectItem value="Seller">Seller</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.isActive ? 'active' : 'blocked'}
              onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{user ? 'Save Changes' : 'Add User'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog