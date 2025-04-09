import { createFileRoute } from "@tanstack/react-router";
import { ProfileSelection } from "../components/auth/ProfileSelection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <ProfileSelection />;
}
