import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[1.6rem] border px-4 py-4 text-sm grid gap-2 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "border-border bg-background/80 text-foreground",
        destructive:
          "border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive/60"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Alert({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      role="alert"
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}
