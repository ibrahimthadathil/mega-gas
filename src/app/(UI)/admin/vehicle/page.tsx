"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VehicleDialog } from "@/components/vehicle/vehicle-dialog";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { Plus } from "lucide-react";
import {
  addVehicle,
  deleteVehicle,
  getAllVehicles,
} from "@/services/client_api-Service/admin/vehicle/vehicle-api";
import { toast } from "sonner";
import { UseRQ } from "@/hooks/useReactQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Vehicle } from "@/types/types";


export default function VehiclesPage() {
  const { data, isLoading } = UseRQ("vehicles" , getAllVehicles);
  const quryClient = useQueryClient()



  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleAddClick = () => {
    setEditingVehicle(null);
    setOpenDialog(true);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setOpenDialog(true);
  };

  const handleDeleteClick = async(id: string) => {
    try {
      const data = await deleteVehicle(id)
      if(data.success){
        toast.success('Deleted')
        quryClient.invalidateQueries({queryKey:['vehicles']})
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  };

  const handleSaveVehicle = async (vehicleData: Vehicle) => {
    try {
      const data = await addVehicle(vehicleData);
      if (data.success) {
        quryClient.invalidateQueries({queryKey:['vehicles']})
        setOpenDialog(false);
        toast.success("Added new Truck");
      }
    } catch (error) {
      toast.error((error as Error).message+"failed to add, Try later");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Vehicles</h1>
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        </div>

        {/* Vehicle Grid */}
        {isLoading? 
        <div className="flex flex-col space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Skeleton className="h-[125px] w-full rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 md:w-3/4" />
            </div>
          </div>
        :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(data as Vehicle[]).map((vehicle:Vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => handleEditClick(vehicle)}
              onDelete={() => handleDeleteClick(vehicle.id as string)}
            />
          ))}
        </div>}

        {(data as Vehicle[])?.length === 0&& (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
             { `No vehicles found. Click "Add Vehicle" to get started.`}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Vehicle Dialog */}
      <VehicleDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
      />
    </main>
  );
}
