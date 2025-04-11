import {
  type Account,
  AccountSchema,
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
  deleteTransaction: UseMutationResult<void, Error, string, unknown>;
  getTransactionsBetweenDates: (
    startDate: LocalDate,
    endDate: LocalDate,
  ) => Transaction[];
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
        deleteTransaction,
        getTransactionsBetweenDates,
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
