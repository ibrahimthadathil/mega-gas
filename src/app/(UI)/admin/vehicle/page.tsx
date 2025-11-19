"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VehicleDialog } from "@/components/vehicle/vehicle-dialog";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { Plus } from "lucide-react";
import { addVehicle } from "@/services/client_api-Service/admin/vehicle/vehicle-api";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  vehicle_no: string;
  vehicle_type: string;
  registration_date: string;
  fitness_validity_date: string;
  tax_validity_date: string;
  insurance_validity_date: string;
  pucc_validity_date: string;
  permit_validity_date: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      vehicle_no: "DL01AB1234",
      vehicle_type: "Car",
      registration_date: "2020-05-15",
      fitness_validity_date: "2026-05-15",
      tax_validity_date: "2025-12-31",
      insurance_validity_date: "2025-06-15",
      pucc_validity_date: "2025-08-20",
      permit_validity_date: "2025-10-10",
    },
    {
      id: "2",
      vehicle_no: "DL02CD5678",
      vehicle_type: "Truck",
      registration_date: "2019-03-20",
      fitness_validity_date: "2025-03-20",
      tax_validity_date: "2025-09-15",
      insurance_validity_date: "2025-07-20",
      pucc_validity_date: "2025-09-25",
      permit_validity_date: "2026-01-15",
    },
  ]);

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

  const handleDeleteClick = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const handleSaveVehicle = async (vehicleData: Vehicle) => {
    try {
      const data = await addVehicle(vehicleData);
      if (data.success) {
        setOpenDialog(false);
        toast.success("Added new Truck");
      }
    } catch (error) {
      toast.error("failed to add, Try later");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => handleEditClick(vehicle)}
              onDelete={() => handleDeleteClick(vehicle.id)}
            />
          ))}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No vehicles found. Click "Add Vehicle" to get started.
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
