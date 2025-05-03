import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$profileId/_profile/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profileId } = useParams({ from: "/p/$profileId" });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Symbols</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>
            Currencies (e.g., EUR, USD), stocks (e.g., GOOG, AAPL),
            cryptocurrencies (e.g., BTC, ETH), and other assets.
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/p/$profileId/settings/symbols" params={{ profileId }}>
            <Button>Manage symbols</Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>
            Categories are used to group transactions together. For example, you
            can create a category for groceries, dining, and entertainment.
          </p>
        </CardContent>
        <CardFooter>
          <Link
            to="/p/$profileId/settings/transaction-categories"
            params={{ profileId }}
          >
            <Button>Manage categories</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
