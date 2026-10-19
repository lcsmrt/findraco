import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="bg-background relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>

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

      <Button size="lg" className="px-6" onClick={() => navigate(PATHS.home)}>
        Back to the hoard
      </Button>
    </main>
  );
}
