import { Button } from "@/components/button/base/Button";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";

type SessionStatusViewProps = {
  status: "loading" | "unreachable";
  onRetry: () => void;
};

export function SessionStatusView({ status, onRetry }: SessionStatusViewProps) {
  if (status === "loading") {
    return (
      <main className="bg-background flex min-h-dvh items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  return (
    <main className="bg-background flex min-h-dvh flex-col items-center justify-center gap-4">
      <Text as="p" variant="secondary">
        Can&apos;t reach findraco.
      </Text>
      <Button onClick={onRetry}>Retry</Button>
    </main>
  );
}
