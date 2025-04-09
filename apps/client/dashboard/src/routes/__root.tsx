import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

export const Route = createRootRoute({ component: App });

function App() {
  return (
    <NextUIProvider>
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools />
    </NextUIProvider>
  );
}
