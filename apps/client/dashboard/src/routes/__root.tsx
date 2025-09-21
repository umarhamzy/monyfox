import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DatabaseProvider } from "@/contexts/database-provider";
import { ThemeProvider } from "@/contexts/theme-provider";

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
      <ThemeProvider>
        <DatabaseProvider>
          <Outlet />
          <Toaster richColors position="bottom-center" />
        </DatabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
