// The import makes this file a module, so the block below augments TanStack Table's types.
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    /** Right-aligns the column's header and cells; numeric columns use it so digits line up. */
    align?: "right";
  }
}
