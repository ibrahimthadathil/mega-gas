// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Edit, Trash } from "lucide-react";
// import { IProduct } from "@/types/types";
// import { UseRQ } from "@/hooks/useReactQuery";
// import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useMemo } from "react";
// import AlertModal from "@/components/alert-dialog"
// export default function ProductListPage() {
//   const { data, isLoading } = UseRQ("products", getAllProducts);
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   const compositeProduct = useMemo(() => {
//     if (!data) return [];
//     return (data as IProduct[])
//       .filter((product) => !product.is_composite)
//       .map((product) => ({ id: product.id, name: product.product_name }));
//   }, [data]);
//   const handleEdit = (product: IProduct) => {
//     queryClient.setQueryData(["product", product.id], product.id);
//     queryClient.setQueryData(["composite", "composite"], compositeProduct);
//     router.push(`/admin/product/edit/${product.id}`);
//   };
//   return (
//     <main className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Products</h1>
//             <p className="text-muted-foreground mt-1">
//               Manage your product inventory
//             </p>
//           </div>
//           {(data as IProduct[])?.length > 0 && (
//             <Link href="/admin/product/add">
//               <Button className="gap-2">
//                 <Plus className="w-4 h-4" />
//                 Add Product
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* Products Grid */}
//         {isLoading ? (
//           <div className="flex flex-col space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
//             <Skeleton className="h-[125px] w-full rounded-xl" />
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-2/3 sm:w-1/2 md:w-3/4" />
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {(data as IProduct[])?.map((product) => (
//               <Card key={product.id} className="flex flex-col">
//                 <CardHeader>
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg">
//                         {product.product_name}
//                       </CardTitle>
//                       <CardDescription className="text-sm">
//                         {product.product_code}
//                       </CardDescription>
//                     </div>
//                     {product.is_composite && (
//                       <Badge variant="outline" className="whitespace-nowrap">
//                         Composite
//                       </Badge>
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent className="flex-1 flex flex-col">
//                   <div className="space-y-3 flex-1">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Type:</span>
//                       <span className="font-medium">
//                         {product.product_type}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Sale Price:</span>
//                       <span className="font-medium">₹{product.sale_price}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Cost Price:</span>
//                       <span className="font-medium">₹{product.cost_price}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Available:</span>
//                       <span className="font-medium">
//                         {product.available_qty} units
//                       </span>
//                     </div>
//                     <div className="pt-2 border-t">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">
//                           Visibility:
//                         </span>
//                         <Badge
//                           variant={product.visibility ? "default" : "secondary"}
//                         >
//                           {product.visibility ? "Visible" : "Hidden"}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <Button
//                     variant="outline"
//                     className="w-full gap-2 mt-2"
//                     onClick={() => handleEdit(product)}
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit
//                   </Button>
//                   {/* <Button variant="destructive" className="w-full gap-2 mt-2"> */}
//                     <AlertModal
//                       data={product}
//                       contents={[
//                         <>
//                         <Trash className="h-5 w-5" color="red" />
//                         </>,
//                         <>
//                           This action cannot be undone. This will permanently
//                           delete{" "}
//                           <span className="font-semibold text-orange-400">
//                             {product.product_name || "This Product"}
//                           </span>
//                           's account and remove their data from our servers.
//                         </>,
//                       ]}
//                       // style="hover:bg-destructive hover:text-destructive-foreground p-2"
                      
//                       action={() => alert(product.id)}
//                     />
//                     {/* <Trash className="w-4 h-4" />
//                     Delete */}
//                   {/* </Button> */}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {(data as IProduct[])?.length === 0 && (
//           <Card className="text-center py-12">
//             <CardContent>
//               <p className="text-muted-foreground mb-4">No products found</p>
//               <Link href="/admin/product/add">
//                 <Button>Create First Product</Button>
//               </Link>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </main>
//   );
// }




"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  MoreHorizontal, 
  ArrowUpDown, 
  Pencil, 
  Trash, 
  Search,
  Filter,
  Eye,
  EyeOff,
  Box
} from "lucide-react";

import { IProduct } from "@/types/types";
import { UseRQ } from "@/hooks/useReactQuery";
import { getAllProducts } from "@/services/client_api-Service/admin/product/product_api";
import AlertModal from "@/components/alert-dialog";

export default function ProductListPage() {
  const { data, isLoading } = UseRQ("products", getAllProducts);
  const queryClient = useQueryClient();
  const router = useRouter();

  // --- Table State ---
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  // --- Derived Data for Edit Logic ---
  const compositeProduct = React.useMemo(() => {
    if (!data) return [];
    return (data as IProduct[])
      .filter((product) => !product.is_composite)
      .map((product) => ({ id: product.id, name: product.product_name }));
  }, [data]);

  const handleEdit = (product: IProduct) => {
    queryClient.setQueryData(["product", product.id], product.id);
    queryClient.setQueryData(["composite", "composite"], compositeProduct);
    router.push(`/admin/product/edit/${product.id}`);
  };

  // --- Extract Unique Product Types for Filter Dropdown ---
  const uniqueTypes = React.useMemo(() => {
    if (!data) return [];
    const types = new Set((data as IProduct[]).map((p) => p.product_type));
    return Array.from(types);
  }, [data]);

  // --- Columns Definition ---
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "product_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-4">
          <div className="font-medium">{row.getValue("product_name")}</div>
          <div className="text-xs text-muted-foreground">{row.original.product_code}</div>
        </div>
      ),
    },
    {
      accessorKey: "product_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.getValue("product_type")}
        </Badge>
      ),
    },
    {
      accessorKey: "is_composite",
      header: "Composition",
      cell: ({ row }) => {
        const isComposite = row.getValue("is_composite");
        return isComposite ? (
          <Badge variant="outline" className="border-blue-200 text-blue-600">
            <Box className="w-3 h-3 mr-1" /> Composite
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground pl-2">Standard</span>
        );
      },
    },
    {
      accessorKey: "sale_price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("sale_price"));
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "available_qty",
      header: "Stock",
      cell: ({ row }) => {
        const qty = row.getValue("available_qty") as number;
        return (
          <div className={`font-medium ${qty === 0 ? "text-destructive" : ""}`}>
            {qty} units
          </div>
        );
      },
    },
    {
      accessorKey: "visibility",
      header: "Status",
      cell: ({ row }) => {
        const isVisible = row.getValue("visibility");
        return (
          <div className="flex items-center gap-2">
            {isVisible ? (
              <Eye className="w-4 h-4 text-green-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm">{isVisible ? "Visible" : "Hidden"}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleEdit(product)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Alert Modal Container */}
              <div className="w-full px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <AlertModal
                  data={product}
                  contents={[
                    <div className="flex items-center text-destructive cursor-pointer w-full">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </div>,
                    <>
                      This action cannot be undone. This will permanently delete{" "}
                      <span className="font-semibold text-orange-400">
                        {product.product_name || "This Product"}
                      </span>
                      's data from our servers.
                    </>,
                  ]}
                  action={() => alert(`Deleted Product ID: ${product.id}`)}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // --- Table Setup ---
  const table = useReactTable({
    data: (data as IProduct[]) || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // --- Loading Skeleton ---
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory
            </p>
          </div>
          <Link href="/admin/product/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col xl:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search products..."
                value={(table.getColumn("product_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("product_name")?.setFilterValue(event.target.value)
                }
                className="pl-8"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Type Filter */}
                <Select
                    value={(table.getColumn("product_type")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                    table.getColumn("product_type")?.setFilterValue(value === "all" ? undefined : value)
                    }
                >
                    <SelectTrigger className="w-[160px]">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Product Type" />
                    </div>
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                        {type}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                {/* Composite Filter */}
                <Select
                    value={
                        table.getColumn("is_composite")?.getFilterValue() === true 
                        ? "true" 
                        : table.getColumn("is_composite")?.getFilterValue() === false 
                        ? "false" 
                        : "all"
                    }
                    onValueChange={(value) => {
                        const filterVal = value === "true" ? true : value === "false" ? false : undefined;
                        table.getColumn("is_composite")?.setFilterValue(filterVal);
                    }}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Composition" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="true">Composite Only</SelectItem>
                    <SelectItem value="false">Standard Only</SelectItem>
                    </SelectContent>
                </Select>

                {/* Visibility Filter */}
                <Select
                    value={
                        table.getColumn("visibility")?.getFilterValue() === true 
                        ? "visible" 
                        : table.getColumn("visibility")?.getFilterValue() === false 
                        ? "hidden" 
                        : "all"
                    }
                    onValueChange={(value) => {
                        const filterVal = value === "visible" ? true : value === "hidden" ? false : undefined;
                        table.getColumn("visibility")?.setFilterValue(filterVal);
                    }}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">Any Status</SelectItem>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset Filters */}
                {(table.getState().columnFilters.length > 0) && (
                    <Button 
                        variant="ghost" 
                        onClick={() => table.resetColumnFilters()}
                        className="px-2 lg:px-3"
                    >
                        Reset
                        <Trash className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>

        {/* Table Area */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} product(s) found.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}