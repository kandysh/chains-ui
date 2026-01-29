import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 shadow-xs",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm",
        outline:
          "border border-primary/30 text-foreground [a&]:hover:bg-primary/10 [a&]:hover:text-primary",
        ghost: "[a&]:hover:bg-accent/50 [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        success: "bg-color-green/20 text-color-green border-color-green/30 [a&]:hover:bg-color-green/30",
        warning: "bg-orange/20 text-orange border-orange/30 [a&]:hover:bg-orange/30",
        error: "bg-destructive/15 text-destructive border-destructive/30 [a&]:hover:bg-destructive/25",
        info: "bg-blue/20 text-blue border-blue/30 [a&]:hover:bg-blue/30",
        teal: "bg-accent/20 text-accent border-accent/30 [a&]:hover:bg-accent/30",
        purple: "bg-purple/20 text-purple border-purple/30 [a&]:hover:bg-purple/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
