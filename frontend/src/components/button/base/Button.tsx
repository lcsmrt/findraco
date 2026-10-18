import { Spinner } from "@/components/spinner/base/Spinner";
import { cn } from "@/lib/mergeClasses";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./buttonVariants";

function Button({
  className,
  variant = "default",
  size = "default",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { isLoading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </ButtonPrimitive>
  );
}

export { Button };
