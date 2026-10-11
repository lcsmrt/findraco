import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/Button";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-background relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>

      <div className="relative flex items-center justify-center">
        <span className="text-primary/15 text-[10rem] leading-none font-bold tracking-tighter select-none sm:text-[14rem]">
          404
        </span>
        <img
          src="/findraco-logo-128.png"
          alt=""
          className="absolute size-28 sm:size-32"
        />
      </div>

      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <h1 className="text-foreground text-3xl font-bold">
          Not in the hoard
        </h1>
        <p className="text-muted-foreground">
          The dragon searched every pile of gold and couldn't find this page.
        </p>
      </div>

      <Button size="lg" className="px-6" onClick={() => navigate(PATHS.home)}>
        Back to the hoard
      </Button>
    </main>
  );
};
