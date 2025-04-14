import { createFileRoute } from "@tanstack/react-router";
import { SettingsSymbolsPage } from "@/components/settings/symbols";

export const Route = createFileRoute("/p/$profileId/_profile/settings/symbols")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <SettingsSymbolsPage />;
}
