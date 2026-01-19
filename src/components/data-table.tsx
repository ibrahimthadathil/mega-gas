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
interface IColumns<T> {
  key?: string;
  header: string;
  render?: (item: T, i: number) => React.ReactNode;
}
interface TableProps<T> {
  data: T[];
  columns: IColumns<T>[];
  itemsPerPage?: number;
  onChange?: (page: number) => void;
  rowClassName?: (item: T, index: number) => string;
}
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 5,
  onChange,
  rowClassName
}: TableProps<T>) {
  const [currentPage, setCurrentpage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = useMemo(() => {
    const firstPage = (currentPage - 1) * itemsPerPage;
    const lastPage = firstPage + itemsPerPage;
    return data?.slice(firstPage, lastPage);
  }, [currentPage, data, itemsPerPage]);

  const pageChange = (page: number) => {
    setCurrentpage(page);
    if (onChange) {
      onChange(page);
    }
  };
  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader className="bg-muted/50 ">
            <TableRow className="hover:bg-transparent ">
              {columns.map((e, i) => (
                <TableHead key={i} className=" text-center">
                  {e.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
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
              <TableRow >
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
