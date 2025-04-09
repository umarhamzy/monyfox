import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="max-w-sm">
      <Outlet />
    </div>
  );
}
