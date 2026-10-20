import { Link, type LinkProps } from "react-router-dom";

/**
 * A client-side link. The navigation views render it instead of importing the router themselves,
 * so they stay presentational: their stories need only a router around them, not app context.
 */
export function RouterLink(props: LinkProps) {
  return <Link {...props} />;
}
