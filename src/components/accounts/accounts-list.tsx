// "use client";

// import type React from "react";
// import AlertModal from "@/components/alert-dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Trash2, Building2, User, Zap, Lightbulb, Pencil } from "lucide-react";
// import type { Account } from "@/app/(UI)/user/accounts/page";
// import { formatDate } from "@/lib/utils";

// interface AccountsListProps {
//   accounts: Account[];
//   onDelete: (id: string) => void;
//   onEdit:(account:Account)=>void
// }

// const typeIcons: Record<Account["account_type"], React.ReactNode> = {
//   Business: <Building2 className="w-6 h-6" />,
//   Personal: <User className="w-6 h-6" />,
//   Enterprise: <Zap className="w-6 h-6" />,
//   Startup: <Lightbulb className="w-6 h-6" />,
// };

// export function AccountsList({ accounts, onDelete,onEdit }: AccountsListProps) {
//   if (accounts.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground text-lg">
//           No accounts yet. Create one to get started!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {accounts?.map((account) => (
//         <Card
//           key={account.id}
//           className="flex flex-col hover:shadow-lg transition-shadow"
//         >
//           <CardHeader className="pb-3">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-center gap-3 flex-1">
//                 <div className="p-2 bg-primary/10 rounded-lg text-primary">
//                   {typeIcons[account?.account_type]}
//                 </div>
//                 <div className="flex-1">
//                   <CardTitle className="text-lg">
//                     {account?.account_name}
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {account?.account_type}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="flex-1 flex flex-col justify-between">
//             <p className="text-xs text-muted-foreground">
//               Created {formatDate(new Date(account?.created_at as Date))}
//             </p>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onEdit(account)}
//               className="mt-4 hover:text-blue-300 gap-2 w-full"
//             >
//               <Pencil className="w-4 h-4" />
//               Edit
//             </Button>
//             <AlertModal
//               data={account}
//               contents={[
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="mt-1 text-destructive hover:text-destructive gap-2 w-full"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete
//                 </Button>,
//                 <>
//                   This action cannot be undone. This will permanently delete{" "}
//                   <span className="font-semibold text-orange-400">
//                     {account.account_name || "This Account"}
//                   </span>
//                   's account and remove their data from our servers.
//                 </>,
//               ]}
//               action={() => onDelete(account.id as string)}
//             />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

"use client";

import * as React from "react";
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
import AlertModal from "@/components/alert-dialog";
import { 
  Building2, 
  User, 
  Zap, 
  Lightbulb, 
  MoreHorizontal, 
  ArrowUpDown, 
  Pencil, 
  Trash2,
  Filter
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Account } from "@/app/(UI)/user/accounts/page";

// --- Props Interface ---
interface AccountsListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
  onEdit: (account: Account) => void;
}

// --- Icons & Types Mapping ---
const typeIcons: Record<Account["account_type"], React.ReactNode> = {
  Business: <Building2 className="w-4 h-4 text-blue-500" />,
  Personal: <User className="w-4 h-4 text-green-500" />,
  Enterprise: <Zap className="w-4 h-4 text-purple-500" />,
  Startup: <Lightbulb className="w-4 h-4 text-yellow-500" />,
};

// Define available types for the filter dropdown
const ACCOUNT_TYPES: Account["account_type"][] = ["Business", "Personal", "Enterprise", "Startup"];

export function AccountsList({ accounts, onDelete, onEdit }: AccountsListProps) {
  // --- Table State ---
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  // --- Columns Definition ---
  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: "account_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium ml-4">{row.getValue("account_name")}</div>,
    },
    {
      accessorKey: "account_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("account_type") as Account["account_type"];
        return (
          <div className="flex items-center gap-2">
            {typeIcons[type]}
            <span>{type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue("created_at");
        return <div>{formatDate(new Date(date as Date))}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const account = row.original;

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
                onClick={() => onEdit(account)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="w-full px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                 <AlertModal
                  data={account}
                  contents={[
                    <div className="flex items-center text-destructive cursor-pointer w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </div>,
                    <>
                      This action cannot be undone. This will permanently delete{" "}
                      <span className="font-semibold text-orange-400">
                        {account.account_name || "This Account"}
                      </span>
                      's account and remove their data from our servers.
                    </>,
                  ]}
                  action={() => onDelete(account.id as string)}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // --- Table Hook ---
  const table = useReactTable({
    data: accounts || [],
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

  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-slate-50">
        <p className="text-muted-foreground text-lg">
          No accounts yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* --- Toolbar: Filters --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          {/* Name Filter */}
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("account_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("account_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          
          {/* Type Filter */}
          <Select
            value={(table.getColumn("account_type")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => {
              // If 'all' is selected, we pass undefined to clear the filter
              table.getColumn("account_type")?.setFilterValue(value === "all" ? undefined : value)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {ACCOUNT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <>
        {(table.getColumn("account_name")?.getFilterValue() || table.getColumn("account_type")?.getFilterValue()) && (
          <Button 
            variant="ghost" 
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Trash2 className="ml-2 h-4 w-4" />
          </Button>
        )}
        </>
      </div>

      {/* --- Table --- */}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total.
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
  );
}