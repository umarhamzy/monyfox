import { createFileRoute } from "@tanstack/react-router";
import { ProfileSelection } from "../components/auth/profile-selection";
import { PrivacyLink } from "../components/privacy";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ProfileSelection />
        <PrivacyLink />
      </div>
    </div>
  );
}
