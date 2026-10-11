import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { resolveTheme, useTheme } from "@/app/providers/ThemeProvider";

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
          <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
            <InfoIcon className="size-4" />
          </div>
        ),
        warning: (
          <div className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent">
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
          title: "text-sm font-medium ml-1",
          description: "text-xs text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
