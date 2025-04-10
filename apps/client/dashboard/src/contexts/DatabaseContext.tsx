import { createContext, ReactNode } from "react";
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
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { type Profile } from "@monyfox/common-data";
import { toast } from "sonner";

const DB_NAME = "monyfox";
const DB_STORE_NAME = "profiles";
const DB_VERSION = 1;

interface DatabaseContextProps {
  database: IDBDatabase;
  profiles: Profile[];
  saveProfileAsync: (profile: Profile) => Promise<void>;
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
    <DatabaseDataProvider database={dbQuery.data}>
      {children}
    </DatabaseDataProvider>
  );
};

function DatabaseDataProvider({
  database,
  children,
}: {
  database: IDBDatabase;
  children: ReactNode;
}) {
  const profilesQuery = useQuery({
    queryKey: ["profiles"],
    queryFn: () => getProfiles(database),
  });

  async function saveProfile(profile: Profile) {
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(DB_STORE_NAME, "readwrite");
      const objectStore = transaction.objectStore(DB_STORE_NAME);
      const request = objectStore.put(profile);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error("Error saving profile", request.error);
        reject(request.error);
      };
    });
  }

  const saveProfileMutation = useMutation({
    mutationFn: (profile: Profile) => saveProfile(profile),
    onSuccess: () => {
      profilesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteProfileMutation = useMutation({
    mutationFn: (id: string) => deleteProfile(database, id),
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
        database,
        profiles: profilesQuery.data,
        saveProfileAsync: saveProfile,
        saveProfile: saveProfileMutation,
        deleteProfile: deleteProfileMutation,
      }}
    >
      {children}
    </DatabaseContext.Provider>
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
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      console.error("Error opening database", request.error);
      reject(request.error);
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore(DB_STORE_NAME, { keyPath: "id" });
    };
  });
}

async function getProfiles(db: IDBDatabase) {
  return new Promise<Profile[]>((resolve, reject) => {
    const transaction = db.transaction(DB_STORE_NAME, "readonly");
    const objectStore = transaction.objectStore(DB_STORE_NAME);
    const request = objectStore.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      console.error("Error getting profiles", request.error);
      reject(request.error);
    };
  });
}

async function deleteProfile(db: IDBDatabase, profileId: string) {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(DB_STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(DB_STORE_NAME);
    const request = objectStore.delete(profileId);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      console.error("Error deleting profile", request.error);
      reject(request.error);
    };
  });
}
