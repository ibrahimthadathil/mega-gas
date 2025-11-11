"use client"

import { Card } from "@/components/ui/card"
import { Truck } from "lucide-react"
import SimpleCard from "@/components/ui/simple-card"

interface Load {
  id: string
  date: string
  vehicleNo: string
  product: string
  quantity: number
}

interface LoadSectionProps {
  loads: Load[]
  onChange: (loads: Load[]) => void
}

const dummyLoad: Load = {
  id: "dummy-1",
  date: "2025-01-15",
  vehicleNo: "MH-12-AB-1234",
  product: "LPG 14.2kg",
  quantity: 50,
}

export default function LoadSection({ loads, }: LoadSectionProps) {
  const displayLoads = loads.length === 0 ? [dummyLoad] : loads

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Load (Auto Fetched)</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {displayLoads.map((load) => (
            <Card key={load.id} className="p-4 min-w-max w-64">
              <SimpleCard icon={Truck} title={load.product} subtitle={load.vehicleNo} amount={`${load.quantity} units`}>
                <div className="border-t pt-2">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">{load.date}</p>
                </div>
              </SimpleCard>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
