"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Warehouse } from "../page";

interface AddWarehouseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit:(data:Warehouse)=>void;
  onSubmit: (data: {
    name: string;
    type: "Vehicle" | "Purchase" | "Location" | "Sale";
  }) => void;
  initialData?: {
    name: string;
    type: "Vehicle" | "Purchase" | "Location" | "Sale";
  };
}

export default function AddWarehouseDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  onEdit,
  initialData,
}: AddWarehouseDialogProps) {
  const form = useForm<{
    name: string;
    type: "Vehicle" | "Purchase" | "Location" | "Sale";
  }>({
    defaultValues: {
      name: "",
      type: "Vehicle",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({ name: "", type: "Vehicle" });
      }
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = form.handleSubmit((data) => {
    initialData ? onEdit(data) : onSubmit(data)
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initialData ? "Edit Warehouse" : "Add Warehouse"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {initialData
              ? "Update the warehouse details below."
              : "Fill in the details to create a new warehouse."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Warehouse Name Field */}
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Warehouse name is required",
                minLength: {
                  value: 1,
                  message: "Warehouse name cannot be empty",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Warehouse Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter warehouse name"
                      {...field}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            {/* Warehouse Type Field */}
            <FormField
              control={form.control}
              name="type"
              rules={{
                required: "Warehouse type is required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Warehouse Type
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="border-border bg-background text-foreground">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Location">Location</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            {/* Dialog Actions */}
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {initialData ? "Update Warehouse" : "Add Warehouse"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
