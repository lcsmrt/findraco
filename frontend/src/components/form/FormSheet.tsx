import { Button } from "@/components/button/base/Button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet/base/Sheet";
import { SaveIcon, XIcon } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";

type FormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Receives the form's submit event; pass react-hook-form's `handleSubmit(submit)`. */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitLabel: string;
  /** Submit is unavailable while the form waits for data it needs (a series definition loading). */
  submitDisabled?: boolean;
  /** Footer actions shown only on narrow screens, where the list's row actions are hidden. */
  mobileActions?: ReactNode;
  children: ReactNode;
};

/**
 * The skeleton every sheet form shares: title, scrolling form, and a footer with Cancel and Submit.
 * Everything specific to one form stays in that form, so a change of container (a bottom drawer on
 * mobile) happens here once.
 */
export function FormSheet({
  open,
  onOpenChange,
  title,
  onSubmit,
  isSubmitting,
  submitLabel,
  submitDisabled = false,
  mobileActions,
  children,
}: FormSheetProps) {
  const formId = useId();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <form
          id={formId}
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-2"
        >
          {children}
        </form>

        <SheetFooter>
          {mobileActions && <div className="flex gap-2 sm:hidden">{mobileActions}</div>}
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          {/* The footer sits outside the scrolling form, so the button reaches it through `form`. */}
          <Button type="submit" form={formId} isLoading={isSubmitting} disabled={submitDisabled}>
            <SaveIcon className="h-4 w-4" />
            {submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
