"use client";

import { useState } from "react";
import { Trash2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { DatePicker } from "@/components/ui/date-picker";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PlantLoadRecord } from "@/types/types"; // Assuming this type contains line_items, sap_number, etc.
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Warehouse } from "../../warehouses/page"; // Assuming this is the Warehouse type

// --- 1. UPDATED INTERFACES ---
interface TripLoadRecord {
  id: string; // Unique ID for key/deletion

  // Fields entered by the user
  to_warehouse_id: string; // The destination warehouse/vehicle ID
  fullQuantity: number;
  emptyQuantity: number;

  // Fields inherited from the selected line item
  trip_type: "oneway" | "two_way";
  product_id: string;
  plant_load_line_item_id: string;
  return_product_id: string | null; // Product ID for empty/return loads

  // Conditional Field
  return_warehouse_id: string | null; // Set for one-way return, or same as origin for two-way
}

interface TripFormData {
  date: Date | undefined;
  sapNumber: string;
  qty: string;
  warehouse_id: string; // Origin warehouse ID
  plant_load_register_id?: string;
  plant_load_line_item_id?: string;
  tripLoadRecords: TripLoadRecord[];
  helpers: string[];
}

// Assuming the structure of a line item from unloadRecord
interface UnloadLineItem {
  line_item_id: string;
  product_name: string;
  product_id: string;
  trip: "oneway" | "two_way"; // Renamed to 'trip' in source code
  return_qty: number; // Max possible return quantity
  return_product_id: string | null;
}

// --- CONSTANTS ---
const HELPER_OPTIONS = ["Ramesh", "Akhil", "Musthafa", "Faizal"];

