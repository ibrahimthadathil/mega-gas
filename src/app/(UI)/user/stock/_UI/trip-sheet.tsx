
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Trash2, X, AlertCircle, Eye } from "lucide-react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IProduct, IUser, PlantLoadRecord } from "@/types/types";
import { UseRQ } from "@/hooks/useReactQuery";
import { getWarehouse } from "@/services/client_api-Service/user/warehouse/wareHouse_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Warehouse } from "../../warehouses/page";
import { toast } from "sonner";

import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
import { get_userByRole } from "@/services/client_api-Service/user/user_api";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getLoadslipByLoad,
  unloadSlip,
  updateUnloadSlip,
} from "@/services/client_api-Service/user/stock/unload_slip_transfer_api";
import { getQTYBywarehouseId } from "@/services/client_api-Service/user/current-stock/current-stock-api";

// --- INTERFACES ---
interface TripLoadRecord {
  id: string;
  to_warehouse_id: string;
  fullQuantity: number;
  emptyQuantity: number;
  trip_type: "oneway" | "two_way";
  product_id: string;
  plant_load_line_item_id: string;
  return_product_id: string | null;
  return_warehouse_id: string | null;
}

export interface TripFormData {
  date: Date | undefined;
  sapNumber: string;
  qty: string;
  warehouse_id: string;
  plant_load_register_id?: string;
  plant_load_line_item_id?: string;
  tripLoadRecords: TripLoadRecord[];
  helpers: string[];
  created_by?: string;
}

interface DialogFormData {
  to_warehouse_id: string;
  fullQuantity: string;
  emptyQuantity: string;
  return_warehouse_id: string;
}

interface UnloadLineItem {
  plant_load_line_item_id: string;
  product_name: string;
  product_id: string;
  trip_type: "oneway" | "two_way";
  return_qty: number;
  qty: number;
  return_product_id: string | null;
}

interface UnloadDetail {
  id: string;
  qty: number;
  product: {
    id: string;
    name: string;
  };
  trip_type: "oneway" | "two_way";
  return_qty: number;
  to_warehouse: {
    id: string;
    name: string;
  };
  return_product: {
    id: string;
    name: string;
  } | null;
  to_return_warehouse: {
    id: string;
    name: string;
  } | null;
}

