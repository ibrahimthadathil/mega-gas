"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AccountsHeaderProps {
  onAddClick: () => void
}

export function AccountsHeader({ onAddClick }: AccountsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold text-foreground">Accounts</h1>
      <Button onClick={onAddClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Account
      </Button>
    </div>
  )
}
