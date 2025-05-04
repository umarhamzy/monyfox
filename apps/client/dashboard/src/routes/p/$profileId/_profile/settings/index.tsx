import { SettingsPage } from "@/components/settings/settings-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$profileId/_profile/settings/")({
  component: SettingsPage,
});
