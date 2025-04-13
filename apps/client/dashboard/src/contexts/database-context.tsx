import { createContext, ReactNode } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { type Profile } from "@monyfox/common-data";
import { toast } from "sonner";
import { DatabaseIDBImpl } from "@/database/database-idb";
import { type Database } from "@/database/database";
import { ErrorPage } from "@/components/error-page";

interface DatabaseContextProps {
  profiles: Profile[];
  saveProfile: UseMutationResult<void, Error, Profile, unknown>;
  deleteProfile: UseMutationResult<void, Error, string, unknown>;
}

export const DatabaseContext = createContext<DatabaseContextProps | undefined>(
  undefined,
);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const dbQuery = useQuery({ queryKey: ["database"], queryFn: getDatabase });

  if (dbQuery.isPending) {
    return <LoadingPage />;
  }

  if (dbQuery.isError) {
    return (
      <ErrorPage
        title="Database error"
        message={dbQuery.error?.message || "Unknown error"}
      />
    );
  }

  return (
    <DatabaseDataProvider db={dbQuery.data}>{children}</DatabaseDataProvider>
  );
};

function DatabaseDataProvider({
  db,
  children,
}: {
  db: Database;
  children: ReactNode;
}) {
  const profilesQuery = useQuery({
    queryKey: ["profiles"],
    queryFn: () => db.getProfiles(),
  });

  const saveProfileMutation = useMutation({
    mutationFn: (profile: Profile) => db.saveProfile(profile),
    onSuccess: () => {
      profilesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id: string) => db.deleteProfile(id),
    onSuccess: () => {
      profilesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (profilesQuery.isPending) {
    return <LoadingPage />;
  }

  if (profilesQuery.isError) {
    return (
      <ErrorPage
        title="Database error"
        message={profilesQuery.error?.message || "Unknown error"}
      />
    );
  }

  return (
    <DatabaseContext.Provider
      value={{
        profiles: profilesQuery.data,
        saveProfile: saveProfileMutation,
        deleteProfile: deleteProfileMutation,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

function LoadingPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Spinner />
      </div>
    </div>
  );
}

async function getDatabase() {
  const db = new DatabaseIDBImpl();
  await db.init();
  return db;
}
