"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddWarehouseDialog from "@/app/(UI)/user/warehouses/_UI/warehouse-dialog";
import { Trash2, Edit2 } from "lucide-react";
import AlertModal from "@/components/alert-dialog";
import {
  addNew_wareHouse,
  editWarehouse,
  deleteWarehouse,
  getWarehouse,
} from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { UseRQ } from "@/hooks/useReactQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export interface Warehouse {
  id?: string;
  name: string;
  type: "Vehicle" | "Purchase" | "Location" | "Sale";
  created_by?: string;
}

export default function WarehousePage() {
  const { data, isLoading } = UseRQ("warehouse", getWarehouse);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  const handleAddWarehouse = async (newWarehouse: Warehouse) => {
    try {
      const data = await addNew_wareHouse(newWarehouse);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["warehouse"] });
        toast.success("Added new Warehouse");
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error(
        ((error as AxiosError).response?.data as Record<string, string>).message
      );
    }
  };

  const handleEditWarehouse = async (warehouse: Warehouse) => {
    try {
      const response = await editWarehouse({
        ...warehouse,
        id: editingWarehouse?.id,
      });

      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["warehouse"] });
        toast.success("Warehouse updated successfully");
        setIsDialogOpen(false);
        setEditingWarehouse(null);
      }
    } catch (error) {
      toast.error(
        ((error as AxiosError).response?.data as Record<string, string>)
          ?.message || "Failed to update warehouse"
      );
    }
  };

  const handleEditClick = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsDialogOpen(true);
  };

  const handleDeleteWarehouse = async (id: string) => {
    try {
      const data = await deleteWarehouse(id);
      if (data) queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      toast.success(data.message);
    } catch (error) {
      toast.error("failed to delete");
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingWarehouse(null);
    }
    setIsDialogOpen(open);
  };

  const typeColors: Record<
    "Vehicle" | "Purchase" | "Location" | "Sale",
    string
  > = {
    Vehicle: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Location:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Purchase:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Sale: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Warehouse Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
          <Button
            onClick={() => {
              setEditingWarehouse(null);
              setIsDialogOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Warehouse
          </Button>
        </div>

        {/* Add Warehouse Dialog */}
        <AddWarehouseDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogClose}
          onEdit={handleEditWarehouse}
          onSubmit={handleAddWarehouse}
          initialData={editingWarehouse || undefined}
        />

        {/* Warehouse Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 md:w-3/4" />
            </div>
          </div>
        ) : (data as Warehouse[]).length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-lg">
              {`No warehouses yet. Click "Add Warehouse" to create one.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data as Warehouse[]).map((warehouse) => (
              <Card
                key={warehouse.id}
                className="border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {warehouse.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(warehouse)}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                      aria-label="Edit warehouse"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <AlertModal
                      data={warehouse}
                      varient="ghost"
                      contents={[
                        <Button
                          key="delete-btn"
                          variant="ghost"
                          size="sm"
                          className="mt-1 text-destructive hover:text-destructive gap-2 w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>,
                        <span key="delete-text">
                          This action cannot be undone. This will permanently
                          delete{" "}
                          <span className="font-semibold text-orange-400">
                            {warehouse.name || "This warehouse"}
                          </span>
                          's account and remove their data from our servers.
                        </span>,
                      ]}
                      action={() =>
                        handleDeleteWarehouse(warehouse.id as string)
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge className={typeColors[warehouse.type]}>
                      {warehouse.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
