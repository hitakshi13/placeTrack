import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Input ─────────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional error message — adds red border and aria-invalid */
  error?: string;
  /** Slot for a leading icon */
  startIcon?: React.ReactNode;
  /** Slot for a trailing icon or element */
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {startIcon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            {startIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive/50",
            startIcon && "pl-9",
            endIcon && "pr-9",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            {endIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Label ─────────────────────────────────────────────────────────────────

const labelVariants = cva(
  "text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-0.5 text-destructive" aria-label="required">
        *
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

// ─── Skeleton ──────────────────────────────────────────────────────────────

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Input, Label, Skeleton };
