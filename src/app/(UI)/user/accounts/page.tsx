"use client";

import { useState } from "react";
import { AccountsHeader } from "@/components/accounts/accounts-header";
import { AccountsList } from "@/components/accounts/accounts-list";
import { AddAccountDialog } from "@/components/accounts/add-account-dialog";
import { toast } from "sonner";
import {
  createAccount,
  deleteAccount,
  getAllAccountsParty,
  updateAccount,
} from "@/services/client_api-Service/user/accounts/accounts_api";
import { useQueryClient } from "@tanstack/react-query";
import { UseRQ } from "@/hooks/useReactQuery";
import { UseRMutation } from "@/hooks/use-mutation";

export interface Account {
  id?: string;
  account_name: string;
  account_type: "Business" | "Personal" | "Enterprise" | "Startup";
  created_at?: Date;
}

export default function Home() {
  const { data: accounts, isLoading: accountsLoading } = UseRQ<Account[]>(
    "accounts",
    getAllAccountsParty
  );
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [editableAccount, setEditableAccount] = useState<Account>();
  const handleAddAccount = async (
    name: string,
    type: Account["account_type"]
  ) => {
    try {
      const data = await createAccount({
        account_name: name,
        account_type: type,
      });      
      if (data.success)
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
    } catch (error) {
      toast.error("failed to add accounts");
    }

    setOpen(false);
  };
  const setEditAccount = (account: Account) => {
    setEditableAccount(account);
    setOpen(true);
  };
  const handleUpdateAccount = async (id:string,account: Account) => {

    try {
      const data = await updateAccount(id,account)
      if(data.success)queryClient.invalidateQueries({queryKey:['accounts']})
        toast.success(data.message)
    } catch (error) {
      toast.error('failed to update')
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const data = await deleteAccount(id);
      if (data.success)
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
    } catch (error) {
      toast.error("failed to delete");
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <AccountsHeader onAddClick={() => setOpen(true)} />
        {accounts && (
          <AccountsList
            accounts={accounts}
            onEdit={setEditAccount}
            onDelete={handleDeleteAccount}
          />
        )}
        <AddAccountDialog
          account={editableAccount}
          open={open}
          onOpenChange={setOpen}
          onAdd={handleAddAccount}
          onUpdate={handleUpdateAccount}
        />
      </div>
    </main>
  );
}
