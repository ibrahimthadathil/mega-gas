"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2 } from "lucide-react";
import { Vehicle } from "@/types/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-foreground">
          {vehicle.vehicle_no}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {vehicle.vehicle_type}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Registration Date */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground font-medium">
            Registration Date
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(vehicle.registration_date)}
          </span>
        </div>

        {/* Fitness Validity Date */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground font-medium">
            Fitness Valid Till
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(vehicle.fitness_validity_date)}
          </span>
        </div>

        {/* Tax Validity Date */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground font-medium">
            Tax Valid Till
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(vehicle.tax_validity_date)}
          </span>
        </div>

        {/* Insurance Validity Date */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground font-medium">
            Insurance Valid Till
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(vehicle.insurance_validity_date)}
          </span>
        </div>

        {/* PUCC Validity Date */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground font-medium">
            PUCC Valid Till
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(vehicle.pucc_validity_date)}
          </span>
        </div>

        {/* Permit Validity Date */}
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground font-medium">
            Permit Valid Till
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(vehicle.permit_validity_date)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Vehicle?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {vehicle.vehicle_no}? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