// Helper function to generate unique IDs
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function TripSheet({
  loadSlipId,
  mode = "add", // "add" or "edit"
}: {
  loadSlipId: string;
  mode?: "add" | "edit";
}) {
  const router = useRouter();
  const { delivery_boys } = useSelector((state: Rootstate) => state.user);
  const [showStock, setShowStock] = useState(false);
  const [selectedStockWarehouse, setSelectedStockWarehouse] =
    useState<string>("");
  const { data: unloadRecord, isLoading: isUnloadData } = UseRQ<
    PlantLoadRecord[]
  >("plant_load", () => getLoadslipByLoad(loadSlipId));

  const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<
    Warehouse[]
  >("warehouse", getWarehouse);
  const { data: products, isLoading: isProductLoading } = UseRQ(
    "products",
    getAllProducts,
  );
  const { data: users, isLoading: isUserLoading } = UseRQ<IUser[]>("user", () =>
    get_userByRole("driver"),
  );

  const [selectedLineItem, setSelectedLineItem] =
    useState<UnloadLineItem | null>(null);
  const { data: currentStock, isLoading: stockLoad } = UseRQ<
    { product_name: string; qty: number }[]
  >(
    ["stock", selectedStockWarehouse],
    () =>
      getQTYBywarehouseId({
        warehouseId: selectedStockWarehouse,
        products: [
          selectedLineItem?.product_id ,
          selectedLineItem?.return_product_id ,
        ],
      }),
    {
      enabled: !!selectedStockWarehouse && showStock &&
      !!selectedLineItem?.product_id,
    },
  );
  
  const [isSubmit, setSubmit] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Main form using react-hook-form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    defaultValues: {
      date: new Date(),
      plant_load_register_id: "",
      sapNumber: "",
      qty: "",
      warehouse_id: "",
      tripLoadRecords: [],
      helpers: delivery_boys ?? [],
    },
  });

  // Dialog form using react-hook-form
  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    watch: dialogWatch,
    setValue: setDialogValue,
    reset: resetDialog,
    formState: { errors: dialogErrors },
  } = useForm<DialogFormData>({
    defaultValues: {
      to_warehouse_id: "",
      fullQuantity: "0",
      emptyQuantity: "0",
      return_warehouse_id: "",
    },
  });

  // Watch form values
  const tripLoadRecords = watch("tripLoadRecords");
  const helpers = watch("helpers");
  const warehouseId = watch("warehouse_id");
  const dialogEmptyQuantity = dialogWatch("emptyQuantity");

  // Convert unload_details to tripLoadRecords format for edit mode
  const convertUnloadDetailsToTripRecords = (
    unloadDetails: UnloadDetail[],
    lineItems: any[],
  ): TripLoadRecord[] => {
    return unloadDetails.map((detail) => {
      // Find the corresponding line item to get plant_load_line_item_id
      const lineItem = lineItems.find(
        (item) => item.product_id === detail.product.id,
      );

      return {
        id: detail.id, // Use existing ID for edit mode
        to_warehouse_id: detail.to_warehouse.id,
        fullQuantity: detail.qty,
        emptyQuantity: detail.return_qty,
        trip_type: detail.trip_type,
        product_id: detail.product.id,
        plant_load_line_item_id: lineItem?.plant_load_line_item_id || "",
        return_product_id: detail.return_product?.id || null,
        return_warehouse_id: detail.to_return_warehouse?.id || null,
      };
    });
  };

  // Update form when unloadRecord loads
  useEffect(() => {
    if (unloadRecord?.[0]) {
      const record = unloadRecord[0];

      setValue("plant_load_register_id", record.id);
      setValue("sapNumber", record.sap_number || "");
      setValue("qty", record.total_full_qty?.toString() || "");
      setValue("warehouse_id", record.warehouse_id || "");

      // Set date based on mode
      if (mode === "edit" && record.unloading_date) {
        setValue("date", new Date(record.unloading_date));
      }

      // Populate tripLoadRecords and helpers in edit mode
      if (mode === "edit") {
        if (record.unload_details && record.unload_details.length > 0) {
          const tripRecords = convertUnloadDetailsToTripRecords(
            record.unload_details,
            record.line_items || [],
          );
          setValue("tripLoadRecords", tripRecords);
        }

        if (record.unloading_staff && record.unloading_staff.length > 0) {
          const helperIds = record.unloading_staff.map(
            (staff: any) => staff.id,
          );
          setValue("helpers", helperIds);
        }
      }
    }
  }, [unloadRecord, setValue, mode]);

  // Memoized warehouse lookup
  const warehouseMap = useMemo(() => {
    if (!warehouses) return new Map();
    return new Map(warehouses.map((w) => [w.id, w.name]));
  }, [warehouses]);

  // Memoized user lookup
  const userMap = useMemo(() => {
    if (!users) return new Map();
    return new Map((users as IUser[]).map((u) => [u.id, u.user_name]));
  }, [users]);

  // Calculate remaining quantities per line item
  const lineItemBalances = useMemo(() => {
    if (!unloadRecord?.[0]?.line_items) return new Map();

    const balances = new Map<string, { remaining: number; total: number }>();

    unloadRecord[0].line_items.forEach((lineItem: any) => {
      const totalQty = lineItem.qty || 0;
      const allocated = tripLoadRecords
        .filter(
          (record) =>
            record.plant_load_line_item_id === lineItem.plant_load_line_item_id,
        )
        .reduce((sum, record) => sum + record.fullQuantity, 0);

      balances.set(lineItem.plant_load_line_item_id, {
        remaining: totalQty - allocated,
        total: totalQty,
      });
    });

    return balances;
  }, [unloadRecord, tripLoadRecords]);

  // Check if all quantities are fully allocated
  const isFullyAllocated = useMemo(() => {
    if (!unloadRecord?.[0]?.line_items) return false;

    return unloadRecord[0].line_items.every((lineItem: any) => {
      const balance = lineItemBalances.get(lineItem.plant_load_line_item_id);
      return balance && balance.remaining === 0;
    });
  }, [lineItemBalances, unloadRecord]);

  // Check if empty quantities match total quantities
  const isEmptyQuantityValid = useMemo(() => {
    if (!unloadRecord?.[0]?.line_items) return false;

    // Calculate total quantity from all line items
    const totalQuantity = unloadRecord[0].line_items.reduce(
      (sum: number, lineItem: any) => {
        return sum + (lineItem.qty || 0);
      },
      0,
    );

    // Total empty quantity from trip load records
    const totalEmptyQty = tripLoadRecords.reduce(
      (sum, record) => sum + record.emptyQuantity,
      0,
    );

    return totalEmptyQty === totalQuantity;
  }, [unloadRecord, tripLoadRecords]);

  // Form is valid only when both full and empty allocations are complete
  const isFormValid = useMemo(() => {
    return isFullyAllocated && isEmptyQuantityValid;
  }, [isFullyAllocated, isEmptyQuantityValid]);

  // Get remaining balance for selected line item
  const getRemainingBalance = (lineItemId: string): number => {
    const balance = lineItemBalances.get(lineItemId);
    return balance?.remaining ?? 0;
  };

  const getWarehouseName = (id: string | undefined): string => {
    if (!id) return "N/A";
    return warehouseMap.get(id) || id;
  };

  const getHelperName = (id: string): string => {
    if (!id) return "N/A";
    return userMap.get(id) || id;
  };

  const handleLineItemClick = (lineItem: UnloadLineItem) => {
    const remaining = getRemainingBalance(lineItem.plant_load_line_item_id);

    if (remaining === 0) {
      toast.info("This product is fully allocated");
      return;
    }

    let returnProductId = lineItem?.return_product_id;

    if (lineItem.trip_type === "oneway" && !returnProductId && products) {
      const matchedProduct = (products as IProduct[]).find(
        (p: any) => p.id === lineItem.product_id,
      );
      returnProductId = matchedProduct?.return_product_id || null;
    }

    setSelectedLineItem({
      ...lineItem,
      return_product_id: returnProductId,
    });

    setEditingRecordId(null); // Clear editing mode
    resetDialog();
    setDialogOpen(true);
  };

  const handleEditTripLoad = (record: TripLoadRecord) => {
    // Find the line item for this record
    const lineItem = unloadRecord?.[0]?.line_items?.find(
      (item: any) =>
        item.plant_load_line_item_id === record.plant_load_line_item_id,
    );

    if (!lineItem) return;

    setSelectedLineItem({
      plant_load_line_item_id: record.plant_load_line_item_id,
      product_name: lineItem.product_name,
      product_id: record.product_id,
      trip_type: record.trip_type,
      return_qty: lineItem.return_qty,
      qty: lineItem.qty,
      return_product_id: record.return_product_id,
    });

    setEditingRecordId(record.id);

    // Pre-fill dialog with existing values
    setDialogValue("to_warehouse_id", record.to_warehouse_id);
    setDialogValue("fullQuantity", record.fullQuantity.toString());
    setDialogValue("emptyQuantity", record.emptyQuantity.toString());
    setDialogValue("return_warehouse_id", record.return_warehouse_id || "");

    setDialogOpen(true);
  };

  const onDialogSubmit = (data: DialogFormData) => {
    if (!data.to_warehouse_id || !selectedLineItem) {
      toast.error("Please select a vehicle/destination warehouse.");
      return;
    }

    const fullQty = Number.parseInt(data.fullQuantity) || 0;
    const emptyQty = Number.parseInt(data.emptyQuantity) || 0;

    // Validation: Check for negative or zero values
    if (fullQty < 0 || emptyQty < 0) {
      toast.error("Quantities cannot be negative.");
      return;
    }

    if (fullQty === 0 && emptyQty === 0) {
      toast.error("Full quantity or Empty quantity must be greater than zero.");
      return;
    }

    // Validation: Check if full quantity exceeds remaining balance
    const remaining = getRemainingBalance(
      selectedLineItem.plant_load_line_item_id,
    );

    // When editing, add back the current record's quantity to the remaining balance
    const adjustedRemaining = editingRecordId
      ? remaining +
        (tripLoadRecords.find((r) => r.id === editingRecordId)?.fullQuantity ||
          0)
      : remaining;

    if (fullQty > adjustedRemaining) {
      toast.error(
        `Cannot allocate ${fullQty}. Only ${adjustedRemaining} items remaining.`,
      );
      return;
    }

    let finalReturnWarehouseId: string | null = null;

    if (selectedLineItem.trip_type === "two_way") {
      finalReturnWarehouseId = warehouseId || null;
    } else if (selectedLineItem.trip_type === "oneway" && emptyQty > 0) {
      finalReturnWarehouseId = data.return_warehouse_id || null;
      if (!finalReturnWarehouseId) {
        toast.error("Please select a Return Warehouse for the empty loads.");
        return;
      }
    }

    if (editingRecordId) {
      // Update existing record
      const updatedRecords = tripLoadRecords.map((record) => {
        if (record.id === editingRecordId) {
          return {
            ...record,
            to_warehouse_id: data.to_warehouse_id,
            fullQuantity: fullQty,
            emptyQuantity: emptyQty,
            return_warehouse_id: finalReturnWarehouseId,
          };
        }
        return record;
      });
      setValue("tripLoadRecords", updatedRecords);
      toast.success("Load updated successfully");
    } else {
      // Add new record
      const newRecord: TripLoadRecord = {
        id: generateId(),
        plant_load_line_item_id: selectedLineItem.plant_load_line_item_id,
        trip_type: selectedLineItem.trip_type,
        product_id: selectedLineItem.product_id,
        return_product_id: selectedLineItem.return_product_id || null,
        to_warehouse_id: data.to_warehouse_id,
        fullQuantity: fullQty,
        emptyQuantity: emptyQty,
        return_warehouse_id: finalReturnWarehouseId,
      };

      setValue("tripLoadRecords", [...tripLoadRecords, newRecord]);
      toast.success("Load added successfully");
    }

    resetDialog();
    setSelectedLineItem(null);
    setEditingRecordId(null);
    setDialogOpen(false);
  };

  const handleDeleteTripLoad = (id: string) => {
    setValue(
      "tripLoadRecords",
      tripLoadRecords.filter((record) => record.id !== id),
    );
    toast.success("Load removed");
  };

  const handleAddHelper = (helperId: string) => {
    if (!helpers.includes(helperId)) {
      setValue("helpers", [...helpers, helperId]);
    }
  };

  const handleRemoveHelper = (helperId: string) => {
    setValue(
      "helpers",
      helpers.filter((h) => h !== helperId),
    );
  };

  // Memoized totals
  const { totalEmpty, totalFull } = useMemo(() => {
    const totalEmpty = tripLoadRecords.reduce(
      (sum, r) => sum + r.emptyQuantity,
      0,
    );
    const totalFull = tripLoadRecords.reduce(
      (sum, r) => sum + r.fullQuantity,
      0,
    );
    return { totalEmpty, totalFull };
  }, [tripLoadRecords]);

  const onSubmit = async (data: TripFormData) => {
    // Final validation before submit
    if (!isFormValid) {
      if (!isFullyAllocated) {
        toast.error("Please allocate all full quantities before submitting.");
      } else if (!isEmptyQuantityValid) {
        const requiredEmpty =
          unloadRecord?.[0]?.line_items?.reduce(
            (sum: number, item: any) => sum + (item.qty || 0),
            0,
          ) || 0;
        toast.error(
          `Total empty quantity must equal ${requiredEmpty}. Current: ${totalEmpty}`,
        );
      }
      return;
    }

    try {
      setSubmit(true);

      if (mode === "edit") {
        // Call update API for edit mode
        data.created_by = unloadRecord?.[0]?.created_by;
        const result = await updateUnloadSlip(loadSlipId, data);
        if (result.success) {
          toast.success("Slip updated successfully");
          router.push("/user/stock/load-slip");
        }
      } else {
        // Call create API for add mode
        const result = await unloadSlip(data);
        if (result.success) {
          toast.success("Slip created");
          router.push("/user/stock/load-slip");
        }
      }
    } catch (error) {
      toast.error(
        mode === "edit" ? "Error updating slip" : "Error creating slip",
      );
    } finally {
      setSubmit(false);
    }
  };

  const isLoading =
    isUnloadData || isWarehouseLoading || isProductLoading || isUserLoading;

  if (isLoading) {
    return <Skeleton className="h-screen w-full" />;
  }

  if (!unloadRecord || unloadRecord.length === 0) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Unload items not found
              </p>
              <Link href="/user/purchase">
                <Button>Go Back</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const currentRecord = unloadRecord[0];
  const currentRemainingBalance = selectedLineItem
    ? getRemainingBalance(selectedLineItem.plant_load_line_item_id)
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mode Indicator */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {mode === "edit" ? "Edit Trip Sheet" : "Create Trip Sheet"}
          </h1>
          {mode === "edit" && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 text-sm font-medium rounded-full">
              Edit Mode
            </span>
          )}
        </div>

        {/* Section 1: Trip Details Header */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">🚚 Trip Details</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="date" className="text-sm font-medium mb-1 block">
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex-1">
              <Label className="text-sm font-medium mb-1 block">
                Origin Warehouse
              </Label>
              <Input
                value={currentRecord.warehouse_name || ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="sap" className="text-sm font-medium mb-1 block">
                SAP Number
              </Label>
              <Controller
                name="sapNumber"
                control={control}
                render={({ field }) => (
                  <Input id="sap" {...field} disabled className="bg-muted" />
                )}
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="cylinders"
                className="text-sm font-medium mb-1 block"
              >
                Total Full Quantity (From SAP)
              </Label>
              <Controller
                name="qty"
                control={control}
                render={({ field }) => (
                  <Input
                    id="cylinders"
                    {...field}
                    disabled
                    className="bg-muted"
                  />
                )}
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Trip Load Details */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📦 Trip Load Details</h2>
            <p className="text-sm text-muted-foreground">
              Click on a product card to add load details
            </p>
          </div>

          {/* Allocation Status Alert */}
          {(!isFullyAllocated || !isEmptyQuantityValid) &&
            tripLoadRecords.length > 0 && (
              <Alert className="mb-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <div className="space-y-1">
                    {!isFullyAllocated && (
                      <p>• All full quantities must be completely allocated</p>
                    )}
                    {!isEmptyQuantityValid && (
                      <p>
                        • Total empty quantity must equal total full quantity (
                        {unloadRecord?.[0]?.line_items?.reduce(
                          (sum: number, item: any) => sum + (item.qty || 0),
                          0,
                        ) || 0}
                        )
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {currentRecord.line_items?.map((lineItem: any, ind) => {
              const balance = lineItemBalances.get(
                lineItem.plant_load_line_item_id,
              );
              const remaining = balance?.remaining ?? 0;
              const total = balance?.total ?? 0;
              const isFullyAllocatedItem = remaining === 0;

              return (
                <Card
                  key={ind}
                  className={`p-4 cursor-pointer transition-all ${
                    isFullyAllocatedItem
                      ? "bg-green-50 dark:bg-green-950 border-green-500 opacity-75"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleLineItemClick(lineItem)}
                >
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Product</p>
                      <p className="font-medium text-sm truncate">
                        {lineItem.product_name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm">Total: {total}</p>
                        <p
                          className={`text-sm font-semibold ${
                            remaining === 0
                              ? "text-green-600"
                              : remaining < total
                                ? "text-orange-600"
                                : "text-blue-600"
                          }`}
                        >
                          Remaining: {remaining}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          lineItem.trip_type === "two_way"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                            : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100"
                        }`}
                      >
                        {lineItem.trip_type === "two_way"
                          ? "Two Way"
                          : "One Way"}
                      </div>
                      {lineItem.return_qty > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Max Return: {lineItem.return_qty}
                        </p>
                      )}
                      {isFullyAllocatedItem && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Dialog for Adding/Editing Load Details */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRecordId ? "Edit" : "Add"} Load Details for{" "}
                  {selectedLineItem?.product_name}
                </DialogTitle>
                <DialogDescription>
                  Enter the destination and quantity for this product.
                  <span className="block mt-2 text-sm font-medium text-orange-600">
                    Remaining to allocate:{" "}
                    {editingRecordId
                      ? currentRemainingBalance +
                        (tripLoadRecords.find((r) => r.id === editingRecordId)
                          ?.fullQuantity || 0)
                      : currentRemainingBalance}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="load-vehicle">
                      Destination Vehicle/Warehouse
                    </Label>
                    {dialogWatch("to_warehouse_id") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2"
                        onClick={() => {
                          setSelectedStockWarehouse(
                            dialogWatch("to_warehouse_id"),
                          );
                          setShowStock(!showStock);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        {showStock ? "Hide Stock" : "Show Stock"}
                      </Button>
                    )}
                  </div>
                  <Controller
                    name="to_warehouse_id"
                    control={dialogControl}
                    rules={{ required: "Please select a destination" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="load-vehicle">
                          <SelectValue placeholder="Select vehicle/warehouse..." />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses?.map((warehouse) => (
                            <SelectItem
                              key={warehouse.id}
                              value={warehouse.id as string}
                            >
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {dialogErrors.to_warehouse_id && (
                    <span className="text-xs text-red-500">
                      {dialogErrors.to_warehouse_id.message}
                    </span>
                  )}

                  {showStock && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Current Stock
                      </p>
                      {stockLoad ? (
                        <p className="text-sm">Loading...</p>
                      ) : currentStock && currentStock.length > 0 ? (
                        <div className="space-y-1">
                          {currentStock.map((stock: any, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>{stock.product_name}</span>
                              <span className="font-semibold">{stock.qty}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No stock found
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="load-full">
                      Full Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="fullQuantity"
                      control={dialogControl}
                      rules={{
                        validate: {
                          positive: (value) => {
                            const num = Number.parseInt(value);
                            return (
                              num >= 0 || "Must be greater than or equal to 0"
                            );
                          },
                          notExceed: (value) => {
                            const num = Number.parseInt(value) || 0;
                            const adjustedRemaining = editingRecordId
                              ? currentRemainingBalance +
                                (tripLoadRecords.find(
                                  (r) => r.id === editingRecordId,
                                )?.fullQuantity || 0)
                              : currentRemainingBalance;
                            return (
                              num <= adjustedRemaining ||
                              `Cannot exceed ${adjustedRemaining}`
                            );
                          },
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id="load-full"
                          type="number"
                          placeholder="0"
                          min="1"
                          max={
                            editingRecordId
                              ? currentRemainingBalance +
                                (tripLoadRecords.find(
                                  (r) => r.id === editingRecordId,
                                )?.fullQuantity || 0)
                              : currentRemainingBalance
                          }
                          {...field}
                        />
                      )}
                    />
                    {dialogErrors.fullQuantity && (
                      <span className="text-xs text-red-500">
                        {dialogErrors.fullQuantity.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="load-empty">Empty Quantity</Label>
                    <Controller
                      name="emptyQuantity"
                      control={dialogControl}
                      rules={{
                        validate: {
                          nonNegative: (value) => {
                            const num = Number.parseInt(value) || 0;
                            return num >= 0 || "Cannot be negative";
                          },
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id="load-empty"
                          type="number"
                          placeholder="0"
                          min="0"
                          {...field}
                        />
                      )}
                    />
                    {dialogErrors.emptyQuantity && (
                      <span className="text-xs text-red-500">
                        {dialogErrors.emptyQuantity.message}
                      </span>
                    )}
                  </div>
                </div>

                {selectedLineItem?.trip_type === "oneway" && (
                  <div className="grid gap-2">
                    <Label htmlFor="return-warehouse">
                      Return Warehouse (If returning empty loads)
                      {Number.parseInt(dialogEmptyQuantity || "0") > 0 && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Controller
                      name="return_warehouse_id"
                      control={dialogControl}
                      rules={{
                        validate: (value) => {
                          const emptyQty = Number.parseInt(
                            dialogEmptyQuantity || "0",
                          );
                          if (emptyQty > 0 && !value) {
                            return "Return warehouse required for empty loads";
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            !dialogEmptyQuantity ||
                            Number.parseInt(dialogEmptyQuantity) === 0
                          }
                        >
                          <SelectTrigger id="return-warehouse">
                            <SelectValue placeholder="Select return warehouse..." />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses?.map((warehouse) => (
                              <SelectItem
                                key={warehouse.id}
                                value={warehouse.id as string}
                              >
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {dialogErrors.return_warehouse_id && (
                      <span className="text-xs text-red-500">
                        {dialogErrors.return_warehouse_id.message}
                      </span>
                    )}
                  </div>
                )}

                {selectedLineItem?.trip_type === "two_way" &&
                  selectedLineItem?.return_qty > 0 && (
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <p className="font-medium">Return Warehouse (Auto-Set)</p>
                      <p className="text-green-500">
                        {getWarehouseName(warehouseId)} (Origin)
                      </p>
                    </div>
                  )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setSelectedLineItem(null);
                    setEditingRecordId(null);
                    resetDialog();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDialogSubmit(onDialogSubmit)}
                >
                  {editingRecordId ? "Update Load" : "Add Load"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {tripLoadRecords.length > 0 ? (
            <>
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3">Added Loads</h3>
                <div className="overflow-x-auto flex gap-2 snap-x mb-4 pb-2">
                  {tripLoadRecords.map((record) => (
                    <Card
                      key={record.id}
                      className="flex-shrink-0 min-w-[220px] p-3 relative"
                    >
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditTripLoad(record)}
                          className="text-muted-foreground hover:text-blue-600"
                          aria-label="Edit load"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTripLoad(record.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Delete load"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Destination
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

              <div className="flex gap-6 text-sm bg-muted/30 rounded p-3">
                <div>
                  <p className="text-muted-foreground">Total Full Loaded:</p>
                  <p className="font-semibold text-lg text-green-600">
                    {totalFull}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Empty Returned:</p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-semibold text-lg ${isEmptyQuantityValid ? "text-green-600" : "text-orange-600"}`}
                    >
                      {totalEmpty}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      /{" "}
                      {unloadRecord?.[0]?.line_items?.reduce(
                        (sum: number, item: any) => sum + (item.qty || 0),
                        0,
                      ) || 0}
                    </span>
                    {isEmptyQuantityValid ? (
                      <span className="text-green-600 text-xs">✓</span>
                    ) : (
                      <span className="text-orange-600 text-xs">⚠</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No load details added yet. Click on a product card above to start.
            </p>
          )}
        </Card>

        {/* Section 3: Helpers */}
        <Card className="p-6">
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
                {(users as IUser[])?.map((helper) => (
                  <SelectItem
                    key={helper.id}
                    value={helper.id as string}
                    disabled={helpers.includes(helper.id as string)}
                  >
                    {helper.user_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {helpers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {helpers.map((helperId) => (
                <div
                  key={helperId}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm font-medium"
                >
                  {getHelperName(helperId)}
                  <button
                    type="button"
                    onClick={() => handleRemoveHelper(helperId)}
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
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmit || !isFormValid}
          className="w-full"
          size="lg"
        >
          {isSubmit
            ? "Processing..."
            : !isFormValid
              ? "Complete All Requirements to Proceed"
              : mode === "edit"
                ? "Update Trip Sheet"
                : "Create Trip Sheet"}
        </Button>

        {!isFormValid && tripLoadRecords.length > 0 && (
          <div className="text-center text-sm space-y-1">
            {!isFullyAllocated && (
              <p className="text-orange-600">
                ⚠ All full quantities must be completely allocated
              </p>
            )}
            {!isEmptyQuantityValid && (
              <p className="text-orange-600">
                ⚠ Total empty quantity must equal total full quantity
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
