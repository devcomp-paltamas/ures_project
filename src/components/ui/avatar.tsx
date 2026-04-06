import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef } from "react";
import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

export function AvatarImage(
  props: ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
) {
  return (
    <AvatarPrimitive.Image
      className="aspect-square h-full w-full object-cover"
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(16,24,40,1),rgba(43,182,115,0.88))] text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}

export function UserAvatar({
  name,
  avatarUrl,
  className
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {avatarUrl ? <AvatarImage alt={name} src={avatarUrl} /> : null}
      <AvatarFallback>{getInitials(name) || "UA"}</AvatarFallback>
    </Avatar>
  );
}
