import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode
}

export function SectionCard({
  title,
  children,
  className,
  ...props
}: SectionCardProps) {
  return (
    <section
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm p-6", className)}
      {...props}
    >
      {title && (
        <div className="mb-4">
          {typeof title === "string" ? (
            <h3 className="font-heading text-xl font-semibold">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div>{children}</div>
    </section>
  )
}
