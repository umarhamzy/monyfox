import { SidebarProvider } from "@/components/ui/sidebar";
import { AssetSymbolExchangeRateProvider } from "@/contexts/asset-symbol-exchange-rate-context";
import { DatabaseContext } from "@/contexts/database-context";
import { ProfileProvider } from "@/contexts/profile-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { type Profile } from "@monyfox/common-data";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { ReactNode, useState } from "react";

export function TestDatabaseProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "TEST_PROFILE_ID",
      user: "TEST_USER",
      data: {
        encrypted: false,
        data: {
          accounts: [
            {
              id: "ACCOUNT_1",
              name: "Account 1",
              isPersonalAsset: true,
            },
            {
              id: "ACCOUNT_2",
              name: "Account 2",
              isPersonalAsset: true,
            },
          ],
          assetSymbols: [
            { id: "EUR", code: "EUR", displayName: "EUR", type: "fiat" },
            { id: "USD", code: "USD", displayName: "USD", type: "fiat" },
          ],
          assetSymbolExchanges: [],
          transactions: [
            {
              id: "TRANSACTION_1",
              description: "Income",
              transactionDate: "2024-01-01",
              accountingDate: "2024-01-01",
              transactionCategoryId: null,
              from: {
                account: { name: "Income" },
                amount: 950,
                symbolId: "EUR",
              },
              to: {
                account: { id: "ACCOUNT_1" },
                amount: 950,
                symbolId: "EUR",
              },
            },
            {
              id: "TRANSACTION_1",
              description: "Expense",
              transactionDate: "2024-01-01",
              accountingDate: "2024-01-01",
              transactionCategoryId: null,
              from: {
                account: { id: "ACCOUNT_1" },
                amount: 23,
                symbolId: "EUR",
              },
              to: {
                account: { name: "Expense" },
                amount: 23,
                symbolId: "EUR",
              },
            },
          ],
          lastUpdated: "2024-01-01T00:00:00.000Z",
        },
      },
      schemaVersion: "1",
    },
  ]);

  const saveProfile = useMutation({
    mutationFn: async (profile: Profile) => {
      setProfiles((p) => [...p, profile]);
    },
  });

  const deleteProfile = useMutation({
    mutationFn: async (id: string) => {
      setProfiles((p) => p.filter((profile) => profile.id !== id));
    },
  });

  return (
    <DatabaseContext.Provider
      value={{
        profiles,
        saveProfile,
        deleteProfile,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
export function TestQueryClientProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function TestContextProvider({
  children,
  profileId = "TEST_PROFILE_ID",
}: {
  children: ReactNode;
  profileId?: string;
}) {
  const router = getTestRouter(() => (
    <TestQueryClientProvider>
      <TestDatabaseProvider>
        <ProfileProvider profileId={profileId}>
          <AssetSymbolExchangeRateProvider>
            <SettingsProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </SettingsProvider>
          </AssetSymbolExchangeRateProvider>
        </ProfileProvider>
      </TestDatabaseProvider>
    </TestQueryClientProvider>
  ));

  return <RouterProvider router={router} />;
}

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
