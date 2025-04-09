import { type Data, ProfileSchema } from "@monyfox/common-data";
import { createContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";
import { DestructiveAlert } from "../components/ui/alert";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface ProfileContextProps {
  user: { id: string; name: string };
  data: Data;
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
  const [profile] = useLocalStorage(
    localStorageKey,
    null,
    ProfileSchema.nullable(),
  );

  if (profile === null) {
    return (
      <div>
        <DestructiveAlert title="Profile not found">
          The profile you are trying to access does not exist.
        </DestructiveAlert>
        <Link to="/">
          <Button>Go back</Button>
        </Link>
      </div>
    );
  }

  if (profile.data.encrypted) {
    return (
      <div>
        <DestructiveAlert title="Profile encrypted">
          The profile you are trying to access is encrypted. Encrypted profiles
          are currently not supported.
        </DestructiveAlert>
        <Link to="/">
          <Button>Go back</Button>
        </Link>
      </div>
    );
  }

  const user = {
    id: profile.id,
    name: profile.user,
  };
  const data = profile.data.data;

  return (
    <ProfileContext.Provider value={{ user, data }}>
      {children}
    </ProfileContext.Provider>
  );
};
