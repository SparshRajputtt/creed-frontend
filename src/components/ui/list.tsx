//@ts-nocheck
// src/components/ui/list.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function List(props: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-3", props.className)} {...props}>
      {props.children}
    </ul>
  )
}

export function ListItem({
  className,
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn("flex items-start space-x-2", className)}
      {...props}
    >
      <span className="mt-[3px] w-2 h-2 shrink-0 rounded-full bg-muted" />
      <span>{children}</span>
    </li>
  )
}
