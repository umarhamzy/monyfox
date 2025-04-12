import {
  type Account,
  AccountSchema,
  type AssetSymbol,
  type Data,
  DataSchema,
  type Transaction,
  TransactionSchema,
} from "@monyfox/common-data";
import { createContext, ReactNode, useCallback, useMemo } from "react";
import { DestructiveAlert } from "../components/ui/alert";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocalDate } from "@js-joda/core";
import { useDatabase } from "@/hooks/use-database";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface ProfileContextProps {
  user: { id: string; name: string };
  data: Data;

  // Accounts
  getAccount: (accountId: string) => Account;
  createAccount: UseMutationResult<void, Error, Account, unknown>;
  deleteAccount: UseMutationResult<void, Error, string, unknown>;

  // Transactions
  createTransaction: UseMutationResult<void, Error, Transaction, unknown>;
  updateTransaction: UseMutationResult<void, Error, Transaction, unknown>;
  deleteTransaction: UseMutationResult<void, Error, string, unknown>;
  getTransactionsBetweenDates: (
    startDate: LocalDate,
    endDate: LocalDate,
  ) => Transaction[];

  // Symbols
  getAssetSymbol: (assetSymbolId: string) => AssetSymbol;
  convertAmount: (
    amount: number,
    fromAssetSymbolId: string,
    toAssetSymbolId: string,
  ) => number;
  createAssetSymbol: UseMutationResult<void, Error, AssetSymbol, unknown>;
  updateAssetSymbol: UseMutationResult<void, Error, AssetSymbol, unknown>;
  deleteAssetSymbol: UseMutationResult<void, Error, string, unknown>;
}

export const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined,
);

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
  const data = profile.data.data;

  const validationResult = useMemo(() => DataSchema.safeParse(data), [data]);
  if (validationResult.error) {
    console.error("Invalid profile data", validationResult.error);
    return (
      <ErrorPage
        title="Invalid profile data"
        message="The profile you are trying to access has invalid data. Please check the
        console logs in your browser for more details."
      />
    );
  }

  return (
    <DataProvider user={user} data={data}>
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

  async function createAccountAsync(raw: Account) {
    const account = AccountSchema.parse(raw);
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          accounts: [...data.accounts, account],
        },
      },
      schemaVersion: "1",
    });
  }
  const createAccount = useMutation({
    mutationFn: createAccountAsync,
  });

  async function deleteAccountAsync(accountId: string) {
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          accounts: data.accounts.filter((account) => account.id !== accountId),
        },
      },
      schemaVersion: "1",
    });
  }
  const deleteAccount = useMutation({
    mutationFn: deleteAccountAsync,
  });

  const transactions = useMemo(() => {
    return data.transactions.sort((a, b) =>
      a.accountingDate.localeCompare(b.accountingDate),
    );
  }, [data.transactions]);

  async function createTransactionAsync(raw: Transaction) {
    const transaction = TransactionSchema.parse(raw);
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          transactions: [...data.transactions, transaction],
        },
      },
      schemaVersion: "1",
    });
  }
  const createTransaction = useMutation({
    mutationFn: createTransactionAsync,
  });

  async function updateTransactionAsync(raw: Transaction) {
    const transaction = TransactionSchema.parse(raw);
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          transactions: data.transactions.map((t) =>
            t.id === transaction.id ? transaction : t,
          ),
        },
      },
      schemaVersion: "1",
    });
  }
  const updateTransaction = useMutation({
    mutationFn: updateTransactionAsync,
  });

  async function deleteTransactionAsync(transactionId: string) {
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          transactions: data.transactions.filter(
            (transaction) => transaction.id !== transactionId,
          ),
        },
      },
      schemaVersion: "1",
    });
  }
  const deleteTransaction = useMutation({
    mutationFn: deleteTransactionAsync,
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

  const convertAmount = (
    amount: number,
    fromSymbolId: string,
    toSymbolId: string,
  ) => {
    if (fromSymbolId === toSymbolId) {
      return amount;
    }

    // TODO: support multi-currency
    return amount;
  };

  async function createAssetSymbolAsync(symbol: AssetSymbol) {
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          assetSymbols: [...data.assetSymbols, symbol],
        },
      },
      schemaVersion: "1",
    });
  }
  const createAssetSymbol = useMutation({
    mutationFn: createAssetSymbolAsync,
  });

  async function updateAssetSymbolAsync(symbol: AssetSymbol) {
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          assetSymbols: data.assetSymbols.map((s) =>
            s.id === symbol.id ? symbol : s,
          ),
        },
      },
      schemaVersion: "1",
    });
  }
  const updateAssetSymbol = useMutation({
    mutationFn: updateAssetSymbolAsync,
  });

  async function deleteAssetSymbolAsync(symbolId: string) {
    await saveProfile.mutateAsync({
      id: user.id,
      user: user.name,
      data: {
        encrypted: false,
        data: {
          ...data,
          assetSymbols: data.assetSymbols.filter((s) => s.id !== symbolId),
        },
      },
      schemaVersion: "1",
    });
  }
  const deleteAssetSymbol = useMutation({
    mutationFn: deleteAssetSymbolAsync,
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

        // Symbols
        getAssetSymbol,
        convertAmount,
        createAssetSymbol,
        updateAssetSymbol,
        deleteAssetSymbol,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

function ErrorPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Whoops!</CardTitle>
          </CardHeader>
          <CardContent>
            <DestructiveAlert title={title}>{message}</DestructiveAlert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/">
              <Button>Go back</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
