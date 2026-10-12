import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary/20 selection:text-primary",
        "flex h-10 w-full min-w-0 rounded-lg border border-border/70 bg-background/60 dark:bg-card/40 backdrop-blur-xs px-3.5 py-2 text-sm text-foreground shadow-2xs transition-all duration-200 outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-medium",
        "hover:border-border hover:bg-background/80 dark:hover:bg-card/60",
        "focus-visible:border-primary/60 focus-visible:bg-background/90 focus-visible:ring-2 focus-visible:ring-primary/25 dark:focus-visible:ring-primary/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive/80 aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
