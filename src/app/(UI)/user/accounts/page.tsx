"use client"

import { useState } from "react"
import { AccountsHeader } from "@/components/accounts/accounts-header"
import { AccountsList } from "@/components/accounts/accounts-list"
import { AddAccountDialog } from "@/components/accounts/add-account-dialog"
import { toast } from "sonner"
import { createAccount } from "@/services/client_api-Service/user/accounts/accounts_api"

export interface Account {
  id: string
  name: string
  type: "Business" | "Personal" | "Enterprise" | "Startup"
  createdAt: Date
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [open, setOpen] = useState(false)

  const handleAddAccount = async(name: string, type: Account["type"]) => {
    try {
      await createAccount({account_name:name,account_type:type})
    } catch (error) {
      toast.error('failed to add accounts')
    }


    setOpen(false)
  }

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id))
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <AccountsHeader onAddClick={() => setOpen(true)} />
        <AccountsList accounts={accounts} onDelete={handleDeleteAccount} />
        <AddAccountDialog open={open} onOpenChange={setOpen} onAdd={handleAddAccount} />
      </div>
    </main>
  )
}
