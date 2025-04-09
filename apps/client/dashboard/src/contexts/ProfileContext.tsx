import {
  type Account,
  AccountSchema,
  type Data,
  ProfileSchema,
} from "@monyfox/common-data";
import { createContext, ReactNode } from "react";
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

interface ProfileContextProps {
  user: { id: string; name: string };
  data: Data;

  createAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
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

  return (
    <ProfileContext.Provider
      value={{ user, data, createAccount, deleteAccount }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

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
