import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProfileProvider } from "../../../contexts/ProfileContext";

export const Route = createFileRoute("/p/$profileId/_profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profileId } = Route.useParams();
  return (
    <ProfileProvider profileId={profileId}>
      <Outlet />
    </ProfileProvider>
  );
}
