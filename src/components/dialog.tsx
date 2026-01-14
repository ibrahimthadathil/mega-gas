"use client";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IUser } from "@/types/types";
import { userFormSchema } from "@/lib/schema/zodSchema";
import { toast } from "sonner";
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Warehouse } from "@/app/(UI)/user/warehouses/page";
import { X } from "lucide-react";

interface UserDialogProps {
  user?: IUser;
  onSave: (
    userData: Omit<IUser, "_id">,
    userId?: string,
    authId?: string
  ) => void;
  trigger: React.ReactNode;
  users?: IUser[]; // Users list for delivery boys selection
}

type UserFormValues = z.infer<typeof userFormSchema>;

const UserDialog: React.FC<UserDialogProps> = ({
  user,
  trigger,
  users = [],
  onSave,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDeliveryBoyValue, setSelectedDeliveryBoyValue] =
    useState<string>("");
  const { data: warehousesData } = UseRQ<Warehouse[]>(
    "warehouse",
    getWarehouse,
    { enabled: !!user }
  );
 
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      user_name: user?.user_name || "",
      password: user?.password || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role,
      warehouse_id: "",
      delivery_boys: [],
    },
  });

  const deliveryBoysField = form.watch("delivery_boys");

  // Get available delivery boys (not already selected and not the current user if editing)
  const availableDeliveryBoys = users.filter(
    (u) =>
      !deliveryBoysField.includes(u.id || "") &&
      (user ? u.id !== user.id : true)
  );

  // Get selected delivery boys objects
  const selectedDeliveryBoysObjects = deliveryBoysField
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is IUser => u !== undefined);
    

  const handleAddDeliveryBoy = (deliveryBoyId: string) => {
    if (!deliveryBoysField.includes(deliveryBoyId)) {
      form.setValue("delivery_boys", [...deliveryBoysField, deliveryBoyId]);
    }
    setSelectedDeliveryBoyValue("");
  };

  const handleRemoveDeliveryBoy = (deliveryBoyId: string) => {
    form.setValue(
      "delivery_boys",
      deliveryBoysField.filter((id) => id !== deliveryBoyId)
    );
  };

  const handleSubmit = async (userData: UserFormValues) => {
    try {
      if (user) {
        // Edit mode - call onSave with user id
        onSave(userData, user.id, user.auth_id);
         setOpen(false);
      } else {
        // Add mode - call API directly
        const { data } = await axios.post("/api/admin/auth", userData);
        if (data.success) {
          setOpen(false);
          toast.success(data.message);
          form.reset();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(
        ((error as AxiosError).response?.data as Record<string, string>).message
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && user) {
      // Reset form data when opening for edit
      form.reset({
        user_name: user.user_name,
        password: user.password,
        email: user.email,
        phone: user.phone,
        role: user.role,
        warehouse_id: (user as any).warehouse_id || "",
        delivery_boys: (user as any).delivery_boys || [],
      });
    } else if (!newOpen) {
      // Reset form when closing
      form.reset({
        user_name: "",
        password: "",
        email: "",
        phone: "",
        role: undefined,
        warehouse_id: "",
        delivery_boys: [],
      });
      setSelectedDeliveryBoyValue("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information here."
              : "Add a new user to the system."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="office_staff">Office Staff</SelectItem>
                      <SelectItem value="plant_driver">Plant driver</SelectItem>
                      <SelectItem value="godown_staff">Godown Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Only show warehouse and delivery boys fields in edit mode */}
            {user && (
              <>
                <FormField
                  control={form.control}
                  name="warehouse_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehousesData?.map((warehouse) => (
                            <SelectItem
                              key={warehouse.id}
                              value={warehouse.id || ""}
                            >
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_boys"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Boys</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Select
                            value={selectedDeliveryBoyValue}
                            onValueChange={handleAddDeliveryBoy}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery boys" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDeliveryBoys.length === 0 ? (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  All delivery boys selected
                                </div>
                              ) : (
                                users.map((deliveryBoy) => (
                                  <SelectItem
                                    key={deliveryBoy.id}
                                    value={deliveryBoy.id || ""}
                                  >
                                    {deliveryBoy.user_name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>

                          {/* Selected Delivery Boys */}
                          {selectedDeliveryBoysObjects.length > 0 && (
                            <div className="pt-2 border-t">
                              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Selected Delivery Boys (
                                {selectedDeliveryBoysObjects.length})
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {selectedDeliveryBoysObjects.map(
                                  (deliveryBoy) => (
                                    <div
                                      key={deliveryBoy.id}
                                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md"
                                    >
                                      <span className="text-sm font-medium">
                                        {deliveryBoy.user_name}
                                      </span>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 w-5 p-0 hover:bg-primary/20"
                                        onClick={() =>
                                          handleRemoveDeliveryBoy(
                                            deliveryBoy.id || ""
                                          )
                                        }
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {selectedDeliveryBoysObjects.length === 0 && (
                            <p className="text-sm text-muted-foreground pt-2 border-t">
                              No delivery boys selected. Please select from the
                              dropdown above.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="submit">
                {user ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
