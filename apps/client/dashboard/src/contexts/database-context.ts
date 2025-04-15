import { createContext } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { type Profile } from "@monyfox/common-data";

interface DatabaseContextProps {
  profiles: Profile[];
  saveProfile: UseMutationResult<void, Error, Profile, unknown>;
  deleteProfile: UseMutationResult<void, Error, string, unknown>;
}

export const DatabaseContext = createContext<DatabaseContextProps | undefined>(
  undefined,
);
