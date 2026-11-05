import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cn } from "@/lib/mergeClasses";

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" swipeDirection="down" {...props} />;
}

function DrawerContent({ className, children, ...props }: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPrimitive.Portal data-slot="drawer-portal">
      <DrawerPrimitive.Backdrop
        data-slot="drawer-overlay"
        className="bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
        <DrawerPrimitive.VirtualKeyboardProvider>
          <DrawerPrimitive.Popup
            data-slot="drawer-content"
            data-side="bottom"
            className={cn(
              "bg-background border-border relative flex max-h-[95dvh] w-full translate-y-(--drawer-swipe-movement-y) flex-col rounded-t-xl border-t pb-[var(--drawer-keyboard-inset,0px)] text-sm shadow-lg transition-transform duration-200 ease-in-out data-ending-style:translate-y-full data-starting-style:translate-y-full data-swiping:transition-none",
              className,
            )}
            {...props}
          >
            <div
              data-slot="drawer-handle"
              className="bg-muted-foreground/30 mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full"
            />
            <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col gap-4">
              {children}
            </DrawerPrimitive.Content>
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.VirtualKeyboardProvider>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="drawer-header" className={cn("gap-0.5 p-4 flex flex-col", className)} {...props} />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="drawer-footer" className={cn("gap-2 p-4 mt-auto flex flex-col", className)} {...props} />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground text-base font-medium", className)}
      {...props}
    />
  );
}

export { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle };
