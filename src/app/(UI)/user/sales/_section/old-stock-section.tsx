import { Card } from "@/components/ui/card"
import { Cylinder } from "lucide-react"

interface OldStockItem {
  id: number
  name: string
  quantity: number
}

interface OldStockSectionProps {
  items: OldStockItem[]
}

export default function OldStockSection({ items }: OldStockSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Old Stock</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2">
          {items.map((item) => (
            <Card key={item.id} className="p-3 min-w-max">
              <div className="flex flex-col items-center gap-2 w-24">
                <Cylinder className="h-6 w-6 text-primary" />
                <p className="text-xs font-medium text-center text-foreground line-clamp-2">{item.name}</p>
                <p className="text-xl font-bold text-primary">{item.quantity}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