export default function TripSheet() {
  const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<
    Warehouse[]
  >("warehouse", getWarehouse);
  const params = useParams();
  const queryClient = useQueryClient();
  const loadSlip_sap = params.id;

  // Retrieve the default record
  const unloadRecord = queryClient.getQueryData([
    "plant_load",
    loadSlip_sap,
  ]) as PlantLoadRecord;

  // --- 2. UPDATED STATE INITIALIZATION ---
  const [formData, setFormData] = useState<TripFormData>({
    date: undefined,
    sapNumber: unloadRecord?.sap_number || "",
    qty: unloadRecord?.total_full_qty?.toString() || "",
    warehouse_id: unloadRecord?.warehouse_id || "", // Origin warehouse ID
    tripLoadRecords: [],
    helpers: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] =
    useState<UnloadLineItem | null>(null);

  // State for user inputs in the dialog
  const [dialogFormData, setDialogFormData] = useState({
    to_warehouse_id: "", // The vehicle ID selected by the user
    fullQuantity: "",
    emptyQuantity: "", // Changed from return_qty for clarity
    return_warehouse_id: "", // Only needed for one-way trips with returns
  });

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, date });
  };

  // Trip Load Details Dialog Handlers
  const handleDialogFormChange = (field: string, value: string) => {
    setDialogFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- 3. UPDATED LINE ITEM CLICK HANDLER ---
  const handleLineItemClick = (lineItem: UnloadLineItem) => {
    setSelectedLineItem(lineItem);

    // Reset inputs, but conditionally pre-set return_warehouse_id for two-way
    setDialogFormData({
      to_warehouse_id: "",
      fullQuantity: "",
      emptyQuantity: "",
      // In a two-way trip, the return warehouse is always the origin warehouse.
      // We will set this explicitly in handleAddTripLoad, but initialize here.
      return_warehouse_id: "",
    });
    setDialogOpen(true);
  };

  // --- 4. UPDATED ADD TRIP LOAD LOGIC (CRUCIAL) ---
  const handleAddTripLoad = () => {
    if (!dialogFormData.to_warehouse_id || !selectedLineItem) {
      alert("Please select a vehicle/destination warehouse.");
      return;
    }

    const fullQty = Number.parseInt(dialogFormData.fullQuantity) || 0;
    const emptyQty = Number.parseInt(dialogFormData.emptyQuantity) || 0;

    if (fullQty === 0 && emptyQty === 0) {
      alert("Full quantity or Empty quantity must be greater than zero.");
      return;
    }

    // Determine the Return Warehouse ID based on trip type and input
    let finalReturnWarehouseId: string | null = null;

    if (selectedLineItem.trip === "two_way") {
      // Two-way trip: Return warehouse is the origin warehouse (the plant/current warehouse)
      finalReturnWarehouseId = formData.warehouse_id || null;
    } else if (selectedLineItem.trip === "oneway") {
      if (emptyQty > 0) {
        // One-way trip with return product requires user to select return warehouse
        finalReturnWarehouseId = dialogFormData.return_warehouse_id || null;
        if (!finalReturnWarehouseId) {
          alert("Please select a Return Warehouse for the empty loads.");
          return;
        }
      }
      // If emptyQty is 0, finalReturnWarehouseId remains null.
    }

    // Construct the new TripLoadRecord
    const newRecord: TripLoadRecord = {
      id: Date.now().toString(),
      plant_load_line_item_id: selectedLineItem.line_item_id,
      trip_type: selectedLineItem.trip,

      // Product IDs inherited from the selected line item
      product_id: selectedLineItem.product_id,
      return_product_id: selectedLineItem.return_product_id || null,

      // User Input
      to_warehouse_id: dialogFormData.to_warehouse_id, // The Vehicle/Destination ID
      fullQuantity: fullQty,
      emptyQuantity: emptyQty,
      return_warehouse_id: finalReturnWarehouseId, // Conditional ID
    };

    // Update form data state
    setFormData((prev) => ({
      ...prev,
      tripLoadRecords: [...prev.tripLoadRecords, newRecord],
    }));

    // Reset dialog state and close
    setDialogFormData({
      to_warehouse_id: "",
      fullQuantity: "",
      emptyQuantity: "",
      return_warehouse_id: "",
    });
    setSelectedLineItem(null);
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
      setFormData((prev) => ({
        ...prev,
        helpers: [...prev.helpers, helper],
      }));
    }
  };

  const handleRemoveHelper = (helper: string) => {
    setFormData((prev) => ({
      ...prev,
      helpers: prev.helpers.filter((h) => h !== helper),
    }));
  };

  // Calculate Totals
  const totalEmpty = formData.tripLoadRecords.reduce(
    (sum, r) => sum + r.emptyQuantity, // Use emptyQuantity
    0
  );
  const totalFull = formData.tripLoadRecords.reduce(
    (sum, r) => sum + r.fullQuantity,
    0
  );

  // Helper to lookup warehouse name
  const getWarehouseName = (id: string | undefined): string => {
    if (!id || !warehouses) return "N/A";
    return warehouses.find((w) => w.id === id)?.name || id;
  };

  // Handle Submit
  const handleProceed = () => {
    console.log("Trip Sheet Data:", formData);
    alert("Form submitted! Check console for data.");
  };

  if (isWarehouseLoading) return <Skeleton className="h-screen w-full" />;

  if (!unloadRecord) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Unload items not found
              </p>
              <Link href={"/user/purchase"}>
                <Button>Go Back</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Section 1: Trip Details Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">🚚 Trip Details</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Date */}
          <div className="flex-1">
            <Label htmlFor="date" className="text-sm font-medium mb-1 block">
              Date
            </Label>
            <DatePicker date={formData.date} onDateChange={handleDateChange} />
          </div>

          {/* Warehouse (Origin - Display Only) */}
          <div className="flex-1">
            <Label className="text-sm font-medium mb-1 block">
              Origin Warehouse
            </Label>
            <Input
              value={unloadRecord?.warehouse_name || ""}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        {/* SAP Number + Total Cylinders */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="sap" className="text-sm font-medium mb-1 block">
              SAP Number
            </Label>
            <Input
              id="sap"
              value={formData.sapNumber}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="flex-1">
            <Label
              htmlFor="cylinders"
              className="text-sm font-medium mb-1 block"
            >
              Total Full Quantity (From SAP)
            </Label>
            <Input
              id="cylinders"
              value={formData.qty}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      <hr />

      {/* Section 2: Trip Load Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📦 Trip Load Details</h2>
          <p className="text-sm text-muted-foreground">
            Click on a product card to add load details
          </p>
        </div>

        {/* Product Cards from Line Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {unloadRecord?.line_items?.map((lineItem: any) => (
            <Card
              key={lineItem.line_item_id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleLineItemClick(lineItem)}
            >
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="font-medium text-sm truncate">
                    {lineItem.product_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      lineItem.trip === "two_way"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                        : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100"
                    }`}
                  >
                    {lineItem.trip === "two_way" ? "Two Way" : "One Way"}
                  </div>
                  {lineItem.return_qty > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Max Return: {lineItem.return_qty}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dialog for Adding Load Details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Add Load Details for {selectedLineItem?.product_name}
              </DialogTitle>
              <DialogDescription>
                Enter the destination and quantity for this product.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Vehicle/To Warehouse Selection (Destination) */}
              <div className="grid gap-2">
                <Label htmlFor="load-vehicle">
                  Destination Vehicle/Warehouse (to_warehouse_id)
                </Label>
                <Select
                  value={dialogFormData.to_warehouse_id} // CHANGED
                  onValueChange={
                    (value) => handleDialogFormChange("to_warehouse_id", value) // CHANGED
                  }
                >
                  <SelectTrigger id="load-vehicle">
                    <SelectValue placeholder="Select vehicle/warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isWarehouseLoading ? (
                      <Skeleton />
                    ) : (
                      (warehouses as Warehouse[])?.map((warehouse) => (
                        <SelectItem
                          key={warehouse.id}
                          value={warehouse.id as string}
                        >
                          {warehouse.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="load-full">Full Quantity</Label>
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
                  <Label htmlFor="load-empty">Empty Quantity</Label>
                  <Input
                    id="load-empty"
                    type="number"
                    placeholder="Quantity"
                    value={dialogFormData.emptyQuantity} // CHANGED
                    onChange={
                      (e) =>
                        handleDialogFormChange("emptyQuantity", e.target.value) // CHANGED
                    }
                  />
                  {/* Hidden field for return product ID */}
                  <Input
                    type="hidden"
                    disabled
                    value={selectedLineItem?.return_product_id || ""}
                  />
                </div>
              </div>

              {/* Conditional Return Warehouse Selection (Only for Oneway) */}
              {selectedLineItem?.trip === "oneway" && (
                <div className="grid gap-2">
                  <Label htmlFor="return-warehouse">
                    Return Warehouse (If returning empty loads)
                    {Number.parseInt(dialogFormData.emptyQuantity || "0") >
                      0 && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Select
                    value={dialogFormData.return_warehouse_id}
                    onValueChange={(value) =>
                      handleDialogFormChange("return_warehouse_id", value)
                    }
                    disabled={
                      !dialogFormData.emptyQuantity ||
                      Number.parseInt(dialogFormData.emptyQuantity) === 0
                    }
                  >
                    <SelectTrigger id="return-warehouse">
                      <SelectValue placeholder="Select return warehouse..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isWarehouseLoading ? (
                        <Skeleton />
                      ) : (
                        (warehouses as Warehouse[])?.map((warehouse) => (
                          <SelectItem
                            key={warehouse.id}
                            value={warehouse.id as string}
                          >
                            {warehouse.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Display for Two-Way Return Warehouse (For User Info) */}
              {selectedLineItem?.trip === "two_way" &&
                selectedLineItem?.return_qty > 0 && (
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <p className="font-medium">Return Warehouse (Auto-Set)</p>
                    <p className="text-green-500">
                      {getWarehouseName(formData.warehouse_id)} (Origin)
                    </p>
                  </div>
                )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setSelectedLineItem(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTripLoad}>Add Load</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Added Load Records */}
        {formData.tripLoadRecords.length > 0 ? (
          <>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Added Loads</h3>
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
                      {/* <div>
                        <p className="text-xs text-muted-foreground">Product ID</p>
                        <p className="font-medium text-xs truncate">
                          {record.product_id}
                        </p>
                      </div> */}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Destination (to_warehouse_id)
                        </p>
                        <p className="font-medium text-xs">
                          {getWarehouseName(record.to_warehouse_id)}
                        </p>
                      </div>

                      {record.return_warehouse_id && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Return Warehouse
                          </p>
                          <p className="font-medium text-xs text-blue-500">
                            {getWarehouseName(record.return_warehouse_id)}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 text-xs pt-1">
                        {record.fullQuantity > 0 && (
                          <div className="flex-1 bg-green-100 dark:bg-green-900 rounded px-2 py-1">
                            <p className="text-muted-foreground text-xs">
                              Full
                            </p>
                            <p className="font-semibold text-green-700 dark:text-green-100">
                              {record.fullQuantity}
                            </p>
                          </div>
                        )}
                        {record.emptyQuantity > 0 && (
                          <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded px-2 py-1">
                            <p className="text-muted-foreground text-xs">
                              Empty
                            </p>
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
            </div>

            {/* Totals */}
            <div className="flex gap-6 text-sm bg-muted/30 rounded p-3">
              <div>
                <p className="text-muted-foreground">Total Full Loaded:</p>
                <p className="font-semibold text-lg text-green-600">
                  {totalFull}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Empty Returned:</p>
                <p className="font-semibold text-lg text-blue-600">
                  {totalEmpty}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No load details added yet. Click on a product card above to start.
          </p>
        )}
      </div>

      <hr />

      {/* Section 3: Helpers */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">👷 Helpers</h2>

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
