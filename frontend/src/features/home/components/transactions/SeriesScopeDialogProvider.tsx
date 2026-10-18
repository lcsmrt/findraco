import { useState, type ReactNode } from "react";
import { SeriesEditScope } from "@/api/dtos/financialTransaction";
import { SeriesScopeDialog } from "./SeriesScopeDialog";
import {
  SeriesScopeDialogContext,
  type ScopeDialogOptions,
} from "./useSeriesScope";

export const SeriesScopeDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState<SeriesEditScope>("THIS_ONE");
  const [options, setOptions] = useState<ScopeDialogOptions>({});
  const [resolver, setResolver] = useState<
    ((value: SeriesEditScope | null) => void) | null
  >(null);

  const chooseScope = (
    opts: ScopeDialogOptions = {},
  ): Promise<SeriesEditScope | null> => {
    setScope("THIS_ONE");
    setOptions(opts);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleContinue = () => {
    resolver?.(scope);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.(null);
    setIsOpen(false);
  };

  return (
    <SeriesScopeDialogContext.Provider value={{ chooseScope }}>
      {children}
      <SeriesScopeDialog
        open={isOpen}
        scope={scope}
        options={options}
        onScopeChange={setScope}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </SeriesScopeDialogContext.Provider>
  );
};
