import {
  type Account,
  AccountSchema,
  type AssetSymbol,
  AssetSymbolSchema,
  type AssetSymbolExchange,
  AssetSymbolExchangeSchema,
  type Data,
  DataSchema,
  type Transaction,
  TransactionSchema,
  type TransactionCategory,
  TransactionCategorySchema,
} from "@monyfox/common-data";
import { ReactNode, useCallback, useMemo } from "react";
import { LocalDate } from "@js-joda/core";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { ErrorPage } from "@/components/error-page";
import { ProfileContext } from "./profile-context";
import { useDatabase } from "@/hooks/use-database";
import { isCycleInTransactionCategories } from "@/utils/transaction-category";

export type MutationResult<T> = UseMutationResult<void, Error, T, unknown>;

export const ProfileProvider = ({
  profileId,
  children,
}: {
  profileId: string;
  children: ReactNode;
}) => {
  const { profiles } = useDatabase();

  const profile = useMemo(
    () => profiles.find((p) => p.id === profileId),
    [profileId, profiles],
  );

  const schemaValidationResult = useMemo(
    () => DataSchema.safeParse(profile?.data.data),
    [profile],
  );

  const dataValidationErrors = useMemo(
    () => getDataValidationErrors(profile?.data.data),
    [profile],
  );

  if (profile === undefined) {
    return (
      <ErrorPage
        title="Profile not found"
        message="The profile you are trying to access does not exist."
      />
    );
  }

  if (profile.data.encrypted) {
    return (
      <ErrorPage
        title="Encrypted profile"
        message="The profile you are trying to access is encrypted. Encrypted profiles are currently not supported."
      />
    );
  }

  const user = {
    id: profile.id,
    name: profile.user,
  };

  if (schemaValidationResult.error) {
    console.error("Invalid profile schema", schemaValidationResult.error);
    return (
      <ErrorPage
        title="Invalid profile schema"
        message="The profile you are trying to access has invalid data. Please check the
        console logs in your browser for more details."
      />
    );
  }

  if (dataValidationErrors.length > 0) {
    console.error("Invalid profile data", dataValidationErrors);
    return (
      <ErrorPage
        title="Invalid profile data"
        message={dataValidationErrors.join(". ") + "."}
      />
    );
  }

  return (
    <DataProvider user={user} data={profile.data.data}>
      {children}
    </DataProvider>
  );
};

