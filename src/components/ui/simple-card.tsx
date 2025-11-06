import type React from "react"
import type { LucideIcon } from "lucide-react"

interface SimpleCardProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  amount?: string | number
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export default function SimpleCard({ icon: Icon, title, subtitle, amount, children, size = "md" }: SimpleCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex-1">
        <Icon className={size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
        <p className="text-sm font-medium text-foreground mt-2">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {amount && (
        <div className="bg-primary/10 rounded p-2">
          <p className="text-xs text-muted-foreground">Amount</p>
          <p className="text-lg font-bold text-primary mt-1">{amount}</p>
        </div>
      )}
      {children}
    </div>
  )
}
