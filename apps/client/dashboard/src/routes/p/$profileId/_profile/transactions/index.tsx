import { TransactionsTable } from "@/components/transaction/transactions-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$profileId/_profile/transactions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TransactionsTable />;
}
