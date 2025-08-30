import { SettingsBackupPage } from "@/components/settings/backup/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$profileId/_profile/settings/backup")({
  component: SettingsBackupPage,
});
