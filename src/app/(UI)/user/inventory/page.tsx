"use client";
import DataTable from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { UseRQ } from '@/hooks/useReactQuery';
import { getDashboardData } from '@/services/client_api-Service/user/dashboard/dashboar-api';
import React from 'react'
import { Warehouse } from '../warehouses/page';
import { getWarehouse } from '@/services/client_api-Service/user/warehouse/wareHouse_api';

const page = () => {
   const {data:inventoryLevel,isLoading } = UseRQ('inventoryLevel',getDashboardData)
    const { data: warehouses, isLoading: isWarehouseLoading } = UseRQ<
       Warehouse[]
     >("warehouse", getWarehouse);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-2">Transfered Stock</h1>
      {isLoading ? (
        <Skeleton className="w-full h-24 bg-zinc-50" />
      ) : (
        // <DataTable columns={columns} itemsPerPage={10} data={inventoryLevel ?? []} />
        <></>
      )}
    </main>
  )
}

export default page
