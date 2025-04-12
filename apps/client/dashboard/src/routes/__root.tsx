import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DatabaseProvider } from "@/contexts/database-context";

export const Route = createRootRoute({ component: App });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider>
        <Outlet />
        <Toaster richColors />
      </DatabaseProvider>
    </QueryClientProvider>
  );
}
