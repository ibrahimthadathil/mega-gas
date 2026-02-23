"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AddWarehouseDialog from "@/app/(UI)/user/warehouses/_UI/warehouse-dialog";
import { Trash2, Edit2, Search, X } from "lucide-react";
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

export default function WarehousePageTable() {
  const { data, isLoading } = UseRQ("warehouse", getWarehouse);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<
    ("Vehicle" | "Purchase" | "Location" | "Sale")[]
  >([]);

  const warehouseTypes: ("Vehicle" | "Purchase" | "Location" | "Sale")[] = [
    "Vehicle",
    "Purchase",
    "Location",
    "Sale",
  ];

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
        ((error as AxiosError).response?.data as Record<string, string>)
          .message,
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
          ?.message || "Failed to update warehouse",
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

  const toggleTypeFilter = (
    type: "Vehicle" | "Purchase" | "Location" | "Sale",
  ) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
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

  // Filter and search logic
  const filteredWarehouses = useMemo(() => {
    let results = (data as Warehouse[]) || [];

    // Filter by search term
    if (searchTerm) {
      results = results.filter((warehouse) =>
        warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by type
    if (selectedTypes.length > 0) {
      results = results.filter((warehouse) =>
        selectedTypes.includes(warehouse.type),
      );
    }

    return results;
  }, [data, searchTerm, selectedTypes]);

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

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouses by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground self-center">
              Filter by type:
            </span>
            {warehouseTypes.map((type) => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTypeFilter(type)}
                className="gap-2"
              >
                {type}
                {selectedTypes.includes(type) && <X className="w-3 h-3" />}
              </Button>
            ))}
            {selectedTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTypes([])}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="flex items-center justify-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-lg">
              {searchTerm || selectedTypes.length > 0
                ? "No warehouses match your search or filters."
                : `No warehouses yet. Click "Add Warehouse" to create one.`}
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse) => (
                  <TableRow
                    key={warehouse.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {warehouse.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={typeColors[warehouse.type]}>
                        {warehouse.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                            <Trash2 className="w-4 h-4" />,
                            <span key="delete-text">
                              This action cannot be undone. This will
                              permanently delete{" "}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && filteredWarehouses.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredWarehouses.length} of{" "}
            {(data as Warehouse[])?.length || 0} warehouses
          </div>
        )}
      </div>
    </div>
  );
}
