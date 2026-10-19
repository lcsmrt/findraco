import { cn } from "@/lib/mergeClasses";

type MemberDotProps = {
  color: string;
  className?: string;
};

export function MemberDot({ color, className }: MemberDotProps) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
}
