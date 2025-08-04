import { StoreProvider } from "@/app/store";

import { KeypressStatsWidget } from "@/features/keypress/widget/keypress-stats-widget/KeypressStatsWidget";

export default function KeypressPage() {
  return (
    <StoreProvider>
      <KeypressStatsWidget />
    </StoreProvider>
  );
}
