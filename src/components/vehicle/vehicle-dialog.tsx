"use client";

import { useState, useEffect } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Vehicle } from "@/types/types";

interface VehicleFormData {
  vehicle_no: string;
  vehicle_type: string;
  registration_date: Date | undefined;
  fitness_validity_date: Date | undefined;
  tax_validity_date: Date | undefined;
  insurance_validity_date: Date | undefined;
  pucc_validity_date: Date | undefined;
  permit_validity_date: Date | undefined;
}

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (data: Vehicle) => void;
  submit?:boolean
}

const VEHICLE_TYPES = ["Car", "Truck", "Bike", "Bus", "Auto-Rickshaw", "Tempo"];

export function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
  onSave,
  submit
}: VehicleDialogProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicle_no: "",
    vehicle_type: "",
    registration_date: undefined,
    fitness_validity_date: undefined,
    tax_validity_date: undefined,
    insurance_validity_date: undefined,
    pucc_validity_date: undefined,
    permit_validity_date: undefined,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof VehicleFormData, string>>
  >({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicle_no: vehicle.vehicle_no,
        vehicle_type: vehicle.vehicle_type,
        registration_date: vehicle.registration_date
          ? new Date(vehicle.registration_date)
          : undefined,
        fitness_validity_date: vehicle.fitness_validity_date
          ? new Date(vehicle.fitness_validity_date)
          : undefined,
        tax_validity_date: vehicle.tax_validity_date
          ? new Date(vehicle.tax_validity_date)
          : undefined,
        insurance_validity_date: vehicle.insurance_validity_date
          ? new Date(vehicle.insurance_validity_date)
          : undefined,
        pucc_validity_date: vehicle.pucc_validity_date
          ? new Date(vehicle.pucc_validity_date)
          : undefined,
        permit_validity_date: vehicle.permit_validity_date
          ? new Date(vehicle.permit_validity_date)
          : undefined,
      });
      setErrors({});
    } else {
      setFormData({
        vehicle_no: "",
        vehicle_type: "",
        registration_date: undefined,
        fitness_validity_date: undefined,
        tax_validity_date: undefined,
        insurance_validity_date: undefined,
        pucc_validity_date: undefined,
        permit_validity_date: undefined,
      });
      setErrors({});
    }
  }, [vehicle, open]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.vehicle_no.trim()) {
      newErrors.vehicle_no = "Vehicle number is required";
    }
    if (!formData.vehicle_type) {
      newErrors.vehicle_type = "Vehicle type is required";
    }
    if (!formData.registration_date) {
      newErrors.registration_date = "Registration date is required";
    }
    if (!formData.fitness_validity_date) {
      newErrors.fitness_validity_date = "Fitness validity date is required";
    }
    if (!formData.tax_validity_date) {
      newErrors.tax_validity_date = "Tax validity date is required";
    }
    if (!formData.insurance_validity_date) {
      newErrors.insurance_validity_date = "Insurance validity date is required";
    }
    if (!formData.pucc_validity_date) {
      newErrors.pucc_validity_date = "PUCC validity date is required";
    }
    if (!formData.permit_validity_date) {
      newErrors.permit_validity_date = "Permit validity date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert Date objects to ISO strings for API
      const vehicleData: Vehicle = {
        ...(vehicle?.id && { id: vehicle.id }),
        vehicle_no: formData.vehicle_no,
        vehicle_type: formData.vehicle_type,
        registration_date: formData.registration_date!.toISOString(),
        fitness_validity_date: formData.fitness_validity_date!.toISOString(),
        tax_validity_date: formData.tax_validity_date!.toISOString(),
        insurance_validity_date:
          formData.insurance_validity_date!.toISOString(),
        pucc_validity_date: formData.pucc_validity_date!.toISOString(),
        permit_validity_date: formData.permit_validity_date!.toISOString(),
      };
      onSave(vehicleData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
          <DialogDescription>
            {vehicle
              ? "Update the vehicle details"
              : "Enter the vehicle details to add a new vehicle"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Number */}
          <div className="space-y-2">
            <Label htmlFor="vehicle_no">Vehicle Number *</Label>
            <Input
              id="vehicle_no"
              placeholder="e.g., DL01AB1234"
              value={formData.vehicle_no}
              onChange={(e) =>
                setFormData({ ...formData, vehicle_no: e.target.value })
              }
              className={errors.vehicle_no ? "border-destructive" : ""}
            />
            {errors.vehicle_no && (
              <p className="text-sm text-destructive">{errors.vehicle_no}</p>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="vehicle_type">Vehicle Type *</Label>
            <Select
              value={formData.vehicle_type}
              onValueChange={(value) =>
                setFormData({ ...formData, vehicle_type: value })
              }
            >
              <SelectTrigger
                id="vehicle_type"
                className={errors.vehicle_type ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_type && (
              <p className="text-sm text-destructive">{errors.vehicle_type}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Registration Date */}
            <div className="space-y-2">
              <Label htmlFor="registration_date">Registration Date *</Label>
              <DatePicker
                date={formData.registration_date}
                onDateChange={(date) =>
                  setFormData({ ...formData, registration_date: date })
                }
              />
              {errors.registration_date && (
                <p className="text-sm text-destructive">
                  {errors.registration_date}
                </p>
              )}
            </div>

            {/* Fitness Validity Date */}
            <div className="space-y-2">
              <Label htmlFor="fitness_validity_date">Fitness Validity *</Label>
              <DatePicker
                date={formData.fitness_validity_date}
                allowFutureDates={true}
                onDateChange={(date) =>
                  setFormData({ ...formData, fitness_validity_date: date })
                }
              />
              {errors.fitness_validity_date && (
                <p className="text-sm text-destructive">
                  {errors.fitness_validity_date}
                </p>
              )}
            </div>

            {/* Tax Validity Date */}
            <div className="space-y-2">
              <Label htmlFor="tax_validity_date">Tax Validity *</Label>
              <DatePicker
                date={formData.tax_validity_date}
                onDateChange={(date) =>
                  setFormData({ ...formData, tax_validity_date: date })
                }
                allowFutureDates={true}
              />
              {errors.tax_validity_date && (
                <p className="text-sm text-destructive">
                  {errors.tax_validity_date}
                </p>
              )}
            </div>

            {/* Insurance Validity Date */}
            <div className="space-y-2">
              <Label htmlFor="insurance_validity_date">
                Insurance Validity *
              </Label>
              <DatePicker
                date={formData.insurance_validity_date}
                onDateChange={(date) =>
                  setFormData({ ...formData, insurance_validity_date: date })
                }
                allowFutureDates={true}
              />
              {errors.insurance_validity_date && (
                <p className="text-sm text-destructive">
                  {errors.insurance_validity_date}
                </p>
              )}
            </div>

            {/* PUCC Validity Date */}
            <div className="space-y-2">
              <Label htmlFor="pucc_validity_date">PUCC Validity *</Label>
              <DatePicker
                date={formData.pucc_validity_date}
                allowFutureDates={true}
                onDateChange={(date) =>
                  setFormData({ ...formData, pucc_validity_date: date })
                }
              />
              {errors.pucc_validity_date && (
                <p className="text-sm text-destructive">
                  {errors.pucc_validity_date}
                </p>
              )}
            </div>

            {/* Permit Validity Date */}
            <div className="space-y-2">
              <Label htmlFor="permit_validity_date">Permit Validity *</Label>
              <DatePicker
                date={formData.permit_validity_date}
                allowFutureDates={true}
                onDateChange={(date) =>
                  setFormData({ ...formData, permit_validity_date: date })
                }
              />
              {errors.permit_validity_date && (
                <p className="text-sm text-destructive">
                  {errors.permit_validity_date}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submit}>
              {vehicle ? "Update Vehicle" : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
