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
  );
}
