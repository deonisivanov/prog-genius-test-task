import { StoreProvider } from "@/app/store";

import { KeypressStatsWidget } from "@/features/keypress/widget/keypress-stats-widget/KeypressStatsWidget";

export default function Page() {
  return (
    <StoreProvider>
      <KeypressStatsWidget />
    </StoreProvider>
  );
}
