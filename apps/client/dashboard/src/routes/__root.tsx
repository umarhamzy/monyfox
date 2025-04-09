import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({ component: App });

function App() {
  return (
    <>
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools />
    </>
  );
}
