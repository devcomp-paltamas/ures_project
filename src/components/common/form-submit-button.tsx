import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FormSubmitButton({
  children,
  className,
  pendingLabel,
  ...props
}: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      className={cn(className)}
      disabled={pending || props.disabled}
      type={props.type ?? "submit"}
    >
      {pending ? pendingLabel ?? children : children}
    </Button>
  );
}
