import { Text } from "@/components/typography/base/Text";

type AppVersionProps = {
  className?: string;
};

export const AppVersion = ({ className }: AppVersionProps) => (
  <Text variant="caption" className={className}>
    v{__APP_VERSION__} - {__APP_BUILD_DATE__}
  </Text>
);
