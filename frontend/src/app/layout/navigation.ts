import { PATHS } from "@/app/routing/paths";

export type Destination = "overview" | "transactions" | "categories" | "plans";

export const DESTINATION_PATHS: Record<Destination, string> = {
  overview: PATHS.overview,
  transactions: PATHS.transactions,
  categories: PATHS.categories,
  plans: PATHS.plans,
};

const DESTINATIONS: readonly Destination[] = [
  "overview",
  "transactions",
  "categories",
  "plans",
];

/** The destination a pathname belongs to (nested paths included), or null off the four. */
export function currentDestination(pathname: string): Destination | null {
  return (
    DESTINATIONS.find((destination) => {
      const path = DESTINATION_PATHS[destination];
      return pathname === path || pathname.startsWith(`${path}/`);
    }) ?? null
  );
}
