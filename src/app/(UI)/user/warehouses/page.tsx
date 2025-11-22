"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddWarehouseDialog from "@/app/(UI)/user/warehouses/_UI/warehouse-dialog";
import { Trash2, Edit2 } from "lucide-react";
import {
  addNew_wareHouse,
  getWarehouse,
} from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { UseRQ } from "@/hooks/useReactQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export interface Warehouse {
  id: string;
  name: string;
  type: "Vehicle" | "Purchase" | "Location" | "Sale";
  created_by: string;
}

export default function WarehousePage() {
  const { data, isLoading } = UseRQ("warehouse", getWarehouse);
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  const handleAddWarehouse = async (newWarehouse: {
    name: string;
    type: "Vehicle" | "Purchase" | "Location" | "Sale";
  }) => {
    // if (editingWarehouse) {
    //   setWarehouses(
    //     warehouses.map((w) => (w.id === editingWarehouse.id ? { ...w, name: data.name, type: data.type } : w)),
    //   )
    //   setEditingWarehouse(null)
    // } else {
    // }
    try {
      const data = await addNew_wareHouse(newWarehouse);
      if (data.success) {
        queryClient.invalidateQueries({queryKey:['warehouse']})
        toast.success("Added new Ware House");
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error(
        ((error as AxiosError).response?.data as Record<string, string>).message
      );
    }
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsDialogOpen(true);
  };

  const handleDeleteWarehouse = (id: string) => {};

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
          onOpenChange={setIsDialogOpen}
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
              No warehouses yet. Click "Add Warehouse" to create one.
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
                      onClick={() => handleEditWarehouse(warehouse)}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                      aria-label="Edit warehouse"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteWarehouse(warehouse.id)}
                      className="p-1 hover:bg-destructive/10 rounded-md transition-colors"
                      aria-label="Delete warehouse"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
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
