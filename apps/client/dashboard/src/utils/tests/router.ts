import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

export function getTestRouter(component: () => React.JSX.Element) {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/p/$profileId",
      component,
    }),
  ]);
  return createRouter({ routeTree });
}
