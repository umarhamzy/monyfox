import { SidebarProvider } from "@/components/ui/sidebar";
import { AssetSymbolExchangeRateProvider } from "@/contexts/asset-symbol-exchange-rate-provider";
import { ProfileProvider } from "@/contexts/profile-provider";
import { SettingsProvider } from "@/contexts/settings-provider";
import { type Profile } from "@monyfox/common-data";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import { getTestRouter } from "./router";
import { DatabaseContext } from "@/contexts/database-context";

export function TestDatabaseProvider({
  children,
  withFiat = true,
  withStocks = true,
}: {
  children: ReactNode;
  withFiat?: boolean;
  withStocks?: boolean;
}) {
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
            ...(withFiat
              ? [
                  {
                    id: "EUR",
                    code: "EUR",
                    displayName: "EUR",
                    type: "fiat" as const,
                  },
                  {
                    id: "USD",
                    code: "USD",
                    displayName: "USD",
                    type: "fiat" as const,
                  },
                ]
              : []),
            ...(withStocks
              ? [
                  {
                    id: "MWRD",
                    code: "MWRD",
                    displayName: "MWRD ETF name",
                    type: "stock" as const,
                  },
                ]
              : []),
          ],
          assetSymbolExchanges: [],
          assetSymbolExchangersMetadata: {
            alphavantage: withStocks ? { apiKey: "TEST_API_KEY" } : null,
          },
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
      setProfiles((p) => {
        const index = p.findIndex((p) => p.id === profile.id);
        if (index === -1) {
          return [...p, profile];
        }
        return p.map((p, i) => (i === index ? profile : p));
      });
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
  withFiat = true,
  withStocks = true,
}: {
  children: ReactNode;
  profileId?: string;
  withFiat?: boolean;
  withStocks?: boolean;
}) {
  const router = getTestRouter(() => (
    <TestQueryClientProvider>
      <TestDatabaseProvider withFiat={withFiat} withStocks={withStocks}>
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
