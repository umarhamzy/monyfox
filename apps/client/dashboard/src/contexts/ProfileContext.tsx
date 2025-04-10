import {
  type Account,
  AccountSchema,
  type Data,
  type Profile,
  ProfileSchema,
  type Transaction,
} from "@monyfox/common-data";
import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";
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

interface ProfileContextProps {
  user: { id: string; name: string };
  data: Data;

  getAccount: (accountId: string) => Account;
  createAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
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
  const localStorageKey = `profile:${profileId}`;
  const [profile, setProfile] = useLocalStorage(
    localStorageKey,
    null,
    ProfileSchema.nullable(),
  );

  if (profile === null) {
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

  return (
    <DataProvider user={user} data={data} setProfile={setProfile}>
      {children}
    </DataProvider>
  );
};

function DataProvider({
  user,
  data,
  setProfile,
  children,
}: {
  user: { id: string; name: string };
  data: Data;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  children: React.ReactNode;
}) {
  function getAccount(accountId: string): Account {
    return (
      data.accounts.find((account) => account.id === accountId) ?? {
        id: accountId,
        name: "Unknown account",
        isPersonalAsset: false,
      }
    );
  }

  function createAccount(raw: Account) {
    const account = AccountSchema.parse(raw);
    setProfile((prev) => {
      if (prev === null) {
        return prev;
      }
      if (prev.data.encrypted) {
        return prev;
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          data: {
            ...prev.data.data,
            accounts: [...prev.data.data.accounts, account],
          },
        },
      };
    });
  }

  function deleteAccount(accountId: string) {
    setProfile((prev) => {
      if (prev === null) {
        return prev;
      }
      if (prev.data.encrypted) {
        return prev;
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          data: {
            ...prev.data.data,
            accounts: prev.data.data.accounts.filter(
              (account) => account.id !== accountId,
            ),
          },
        },
      };
    });
  }

  const transactions = useMemo(() => {
    return data.transactions.sort((a, b) => a.date.localeCompare(b.date));
  }, [data.transactions]);

  const getTransactionsBetweenDates = useCallback(
    (start: LocalDate, end: LocalDate) => {
      // TODO: use binary search to find the first and last transaction in the range since the transactions are sorted.
      return transactions.filter((transaction) => {
        const date = LocalDate.parse(transaction.date);
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
        getAccount,
        createAccount,
        deleteAccount,
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
