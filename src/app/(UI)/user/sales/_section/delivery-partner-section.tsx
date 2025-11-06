"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface DeliveryPartnerSectionProps {
  value: string
  onChange: (value: string) => void
  helper: string
  onHelperChange: (value: string) => void
}

const partners = ["Ramesh", "Akhil", "Musthafa", "Faizal"]
const helpers = ["Helper 1", "Helper 2", "Helper 3", "Helper 4", "Helper 5"]

export default function DeliveryPartnerSection({
  value,
  onChange,
  helper,
  onHelperChange,
}: DeliveryPartnerSectionProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Delivery Partner</h2>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a delivery partner" />
          </SelectTrigger>
          <SelectContent>
            {partners.map((partner) => (
              <SelectItem key={partner} value={partner}>
                {partner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="pt-2 border-t">
          <label className="text-sm font-medium text-muted-foreground">Helper (Optional)</label>
          <Select value={helper} onValueChange={onHelperChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a helper (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {helpers.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
