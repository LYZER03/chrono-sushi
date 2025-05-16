import { forwardRef } from "react"
import type { HTMLAttributes } from "react"
import { cn } from "../../lib/utils"

/**
 * Button group component for grouping related buttons
 */
const ButtonGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-md",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

/**
 * Button group item for use within ButtonGroup
 * Buttons placed inside this will have connected styling
 */
const ButtonGroupItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "[&>button]:rounded-none [&>button]:border-r-0 [&:first-child>button]:rounded-l-md [&:last-child>button]:rounded-r-md [&:last-child>button]:border-r",
          className
        )}
        {...props}
      />
    )
  }
)
ButtonGroupItem.displayName = "ButtonGroupItem"

export { ButtonGroup, ButtonGroupItem }
