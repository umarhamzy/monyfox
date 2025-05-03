import { TransactionCategoriesList } from "@/components/settings/transaction-categories/categories-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/p/$profileId/_profile/settings/transaction-categories",
)({
  component: TransactionCategoriesList,
});
