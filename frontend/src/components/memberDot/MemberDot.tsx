import { cn } from "@/lib/mergeClasses";

type MemberDotProps = {
  color: string;
  className?: string;
};

export const MemberDot = ({ color, className }: MemberDotProps) => (
  <span
    aria-hidden
    className={cn("inline-block size-2 shrink-0 rounded-full", className)}
    style={{ backgroundColor: color }}
  />
);
