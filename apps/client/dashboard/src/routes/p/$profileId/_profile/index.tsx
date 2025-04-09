import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "../../../../hooks/use-profile";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/p/$profileId/_profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useProfile();
  return (
    <Card>
      <CardContent>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}
