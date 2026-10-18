import { Card, CardContent, CardDescription, CardHeader } from "@/components/card/base/Card";
import { Heading } from "@/components/typography/base/Heading";
import { cn } from "@/lib/mergeClasses";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** The centred card every auth page renders its form in, under the page's single heading. */
export function AuthCard({ title, description, children, className }: AuthCardProps) {
  return (
    <Card className={cn("w-full max-w-xl gap-5 p-5 shadow-md", className)}>
      <CardHeader className="justify-items-center px-0 text-center">
        <Heading level={1} variant="headline" className="text-foreground">
          {title}
        </Heading>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="px-0">{children}</CardContent>
    </Card>
  );
}
