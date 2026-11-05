import { Button } from "@/components/button/base/Button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/sheet/base/Drawer";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet/base/Sheet";
import { useIsNarrowScreen } from "@/hooks/useIsNarrowScreen";
import { SaveIcon, XIcon } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const formId = useId();

  const isNarrow = useIsNarrowScreen();
  const Root = isNarrow ? Drawer : Sheet;
  const Content = isNarrow ? DrawerContent : SheetContent;
  const Header = isNarrow ? DrawerHeader : SheetHeader;
  const Title = isNarrow ? DrawerTitle : SheetTitle;
  const Footer = isNarrow ? DrawerFooter : SheetFooter;

  // The forms take the open flag only, not Base UI's event details.
  function handleOpenChange(next: boolean) {
    onOpenChange(next);
  }

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Content {...(isNarrow ? {} : { side: "right" as const })}>
        <Header>
          <Title>{title}</Title>
        </Header>

        <form
          id={formId}
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-2"
        >
          {children}
        </form>

        <Footer>
          {mobileActions && <div className="flex gap-2 sm:hidden">{mobileActions}</div>}
          {/* Side by side on the phone to save height; stacked in the side sheet. */}
          <div className="flex gap-2 sm:flex-col">
            <Button
              variant="outline"
              type="button"
              className="flex-1 sm:flex-none"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              <XIcon className="h-4 w-4" />
              {t("common.cancel")}
            </Button>
            {/* The footer sits outside the scrolling form, so the button reaches it through `form`. */}
            <Button
              type="submit"
              form={formId}
              className="flex-1 sm:flex-none"
              isLoading={isSubmitting}
              disabled={submitDisabled}
            >
              <SaveIcon className="h-4 w-4" />
              {submitLabel}
            </Button>
          </div>
        </Footer>
      </Content>
    </Root>
  );
}
