"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useMemo, useState } from "react";
import Pagination from "@/components/ui/pagination";
type PaginationMode = "client" | "server";

interface IColumns<T> {
  key?: string;
  header: string;
  render?: (item: T, i: number) => React.ReactNode;
}
interface TableProps<T> {
  data: T[];
  columns: IColumns<T>[];
  itemsPerPage?: number;
  paginationMode?: PaginationMode;
  onChange?: (page: number) => void;
  rowClassName?: (item: T, index: number) => string;

  currentPage?: number;
  totalPages?: number;
}
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 5,
  onChange,
  rowClassName,
  paginationMode="client",
  currentPage: serverPage,
  totalPages: serverTotalPages,

}: TableProps<T>) {
  // const [currentPage, setCurrentpage] = useState(1);
  // const totalPages = Math.ceil(data.length / itemsPerPage);
  // const currentData = useMemo(() => {
  //   const firstPage = (currentPage - 1) * itemsPerPage;
  //   const lastPage = firstPage + itemsPerPage;
  //   return data?.slice(firstPage, lastPage);
  // }, [currentPage, data, itemsPerPage]);

  // const pageChange = (page: number) => {
  //   setCurrentpage(page);
  //   if (onChange) {
  //     onChange(page);
  //   }
  // };
  const [clientPage, setClientPage] = useState(1);

  const isServer = paginationMode === "server";

  const currentPage = isServer ? serverPage ?? 1 : clientPage;

  const totalPages = isServer
    ? serverTotalPages ?? 1
    : Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    if (isServer) {
      // API already paginated
      return data;
    }

    // client-side slicing
    const start = (clientPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [isServer, data, clientPage, itemsPerPage]);
   const pageChange = (page: number) => {
    if (isServer) {
      onChange?.(page);   // parent controls
    } else {
      setClientPage(page);
      onChange?.(page);  // optional callback
    }
  };
  return (
    <>
      <div>
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow className="hover:bg-transparent">
              {columns.map((e, i) => (
                <TableHead key={i} className="text-center">
                  {e.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center bg-cyan-100">
            {currentData.length ? (
              currentData.map((item, ind) => (
                <TableRow
                  key={(item as T)._id || ind}
                  className={`bg-card hover:bg-muted/50 dark:hover:bg-muted/50 ${rowClassName ? rowClassName(item, ind) : ""}`}
                >
                  {columns.map((e, i) => (
                    <TableCell key={i} className={`font-medium text-black'}`}>
                      {e.render
                        ? e.render(item, ind)
                        : e.key
                          ? item[e.key]
                          : "Not found"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-14 text-center text-yellow-800 "
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChange}
      />
    </>
  );
}
