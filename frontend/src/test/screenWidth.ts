import { vi } from "vitest";

type Listener = () => void;

/**
 * Replaces `window.matchMedia` with one that answers `(max-width: Npx)` queries from a width the
 * test controls. `setWidth` re-evaluates every query and notifies the ones whose answer changed.
 */
export function stubScreenWidth(initialWidth: number) {
  let width = initialWidth;
  const queries = new Set<{ matches: boolean; evaluate: () => boolean; listeners: Set<Listener> }>();

  function create(media: string) {
    const max = Number(/max-width:\s*(\d+)px/.exec(media)?.[1] ?? Infinity);
    const listeners = new Set<Listener>();
    const query = {
      media,
      matches: width <= max,
      evaluate: () => width <= max,
      listeners,
      addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
      removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
    };
    queries.add(query);
    return query;
  }

  vi.stubGlobal("matchMedia", create);

  return {
    setWidth(next: number) {
      width = next;
      queries.forEach((query) => {
        const matches = query.evaluate();
        if (matches === query.matches) return;
        query.matches = matches;
        query.listeners.forEach((listener) => listener());
      });
    },
  };
}
