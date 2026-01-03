"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Account } from "@/app/(UI)/user/accounts/page";

const accountFormSchema = z.object({
  account_name: z
    .string()
    .min(1, "Account name is required")
    .min(2, "Account name must be at least 2 characters"),
 account_type: z
  .enum(["Business", "Personal", "Enterprise", "Startup"])
  .refine(Boolean, {
    message: "Please select an account type",
  }),

});

type AccountFormData = z.infer<typeof accountFormSchema>;

interface AddAccountDialogProps {
  onUpdate: (id: string, account: Account) => void;
  account?: Account;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    name: string,
    type: "Business" | "Personal" | "Enterprise" | "Startup"
  ) => void;
}

function AccountForm({
  account,
  onSubmit,
  onCancel,
}: {
  account?: Account;
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      account_name: account?.account_name || "",
      account_type: account?.account_type || undefined,
    },
  });

  const typeValue = watch("account_type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="account-name">Account Name</Label>
        <Input
          id="account-name"
          placeholder="Enter account name"
          {...register("account_name")}
        />
        {errors.account_name && (
          <p className="text-sm text-destructive">
            {errors.account_name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-type">Account Type</Label>
        <Select
          value={typeValue || ""}
          onValueChange={(value) =>
            setValue("account_type", value as AccountFormData["account_type"])
          }
        >
          <SelectTrigger id="account-type">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
            <SelectItem value="Startup">Startup</SelectItem>
          </SelectContent>
        </Select>
        {errors.account_type && (
          <p className="text-sm text-destructive">
            {errors.account_type.message}
          </p>
        )}
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {account
            ? isSubmitting
              ? "Updating..."
              : "Update Account"
            : isSubmitting
            ? "Creating..."
            : "Create Account"}
        </Button>
      </div>
    </form>
  );
}

export function AddAccountDialog({
  open,
  onOpenChange,
  onAdd,
  account,
  onUpdate,
}: AddAccountDialogProps) {
  const onSubmit = async (data: AccountFormData) => {
    if (account) {
      onUpdate(account.id as string, data);
    } else {
      onAdd(data.account_name, data.account_type);
    }
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {account ? "Edit Account" : "Add New Account"}
          </DialogTitle>
          <DialogDescription>
            {account
              ? "Update the account details below."
              : "Create a new account by filling in the details below."}
          </DialogDescription>
        </DialogHeader>
        <AccountForm
          key={account?.id || "new"}
          account={account}
          onSubmit={onSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
