import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { resolveTheme } from "@/app/providers/resolveTheme";
import { useTheme } from "@/app/providers/useTheme";
import { typographyVariants } from "@/components/typography/base/typographyVariants";
import { cn } from "@/lib/mergeClasses";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={resolveTheme(theme)}
      className="toaster group"
      position="bottom-left"
      closeButton
      icons={{
        success: (
          <div className="flex size-6 items-center justify-center rounded-full bg-success/15 text-success">
            <CircleCheckIcon className="size-4" />
          </div>
        ),
        info: (
          <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary-ink">
            <InfoIcon className="size-4" />
          </div>
        ),
        warning: (
          <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary-ink">
            <TriangleAlertIcon className="size-4" />
          </div>
        ),
        error: (
          <div className="flex size-6 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <OctagonXIcon className="size-4" />
          </div>
        ),
        loading: (
          <div className="bg-muted flex size-6 items-center justify-center rounded-full">
            <Loader2Icon className="size-4 animate-spin" />
          </div>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group flex items-start gap-3 rounded-md border bg-popover px-4 py-3 shadow-md",
          icon: "mt-0.5 flex shrink-0 items-center justify-center rounded-full",
          title: cn(typographyVariants({ variant: "label" }), "ml-1"),
          description: typographyVariants({ variant: "caption" }),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
