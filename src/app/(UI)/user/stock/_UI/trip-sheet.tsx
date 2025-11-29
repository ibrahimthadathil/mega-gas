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
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PlantLoadRecord } from "@/types/types";
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Warehouse } from "../../warehouses/page";

interface TripLoadRecord {
  id?: string;
  warehouse_id: string;
  fullQuantity: number;
  emptyQuantity:number;
  return_qty: number;
  product_id?:string;
  retutn_product_id?:string;
  to_warehouse_id?:string;
  return_warehouse_id?:string;
  plant_load_line_item_id?:string;
  trip_type?:"oneway" | "two_way";

}

interface TripFormData {
  date: Date | undefined;
  sapNumber: string;
  qty: string; // full qty of the vallya wandi
  warehouse_id: string;
  plant_load_register_id?:string;
  plant_load_line_item_id?:string;
  tripLoadRecords: TripLoadRecord[];
  helpers: string[];
}

const HELPER_OPTIONS = ["Ramesh", "Akhil", "Musthafa", "Faizal"];

export default function TripSheet() {
  const { data, isLoading } = UseRQ("warehouse", getWarehouse);
  const params = useParams();
  const queryClient = useQueryClient();
  const loadSlip_sap = params.id;
  const unloadRecord = queryClient.getQueryData([
    "plant_load",
    loadSlip_sap,
  ]) as PlantLoadRecord;

  const [formData, setFormData] = useState<TripFormData>({
    date: undefined,
    sapNumber: unloadRecord?.sap_number || "",
    qty: unloadRecord?.total_full_qty?.toString() || "",
    warehouse_id: unloadRecord?.warehouse_id || "",
    tripLoadRecords: [],
    helpers: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<any>(null);
  const [dialogFormData, setDialogFormData] = useState({
    warehouse_id: "",
    fullQuantity: "",
    return_qty: "",
    to_warehouse_return_id: "",
    return_product_id: "",
    trip: "",
  });

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, date });
  };

  // Trip Load Details Dialog Handlers
  const handleDialogFormChange = (field: string, value: string) => {
    setDialogFormData({ ...dialogFormData, [field]: value });
  };

  const handleLineItemClick = (lineItem: any, trip: string) => {
    setSelectedLineItem(lineItem);
    console.log(lineItem,'🤔🤔');
    
    // setDialogFormData({
    //   warehouse_id: "",
    //   fullQuantity: "",
    //   return_qty: "",
    //   to_warehouse_return_id: "",
    //   return_product_id: "",
    //   trip,
    // });
    setDialogOpen(true);
  };

  const handleAddTripLoad = () => {
    if (!dialogFormData.warehouse_id || !selectedLineItem) {
      return;
    }

    const fullQty = Number.parseInt(dialogFormData.fullQuantity) || 0;
    const emptyQty = Number.parseInt(dialogFormData.return_qty) || 0;

    if (fullQty === 0 && emptyQty === 0) {
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      warehouse_id: dialogFormData.warehouse_id,
      fullQuantity: fullQty,
      return_qty: emptyQty,
    };

    setFormData({
      ...formData,
      tripLoadRecords: [...formData.tripLoadRecords, newRecord],
    });

    setDialogFormData({
      warehouse_id: "",
      fullQuantity: "",
      return_qty: "",
      to_warehouse_return_id: "",
      return_product_id: "",
      trip: "",
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
    (sum, r) => sum + r.return_qty,
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

  if (isLoading) return <Skeleton />;

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
        <h2 className="text-lg font-semibold mb-4">Trip Details</h2>

        {/* Date and Warehouse */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Date */}
          <div className="flex-1">
            <Label htmlFor="date" className="text-sm font-medium mb-1 block">
              Date
            </Label>
            <DatePicker date={formData.date} onDateChange={handleDateChange} />
          </div>

          {/* Warehouse (Display Only) */}
          <div className="flex-1">
            <Label className="text-sm font-medium mb-1 block">Warehouse</Label>
            <Input
              value={unloadRecord?.warehouse_name || ""}
              disabled
              className="bg-muted"
            />
            <Input type="hidden" value={unloadRecord?.warehouse_id || ""} />
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
              Total Full Quantity
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

      {/* Section 2: Trip Load Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Trip Load Details</h2>
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
              onClick={() => handleLineItemClick(lineItem, lineItem.trip)}
            >
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Product name</p>
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
                  {lineItem.trip === "two_way" && lineItem.return_qty > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Return: {lineItem.return_qty}
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
              <DialogTitle>Add Load Details</DialogTitle>
              <DialogDescription>
                Enter the vehicle and quantity details for this product.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Product ID (Display Only) */}
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  disabled
                  value={selectedLineItem?.product_name}
                  className="bg-muted"
                />
                <Input
                  value={selectedLineItem?.product_id || ""}
                  disabled
                  className="bg-muted"
                  type="hidden"
                />
              </div>
              {/* Trip Type (Display Only) */}
              <div className="grid gap-2">
                <Label>Trip Type</Label>
                <Input
                  value={
                    selectedLineItem?.trip === "two_way" ? "Two Way" : "One Way"
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
              {/* Return Product ID (if two-way) */}
              {selectedLineItem?.trip === "two_way" && (
                <div className="grid gap-2">
                  <Label>Return Quantity</Label>
                  <Input
                    value={selectedLineItem?.return_qty || 0}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
              {/* Vehicle Selection */}
              <div className="grid gap-2">
                <Label htmlFor="load-vehicle">Vehicle Number</Label>
                <Select
                  value={dialogFormData.warehouse_id}
                  onValueChange={(value) =>
                    handleDialogFormChange("warehouse_id", value)
                  }
                >
                  <SelectTrigger id="load-vehicle">
                    <SelectValue placeholder="Select vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <Skeleton />
                    ) : (
                      (data as Warehouse[]).map((warehouse) => {
                        return (
                          <SelectItem value={warehouse.id as string}>
                            {warehouse.name}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* Quantity Inputs */}
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
                    value={dialogFormData.return_qty}
                    onChange={(e) =>
                      handleDialogFormChange("return_qty", e.target.value)
                    }
                  />
                  <Input
                    type="hidden"
                    disabled
                    value={dialogFormData?.return_product_id}
                  />
                </div>
                {selectedLineItem?.trip === "oneway" && (
                  <div className="grid gap-2">
                    <Label htmlFor="return-warehouse">Return Warehouse</Label>
                    <Select
                      value={dialogFormData.to_warehouse_return_id}
                      onValueChange={(value) =>
                        handleDialogFormChange("to_warehouse_return_id", value)
                      }
                    >
                      <SelectTrigger id="return-warehouse">
                        <SelectValue placeholder="Select return warehouse..." />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <Skeleton />
                        ) : (
                          (data as Warehouse[]).map((warehouse) => {
                            return (
                              <SelectItem
                                key={warehouse.id}
                                value={warehouse.id as string}
                              >
                                {warehouse.name}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
               {/* <Input value={dialogFormData.to_warehouse_return_id} /> */}
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
              <Button onClick={handleAddTripLoad}>Add</Button>
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
                      onClick={() => handleDeleteTripLoad(record?.id as string)}
                      className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="space-y-1.5">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Product ID
                        </p>
                        <p className="font-medium text-xs truncate">
                          {/* {record.driverName} */}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vehicle</p>
                        <p className="font-medium text-xs">
                          {record.warehouse_id}
                        </p>
                      </div>
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
                        {record.return_qty > 0 && (
                          <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded px-2 py-1">
                            <p className="text-muted-foreground text-xs">
                              Empty
                            </p>
                            <p className="font-semibold text-blue-700 dark:text-blue-100">
                              {record.return_qty}
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
            No load details added yet. Click on a product card above to start.
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
