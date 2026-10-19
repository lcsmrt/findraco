import type { ReactNode } from "react";
import { Button } from "@/components/button/base/Button";
import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";

type NotFoundViewProps = {
  // A slot, so the theme toggle (which reads the theme context) stays in the container.
  themeToggle: ReactNode;
  onGoHome: () => void;
};

export function NotFoundView({ themeToggle, onGoHome }: NotFoundViewProps) {
  return (
    <main className="bg-background relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <div className="absolute top-3 right-3">{themeToggle}</div>

      <div className="relative flex items-center justify-center">
        <Text variant="display" className="text-primary/15 select-none">
          404
        </Text>
        <img
          src="/findraco-logo-128.png"
          alt=""
          className="absolute size-28 sm:size-32"
        />
      </div>

      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <Heading level={1} variant="headline" className="text-foreground">
          Not in the hoard
        </Heading>
        <Text as="p" variant="secondary">
          The dragon searched every pile of gold and couldn't find this page.
        </Text>
      </div>

      <Button size="lg" className="px-6" onClick={onGoHome}>
        Back to the hoard
      </Button>
    </main>
  );
}
