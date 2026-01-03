"use client";

import type React from "react";
import AlertModal from "@/components/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Building2, User, Zap, Lightbulb, Pencil } from "lucide-react";
import type { Account } from "@/app/(UI)/user/accounts/page";
import { formatDate } from "@/lib/utils";

interface AccountsListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
  onEdit:(account:Account)=>void
}

const typeIcons: Record<Account["account_type"], React.ReactNode> = {
  Business: <Building2 className="w-6 h-6" />,
  Personal: <User className="w-6 h-6" />,
  Enterprise: <Zap className="w-6 h-6" />,
  Startup: <Lightbulb className="w-6 h-6" />,
};

export function AccountsList({ accounts, onDelete,onEdit }: AccountsListProps) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No accounts yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts?.map((account) => (
        <Card
          key={account.id}
          className="flex flex-col hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {typeIcons[account?.account_type]}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {account?.account_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {account?.account_type}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-xs text-muted-foreground">
              Created {formatDate(new Date(account?.created_at as Date))}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(account)}
              className="mt-4 hover:text-blue-300 gap-2 w-full"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            <AlertModal
              data={account}
              contents={[
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 text-destructive hover:text-destructive gap-2 w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>,
                <>
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="font-semibold text-orange-400">
                    {account.account_name || "This Account"}
                  </span>
                  's account and remove their data from our servers.
                </>,
              ]}
              action={() => onDelete(account.id as string)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