function DataProvider({
  user,
  data,
  children,
}: {
  user: { id: string; name: string };
  data: Data;
  children: React.ReactNode;
}) {
  const { saveProfile } = useDatabase();

  function getAccount(accountId: string): Account {
    return (
      data.accounts.find((account) => account.id === accountId) ?? {
        id: accountId,
        name: "Unknown account",
        isPersonalAsset: false,
      }
    );
  }

  async function updateDataFields<K extends keyof Data>(
    ...updates: Array<{
      key: K;
      value: Data[K];
    }>
  ) {
    const newData = { ...data };
    for (const update of updates) {
      newData[update.key] = update.value;
    }
    newData.lastUpdated = new Date().toISOString();

    const errors = getDataValidationErrors(newData);
    if (errors.length > 0) {
      throw new Error(errors.join(". ") + ".");
    }

    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: newData,
      },
      schemaVersion: "1",
    });
  }

  async function createEntitiesAsync<
    K extends Exclude<
      keyof Data,
      "lastUpdated" | "assetSymbolExchangersMetadata"
    >,
  >(...creations: Array<{ key: K; entity: Data[K][number] }>) {
    await updateDataFields(
      ...creations.map(({ key, entity }) => ({
        key,
        value: [...data[key], entity] as Data[K],
      })),
    );
  }

  async function updateEntityAsync<
    K extends Exclude<
      keyof Data,
      "lastUpdated" | "assetSymbolExchangersMetadata"
    >,
  >(key: K, entity: Data[K][number]) {
    await updateDataFields({
      key,
      value: data[key].map((e) => (e.id === entity.id ? entity : e)) as Data[K],
    });
  }

  async function deleteEntityAsync<
    K extends Exclude<
      keyof Data,
      "lastUpdated" | "assetSymbolExchangersMetadata"
    >,
  >(key: K, entityId: string) {
    await updateDataFields({
      key,
      value: data[key].filter((e) => e.id !== entityId) as Data[K],
    });
  }

  // Accounts
  const createAccount = useMutation({
    mutationFn: (a: Account) =>
      createEntitiesAsync({ key: "accounts", entity: AccountSchema.parse(a) }),
  });

  const deleteAccount = useMutation({
    mutationFn: (id: string) => deleteEntityAsync("accounts", id),
  });

  // Transactions
  const transactions = useMemo(() => {
    return data.transactions.sort((a, b) =>
      a.accountingDate.localeCompare(b.accountingDate),
    );
  }, [data.transactions]);

  const createTransaction = useMutation({
    mutationFn: (t: Transaction) =>
      createEntitiesAsync({
        key: "transactions",
        entity: TransactionSchema.parse(t),
      }),
  });

  const updateTransaction = useMutation({
    mutationFn: (t: Transaction) =>
      updateEntityAsync("transactions", TransactionSchema.parse(t)),
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => deleteEntityAsync("transactions", id),
  });

  const getTransactionsBetweenDates = useCallback(
    (start: LocalDate, end: LocalDate) => {
      // TODO: use binary search to find the first and last transaction in the range since the transactions are sorted.
      return transactions.filter((transaction) => {
        const date = LocalDate.parse(transaction.accountingDate);
        return (
          date.isAfter(start.minusDays(1)) && date.isBefore(end.plusDays(1))
        );
      });
    },
    [transactions],
  );

  // Transaction categories
  const getTransactionCategory = useCallback(
    (id: string): TransactionCategory => {
      const category = data.transactionCategories.find((c) => c.id === id);
      if (!category) {
        return {
          id: "N/A",
          name: "N/A",
          parentTransactionCategoryId: null,
        };
      }
      return category;
    },
    [data.transactionCategories],
  );

  const createTransactionCategory = useMutation({
    mutationFn: (tc: TransactionCategory) =>
      createEntitiesAsync({
        key: "transactionCategories",
        entity: TransactionCategorySchema.parse(tc),
      }),
  });

  const updateTransactionCategory = useMutation({
    mutationFn: (tc: TransactionCategory) =>
      updateEntityAsync(
        "transactionCategories",
        TransactionCategorySchema.parse(tc),
      ),
  });

  const deleteTransactionCategory = useMutation({
    mutationFn: (id: string) => deleteEntityAsync("transactionCategories", id),
  });

  const transactionCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const transaction of transactions) {
      const category = transaction.transactionCategoryId ?? "-";
      const count = map.get(category) ?? 0;
      map.set(category, count + 1);
    }
    return map;
  }, [transactions]);

  const getTransactionCountByCategory = useCallback(
    (id: string) => transactionCountByCategory.get(id) ?? 0,
    [transactionCountByCategory],
  );

  // Asset symbols
  const getAssetSymbol = useCallback(
    (symbolId: string): AssetSymbol => {
      const symbol = data.assetSymbols.find((s) => s.id === symbolId);
      if (!symbol) {
        return {
          id: "N/A",
          type: "other",
          code: "N/A",
          displayName: "N/A",
        };
      }
      return symbol;
    },
    [data.assetSymbols],
  );

  const transactionCountBySymbol = useMemo(() => {
    const map = new Map<string, number>();
    for (const transaction of transactions) {
      const fromSymbol = transaction.from.symbolId;
      const toSymbol = transaction.to.symbolId;

      if (fromSymbol === toSymbol) {
        map.set(fromSymbol, (map.get(fromSymbol) ?? 0) + 1);
      } else {
        map.set(fromSymbol, (map.get(fromSymbol) ?? 0) + 1);
        map.set(toSymbol, (map.get(toSymbol) ?? 0) + 1);
      }
    }
    return map;
  }, [transactions]);

  const getTransactionCountBySymbol = useCallback(
    (id: string) => transactionCountBySymbol.get(id) ?? 0,
    [transactionCountBySymbol],
  );

  const createAssetSymbol = useMutation({
    mutationFn: (as: AssetSymbol) =>
      createEntitiesAsync({
        key: "assetSymbols",
        entity: AssetSymbolSchema.parse(as),
      }),
  });

  const deleteAssetSymbol = useMutation({
    mutationFn: (id: string) => deleteEntityAsync("assetSymbols", id),
  });

  const createAssetSymbolWithExchange = useMutation({
    mutationFn: ({
      assetSymbol,
      assetSymbolExchange,
    }: {
      assetSymbol: AssetSymbol;
      assetSymbolExchange: AssetSymbolExchange;
    }) =>
      createEntitiesAsync(
        { key: "assetSymbols", entity: AssetSymbolSchema.parse(assetSymbol) },
        {
          key: "assetSymbolExchanges",
          entity: AssetSymbolExchangeSchema.parse(assetSymbolExchange),
        },
      ),
  });

  const createAssetSymbolExchange = useMutation({
    mutationFn: (as: AssetSymbolExchange) =>
      createEntitiesAsync({
        key: "assetSymbolExchanges",
        entity: AssetSymbolExchangeSchema.parse(as),
      }),
  });

  const deleteAssetSymbolExchange = useMutation({
    mutationFn: (id: string) => deleteEntityAsync("assetSymbolExchanges", id),
  });

  const updateAlphaVantageApiKey = useMutation({
    mutationFn: (key: string | null) =>
      updateDataFields({
        key: "assetSymbolExchangersMetadata",
        value: {
          ...data.assetSymbolExchangersMetadata,
          alphavantage: key !== null ? { apiKey: key } : null,
        },
      }),
  });

  return (
    <ProfileContext.Provider
      value={{
        user,
        data: {
          ...data,
          transactions,
        },

        // Accounts
        getAccount,
        createAccount,
        deleteAccount,

        // Transactions
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionsBetweenDates,

        // Transaction categories
        getTransactionCategory,
        createTransactionCategory,
        updateTransactionCategory,
        deleteTransactionCategory,
        getTransactionCountByCategory,

        // Symbols
        getAssetSymbol,
        getTransactionCountBySymbol,
        createAssetSymbol,
        deleteAssetSymbol,

        // Exchanges
        createAssetSymbolWithExchange,
        createAssetSymbolExchange,
        deleteAssetSymbolExchange,
        updateAlphaVantageApiKey,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

function getDataValidationErrors(data: Data | string | undefined): string[] {
  if (data === undefined || typeof data === "string") {
    // We don't care about the message since we don't use this result in this case.
    return ["Data is encrypted or undefined"];
  }

  const errors: string[] = [];

  // Transaction categories
  if (isCycleInTransactionCategories(data.transactionCategories)) {
    errors.push("There are cycles in the transaction categories");
  }

  const existingTransactionCategoryIds = new Set(
    data.transactionCategories.map((category) => category.id),
  );
  for (const category of data.transactionCategories) {
    if (
      category.parentTransactionCategoryId !== null &&
      !existingTransactionCategoryIds.has(category.parentTransactionCategoryId)
    ) {
      errors.push(
        `Transaction category ${category.name} has a non-existing parent category`,
      );
    }
  }

  return errors;
}
