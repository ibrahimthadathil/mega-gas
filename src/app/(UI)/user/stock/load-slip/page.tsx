"use client";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRQ } from "@/hooks/useReactQuery";
import {
  deleteUnloadSlip,
  getAllUnloadDetails,
} from "@/services/client_api-Service/user/unload/unload_api";
import { PlantLoadUnloadView } from "@/types/unloadSlip";
import { Ban, Eye, Pencil, Trash } from "lucide-react";
import AlertModal from "@/components/alert-dialog";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const page = () => {
  const { data: unloadedRecord, isLoading } = UseRQ<PlantLoadUnloadView[]>(
    "unloadRecord",
    getAllUnloadDetails
  );
  const queryClient = useQueryClient();
  const { role } = useSelector((user: Rootstate) => user.user);
  const router = useRouter()
  const handleDelete = async (id: string,unloaded:boolean) => {
    try {
      if(!unloaded)return toast.warning('Not possible until unload')
      const data = await deleteUnloadSlip(id);
      if (data.success)
        queryClient.invalidateQueries({ queryKey: ["unloadRecord"] });
      toast.success(data.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEdit = async(id:string)=>{
    router.push(`/user/stock/load-slip/${id}`)
  }
  const columns = useMemo(() => {
    return [
      {
        header: "No",
        render: (_e: PlantLoadUnloadView, i: number) => `TR${i + 1}`,
      },
      {
        header: "Bill Date",
        render: (row: PlantLoadUnloadView) => <span>{row?.bill_date}</span>,
      },
      {
        header: "Sap Number",
        render: (row: PlantLoadUnloadView) => <span>{row?.sap_number}</span>,
      },
      {
        header: "Warehouse",
        render: (row: PlantLoadUnloadView) => (
          <span>{row?.warehouse.name}</span>
        ),
      },
      {
        header: "Total QTY",
        render: (row: PlantLoadUnloadView) => <span>{row?.total_qty}</span>,
      },
      {
        header: "Total Return QTY",
        render: (row: PlantLoadUnloadView) => (
          <span>{row?.total_return_qty}</span>
        ),
      },
      {
        header: "Unload Date",
        render: (row: PlantLoadUnloadView) => (
          <span className="text-green-800">
            {row?.unload_date || "Not unloaded Yet"}
          </span>
        ),
      },
      {
        header: "Unload Status",
        render: (row: PlantLoadUnloadView) => (
          <Badge
            variant="outline"
            className={cn(
              "text-white bg-red-400",
              row?.unload_details?.length > 0 && "bg-green-800"
            )}
          >
            {row?.unload_details?.length > 0 ? "Unloaded" : "Not Unloaded"}
          </Badge>
        ),
      },
      {
        header: "Unload Details",
        render: (row: PlantLoadUnloadView) =>
          row?.unload_details?.length > 0 ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-scroll [&>button]:hidden">
                <DialogHeader>
                  <DialogTitle>Unload Details</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NO</TableHead>
                        <TableHead>vehicle</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>QTY</TableHead>
                        <TableHead>Return Product</TableHead>
                        <TableHead>Return QTY</TableHead>
                        <TableHead>Return Warehouse To</TableHead>
                        <TableHead>Trip Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {row?.unload_details?.map((detail, index) => (
                        <TableRow key={detail.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{detail.to_warehouse.name}</TableCell>
                          <TableCell>{detail.product.name}</TableCell>
                          <TableCell>{detail.qty}</TableCell>
                          <TableCell>
                            {detail.return_product?.name || "No return"}
                          </TableCell>
                          <TableCell>{detail.return_qty || 0}</TableCell>
                          <TableCell>
                            {detail.to_return_warehouse?.name || "-"}
                          </TableCell>
                          <TableCell>{detail.trip_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            " - "
          ),
      },
      {
        header: "Edit",
        render: (row: PlantLoadUnloadView) => (
          <Button
            variant="ghost"
            onClick={() => handleEdit(row?.plant_load_register_id)}
          >
            <Pencil color="skyblue" />
          </Button>
        ),
      },
      {
        header: "Delete",
        render: (row: PlantLoadUnloadView) =>
          role == "admin" ? (
            <AlertModal
              data={row}
              contents={[
                <Trash className="h-5 w-5" />,
                <>
                  This action cannot be undone. This will permanently delete
                  this transfer record.
                </>,
              ]}
              style=" p-2"
              varient="ghost"
              action={() => handleDelete(row?.plant_load_register_id,row?.unload_details?.length>=1)}
            />
          ) : (
            <>
              <Ban className="h-5 w-5 text-red-500 " />
            </>
          ),
      },
    ];
  }, [unloadedRecord]);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
      {isLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        <DataTable
          columns={columns}
          itemsPerPage={10}
          data={unloadedRecord ?? []}
        />
      )}
    </main>
  );
};

export default page;
