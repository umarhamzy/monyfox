import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "../../../../hooks/use-profile";

export const Route = createFileRoute("/p/$profileId/_profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useProfile();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
