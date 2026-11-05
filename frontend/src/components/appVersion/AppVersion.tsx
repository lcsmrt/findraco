import { useTranslation } from "react-i18next";
import { Text } from "@/components/typography/base/Text";

type AppVersionProps = {
  className?: string;
};

export function AppVersion({ className }: AppVersionProps) {
  const { t } = useTranslation();

  return (
    <Text variant="caption" className={className}>
      {t("components.appVersion.version", { version: __APP_VERSION__, date: __APP_BUILD_DATE__ })}
    </Text>
  );
}
