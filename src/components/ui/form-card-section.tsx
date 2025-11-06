"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type React from "react"

interface FormCardSectionProps<T extends { id: string }> {
  title: string
  items: T[]
  onDelete: (id: string) => void
  renderCard: (item: T) => React.ReactNode
  isDummy?: (item: T) => boolean
  children?: React.ReactNode
  emptyMessage?: string
  showTotal?: boolean
  totalLabel?: string
  totalValue?: string | number
}

export default function FormCardSection<T extends { id: string }>({
  title,
  items,
  onDelete,
  renderCard,
  isDummy,
  children,
  emptyMessage = "No items added yet",
  showTotal = false,
  totalLabel = "Total",
  totalValue = "0",
}: FormCardSectionProps<T>) {
  const displayItems = items.length === 0 ? [] : items

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {children}
      </div>

      {displayItems.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3">
              {displayItems.map((item) => (
                <Card key={item.id} className="p-4 min-w-max flex-shrink-0">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      {renderCard(item)}
                      {!isDummy?.(item) && (
                        <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {showTotal && (
            <Card className="p-4 bg-muted">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">{totalLabel}</p>
                <p className="text-xl font-bold text-primary">{totalValue}</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
