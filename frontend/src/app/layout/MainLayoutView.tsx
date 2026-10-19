import type { ReactNode } from "react";

type MainLayoutViewProps = {
  // A slot, so the navbar (which reads auth and plan context) stays in the container.
  navbar: ReactNode;
  children: ReactNode;
};

export function MainLayoutView({ navbar, children }: MainLayoutViewProps) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <header>{navbar}</header>
      <main className="flex flex-1 flex-col pt-16">{children}</main>
    </div>
  );
}
