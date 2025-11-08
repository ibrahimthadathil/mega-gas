"use client";

import { useState } from "react";
import { Trash2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface TripLoadRecord {
  id: string;
  driverName: string;
  vehicleNumber: string;
  fullQuantity: number;
  emptyQuantity: number;
}

interface TripFormData {
  tripType: "one-way" | "two-way";
  date: Date | undefined;
  sapNumber: string;
  cylindersCount: string;
  vehicleNumber: string;
  driverName: string;
  tripLoadRecords: TripLoadRecord[];
  helpers: string[];
}

const HELPER_OPTIONS = ["Ramesh", "Akhil", "Musthafa", "Faizal"];

export function TripSheet() {
  const [formData, setFormData] = useState<TripFormData>({
    tripType: "one-way",
    date: undefined,
    sapNumber: "",
    cylindersCount: "",
    vehicleNumber: "",
    driverName: "",
    tripLoadRecords: [],
    helpers: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFormData, setDialogFormData] = useState({
    driverName: "",
    vehicleNumber: "",
    fullQuantity: "",
    emptyQuantity: "",
  });

  // Trip Details Section Handlers
  const handleTripTypeChange = (value: "one-way" | "two-way") => {
    setFormData({ ...formData, tripType: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, date });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Trip Load Details Dialog Handlers
  const handleDialogFormChange = (field: string, value: string) => {
    setDialogFormData({ ...dialogFormData, [field]: value });
  };

  const handleAddTripLoad = () => {
    if (!dialogFormData.driverName || !dialogFormData.vehicleNumber) {
      return;
    }

    const existingRecordIndex = formData.tripLoadRecords.findIndex(
      (r) =>
        r.driverName === dialogFormData.driverName &&
        r.vehicleNumber === dialogFormData.vehicleNumber
    );

    const fullQty = Number.parseInt(dialogFormData.fullQuantity) || 0;
    const emptyQty = Number.parseInt(dialogFormData.emptyQuantity) || 0;

    if (fullQty === 0 && emptyQty === 0) {
      return;
    }

    if (existingRecordIndex >= 0) {
      const updatedRecords = [...formData.tripLoadRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        fullQuantity:
          updatedRecords[existingRecordIndex].fullQuantity + fullQty,
        emptyQuantity:
          updatedRecords[existingRecordIndex].emptyQuantity + emptyQty,
      };
      setFormData({ ...formData, tripLoadRecords: updatedRecords });
    } else {
      const newRecord: TripLoadRecord = {
        id: Date.now().toString(),
        driverName: dialogFormData.driverName,
        vehicleNumber: dialogFormData.vehicleNumber,
        fullQuantity: fullQty,
        emptyQuantity: emptyQty,
      };
      setFormData({
        ...formData,
        tripLoadRecords: [...formData.tripLoadRecords, newRecord],
      });
    }

    setDialogFormData({
      driverName: "",
      vehicleNumber: "",
      fullQuantity: "",
      emptyQuantity: "",
    });
    setDialogOpen(false);
  };

  const handleDeleteTripLoad = (id: string) => {
    setFormData({
      ...formData,
      tripLoadRecords: formData.tripLoadRecords.filter(
        (record) => record.id !== id
      ),
    });
  };

  // Helpers Section Handlers
  const handleAddHelper = (helper: string) => {
    if (!formData.helpers.includes(helper)) {
      setFormData({
        ...formData,
        helpers: [...formData.helpers, helper],
      });
    }
  };

  const handleRemoveHelper = (helper: string) => {
    setFormData({
      ...formData,
      helpers: formData.helpers.filter((h) => h !== helper),
    });
  };

  // Calculate Totals
  const totalEmpty = formData.tripLoadRecords.reduce(
    (sum, r) => sum + r.emptyQuantity,
    0
  );
  const totalFull = formData.tripLoadRecords.reduce(
    (sum, r) => sum + r.fullQuantity,
    0
  );

  // Handle Submit
  const handleProceed = () => {
    console.log("Trip Sheet Data:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Section 1: Trip Details Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Trip Details</h2>

        {/* Trip Type + Date */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          {/* Trip Type */}
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium whitespace-nowrap">
              Trip Type
            </Label>
            <RadioGroup
              value={formData.tripType}
              onValueChange={handleTripTypeChange}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label
                  htmlFor="one-way"
                  className="text-sm cursor-pointer font-normal"
                >
                  One Way
                </Label>
              </div>
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="two-way" id="two-way" />
                <Label
                  htmlFor="two-way"
                  className="text-sm cursor-pointer font-normal"
                >
                  Two Way
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 md:ml-8">
            <Label
              htmlFor="date"
              className="text-sm font-medium whitespace-nowrap"
            >
              Date
            </Label>
            <div className="w-40">
              <DatePicker
                date={formData.date}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        {/* SAP Number + Cylinders */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Label htmlFor="sap" className="text-sm font-medium mb-1 block">
              SAP Number
            </Label>
            <Input
              id="sap"
              placeholder="Enter SAP Number"
              value={formData.sapNumber}
              onChange={(e) => handleInputChange("sapNumber", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label
              htmlFor="cylinders"
              className="text-sm font-medium mb-1 block"
            >
              No. of Cylinders
            </Label>
            <Input
              id="cylinders"
              placeholder="Enter number"
              value={formData.cylindersCount}
              onChange={(e) =>
                handleInputChange("cylindersCount", e.target.value)
              }
            />
          </div>
        </div>

        {/* Vehicle Number + Driver Name */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="vehicle" className="text-sm font-medium mb-1 block">
              Vehicle Number
            </Label>
            <Input
              id="vehicle"
              placeholder="Enter vehicle number"
              value={formData.vehicleNumber}
              onChange={(e) =>
                handleInputChange("vehicleNumber", e.target.value)
              }
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="driver" className="text-sm font-medium mb-1 block">
              Driver Name
            </Label>
            <Input
              id="driver"
              placeholder="Enter driver name"
              value={formData.driverName}
              onChange={(e) => handleInputChange("driverName", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Trip Load Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Trip Load Details</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Trip Load Record</DialogTitle>
                <DialogDescription>
                  Enter the details for the new trip load record.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="load-driver">Driver Name</Label>
                  <Input
                    id="load-driver"
                    placeholder="Enter driver name"
                    value={dialogFormData.driverName}
                    onChange={(e) =>
                      handleDialogFormChange("driverName", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="load-vehicle">Vehicle Number</Label>
                  <Input
                    id="load-vehicle"
                    placeholder="Enter vehicle number"
                    value={dialogFormData.vehicleNumber}
                    onChange={(e) =>
                      handleDialogFormChange("vehicleNumber", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="load-full">Full</Label>
                    <Input
                      id="load-full"
                      type="number"
                      placeholder="Quantity"
                      value={dialogFormData.fullQuantity}
                      onChange={(e) =>
                        handleDialogFormChange("fullQuantity", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="load-empty">Empty</Label>
                    <Input
                      id="load-empty"
                      type="number"
                      placeholder="Quantity"
                      value={dialogFormData.emptyQuantity}
                      onChange={(e) =>
                        handleDialogFormChange("emptyQuantity", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTripLoad}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scrollable Cards */}
        {formData.tripLoadRecords.length > 0 ? (
          <>
            <div className="overflow-x-auto flex gap-2 snap-x mb-4 pb-2">
              {formData.tripLoadRecords.map((record) => (
                <Card
                  key={record.id}
                  className="flex-shrink-0 min-w-[220px] p-3 relative"
                >
                  <button
                    onClick={() => handleDeleteTripLoad(record.id)}
                    className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="space-y-1.5">
                    <div>
                      <p className="text-xs text-muted-foreground">Driver</p>
                      <p className="font-medium text-xs">{record.driverName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="font-medium text-xs">
                        {record.vehicleNumber}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs pt-1">
                      {record.fullQuantity > 0 && (
                        <div className="flex-1 bg-green-100 dark:bg-green-900 rounded px-2 py-1">
                          <p className="text-muted-foreground text-xs">Full</p>
                          <p className="font-semibold text-green-700 dark:text-green-100">
                            {record.fullQuantity}
                          </p>
                        </div>
                      )}
                      {record.emptyQuantity > 0 && (
                        <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded px-2 py-1">
                          <p className="text-muted-foreground text-xs">Empty</p>
                          <p className="font-semibold text-blue-700 dark:text-blue-100">
                            {record.emptyQuantity}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Totals */}
            <div className="flex gap-6 text-sm bg-muted/30 rounded p-3">
              <div>
                <p className="text-muted-foreground">Total Empty:</p>
                <p className="font-semibold text-lg">{totalEmpty}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Full:</p>
                <p className="font-semibold text-lg">{totalFull}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No trip load records added yet.
          </p>
        )}
      </div>

      {/* Section 3: Helpers */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Helpers</h2>

        <div className="mb-4">
          <Label
            htmlFor="helpers-select"
            className="text-sm font-medium mb-2 block"
          >
            Select Helper
          </Label>
          <Select onValueChange={handleAddHelper}>
            <SelectTrigger id="helpers-select">
              <SelectValue placeholder="Choose a helper..." />
            </SelectTrigger>
            <SelectContent>
              {HELPER_OPTIONS.map((helper) => (
                <SelectItem
                  key={helper}
                  value={helper}
                  disabled={formData.helpers.includes(helper)}
                >
                  {helper}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Helper Badges */}
        {formData.helpers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.helpers.map((helper) => (
              <div
                key={helper}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium"
              >
                {helper}
                <button
                  onClick={() => handleRemoveHelper(helper)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No helpers added yet.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button onClick={handleProceed} className="w-full" size="lg">
        Proceed
      </Button>
    </div>
  );
}
