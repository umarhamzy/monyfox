import { AccountsList } from "@/components/accounts/accounts-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$profileId/_profile/accounts/")({
  component: AccountsList,
});
