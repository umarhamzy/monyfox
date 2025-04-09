import { type Data, ProfileSchema } from "@monyfox/common-data";
import { createContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";
import { Alert } from "../components/ui/Alert";
import { Button } from "@nextui-org/react";
import { Link } from "@tanstack/react-router";

interface ProfileContextProps {
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
        <Alert type="error">Profile not found</Alert>
        <Link to="/">
          <Button>Go back</Button>
        </Link>
      </div>
    );
  }

  if (profile.data.encrypted) {
    return (
      <div>
        <Alert type="error">Profile is encrypted</Alert>
        <Link to="/">
          <Button>Go back</Button>
        </Link>
      </div>
    );
  }

  const data = profile.data.data;

  return (
    <ProfileContext.Provider value={{ data }}>
      {children}
    </ProfileContext.Provider>
  );
};
