import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/Button";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center gap-6 px-4">
      <img
        src="/findraco-logo-128.png"
        alt="findraco logo"
        className="h-24"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-foreground text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground text-center">
          The page you tried to access does not exist.
        </p>
      </div>
      <Button onClick={() => navigate(PATHS.home)}>Go back home</Button>
    </div>
  );
};
